import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Mail, Linkedin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Sample team data
const sampleTeam = [
  {
    id: "1",
    name: "Director General",
    role: "Director Ejecutivo",
    bio: "Profesional con amplia experiencia en gestión de proyectos sociales y desarrollo comunitario en la región Caribe.",
    image_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    email: "director@funsomex.com",
  },
  {
    id: "2",
    name: "Coordinadora de Proyectos",
    role: "Coordinadora de Proyectos",
    bio: "Especialista en formulación y ejecución de proyectos de desarrollo social con enfoque en comunidades vulnerables.",
    image_url:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    email: "proyectos@funsomex.com",
  },
  {
    id: "3",
    name: "Contador Público",
    role: "Director Financiero",
    bio: "Contador público con experiencia en gestión financiera de organizaciones sin ánimo de lucro.",
    image_url:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    email: "contabilidad@funsomex.com",
  },
  {
    id: "4",
    name: "Psicóloga",
    role: "Coordinadora de Bienestar",
    bio: "Psicóloga especializada en salud mental comunitaria y programas de bienestar social.",
    image_url:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    email: "bienestar@funsomex.com",
  },
];

const TeamPage = () => {
  const [team, setTeam] = useState(sampleTeam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get(`${API}/team`);
        if (response.data && response.data.length > 0) {
          setTeam(response.data);
        }
      } catch (error) {
        console.error("Error fetching team:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
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
    <div className="overflow-hidden" data-testid="team-page">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary" data-testid="team-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-56 h-56 rounded-full bg-accent" />
          <div className="absolute bottom-10 left-20 w-40 h-40 rounded-full bg-secondary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Nuestra Gente
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Equipo de Trabajo
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Conoce a las personas comprometidas que hacen posible nuestra misión
              de desarrollo social.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 bg-background" data-testid="team-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                data-testid={`team-member-${index}`}
              >
                <Card className="team-card h-full border-border bg-white overflow-hidden">
                  <div className="relative">
                    <div className="h-64 overflow-hidden">
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-20" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-secondary font-medium text-sm mb-3">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {member.bio}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                          data-testid={`team-email-${index}`}
                          aria-label={`Email ${member.name}`}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                          data-testid={`team-linkedin-${index}`}
                          aria-label={`LinkedIn ${member.name}`}
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 bg-muted" data-testid="join-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              ¿Quieres ser parte de FUNSOMEX?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Siempre estamos buscando personas comprometidas con el desarrollo
              social. Si compartes nuestra visión, contáctanos.
            </p>
            <a
              href="mailto:administracion@funsomex.com"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-8 py-3 font-semibold hover:-translate-y-1 transition-all duration-300"
              data-testid="join-cta"
            >
              <Mail className="w-5 h-5" />
              Enviar CV
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
