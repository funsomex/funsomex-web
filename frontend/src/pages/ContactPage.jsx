import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Mail, MapPin, Phone, Send, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContactPage = () => {
  const [foundationInfo, setFoundationInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`${API}/foundation-info`);
        setFoundationInfo(response.data);
      } catch (error) {
        console.error("Error fetching foundation info:", error);
      }
    };
    fetchInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Mensaje enviado correctamente");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error al enviar el mensaje. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden" data-testid="contact-page">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary" data-testid="contact-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-56 h-56 rounded-full bg-accent" />
          <div className="absolute bottom-10 left-20 w-40 h-40 rounded-full bg-secondary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Estamos para ayudarte
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Contáctanos
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              ¿Tienes alguna pregunta o quieres trabajar con nosotros? Nos
              encantaría saber de ti.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background" data-testid="contact-form-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
              <form
                onSubmit={handleSubmit}
                className="contact-form space-y-6"
                data-testid="contact-form"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+57 300 000 0000"
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="¿En qué podemos ayudarte?"
                      required
                      data-testid="input-subject"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    required
                    data-testid="input-message"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 rounded-full py-6 font-semibold"
                  data-testid="submit-contact"
                >
                  {loading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Información de Contacto
                </h2>
                <p className="text-muted-foreground mb-8">
                  Estamos ubicados en San Andrés de Sotavento, Córdoba. Puedes
                  visitarnos o contactarnos por cualquiera de los siguientes
                  medios.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="bg-white border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Dirección</h3>
                      <p className="text-muted-foreground text-sm">
                        {foundationInfo?.address || "Calle El Estanco DG 4 CR 7C-40"}
                        <br />
                        {foundationInfo?.city || "San Andrés de Sotavento"},{" "}
                        {foundationInfo?.department || "Córdoba"}
                        <br />
                        {foundationInfo?.country || "Colombia"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Correo Electrónico</h3>
                      <a
                        href={`mailto:${foundationInfo?.email || "administracion@funsomex.com"}`}
                        className="text-muted-foreground text-sm hover:text-primary transition-colors"
                        data-testid="contact-email-link"
                      >
                        {foundationInfo?.email || "administracion@funsomex.com"}
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-border">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Horario de Atención</h3>
                      <p className="text-muted-foreground text-sm">
                        Lunes a Viernes: 8:00 AM - 5:00 PM
                        <br />
                        Sábados: 8:00 AM - 12:00 PM
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* NIT Info */}
              <Card className="bg-primary text-white border-0">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">
                    Información Tributaria
                  </h3>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    <p>
                      <strong>NIT:</strong> {foundationInfo?.nit || "901936025-1"}
                    </p>
                  </div>
                  <p className="text-sm text-white/80 mt-2">
                    Fundación registrada como entidad sin ánimo de lucro
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-muted" data-testid="map-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Ubicación
            </span>
            <h2>Encuéntranos</h2>
            <p>
              Visítanos en nuestra sede en San Andrés de Sotavento, Córdoba.
            </p>
          </div>

          <div className="map-container h-[400px] rounded-2xl overflow-hidden">
            <iframe
              title="Ubicación FUNSOMEX"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31347.77831842088!2d-75.51835!3d9.14617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e5965752bad26e5%3A0x5f4b6d8a5c1c5c5c!2sSan%20Andr%C3%A9s%20de%20Sotavento%2C%20C%C3%B3rdoba!5e0!3m2!1ses!2sco!4v1699999999999!5m2!1ses!2sco"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
