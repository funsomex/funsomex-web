import { Link } from "react-router-dom";
import { Mail, MapPin, Instagram } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_nonprofitcolombia/artifacts/qrwxuwsr_Logo%20FUNSOMEX.jpg";
const INSTAGRAM_URL = "https://www.instagram.com/funsomex";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-pattern text-white" data-testid="main-footer">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <img
              src={LOGO_URL}
              alt="FUNSOMEX Logo"
              className="h-16 w-auto object-contain mb-4 bg-white rounded-lg p-2"
            />
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Fundación dedicada al desarrollo integral de las comunidades indígenas
              de la sabana de Córdoba y Sucre.
            </p>
            <div className="flex gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="social-instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {[
                { name: "Inicio", path: "/" },
                { name: "Nosotros", path: "/nosotros" },
                { name: "Servicios", path: "/servicios" },
                { name: "Proyectos", path: "/proyectos" },
                { name: "Noticias", path: "/noticias" },
                { name: "Contacto", path: "/contacto" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                    data-testid={`footer-link-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">Nuestros Servicios</h4>
            <ul className="space-y-3">
              <li className="text-white/80 text-sm">Proyectos Sociales</li>
              <li className="text-white/80 text-sm">Asesoría Financiera</li>
              <li className="text-white/80 text-sm">Capacitación</li>
              <li className="text-white/80 text-sm">Tecnología</li>
              <li className="text-white/80 text-sm">Salud Mental</li>
              <li className="text-white/80 text-sm">Consultoría en Seguridad</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-white/80 text-sm">
                  Calle El Estanco DG 4 CR 7C-40<br />
                  San Andrés de Sotavento, Córdoba<br />
                  Colombia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <a
                  href="mailto:administracion@funsomex.com"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                  data-testid="footer-email"
                >
                  administracion@funsomex.com
                </a>
              </li>
              <li className="text-white/80 text-sm">
                <strong className="text-white">NIT:</strong> 901936025-1
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} FUNSOMEX - Fundación Social y Financiera Mexion. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <Link
                to="/admin"
                className="text-white/60 hover:text-white text-sm transition-colors"
                data-testid="footer-admin-link"
              >
                Administración
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
