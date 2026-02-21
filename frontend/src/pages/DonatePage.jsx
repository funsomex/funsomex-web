import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Heart, Gift, Mail, CheckCircle2, ArrowRight, CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const predefinedAmounts = [10, 25, 50, 100, 250, 500];

const DonatePage = () => {
  const [searchParams] = useSearchParams();
  const [foundationInfo, setFoundationInfo] = useState(null);
  const [donationStats, setDonationStats] = useState({ total_amount: 0, total_donations: 0 });
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showPayPal, setShowPayPal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoRes, statsRes] = await Promise.all([
          axios.get(`${API}/foundation-info`),
          axios.get(`${API}/donations/stats`)
        ]);
        setFoundationInfo(infoRes.data);
        setDonationStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();

    // Check for PayPal return
    if (searchParams.get("success") === "true") {
      const paymentId = searchParams.get("paymentId");
      const payerId = searchParams.get("PayerID");
      if (paymentId && payerId) {
        executePayment(paymentId, payerId);
      }
    } else if (searchParams.get("cancelled") === "true") {
      toast.error("Donación cancelada");
    }
  }, [searchParams]);

  const executePayment = async (paymentId, payerId) => {
    try {
      const response = await axios.post(`${API}/donations/execute-payment`, null, {
        params: { payment_id: paymentId, payer_id: payerId }
      });
      if (response.data.success) {
        toast.success("¡Gracias por tu donación! Tu apoyo transforma vidas.");
        // Refresh stats
        const statsRes = await axios.get(`${API}/donations/stats`);
        setDonationStats(statsRes.data);
      }
    } catch (error) {
      console.error("Error executing payment:", error);
      toast.error("Error al procesar la donación");
    }
  };

  const getFinalAmount = () => {
    if (customAmount && parseFloat(customAmount) > 0) {
      return parseFloat(customAmount);
    }
    return selectedAmount || 0;
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setShowPayPal(false);
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
    setShowPayPal(false);
  };

  const handleProceedToPayment = () => {
    const amount = getFinalAmount();
    if (amount < 1) {
      toast.error("Por favor selecciona o ingresa un monto válido");
      return;
    }
    setShowPayPal(true);
  };

  const createPayPalOrder = async () => {
    const amount = getFinalAmount();
    try {
      const response = await axios.post(`${API}/donations/create-payment`, {
        amount: amount,
        currency: "USD",
        donor_name: donorName || null,
        donor_email: donorEmail || null,
        message: message || null
      });
      
      if (response.data.success) {
        // Redirect to PayPal
        window.location.href = response.data.approval_url;
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      toast.error("Error al crear la orden de pago");
      throw error;
    }
  };

  const impactItems = [
    {
      icon: "🎓",
      title: "Educación",
      description: "Capacitación y formación para jóvenes de comunidades rurales.",
    },
    {
      icon: "💚",
      title: "Salud Mental",
      description: "Programas de bienestar psicológico para familias vulnerables.",
    },
    {
      icon: "💼",
      title: "Emprendimiento",
      description: "Apoyo a microempresas y emprendimientos comunitarios.",
    },
    {
      icon: "🌱",
      title: "Desarrollo Rural",
      description: "Proyectos de desarrollo sostenible en zonas indígenas.",
    },
  ];

  return (
    <div className="overflow-hidden" data-testid="donate-page">
      {/* Hero Section */}
      <section className="relative py-20 bg-secondary" data-testid="donate-hero">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-56 h-56 rounded-full bg-white" />
          <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full bg-accent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Haz la diferencia
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Apoya Nuestra Causa
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Tu donación ayuda a transformar vidas en las comunidades indígenas
              de Córdoba y Sucre. Cada aporte cuenta.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Donation Stats */}
      {donationStats.total_donations > 0 && (
        <section className="py-8 bg-white border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">${donationStats.total_amount?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total recaudado</p>
              </div>
              <div className="h-12 w-px bg-border hidden sm:block" />
              <div>
                <p className="text-3xl font-bold text-secondary">{donationStats.total_donations}</p>
                <p className="text-sm text-muted-foreground">Donaciones recibidas</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Online Donation Section */}
      <section className="py-20 bg-background" data-testid="online-donation-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">Donar en Línea con PayPal</h2>
              </div>
              
              <Card className="bg-white border-border shadow-card">
                <CardContent className="p-8">
                  {/* Amount Selection */}
                  <div className="mb-6">
                    <Label className="text-base font-semibold mb-3 block">
                      Selecciona un monto (USD)
                    </Label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount ? "default" : "outline"}
                          className={`py-6 text-lg font-bold ${
                            selectedAmount === amount
                              ? "bg-primary text-primary-foreground"
                              : "hover:border-primary"
                          }`}
                          onClick={() => handleAmountSelect(amount)}
                          data-testid={`amount-${amount}`}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="Otro monto"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="pl-10 py-6 text-lg"
                        min="1"
                        data-testid="custom-amount-input"
                      />
                    </div>
                  </div>

                  {/* Donor Info (Optional) */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="donor-name">Nombre (opcional)</Label>
                      <Input
                        id="donor-name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Tu nombre"
                        data-testid="donor-name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="donor-email">Email (opcional)</Label>
                      <Input
                        id="donor-email"
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="tu@email.com"
                        data-testid="donor-email-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Mensaje (opcional)</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Deja un mensaje de apoyo..."
                        rows={2}
                        data-testid="donation-message-input"
                      />
                    </div>
                  </div>

                  {/* PayPal Button */}
                  {!showPayPal ? (
                    <Button
                      onClick={handleProceedToPayment}
                      className="w-full bg-[#0070ba] hover:bg-[#003087] text-white py-6 text-lg font-semibold rounded-full"
                      disabled={getFinalAmount() < 1}
                      data-testid="proceed-to-paypal-btn"
                    >
                      <img 
                        src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" 
                        alt="PayPal" 
                        className="h-6 mr-2"
                      />
                      Donar ${getFinalAmount() || 0} USD con PayPal
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-xl text-center mb-4">
                        <p className="font-semibold text-lg">Monto a donar: ${getFinalAmount()} USD</p>
                      </div>
                      <Button
                        onClick={createPayPalOrder}
                        className="w-full bg-[#ffc439] hover:bg-[#f0b72f] text-[#003087] py-6 text-lg font-bold rounded-full"
                        data-testid="paypal-checkout-btn"
                      >
                        <img 
                          src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" 
                          alt="PayPal" 
                          className="h-6 mr-2"
                        />
                        Completar Donación con PayPal
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowPayPal(false)}
                        className="w-full"
                      >
                        Cambiar monto
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Serás redirigido a PayPal para completar tu donación de forma segura.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Impact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <Heart className="w-16 h-16 text-secondary mb-6" />
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Tu Donación Transforma Vidas
                </h2>
                <p className="text-muted-foreground mb-8">
                  {foundationInfo?.donation_info?.message ||
                    "Tu donación ayuda a transformar vidas en las comunidades indígenas de Córdoba y Sucre."}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {impactItems.map((item, index) => (
                  <Card key={index} className="bg-white border-border">
                    <CardContent className="p-4">
                      <span className="text-2xl mb-2 block">{item.icon}</span>
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Pago 100% Seguro</p>
                    <p className="text-sm text-muted-foreground">
                      Procesado por PayPal con encriptación de datos.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Certificado de Donación</p>
                    <p className="text-sm text-muted-foreground">
                      Recibirás un comprobante de tu donación.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Beneficios Tributarios</p>
                    <p className="text-sm text-muted-foreground">
                      Tu donación puede ser deducible de impuestos.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Alternative Donation Methods */}
      <section className="py-20 bg-muted" data-testid="alternative-donation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Otras formas de ayudar
            </span>
            <h2>Métodos Alternativos</h2>
            <p>
              Si prefieres donar por otros medios, aquí tienes más opciones.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white border-border">
              <CardContent className="p-6 text-center">
                <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Transferencia Bancaria</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Solicita los datos bancarios al correo de la fundación.
                </p>
                <a
                  href={`mailto:${foundationInfo?.email || "administracion@funsomex.com"}?subject=Solicitud datos bancarios para donación`}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Solicitar datos
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white border-border">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Donación en Especie</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Equipos, materiales educativos o suministros.
                </p>
                <Link
                  to="/contacto"
                  className="text-secondary hover:underline text-sm font-medium"
                >
                  Contáctanos
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white border-border">
              <CardContent className="p-6 text-center">
                <Mail className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Voluntariado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tu tiempo y habilidades también son valiosos.
                </p>
                <a
                  href={`mailto:${foundationInfo?.email || "administracion@funsomex.com"}?subject=Quiero ser voluntario`}
                  className="text-accent-foreground hover:underline text-sm font-medium"
                >
                  Unirme como voluntario
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tax Benefits Section */}
      <section className="py-16 bg-background" data-testid="tax-benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary text-white border-0">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    Beneficios Tributarios
                  </h3>
                  <p className="text-white/80 mb-6">
                    Como fundación sin ánimo de lucro registrada en Colombia, tus
                    donaciones pueden ser deducibles de impuestos según la
                    normativa vigente.
                  </p>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      Certificado de donación
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      Deducción fiscal según Art. 257 E.T.
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      Transparencia en el uso de recursos
                    </li>
                  </ul>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-5xl font-bold text-accent mb-2">25%</p>
                  <p className="text-white/80">
                    Deducción en renta por donaciones a entidades sin ánimo de
                    lucro
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Foundation Info */}
      <section className="py-16 bg-muted" data-testid="foundation-info">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img
            src={foundationInfo?.logo_url}
            alt="FUNSOMEX"
            className="h-20 mx-auto mb-6"
          />
          <h3 className="text-xl font-bold mb-2">{foundationInfo?.name}</h3>
          <p className="text-muted-foreground mb-2">NIT: {foundationInfo?.nit}</p>
          <p className="text-muted-foreground">
            {foundationInfo?.address}, {foundationInfo?.city}, {foundationInfo?.department}
          </p>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;
