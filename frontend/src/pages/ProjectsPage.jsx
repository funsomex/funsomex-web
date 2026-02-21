import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { MapPin, Calendar, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Sample projects data (will be replaced with API data when available)
const sampleProjects = [
  {
    id: "1",
    title: "Capacitación en Emprendimiento Rural",
    description:
      "Programa de formación para emprendedores de comunidades indígenas en habilidades de gestión empresarial y finanzas básicas.",
    image_url:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    category: "Capacitación",
    location: "San Andrés de Sotavento",
    year: 2024,
  },
  {
    id: "2",
    title: "Escuelas Saludables",
    description:
      "Implementación de programas de salud mental y bienestar en instituciones educativas de la región.",
    image_url:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    category: "Salud",
    location: "Córdoba",
    year: 2024,
  },
  {
    id: "3",
    title: "Asesoría Contable MIPYMES",
    description:
      "Programa de asesoría gratuita en temas contables y tributarios para micro y pequeñas empresas locales.",
    image_url:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    category: "Financiero",
    location: "Sucre",
    year: 2023,
  },
  {
    id: "4",
    title: "Tecnología para el Campo",
    description:
      "Dotación de equipos informáticos y capacitación digital para asociaciones de agricultores.",
    image_url:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    category: "Tecnología",
    location: "Bolívar",
    year: 2023,
  },
  {
    id: "5",
    title: "Desarrollo Cultural Zenú",
    description:
      "Preservación y promoción de la cultura Zenú a través de talleres de artesanías y tradiciones.",
    image_url:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    category: "Cultural",
    location: "San Andrés de Sotavento",
    year: 2023,
  },
  {
    id: "6",
    title: "Seguridad Comunitaria",
    description:
      "Capacitación en prevención de riesgos y primeros auxilios para líderes comunitarios.",
    image_url:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
    category: "Seguridad",
    location: "Córdoba",
    year: 2024,
  },
];

const categories = [
  "Todos",
  "Capacitación",
  "Salud",
  "Financiero",
  "Tecnología",
  "Cultural",
  "Seguridad",
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState(sampleProjects);
  const [filteredProjects, setFilteredProjects] = useState(sampleProjects);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${API}/projects`);
        if (response.data && response.data.length > 0) {
          setProjects(response.data);
          setFilteredProjects(response.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Keep sample data if API fails
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === "Todos") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((p) => p.category === selectedCategory)
      );
    }
  }, [selectedCategory, projects]);

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
    <div className="overflow-hidden" data-testid="projects-page">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary" data-testid="projects-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-48 h-48 rounded-full bg-accent" />
          <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-secondary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Nuestro Trabajo
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Proyectos y Galería
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Conoce los proyectos que hemos desarrollado en beneficio de las
              comunidades de Córdoba, Sucre y Bolívar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                {filteredProjects.length} Proyectos
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Filtrar por categoría:
              </span>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger
                  className="w-[180px]"
                  data-testid="category-filter"
                >
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-background" data-testid="projects-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length > 0 ? (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  data-testid={`project-card-${index}`}
                >
                  <Card className="h-full overflow-hidden border-border bg-white card-hover group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="badge-primary bg-primary text-primary-foreground">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {project.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{project.location}</span>
                          </div>
                        )}
                        {project.year && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{project.year}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No hay proyectos en esta categoría.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted" data-testid="projects-stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "20+", label: "Proyectos Ejecutados" },
              { value: "3", label: "Departamentos" },
              { value: "100+", label: "Beneficiarios" },
              { value: "6", label: "Áreas de Trabajo" },
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
    </div>
  );
};

export default ProjectsPage;
