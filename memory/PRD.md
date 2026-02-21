# FUNSOMEX - Product Requirements Document

## Project Overview
**Project Name:** FUNSOMEX Website (Fundación Social y Financiera Mexion)
**Type:** Non-profit Organization Website
**Date Created:** February 7, 2025
**Stack:** React + FastAPI + MongoDB

## User Personas
1. **Community Members:** Indigenous communities from Córdoba and Sucre seeking support
2. **Potential Donors:** Individuals and organizations wanting to contribute
3. **Government Entities:** Public institutions for partnerships
4. **Foundation Staff:** Admin users managing content

## Core Requirements (Static)
- Corporate website with Mission, Vision, Values
- Services showcase
- News aggregation from Colombian government sources
- Contact functionality
- Donation information
- Admin panel for content management

## What's Been Implemented ✅
### February 7, 2025 - MVP Complete
- **Homepage:** Hero section with foundation logo, mission preview, services, stats, external news, CTA
- **About Page:** Mission, Vision, Values, Object Social, Location with Google Maps
- **Services Page:** 6 core services with detailed descriptions
- **Projects Page:** Gallery with category filtering
- **Team Page:** Team member display with contact info
- **News Page:** External news scraping from DIAN, Contraloría, Gobernaciones, Contaduría, Portafolio + internal news
- **Contact Page:** Functional contact form with email/phone/address
- **Donate Page:** Donation information and tax benefits
- **Admin Panel:** Full CRUD for News, Team, Projects, Contact messages

### Backend APIs
- `/api/foundation-info` - Foundation data
- `/api/news` - Internal news CRUD
- `/api/external-news` - Scraped news from government sites
- `/api/team` - Team members CRUD
- `/api/projects` - Projects CRUD
- `/api/contact` - Contact form submissions
- `/api/news-sources` - List of external news sources

## Design System
- **Theme:** Tropical Heritage / Organic Modernism (Light Mode)
- **Colors:** Green (#1B5E20), Orange (#E65100), Yellow (#FFD600), Sand background
- **Typography:** Syne (headings), Manrope (body)
- **Components:** Shadcn/UI with custom styling

## Prioritized Backlog

### P0 - Critical (Next)
- [ ] Authentication for admin panel

### P1 - High Priority
- [ ] Image upload for news/projects/team
- [ ] Rich text editor for news content
- [ ] Email notifications for contact form

### P2 - Medium Priority
- [ ] Social media integration
- [ ] Newsletter subscription
- [ ] Project details page
- [ ] Multi-language support (Spanish/English)

### P3 - Nice to Have
- [ ] Blog with categories
- [ ] Event calendar
- [ ] Document downloads
- [ ] Statistics dashboard

## Next Tasks
1. Add authentication to protect admin panel
2. Implement image upload functionality
3. Add more external news sources
4. Create automated news refresh schedule

---

### February 7, 2025 - PayPal Donation System Added
- **Online Donations:** PayPal integration for accepting donations
- **Amount Options:** Predefined amounts ($10, $25, $50, $100, $250, $500) + custom amount
- **Donor Info:** Optional name, email, and message fields
- **Stats Tracking:** Total donations and amount raised displayed
- **Security:** PayPal sandbox mode (switch to live for production)

### New Backend APIs
- `/api/donations/create-payment` - Create PayPal payment
- `/api/donations/execute-payment` - Execute after approval
- `/api/donations/stats` - Get donation statistics
- `/api/donations` - List all donations (admin)

### PayPal Configuration
- Mode: Sandbox (testing)
- To go live: Change PAYPAL_MODE to "live" in .env and use production credentials

---

### February 7, 2025 - Authentication & Final Touches
- **Admin Authentication:** JWT-based login system
- **Credentials:** administracion@funsomex.com / SSs010616*+
- **Token Expiration:** 24 hours
- **Protected Routes:** Admin panel (news, team, projects, contacts, donations CRUD)
- **Social Media:** Updated to only show Instagram (@funsomex)

### Login Flow
1. User goes to /admin → Redirected to /login
2. Enter credentials → Receive JWT token
3. Token stored in localStorage
4. All admin API calls include Bearer token
5. Logout clears token and redirects to /login

## WEBSITE COMPLETE ✅
All features implemented and tested:
- Corporate pages (Home, About, Services, Projects, Team, News, Contact, Donate)
- PayPal donation system (Production mode)
- News scraping from Colombian government sites
- Protected admin panel
- Instagram social link
