import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Newspaper,
  Plus,
  Trash2,
  Mail,
  RefreshCw,
  Users,
  FolderOpen,
  Check,
  LogOut,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [news, setNews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("news");

  // Form states
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    summary: "",
    image_url: "",
    category: "general",
  });
  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "",
    bio: "",
    image_url: "",
    email: "",
    order: 0,
  });
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    location: "",
    year: new Date().getFullYear(),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentDialog, setCurrentDialog] = useState("");

  // Get auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("funsomex_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Verify authentication on mount
  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    const token = localStorage.getItem("funsomex_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.get(`${API}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuthenticated(true);
      fetchAllData();
    } catch (error) {
      console.error("Auth verification failed:", error);
      localStorage.removeItem("funsomex_token");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("funsomex_token");
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [newsRes, contactsRes, teamRes, projectsRes, donationsRes] = await Promise.all([
        axios.get(`${API}/news`),
        axios.get(`${API}/contact`, { headers }),
        axios.get(`${API}/team`),
        axios.get(`${API}/projects`),
        axios.get(`${API}/donations`, { headers }),
      ]);
      setNews(newsRes.data);
      setContacts(contactsRes.data);
      setTeam(teamRes.data);
      setProjects(projectsRes.data);
      setDonations(donationsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error("Error al cargar datos");
      }
    } finally {
      setLoading(false);
    }
  };

  // News handlers
  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/news`, newsForm, { headers: getAuthHeaders() });
      toast.success("Noticia creada correctamente");
      setNewsForm({
        title: "",
        content: "",
        summary: "",
        image_url: "",
        category: "general",
      });
      setDialogOpen(false);
      fetchAllData();
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error("Error al crear noticia");
      }
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta noticia?")) return;
    try {
      await axios.delete(`${API}/news/${id}`, { headers: getAuthHeaders() });
      toast.success("Noticia eliminada");
      fetchAllData();
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error("Error al eliminar noticia");
      }
    }
  };

  // Team handlers
  const handleCreateTeamMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/team`, teamForm, { headers: getAuthHeaders() });
      toast.success("Miembro agregado correctamente");
      setTeamForm({
        name: "",
        role: "",
        bio: "",
        image_url: "",
        email: "",
        order: 0,
      });
      setDialogOpen(false);
      fetchAllData();
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error("Error al agregar miembro");
      }
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este miembro?")) return;
    try {
      await axios.delete(`${API}/team/${id}`, { headers: getAuthHeaders() });
      toast.success("Miembro eliminado");
      fetchAllData();
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error("Error al eliminar miembro");
      }
    }
  };

  // Project handlers
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/projects`, projectForm, { headers: getAuthHeaders() });
      toast.success("Proyecto creado correctamente");
      setProjectForm({
        title: "",
        description: "",
        image_url: "",
        category: "",
        location: "",
        year: new Date().getFullYear(),
      });
      setDialogOpen(false);
      fetchAllData();
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error("Error al crear proyecto");
      }
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proyecto?")) return;
    try {
      await axios.delete(`${API}/projects/${id}`, { headers: getAuthHeaders() });
      toast.success("Proyecto eliminado");
      fetchAllData();
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error("Error al eliminar proyecto");
      }
    }
  };

  // Contact handlers
  const handleMarkRead = async (id) => {
    try {
      await axios.put(`${API}/contact/${id}/read`, null, { headers: getAuthHeaders() });
      toast.success("Marcado como leído");
      fetchAllData();
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error("Error al marcar como leído");
      }
    }
  };

  const handleRefreshExternalNews = async () => {
    try {
      await axios.post(`${API}/external-news/refresh`);
      toast.success("Actualizando noticias externas...");
    } catch (error) {
      toast.error("Error al actualizar noticias");
    }
  };

  const openDialog = (type) => {
    setCurrentDialog(type);
    setDialogOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted" data-testid="admin-page">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-muted-foreground">
                Gestiona el contenido de FUNSOMEX
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={fetchAllData}
                className="gap-2"
                data-testid="refresh-data-btn"
              >
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="gap-2"
                data-testid="logout-btn"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="news" className="gap-2">
              <Newspaper className="w-4 h-4" />
              Noticias
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="w-4 h-4" />
              Equipo
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FolderOpen className="w-4 h-4" />
              Proyectos
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-2">
              <Mail className="w-4 h-4" />
              Mensajes
              {contacts.filter((c) => !c.read).length > 0 && (
                <span className="ml-1 bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                  {contacts.filter((c) => !c.read).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="donations" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Donaciones
            </TabsTrigger>
          </TabsList>

          {/* News Tab */}
          <TabsContent value="news" data-testid="news-tab">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Noticias FUNSOMEX</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleRefreshExternalNews}
                  className="gap-2"
                  data-testid="refresh-external-news"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualizar Externas
                </Button>
                <Dialog open={dialogOpen && currentDialog === "news"} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="gap-2 bg-primary"
                      onClick={() => openDialog("news")}
                      data-testid="add-news-btn"
                    >
                      <Plus className="w-4 h-4" />
                      Nueva Noticia
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nueva Noticia</DialogTitle>
                      <DialogDescription>
                        Agrega una noticia al sitio web de FUNSOMEX
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateNews} className="space-y-4">
                      <div>
                        <Label htmlFor="news-title">Título</Label>
                        <Input
                          id="news-title"
                          value={newsForm.title}
                          onChange={(e) =>
                            setNewsForm({ ...newsForm, title: e.target.value })
                          }
                          required
                          data-testid="news-title-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="news-summary">Resumen</Label>
                        <Input
                          id="news-summary"
                          value={newsForm.summary}
                          onChange={(e) =>
                            setNewsForm({ ...newsForm, summary: e.target.value })
                          }
                          data-testid="news-summary-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="news-content">Contenido</Label>
                        <Textarea
                          id="news-content"
                          value={newsForm.content}
                          onChange={(e) =>
                            setNewsForm({ ...newsForm, content: e.target.value })
                          }
                          rows={4}
                          required
                          data-testid="news-content-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="news-image">URL de Imagen</Label>
                        <Input
                          id="news-image"
                          value={newsForm.image_url}
                          onChange={(e) =>
                            setNewsForm({ ...newsForm, image_url: e.target.value })
                          }
                          data-testid="news-image-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="news-category">Categoría</Label>
                        <Select
                          value={newsForm.category}
                          onValueChange={(value) =>
                            setNewsForm({ ...newsForm, category: value })
                          }
                        >
                          <SelectTrigger data-testid="news-category-select">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="proyectos">Proyectos</SelectItem>
                            <SelectItem value="eventos">Eventos</SelectItem>
                            <SelectItem value="comunicados">Comunicados</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full" data-testid="submit-news">
                        Crear Noticia
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-4">
              {news.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay noticias creadas</p>
                  </CardContent>
                </Card>
              ) : (
                news.map((item) => (
                  <Card key={item.id} className="bg-white">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge-primary text-xs">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {item.summary || item.content}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteNews(item.id)}
                        data-testid={`delete-news-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" data-testid="team-tab">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Equipo de Trabajo</h2>
              <Dialog open={dialogOpen && currentDialog === "team"} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="gap-2 bg-primary"
                    onClick={() => openDialog("team")}
                    data-testid="add-team-btn"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Miembro
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Miembro del Equipo</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTeamMember} className="space-y-4">
                    <div>
                      <Label htmlFor="team-name">Nombre</Label>
                      <Input
                        id="team-name"
                        value={teamForm.name}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, name: e.target.value })
                        }
                        required
                        data-testid="team-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="team-role">Cargo</Label>
                      <Input
                        id="team-role"
                        value={teamForm.role}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, role: e.target.value })
                        }
                        required
                        data-testid="team-role-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="team-bio">Biografía</Label>
                      <Textarea
                        id="team-bio"
                        value={teamForm.bio}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, bio: e.target.value })
                        }
                        rows={3}
                        required
                        data-testid="team-bio-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="team-image">URL de Foto</Label>
                      <Input
                        id="team-image"
                        value={teamForm.image_url}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, image_url: e.target.value })
                        }
                        data-testid="team-image-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="team-email">Email</Label>
                      <Input
                        id="team-email"
                        type="email"
                        value={teamForm.email}
                        onChange={(e) =>
                          setTeamForm({ ...teamForm, email: e.target.value })
                        }
                        data-testid="team-email-input"
                      />
                    </div>
                    <Button type="submit" className="w-full" data-testid="submit-team">
                      Agregar Miembro
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No hay miembros del equipo
                    </p>
                  </CardContent>
                </Card>
              ) : (
                team.map((member) => (
                  <Card key={member.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {member.image_url && (
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-secondary">{member.role}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTeamMember(member.id)}
                          data-testid={`delete-team-${member.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" data-testid="projects-tab">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Proyectos</h2>
              <Dialog open={dialogOpen && currentDialog === "project"} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="gap-2 bg-primary"
                    onClick={() => openDialog("project")}
                    data-testid="add-project-btn"
                  >
                    <Plus className="w-4 h-4" />
                    Nuevo Proyecto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                      <Label htmlFor="project-title">Título</Label>
                      <Input
                        id="project-title"
                        value={projectForm.title}
                        onChange={(e) =>
                          setProjectForm({ ...projectForm, title: e.target.value })
                        }
                        required
                        data-testid="project-title-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-description">Descripción</Label>
                      <Textarea
                        id="project-description"
                        value={projectForm.description}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        required
                        data-testid="project-description-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-image">URL de Imagen</Label>
                      <Input
                        id="project-image"
                        value={projectForm.image_url}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            image_url: e.target.value,
                          })
                        }
                        required
                        data-testid="project-image-input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="project-category">Categoría</Label>
                        <Input
                          id="project-category"
                          value={projectForm.category}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              category: e.target.value,
                            })
                          }
                          required
                          data-testid="project-category-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="project-year">Año</Label>
                        <Input
                          id="project-year"
                          type="number"
                          value={projectForm.year}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              year: parseInt(e.target.value),
                            })
                          }
                          data-testid="project-year-input"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="project-location">Ubicación</Label>
                      <Input
                        id="project-location"
                        value={projectForm.location}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            location: e.target.value,
                          })
                        }
                        data-testid="project-location-input"
                      />
                    </div>
                    <Button type="submit" className="w-full" data-testid="submit-project">
                      Crear Proyecto
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-12 text-center">
                    <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay proyectos</p>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project) => (
                  <Card key={project.id} className="bg-white overflow-hidden">
                    {project.image_url && (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="badge-primary text-xs mb-1 inline-block">
                            {project.category}
                          </span>
                          <h3 className="font-semibold">{project.title}</h3>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          data-testid={`delete-project-${project.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" data-testid="contacts-tab">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">
                Mensajes de Contacto
                {contacts.filter((c) => !c.read).length > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({contacts.filter((c) => !c.read).length} sin leer)
                  </span>
                )}
              </h2>
            </div>

            <div className="grid gap-4">
              {contacts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No hay mensajes de contacto
                    </p>
                  </CardContent>
                </Card>
              ) : (
                contacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className={`bg-white ${!contact.read ? "border-l-4 border-l-secondary" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{contact.name}</span>
                            {!contact.read && (
                              <span className="badge-secondary text-xs">Nuevo</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {contact.email} {contact.phone && `• ${contact.phone}`}
                          </p>
                          <p className="font-medium text-sm mb-2">
                            {contact.subject}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {contact.message}
                          </p>
                        </div>
                        {!contact.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkRead(contact.id)}
                            className="gap-1"
                            data-testid={`mark-read-${contact.id}`}
                          >
                            <Check className="w-4 h-4" />
                            Leído
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" data-testid="donations-tab">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Donaciones Recibidas</h2>
            </div>

            <div className="grid gap-4">
              {donations.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No hay donaciones registradas
                    </p>
                  </CardContent>
                </Card>
              ) : (
                donations.map((donation) => (
                  <Card
                    key={donation.id}
                    className={`bg-white ${donation.status === "completed" ? "border-l-4 border-l-primary" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-lg">
                              ${donation.amount} {donation.currency}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                donation.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : donation.status === "created"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {donation.status === "completed"
                                ? "Completada"
                                : donation.status === "created"
                                ? "Pendiente"
                                : "Fallida"}
                            </span>
                          </div>
                          {donation.donor_name && (
                            <p className="text-sm text-muted-foreground">
                              De: {donation.donor_name}
                              {donation.donor_email && ` (${donation.donor_email})`}
                            </p>
                          )}
                          {donation.message && (
                            <p className="text-sm text-muted-foreground italic mt-1">
                              "{donation.message}"
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          {new Date(donation.created_at).toLocaleDateString("es-CO")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
