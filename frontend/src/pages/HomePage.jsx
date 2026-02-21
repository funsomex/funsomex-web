import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  HeartHandshake,
  Calculator,
  GraduationCap,
  Laptop,
  Brain,
  ShieldCheck,
  ArrowRight,
  Users,
  Target,
  Award,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HERO_IMAGE = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80";
const COMMUNITY_IMAGE = "https://images.unsplash.com/photo-1593460915132-fcb729cc4597?w=800&q=80";

const serviceIcons = {
  "heart-handshake": HeartHandshake,
  "calculator": Calculator,
  "graduation-cap": GraduationCap,
  "laptop": Laptop,
  "brain": Brain,
  "shield-check": ShieldCheck,
};

const HomePage = () => {
  const [foundationInfo, setFoundationInfo] = useState(null);
  const [externalNews, setExternalNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, newsRes] = await Promise.all([
          axios.get(`${API}/foundation-info`),
          axios.get(`${API}/external-news`),
        ]);
        setFoundationInfo(infoRes.data);
        setExternalNews(newsRes.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="overflow-hidden" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center hero-pattern" data-testid="hero-section">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Comunidad"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
        </div>

        {/* Decorative Elements */}
        <div className="decorative-circle decorative-circle-accent w-64 h-64 -top-20 -right-20 opacity-20" />
        <div className="decorative-circle decorative-circle-secondary w-48 h-48 bottom-20 left-10 opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Fundación Sin Ánimo de Lucro
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Transformando{" "}
              <span className="text-accent">Vidas</span> en las
              Comunidades Indígenas
            </h1>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              FUNSOMEX trabaja por el desarrollo integral de las comunidades de
              la zona indígena de Córdoba y Sucre, promoviendo el bienestar
              social, cultural y económico.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/nosotros">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 font-semibold transition-all duration-300 hover:-translate-y-1"
                  data-testid="hero-cta-about"
                >
                  Conocer Más
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/donar">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 rounded-full px-8 font-semibold transition-all duration-300 hover:-translate-y-1"
                  data-testid="hero-cta-donate"
                >
                  Donar Ahora
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-y border-border" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "5+", label: "Años de Servicio" },
              { value: "100+", label: "Familias Beneficiadas" },
              { value: "20+", label: "Proyectos Ejecutados" },
              { value: "3", label: "Departamentos" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-background" data-testid="mission-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
                Nuestra Esencia
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-8">
                Comprometidos con el{" "}
                <span className="text-primary">Desarrollo Social</span>
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Misión</h3>
                    <p className="text-muted-foreground">
                      {foundationInfo?.mission ||
                        "Promover el desarrollo integral de las comunidades mediante programas de bienestar social, cultural, deportivo y económico."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Visión</h3>
                    <p className="text-muted-foreground">
                      {foundationInfo?.vision ||
                        "Ser la fundación líder en el desarrollo sostenible de las comunidades indígenas del Caribe colombiano."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Valores</h3>
                    <div className="flex flex-wrap gap-2">
                      {(foundationInfo?.values || [
                        { name: "Compromiso" },
                        { name: "Transparencia" },
                        { name: "Inclusión" },
                        { name: "Excelencia" },
                        { name: "Solidaridad" },
                      ]).map((value, idx) => (
                        <span
                          key={idx}
                          className="badge-primary"
                        >
                          {value.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={COMMUNITY_IMAGE}
                  alt="Comunidad FUNSOMEX"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-card max-w-[250px]">
                <p className="text-4xl font-bold text-primary mb-1">901936025-1</p>
                <p className="text-sm text-muted-foreground">NIT Fundación</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Lo que hacemos
            </span>
            <h2>Nuestros Servicios</h2>
            <p>
              Ofrecemos una amplia gama de servicios para el desarrollo integral
              de las comunidades.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {(foundationInfo?.services || []).map((service, index) => {
              const IconComponent = serviceIcons[service.icon] || HeartHandshake;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="card-hover h-full border-border bg-white">
                    <CardContent className="p-6">
                      <div className="service-icon mb-4">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="text-center mt-10">
            <Link to="/servicios">
              <Button
                variant="outline"
                className="rounded-full px-8 font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                data-testid="services-view-all"
              >
                Ver Todos los Servicios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* External News Section */}
      <section className="py-20 bg-background" data-testid="news-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Actualidad
            </span>
            <h2>Noticias de Interés</h2>
            <p>
              Mantente informado con las últimas noticias de entidades oficiales
              colombianas.
            </p>
          </div>

          {externalNews.length > 0 ? (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {externalNews.map((news, index) => (
                <motion.a
                  key={index}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  className="news-card p-5 group"
                  data-testid={`external-news-${index}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`source-badge ${
                      news.source.toLowerCase().includes('dian') ? 'source-badge-dian' :
                      news.source.toLowerCase().includes('contral') ? 'source-badge-contraloria' :
                      news.source.toLowerCase().includes('portafolio') ? 'source-badge-portafolio' :
                      'source-badge-gobernacion'
                    }`}>
                      {news.source}
                    </span>
                    {news.date && (
                      <span className="text-xs text-muted-foreground">
                        {news.date}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-3">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground group-hover:text-secondary transition-colors">
                    <span>Leer más</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </motion.a>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Cargando noticias externas...
              </p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/noticias">
              <Button
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full px-8 font-semibold"
                data-testid="news-view-all"
              >
                Ver Todas las Noticias
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              ¿Quieres ser parte del cambio?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Tu apoyo puede transformar vidas. Únete a nuestra misión de
              desarrollo social en las comunidades indígenas de Colombia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/donar">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 font-semibold transition-all duration-300 hover:-translate-y-1"
                  data-testid="cta-donate"
                >
                  Hacer una Donación
                </Button>
              </Link>
              <Link to="/contacto">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white/10 rounded-full px-8 font-semibold transition-all duration-300 hover:-translate-y-1"
                  data-testid="cta-contact"
                >
                  Contáctanos
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
