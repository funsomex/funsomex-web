import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ExternalLink, RefreshCw, Newspaper, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const NewsPage = () => {
  const [externalNews, setExternalNews] = useState([]);
  const [internalNews, setInternalNews] = useState([]);
  const [newsSources, setNewsSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [externalRes, internalRes, sourcesRes] = await Promise.all([
        axios.get(`${API}/external-news`),
        axios.get(`${API}/news`),
        axios.get(`${API}/news-sources`),
      ]);
      setExternalNews(externalRes.data);
      setInternalNews(internalRes.data);
      setNewsSources(sourcesRes.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await axios.post(`${API}/external-news/refresh`);
      toast.success("Actualizando noticias externas...");
      // Wait a bit and then fetch updated news
      setTimeout(async () => {
        const response = await axios.get(`${API}/external-news`);
        setExternalNews(response.data);
        setRefreshing(false);
        toast.success("Noticias actualizadas");
      }, 5000);
    } catch (error) {
      console.error("Error refreshing news:", error);
      toast.error("Error al actualizar noticias");
      setRefreshing(false);
    }
  };

  const filteredNews =
    selectedSource === "Todos"
      ? externalNews
      : externalNews.filter((news) => news.source === selectedSource);

  const getSourceBadgeClass = (source) => {
    const sourceLower = source.toLowerCase();
    if (sourceLower.includes("dian")) return "source-badge-dian";
    if (sourceLower.includes("contral")) return "source-badge-contraloria";
    if (sourceLower.includes("portafolio")) return "source-badge-portafolio";
    return "source-badge-gobernacion";
  };

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
    <div className="overflow-hidden" data-testid="news-page">
      {/* Hero Section */}
      <section className="relative py-20 bg-secondary" data-testid="news-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-white" />
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-accent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Actualidad
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Noticias
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Mantente informado con las últimas noticias de entidades oficiales
              colombianas y noticias de FUNSOMEX.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Internal News Section */}
      {internalNews.length > 0 && (
        <section className="py-16 bg-background" data-testid="internal-news">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Newspaper className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Noticias FUNSOMEX</h2>
            </div>
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {internalNews.slice(0, 6).map((news, index) => (
                <motion.div key={news.id} variants={itemVariants}>
                  <Card className="h-full bg-white border-border card-hover">
                    {news.image_url && (
                      <div className="h-48 overflow-hidden rounded-t-xl">
                        <img
                          src={news.image_url}
                          alt={news.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <span className="badge-primary mb-3 inline-block">
                        {news.category}
                      </span>
                      <h3 className="font-bold text-lg mb-2">{news.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {news.summary || news.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* External News Section */}
      <section className="py-16 bg-muted" data-testid="external-news">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <ExternalLink className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl font-bold">Noticias de Entidades Oficiales</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select
                  value={selectedSource}
                  onValueChange={setSelectedSource}
                >
                  <SelectTrigger
                    className="w-[200px] bg-white"
                    data-testid="source-filter"
                  >
                    <SelectValue placeholder="Filtrar por fuente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todas las fuentes</SelectItem>
                    {newsSources.map((source) => (
                      <SelectItem key={source.name} value={source.name}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2"
                data-testid="refresh-news-btn"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>
            </div>
          </div>

          {/* News Sources Links */}
          <div className="flex flex-wrap gap-2 mb-8">
            {newsSources.map((source) => (
              <a
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`source-badge ${getSourceBadgeClass(source.name)} hover:opacity-80 transition-opacity`}
                data-testid={`source-link-${source.name}`}
              >
                {source.name}
              </a>
            ))}
          </div>

          {/* External News Grid */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-white border-border">
                  <CardContent className="p-6">
                    <div className="skeleton h-4 w-24 mb-3" />
                    <div className="skeleton h-6 w-full mb-2" />
                    <div className="skeleton h-6 w-3/4 mb-4" />
                    <div className="skeleton h-4 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNews.length > 0 ? (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {filteredNews.map((news, index) => (
                <motion.a
                  key={index}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  className="block"
                  data-testid={`external-news-${index}`}
                >
                  <Card className="h-full bg-white border-border card-hover group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`source-badge ${getSourceBadgeClass(
                            news.source
                          )}`}
                        >
                          {news.source}
                        </span>
                        {news.date && (
                          <span className="text-xs text-muted-foreground">
                            {news.date}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-3 mb-4">
                        {news.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-secondary transition-colors">
                        <span>Leer más</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No hay noticias disponibles de esta fuente.
              </p>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Actualizar noticias
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground text-center">
            Las noticias externas provienen de las páginas oficiales de cada
            entidad. FUNSOMEX no se hace responsable del contenido de las fuentes
            externas.
          </p>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;
