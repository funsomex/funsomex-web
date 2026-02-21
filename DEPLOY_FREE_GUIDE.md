# FUNSOMEX - Guía de Despliegue Gratuito

## Arquitectura de Despliegue

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   VERCEL        │     │    RENDER       │     │  MONGODB ATLAS  │
│   (Frontend)    │────▶│   (Backend)     │────▶│   (Database)    │
│   GRATIS        │     │   GRATIS        │     │   GRATIS        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## PASO 1: Crear Base de Datos en MongoDB Atlas (5 minutos)

1. Ve a https://www.mongodb.com/atlas
2. Crea una cuenta gratuita
3. Clic en "Build a Database"
4. Selecciona **"M0 FREE"** (Shared - Gratis)
5. Elige región cercana (ej: South America - São Paulo)
6. Nombre del cluster: `funsomex-cluster`
7. Clic en "Create"

### Configurar acceso:
1. En "Database Access" → "Add New Database User"
   - Usuario: `funsomex_admin`
   - Contraseña: (genera una segura y guárdala)
   - Rol: "Read and write to any database"

2. En "Network Access" → "Add IP Address"
   - Clic en "Allow Access from Anywhere" (0.0.0.0/0)
   - Esto permite que Render se conecte

3. Obtener Connection String:
   - Clic en "Connect" → "Connect your application"
   - Copia la URL, se ve así:
   ```
   mongodb+srv://funsomex_admin:<password>@funsomex-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Reemplaza `<password>` con tu contraseña real

---

## PASO 2: Desplegar Backend en Render (10 minutos)

1. Ve a https://render.com
2. Crea cuenta con GitHub
3. Clic en "New" → "Web Service"
4. Conecta tu repositorio de GitHub (o sube el código)

### Configuración del servicio:
- **Name:** `funsomex-api`
- **Region:** Oregon (US West) o el más cercano
- **Branch:** `main`
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
- **Plan:** Free

### Variables de Entorno en Render:
Agrega estas variables en "Environment":

```
MONGO_URL=mongodb+srv://funsomex_admin:TU_PASSWORD@funsomex-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=funsomex
CORS_ORIGINS=*
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura-2024
ADMIN_EMAIL=administracion@funsomex.com
ADMIN_PASSWORD=SSs010616*+
PAYPAL_CLIENT_ID=AV_boDIMka_BZSwlQCFhP2EU-N1HtSUll6Ejb0_CKx7xsttY9-GTMRRexeDukVyUHLlrEH7Bzrg9r1UZ
PAYPAL_SECRET=EDdWPMOUckTmwbLr_LUhmlpzcn3Ze8g__w1dkLUMzPPnFxWzJXfxB9Fzgf56CSdQ9AP7j2d87soT-_Xd
PAYPAL_MODE=live
FRONTEND_URL=https://funsomex.vercel.app
```

5. Clic en "Create Web Service"
6. Espera que despliegue (~5 minutos)
7. Copia la URL generada (ej: `https://funsomex-api.onrender.com`)

---

## PASO 3: Desplegar Frontend en Vercel (5 minutos)

1. Ve a https://vercel.com
2. Crea cuenta con GitHub
3. Clic en "Add New" → "Project"
4. Importa tu repositorio

### Configuración:
- **Framework Preset:** Create React App
- **Root Directory:** `frontend`
- **Build Command:** `yarn build`
- **Output Directory:** `build`

### Variables de Entorno en Vercel:
```
REACT_APP_BACKEND_URL=https://funsomex-api.onrender.com
REACT_APP_PAYPAL_CLIENT_ID=AV_boDIMka_BZSwlQCFhP2EU-N1HtSUll6Ejb0_CKx7xsttY9-GTMRRexeDukVyUHLlrEH7Bzrg9r1UZ
```

5. Clic en "Deploy"
6. Tu sitio estará en: `https://funsomex.vercel.app` (o similar)

---

## PASO 4: Actualizar URL del Frontend en Render

1. Ve a Render → Tu servicio backend
2. En "Environment", actualiza:
   ```
   FRONTEND_URL=https://tu-proyecto.vercel.app
   ```
3. El servicio se reiniciará automáticamente

---

## URLs Finales

- **Sitio Web:** https://tu-proyecto.vercel.app
- **API Backend:** https://funsomex-api.onrender.com
- **Panel Admin:** https://tu-proyecto.vercel.app/login

---

## Limitaciones del Plan Gratuito

| Servicio | Límite Gratis |
|----------|---------------|
| MongoDB Atlas | 512 MB storage |
| Render | 750 horas/mes, se "duerme" tras 15 min inactividad |
| Vercel | 100 GB bandwidth/mes |

### Nota sobre Render Gratis:
- El backend se "duerme" después de 15 minutos sin uso
- La primera visita después de dormirse tarda ~30 segundos en despertar
- Para una fundación con tráfico moderado, esto es aceptable

---

## Dominio Personalizado (Opcional)

Si tienes un dominio como `funsomex.org`:

**En Vercel:**
1. Settings → Domains → Add
2. Escribe `funsomex.org`
3. Configura los DNS según las instrucciones

**En Render:**
1. Settings → Custom Domains → Add
2. Para API: `api.funsomex.org`

---

## Soporte

Si tienes problemas:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

