import { useState, useEffect } from "react";
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
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const serviceIcons = {
  "heart-handshake": HeartHandshake,
  "calculator": Calculator,
  "graduation-cap": GraduationCap,
  "laptop": Laptop,
  "brain": Brain,
  "shield-check": ShieldCheck,
};

const serviceDetails = {
  "Proyectos Sociales": [
    "Elaboración de proyectos de desarrollo económico y social",
    "Programas ambientales y culturales",
    "Proyectos deportivos comunitarios",
    "Alianzas con ONGs nacionales e internacionales",
    "Gestión de recursos públicos y privados",
  ],
  "Asesoría Financiera y Contable": [
    "Asesoría en áreas financieras y contables",
    "Consultoría tributaria e impuestos",
    "Revisoría fiscal",
    "Creación y formalización de empresas",
    "Asesoría jurídica empresarial",
    "Auditoría de inventarios y almacenes",
  ],
  "Capacitación y Formación": [
    "Talleres de formación profesional",
    "Charlas empresariales",
    "Programas de entrenamiento",
    "Capacitación para entidades públicas y privadas",
    "Formación técnica especializada",
  ],
  "Tecnología e Informática": [
    "Procesamiento de datos",
    "Mantenimiento de equipos de oficina",
    "Reparación de equipos informáticos",
    "Desarrollo de software personalizado",
    "Suministro de hardware y equipos",
    "Diseño e impresión de papelería",
  ],
  "Salud Mental y Bienestar": [
    "Proyectos de psicología comunitaria",
    "Programas de estilos de vida saludable",
    "Escuelas saludables",
    "Proyectos de salud mental",
    "Programas sociales integrales",
  ],
  "Consultoría en Seguridad": [
    "Estudios de seguridad",
    "Auditorías de seguridad",
    "Formación en salvamento e incendios",
    "Supervisión de obras",
    "Comercio de dispositivos de protección",
    "Gestión de calamidades",
  ],
};

const ServicesPage = () => {
  const [foundationInfo, setFoundationInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`${API}/foundation-info`);
        setFoundationInfo(response.data);
      } catch (error) {
        console.error("Error fetching foundation info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="overflow-hidden" data-testid="services-page">
      {/* Hero Section */}
      <section className="relative py-20 bg-secondary" data-testid="services-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-60 h-60 rounded-full bg-white" />
          <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-accent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Lo que hacemos
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Nuestros Servicios
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Ofrecemos una amplia gama de servicios profesionales para el
              desarrollo integral de las comunidades y organizaciones.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background" data-testid="services-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {(foundationInfo?.services || []).map((service, index) => {
              const IconComponent = serviceIcons[service.icon] || HeartHandshake;
              const details = serviceDetails[service.title] || [];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`grid lg:grid-cols-2 gap-8 items-center ${
                    !isEven ? "lg:flex-row-reverse" : ""
                  }`}
                  data-testid={`service-item-${index}`}
                >
                  <div className={!isEven ? "lg:order-2" : ""}>
                    <Card className="bg-white border-0 shadow-card hover:shadow-card-hover transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${
                              index % 3 === 0
                                ? "bg-primary"
                                : index % 3 === 1
                                ? "bg-secondary"
                                : "bg-primary"
                            }`}
                          >
                            <IconComponent className="w-8 h-8" />
                          </div>
                          <CardTitle className="text-2xl">
                            {service.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-6">
                          {service.description}
                        </p>
                        <ul className="space-y-3">
                          {details.map((detail, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-sm"
                            >
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">
                                {detail}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div
                    className={`hidden lg:block ${!isEven ? "lg:order-1" : ""}`}
                  >
                    <div
                      className={`h-64 rounded-2xl ${
                        index % 3 === 0
                          ? "bg-primary/10"
                          : index % 3 === 1
                          ? "bg-secondary/10"
                          : "bg-accent/20"
                      } flex items-center justify-center`}
                    >
                      <IconComponent
                        className={`w-24 h-24 ${
                          index % 3 === 0
                            ? "text-primary/30"
                            : index % 3 === 1
                            ? "text-secondary/30"
                            : "text-accent/50"
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-muted" data-testid="additional-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Más servicios
            </span>
            <h2>Servicios Adicionales</h2>
            <p>
              Además de nuestros servicios principales, ofrecemos las siguientes
              actividades.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Estudios de Mercado",
                description:
                  "Encuestas de opinión, diagnósticos y métodos de gestión empresarial.",
              },
              {
                title: "Sistemas de Gestión",
                description:
                  "Implementación de sistemas de gestión para incrementar la productividad.",
              },
              {
                title: "Suministros",
                description:
                  "Muebles de oficina, maquinaria, equipos y útiles de escritorio.",
              },
              {
                title: "Eventos",
                description:
                  "Organización y sistematización de eventos nacionales e internacionales.",
              },
              {
                title: "Alianzas Estratégicas",
                description:
                  "Consorcios y uniones temporales con organizaciones afines.",
              },
              {
                title: "Cooperación Internacional",
                description:
                  "Gestión de recursos de cooperación nacional e internacional.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white border-border card-hover">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white" data-testid="services-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              ¿Necesitas alguno de nuestros servicios?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Contáctanos y con gusto te asesoraremos sobre cómo podemos ayudarte
              a alcanzar tus objetivos.
            </p>
            <Link to="/contacto">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 font-semibold transition-all duration-300 hover:-translate-y-1"
                data-testid="services-contact-cta"
              >
                Contáctanos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
