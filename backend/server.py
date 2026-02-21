from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
from bs4 import BeautifulSoup
import asyncio
import paypalrestsdk
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# PayPal Configuration
paypalrestsdk.configure({
    "mode": os.environ.get('PAYPAL_MODE', 'sandbox'),
    "client_id": os.environ.get('PAYPAL_CLIENT_ID', ''),
    "client_secret": os.environ.get('PAYPAL_SECRET', '')
})

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET')
if not JWT_SECRET:
    raise ValueError("JWT_SECRET environment variable is required")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Admin credentials
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')
if not ADMIN_EMAIL or not ADMIN_PASSWORD:
    raise ValueError("ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required")

# Security
security = HTTPBearer(auto_error=False)

# Create the main app without a prefix
app = FastAPI(title="FUNSOMEX API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============== AUTH HELPERS ==============

def create_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="No autorizado")
    email = verify_token(credentials.credentials)
    if not email:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    return email

# ============== MODELS ==============

class NewsArticle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: str
    summary: Optional[str] = None
    image_url: Optional[str] = None
    source: str = "FUNSOMEX"
    source_url: Optional[str] = None
    category: str = "general"
    published_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_external: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsCreate(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    image_url: Optional[str] = None
    category: str = "general"

class NewsUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None

class TeamMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    bio: str
    image_url: Optional[str] = None
    email: Optional[str] = None
    linkedin: Optional[str] = None
    order: int = 0

class TeamMemberCreate(BaseModel):
    name: str
    role: str
    bio: str
    image_url: Optional[str] = None
    email: Optional[str] = None
    linkedin: Optional[str] = None
    order: int = 0

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image_url: str
    category: str
    location: Optional[str] = None
    year: Optional[int] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectCreate(BaseModel):
    title: str
    description: str
    image_url: str
    category: str
    location: Optional[str] = None
    year: Optional[int] = None

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read: bool = False

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class ExternalNews(BaseModel):
    title: str
    url: str
    source: str
    date: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    message: str

# ============== AUTH ROUTES ==============

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Admin login endpoint"""
    if request.email != ADMIN_EMAIL:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    # Verify password
    if request.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    token = create_token(request.email)
    return LoginResponse(success=True, token=token, message="Login exitoso")

@api_router.get("/auth/verify")
async def verify_auth(admin: str = Depends(get_current_admin)):
    """Verify if token is valid"""
    return {"valid": True, "email": admin}

# ============== NEWS SCRAPER ==============

NEWS_SOURCES = {
    "DIAN": "https://www.dian.gov.co/Prensa/Paginas/BoletinesDePrensa.aspx",
    "Contraloría": "https://www.contraloria.gov.co/web/guest/sala-de-prensa/boletines-de-prensa",
    "Contaduría": "https://www.contaduria.gov.co/noticias",
    "Gobernación Córdoba": "https://www.cordoba.gov.co/",
    "Gobernación Sucre": "https://sucre.gov.co/",
    "Gobernación Bolívar": "https://www.bolivar.gov.co/",
    "Portafolio": "https://www.portafolio.co/"
}

async def scrape_news_from_source(source_name: str, url: str) -> List[ExternalNews]:
    """Scrape news from a single source"""
    news_items = []
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client_http:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            response = await client_http.get(url, headers=headers)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Generic scraping - look for article titles/links
                articles = soup.find_all(['article', 'div'], class_=lambda x: x and any(
                    word in str(x).lower() for word in ['news', 'noticia', 'article', 'post', 'item']
                ))[:5]
                
                if not articles:
                    # Fallback: look for links with news-like patterns
                    links = soup.find_all('a', href=True)
                    for link in links[:10]:
                        title = link.get_text(strip=True)
                        if len(title) > 20 and len(title) < 200:
                            href = link['href']
                            if not href.startswith('http'):
                                href = url.rstrip('/') + '/' + href.lstrip('/')
                            news_items.append(ExternalNews(
                                title=title[:150],
                                url=href,
                                source=source_name,
                                date=datetime.now(timezone.utc).strftime("%Y-%m-%d")
                            ))
                            if len(news_items) >= 3:
                                break
                else:
                    for article in articles[:3]:
                        title_tag = article.find(['h1', 'h2', 'h3', 'h4', 'a'])
                        if title_tag:
                            title = title_tag.get_text(strip=True)
                            link = article.find('a', href=True)
                            href = link['href'] if link else url
                            if not href.startswith('http'):
                                href = url.rstrip('/') + '/' + href.lstrip('/')
                            news_items.append(ExternalNews(
                                title=title[:150],
                                url=href,
                                source=source_name,
                                date=datetime.now(timezone.utc).strftime("%Y-%m-%d")
                            ))
    except Exception as e:
        logging.error(f"Error scraping {source_name}: {e}")
    
    return news_items

async def scrape_all_news() -> List[dict]:
    """Scrape news from all sources concurrently"""
    tasks = [scrape_news_from_source(name, url) for name, url in NEWS_SOURCES.items()]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    all_news = []
    for result in results:
        if isinstance(result, list):
            all_news.extend([n.model_dump() for n in result])
    
    # Cache in database
    if all_news:
        await db.external_news.delete_many({})
        await db.external_news.insert_many(all_news)
        await db.external_news.create_index("source")
    
    return all_news

# ============== API ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "FUNSOMEX API - Fundación Social y Financiera Mexion"}

# --- News Routes ---
@api_router.get("/news", response_model=List[NewsArticle])
async def get_news(limit: int = 20, category: Optional[str] = None):
    query = {} if not category else {"category": category}
    news = await db.news.find(query, {"_id": 0}).sort("published_date", -1).limit(limit).to_list(limit)
    for item in news:
        if isinstance(item.get('published_date'), str):
            item['published_date'] = datetime.fromisoformat(item['published_date'].replace('Z', '+00:00'))
        if isinstance(item.get('created_at'), str):
            item['created_at'] = datetime.fromisoformat(item['created_at'].replace('Z', '+00:00'))
    return news

@api_router.get("/news/{news_id}", response_model=NewsArticle)
async def get_news_by_id(news_id: str):
    news = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not news:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    if isinstance(news.get('published_date'), str):
        news['published_date'] = datetime.fromisoformat(news['published_date'].replace('Z', '+00:00'))
    if isinstance(news.get('created_at'), str):
        news['created_at'] = datetime.fromisoformat(news['created_at'].replace('Z', '+00:00'))
    return news

@api_router.post("/news", response_model=NewsArticle)
async def create_news(news_data: NewsCreate, admin: str = Depends(get_current_admin)):
    news_obj = NewsArticle(**news_data.model_dump())
    doc = news_obj.model_dump()
    doc['published_date'] = doc['published_date'].isoformat()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.news.insert_one(doc)
    return news_obj

@api_router.put("/news/{news_id}", response_model=NewsArticle)
async def update_news(news_id: str, news_data: NewsUpdate, admin: str = Depends(get_current_admin)):
    update_dict = {k: v for k, v in news_data.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No hay datos para actualizar")
    result = await db.news.update_one({"id": news_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return await get_news_by_id(news_id)

@api_router.delete("/news/{news_id}")
async def delete_news(news_id: str, admin: str = Depends(get_current_admin)):
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return {"message": "Noticia eliminada"}

# --- External News Routes ---
@api_router.get("/external-news")
async def get_external_news(source: Optional[str] = None):
    query = {} if not source else {"source": source}
    news = await db.external_news.find(query, {"_id": 0}).to_list(50)
    return news

@api_router.post("/external-news/refresh")
async def refresh_external_news(background_tasks: BackgroundTasks):
    background_tasks.add_task(scrape_all_news)
    return {"message": "Actualizando noticias externas..."}

@api_router.get("/news-sources")
async def get_news_sources():
    return [{"name": name, "url": url} for name, url in NEWS_SOURCES.items()]

# --- Team Routes ---
@api_router.get("/team", response_model=List[TeamMember])
async def get_team():
    members = await db.team.find({}, {"_id": 0}).sort("order", 1).to_list(50)
    return members

@api_router.post("/team", response_model=TeamMember)
async def create_team_member(member_data: TeamMemberCreate, admin: str = Depends(get_current_admin)):
    member_obj = TeamMember(**member_data.model_dump())
    doc = member_obj.model_dump()
    await db.team.insert_one(doc)
    return member_obj

@api_router.delete("/team/{member_id}")
async def delete_team_member(member_id: str, admin: str = Depends(get_current_admin)):
    result = await db.team.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Miembro no encontrado")
    return {"message": "Miembro eliminado"}

# --- Projects/Gallery Routes ---
@api_router.get("/projects", response_model=List[Project])
async def get_projects(category: Optional[str] = None):
    query = {} if not category else {"category": category}
    projects = await db.projects.find(query, {"_id": 0}).sort("created_at", -1).to_list(50)
    for proj in projects:
        if isinstance(proj.get('created_at'), str):
            proj['created_at'] = datetime.fromisoformat(proj['created_at'].replace('Z', '+00:00'))
    return projects

@api_router.post("/projects", response_model=Project)
async def create_project(project_data: ProjectCreate, admin: str = Depends(get_current_admin)):
    project_obj = Project(**project_data.model_dump())
    doc = project_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.projects.insert_one(doc)
    return project_obj

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, admin: str = Depends(get_current_admin)):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return {"message": "Proyecto eliminado"}

# --- Contact Routes ---
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(contact_data: ContactCreate):
    contact_obj = ContactMessage(**contact_data.model_dump())
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    return contact_obj

@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contacts(admin: str = Depends(get_current_admin)):
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for contact in contacts:
        if isinstance(contact.get('created_at'), str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at'].replace('Z', '+00:00'))
    return contacts

@api_router.put("/contact/{contact_id}/read")
async def mark_contact_read(contact_id: str, admin: str = Depends(get_current_admin)):
    result = await db.contacts.update_one({"id": contact_id}, {"$set": {"read": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Mensaje no encontrado")
    return {"message": "Marcado como leído"}

# --- Foundation Info ---
@api_router.get("/foundation-info")
async def get_foundation_info():
    return {
        "name": "FUNDACIÓN SOCIAL Y FINANCIERA MEXION",
        "sigla": "FUNSOMEX",
        "nit": "901936025-1",
        "address": "Calle El Estanco DG 4 CR 7C-40",
        "city": "San Andrés de Sotavento",
        "department": "Córdoba",
        "country": "Colombia",
        "email": "administracion@funsomex.com",
        "logo_url": "https://customer-assets.emergentagent.com/job_nonprofitcolombia/artifacts/qrwxuwsr_Logo%20FUNSOMEX.jpg",
        "mission": "Promover el desarrollo integral de las comunidades de la zona indígena de la sabana de Córdoba y Sucre mediante programas de bienestar social, cultural, deportivo y económico.",
        "vision": "Ser la fundación líder en el desarrollo sostenible de las comunidades indígenas del Caribe colombiano, reconocida por su impacto social positivo y su compromiso con el bienestar comunitario.",
        "values": [
            {"name": "Compromiso Social", "description": "Dedicación genuina al bienestar de las comunidades"},
            {"name": "Transparencia", "description": "Gestión clara y abierta de todos nuestros recursos"},
            {"name": "Inclusión", "description": "Respeto y valoración de la diversidad cultural"},
            {"name": "Excelencia", "description": "Búsqueda constante de la calidad en todo lo que hacemos"},
            {"name": "Solidaridad", "description": "Apoyo mutuo y cooperación comunitaria"}
        ],
        "services": [
            {
                "title": "Proyectos Sociales",
                "description": "Elaboración y ejecución de programas de desarrollo económico, social, ambiental, cultural y deportivo.",
                "icon": "heart-handshake"
            },
            {
                "title": "Asesoría Financiera y Contable",
                "description": "Servicios de asesoría en áreas financieras, contables, tributarias, revisoría fiscal y creación de empresas.",
                "icon": "calculator"
            },
            {
                "title": "Capacitación y Formación",
                "description": "Talleres, charlas y programas de entrenamiento para empresas públicas y privadas.",
                "icon": "graduation-cap"
            },
            {
                "title": "Tecnología e Informática",
                "description": "Procesamiento de datos, desarrollo de software, mantenimiento de equipos y suministros tecnológicos.",
                "icon": "laptop"
            },
            {
                "title": "Salud Mental y Bienestar",
                "description": "Proyectos de psicología, estilos de vida saludable y programas de salud mental.",
                "icon": "brain"
            },
            {
                "title": "Consultoría en Seguridad",
                "description": "Estudios, auditorías y formación en seguridad, salvamento e incendios.",
                "icon": "shield-check"
            }
        ],
        "donation_info": {
            "bank_name": "Banco de Colombia",
            "account_type": "Cuenta de Ahorros",
            "account_number": "Consultar al correo administracion@funsomex.com",
            "message": "Tu donación ayuda a transformar vidas en las comunidades indígenas de Córdoba y Sucre."
        }
    }

# --- PayPal Donation Routes ---
class DonationCreate(BaseModel):
    amount: float
    currency: str = "USD"
    donor_name: Optional[str] = None
    donor_email: Optional[str] = None
    message: Optional[str] = None

class Donation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    paypal_payment_id: Optional[str] = None
    amount: float
    currency: str = "USD"
    donor_name: Optional[str] = None
    donor_email: Optional[str] = None
    message: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

@api_router.post("/donations/create-payment")
async def create_paypal_payment(donation: DonationCreate):
    """Create a PayPal payment for donation"""
    frontend_url = os.environ.get('FRONTEND_URL')
    if not frontend_url:
        raise HTTPException(status_code=500, detail="FRONTEND_URL not configured")
    
    try:
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": f"{frontend_url}/donar?success=true",
                "cancel_url": f"{frontend_url}/donar?cancelled=true"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Donación a FUNSOMEX",
                        "sku": "donation",
                        "price": f"{donation.amount:.2f}",
                        "currency": donation.currency,
                        "quantity": 1
                    }]
                },
                "amount": {
                    "total": f"{donation.amount:.2f}",
                    "currency": donation.currency
                },
                "description": f"Donación a la Fundación Social y Financiera Mexion - FUNSOMEX. {donation.message or ''}"
            }]
        })

        if payment.create():
            # Save donation record
            donation_record = Donation(
                paypal_payment_id=payment.id,
                amount=donation.amount,
                currency=donation.currency,
                donor_name=donation.donor_name,
                donor_email=donation.donor_email,
                message=donation.message,
                status="created"
            )
            doc = donation_record.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.donations.insert_one(doc)
            
            # Find approval URL
            for link in payment.links:
                if link.rel == "approval_url":
                    return {
                        "success": True,
                        "payment_id": payment.id,
                        "approval_url": link.href,
                        "donation_id": donation_record.id
                    }
            
            raise HTTPException(status_code=500, detail="No se encontró URL de aprobación")
        else:
            logger.error(f"PayPal error: {payment.error}")
            raise HTTPException(status_code=400, detail=f"Error al crear pago: {payment.error}")
    except Exception as e:
        logger.error(f"PayPal payment creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al procesar el pago: {str(e)}")

@api_router.post("/donations/execute-payment")
async def execute_paypal_payment(payment_id: str, payer_id: str):
    """Execute a PayPal payment after approval"""
    try:
        payment = paypalrestsdk.Payment.find(payment_id)
        
        if payment.execute({"payer_id": payer_id}):
            # Update donation record
            await db.donations.update_one(
                {"paypal_payment_id": payment_id},
                {"$set": {"status": "completed"}}
            )
            return {
                "success": True,
                "message": "¡Gracias por tu donación! Tu apoyo ayuda a transformar vidas.",
                "payment_id": payment_id
            }
        else:
            logger.error(f"PayPal execution error: {payment.error}")
            await db.donations.update_one(
                {"paypal_payment_id": payment_id},
                {"$set": {"status": "failed"}}
            )
            raise HTTPException(status_code=400, detail=f"Error al ejecutar pago: {payment.error}")
    except Exception as e:
        logger.error(f"PayPal payment execution error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al ejecutar el pago: {str(e)}")

@api_router.get("/donations")
async def get_donations(admin: str = Depends(get_current_admin)):
    """Get all donations (admin)"""
    donations = await db.donations.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    for donation in donations:
        if isinstance(donation.get('created_at'), str):
            donation['created_at'] = datetime.fromisoformat(donation['created_at'].replace('Z', '+00:00'))
    return donations

@api_router.get("/donations/stats")
async def get_donation_stats():
    """Get donation statistics"""
    pipeline = [
        {"$match": {"status": "completed"}},
        {"$group": {
            "_id": None,
            "total_amount": {"$sum": "$amount"},
            "total_count": {"$sum": 1}
        }}
    ]
    result = await db.donations.aggregate(pipeline).to_list(1)
    if result:
        return {
            "total_amount": result[0]["total_amount"],
            "total_donations": result[0]["total_count"]
        }
    return {"total_amount": 0, "total_donations": 0}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    # Initialize external news on startup
    logger.info("Initializing FUNSOMEX API...")
    # Create indexes
    await db.news.create_index("id", unique=True)
    await db.news.create_index("category")
    await db.team.create_index("id", unique=True)
    await db.projects.create_index("id", unique=True)
    await db.contacts.create_index("id", unique=True)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
