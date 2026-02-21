import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Target,
  Eye,
  Heart,
  Users,
  Building2,
  FileText,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ABOUT_IMAGE = "https://images.unsplash.com/photo-1593460915132-fcb729cc4597?w=800&q=80";
const TEAM_IMAGE = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80";

const AboutPage = () => {
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
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="overflow-hidden" data-testid="about-page">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary" data-testid="about-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-accent" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-secondary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Conócenos
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Quiénes Somos
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              FUNSOMEX es una fundación sin ánimo de lucro dedicada al desarrollo
              integral de las comunidades indígenas de la sabana de Córdoba y
              Sucre.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-8 -mt-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white shadow-card border-0 h-full">
                <CardContent className="p-6 text-center">
                  <Building2 className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">
                    {foundationInfo?.sigla || "FUNSOMEX"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fundación Social y Financiera Mexion
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white shadow-card border-0 h-full">
                <CardContent className="p-6 text-center">
                  <FileText className="w-10 h-10 text-secondary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">NIT</h3>
                  <p className="text-sm text-muted-foreground">
                    {foundationInfo?.nit || "901936025-1"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white shadow-card border-0 h-full">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-10 h-10 text-accent mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Ubicación</h3>
                  <p className="text-sm text-muted-foreground">
                    San Andrés de Sotavento, Córdoba
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background" data-testid="mission-vision-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-l-4 border-l-primary bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Target className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold">Misión</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {foundationInfo?.mission ||
                      "Promover el desarrollo integral de las comunidades de la zona indígena de la sabana de Córdoba y Sucre mediante programas de bienestar social, cultural, deportivo y económico."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-l-4 border-l-secondary bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                      <Eye className="w-7 h-7 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-bold">Visión</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {foundationInfo?.vision ||
                      "Ser la fundación líder en el desarrollo sostenible de las comunidades indígenas del Caribe colombiano, reconocida por su impacto social positivo y su compromiso con el bienestar comunitario."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Nuestros Principios
            </span>
            <h2>Valores Institucionales</h2>
            <p>
              Los valores que guían cada una de nuestras acciones y decisiones.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {(foundationInfo?.values || [
              {
                name: "Compromiso Social",
                description: "Dedicación genuina al bienestar de las comunidades",
              },
              {
                name: "Transparencia",
                description: "Gestión clara y abierta de todos nuestros recursos",
              },
              {
                name: "Inclusión",
                description: "Respeto y valoración de la diversidad cultural",
              },
              {
                name: "Excelencia",
                description: "Búsqueda constante de la calidad en todo lo que hacemos",
              },
              {
                name: "Solidaridad",
                description: "Apoyo mutuo y cooperación comunitaria",
              },
            ]).map((value, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="value-card h-full bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-lg mb-2">{value.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Object Social Section */}
      <section className="py-20 bg-background" data-testid="object-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
                Marco Legal
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-6">
                Objeto Social
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  La FUNDACIÓN SOCIAL Y FINANCIERA MEXION (FUNSOMEX) tiene como
                  objeto las siguientes actividades de bienestar social:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Elaborar, gestionar y ejecutar programas y proyectos de
                      desarrollo económico, social, ambiental, cultural y
                      deportivos.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Canalización de recursos de entidades públicas y privadas,
                      nacionales e internacionales.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Asesoría y auditoría en áreas financieras, contables,
                      tributarias y revisoría fiscal.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Asistencia técnica, capacitaciones, charlas y talleres de
                      formación.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>
                      Proyectos de psicología, estilos de vida saludables y salud
                      mental.
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={TEAM_IMAGE}
                  alt="Equipo FUNSOMEX"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary text-white rounded-xl p-6 shadow-lg max-w-[200px]">
                <Users className="w-8 h-8 mb-2" />
                <p className="font-bold">Trabajamos por las comunidades indígenas</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-muted" data-testid="location-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Nuestra Sede
            </span>
            <h2>Ubicación</h2>
            <p>
              Nos encontramos en el corazón de la zona indígena del Caribe
              colombiano.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="bg-white border-0 shadow-card">
              <CardContent className="p-8">
                <h3 className="font-bold text-xl mb-6">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold">Dirección</p>
                      <p className="text-muted-foreground">
                        {foundationInfo?.address || "Calle El Estanco DG 4 CR 7C-40"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Building2 className="w-6 h-6 text-secondary shrink-0" />
                    <div>
                      <p className="font-semibold">Ciudad</p>
                      <p className="text-muted-foreground">
                        {foundationInfo?.city || "San Andrés de Sotavento"},{" "}
                        {foundationInfo?.department || "Córdoba"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <FileText className="w-6 h-6 text-accent shrink-0" />
                    <div>
                      <p className="font-semibold">País</p>
                      <p className="text-muted-foreground">
                        {foundationInfo?.country || "Colombia"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="map-container h-[300px] lg:h-auto bg-muted rounded-2xl flex items-center justify-center">
              <iframe
                title="Ubicación FUNSOMEX"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31347.77831842088!2d-75.51835!3d9.14617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e5965752bad26e5%3A0x5f4b6d8a5c1c5c5c!2sSan%20Andr%C3%A9s%20de%20Sotavento%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2sco!4v1699999999999!5m2!1ses!2sco"
                className="w-full h-full min-h-[300px] rounded-xl"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
