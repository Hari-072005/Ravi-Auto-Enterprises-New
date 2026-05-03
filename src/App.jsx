import { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { MapPin, Phone, Clock, Mail, ChevronRight, X, Menu, Search, ArrowRight, ShieldCheck, Truck, Percent, Wrench } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "lorry", icon: "🚛", name: "Lorry / Truck", desc: "Heavy commercial vehicle engine parts for Ashok Leyland, TATA, Eicher, Mahindra", color: "from-orange-500 to-amber-500", glow: "rgba(249, 115, 22, 0.4)" },
  { id: "tractor", icon: "🚜", name: "Tractor", desc: "Agricultural tractor spares for Mahindra, Sonalika, John Deere, New Holland", color: "from-amber-500 to-yellow-500", glow: "rgba(245, 158, 11, 0.4)" },
  { id: "jcb", icon: "🏗️", name: "JCB / Excavator", desc: "Construction equipment engine parts for JCB, CAT, Komatsu, Volvo", color: "from-emerald-500 to-teal-500", glow: "rgba(16, 185, 129, 0.4)" },
  { id: "generator", icon: "⚡", name: "Generator", desc: "DG set and generator engine spares for Kirloskar, Cummins, Perkins, Greaves", color: "from-indigo-500 to-blue-500", glow: "rgba(99, 102, 241, 0.4)" },
  { id: "harvester", icon: "🌾", name: "Harvester", desc: "Combine harvester engine and operational spares for Claas, John Deere, Kubota", color: "from-red-500 to-rose-500", glow: "rgba(239, 68, 68, 0.4)" },
  { id: "car", icon: "🚗", name: "Car", desc: "Engine parts and spares for Maruti Suzuki, Hyundai, Tata, Mahindra cars", color: "from-blue-500 to-cyan-500", glow: "rgba(59, 130, 246, 0.4)" },
];

const PRODUCTS = [
  { id: 1, cat: "lorry", name: "Cylinder Head", brand: "Tiger Power", model: "BS-3,BS-4,BS-6", partNo: "AL-CH-001", tag: "Best Seller" },
  { id: 2, cat: "lorry", name: "Piston Kit (Set of 6)", brand: "Usha", model: "407 / 709", partNo: "TT-PK-006", tag: "" },
  { id: 3, cat: "lorry", name: "Crankshaft", brand: "Eicher", model: "10.90", partNo: "EC-CS-010", tag: "" },
  { id: 4, cat: "lorry", name: "Connecting Rod Set", brand: "Mahindra", model: "Blazo", partNo: "MH-CR-001", tag: "" },
  { id: 5, cat: "lorry", name: "Oil Pump", brand: "Ashok Leyland", model: "Dost / Boss", partNo: "AL-OP-002", tag: "" },
  { id: 6, cat: "lorry", name: "Water Pump", brand: "TATA", model: "1615 / 1618", partNo: "TT-WP-003", tag: "Best Seller" },
  { id: 7, cat: "lorry", name: "Piston Ring", brand: "Usha Moly Plus", model: "407", partNo: "PRS2512A9E67B7DI", tag: "Best Seller" },
  { id: 8, cat: "tractor", name: "Engine Overhaul Kit", brand: "Mahindra", model: "575 DI", partNo: "MH-OK-575", tag: "Best Seller" },
  { id: 9, cat: "tractor", name: "Fuel Injection Pump", brand: "Sonalika", model: "DI 60", partNo: "SL-FP-060", tag: "" },
  { id: 10, cat: "tractor", name: "Cylinder Liner Set", brand: "John Deere", model: "5050D", partNo: "JD-CL-505", tag: "New Arrival" },
  { id: 11, cat: "tractor", name: "Camshaft Assembly", brand: "New Holland", model: "3630", partNo: "NH-CA-363", tag: "" },
  { id: 12, cat: "tractor", name: "Piston Ring Set", brand: "Mahindra", model: "265 DI", partNo: "MH-PR-265", tag: "" },
  { id: 13, cat: "tractor", name: "Valve Set", brand: "Sonalika", model: "DI 75", partNo: "SL-VS-075", tag: "" },
  { id: 14, cat: "jcb", name: "Engine Head Gasket Kit", brand: "JCB", model: "3CX / 4CX", partNo: "JC-HG-3CX", tag: "Best Seller" },
  { id: 15, cat: "jcb", name: "Turbocharger", brand: "CAT", model: "320D", partNo: "CT-TC-320", tag: "" },
  { id: 16, cat: "jcb", name: "Hydraulic Pump", brand: "JCB", model: "JS200", partNo: "JC-HP-200", tag: "New Arrival" },
  { id: 17, cat: "jcb", name: "Starter Motor", brand: "Komatsu", model: "PC200", partNo: "KM-SM-200", tag: "" },
  { id: 18, cat: "generator", name: "Fuel Injector Set", brand: "Kirloskar", model: "KG1-75AS", partNo: "KR-FI-075", tag: "Best Seller" },
  { id: 19, cat: "generator", name: "Alternator Assembly", brand: "Cummins", model: "DG 82.5 KVA", partNo: "CM-AL-082", tag: "" },
  { id: 20, cat: "generator", name: "Engine Piston Kit", brand: "Perkins", model: "1104C", partNo: "PK-PK-110", tag: "New Arrival" },
  { id: 21, cat: "generator", name: "Air Filter Assembly", brand: "Greaves", model: "G6.75", partNo: "GV-AF-675", tag: "" },
  { id: 22, cat: "harvester", name: "Cutter Bar Blade", brand: "Claas", model: "Crop Tiger 30", partNo: "CL-CB-030", tag: "Best Seller" },
  { id: 23, cat: "harvester", name: "Combine Belt", brand: "John Deere", model: "W70", partNo: "JD-CB-W70", tag: "" },
  { id: 24, cat: "harvester", name: "Elevator Chain", brand: "Kubota", model: "DC-68G", partNo: "KB-EC-068", tag: "New Arrival" },
  { id: 25, cat: "car", name: "Brake Pads Set", brand: "Bosch", model: "Swift / Dzire", partNo: "BO-BP-001", tag: "Best Seller" },
  { id: 26, cat: "car", name: "Oil Filter", brand: "Purolator", model: "i20 / Venue", partNo: "PU-OF-020", tag: "" },
  { id: 27, cat: "car", name: "Timing Belt", brand: "Gates", model: "Nexon / Altroz", partNo: "GA-TB-015", tag: "New Arrival" }
];

const BRANDS = ["Ashok Leyland", "TATA", "Eicher", "Mahindra", "Sonalika", "Hyundai", "New Holland", "JCB", "CAT", "Komatsu", "Cummins", "Kirloskar", "Perkins", "Bharat Benz", "Isuzu", "Nissan", "Kuboto", "Yanmar"];
const TICKER_ITEMS = ["ENGINE SPARES", "LORRY PARTS", "TRACTOR PARTS", "JCB PARTS", "GENERATOR PARTS", "HARVESTER PARTS", "CAR PARTS", "GENUINE QUALITY", "PAN INDIA DELIVERY", "BULK ORDERS WELCOME"];

// ─── UTILS ───────────────────────────────────────────────────────────────────
function TiltCard({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Navbar({ onContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "glass py-3" : "bg-transparent py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform">
            RAE
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold leading-tight tracking-wide">Ravi Auto Enterprises</span>
            <span className="text-xs text-neutral-400 font-medium tracking-widest">ENGINE SPARE PARTS</span>
          </div>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {["Home", "About", "Categories", "Products"].map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`} className="text-sm font-medium text-neutral-300 hover:text-white transition-colors relative group">
                {l}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-500 transition-all group-hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <button onClick={onContact} className="px-6 py-2.5 rounded-full bg-white text-black font-medium text-sm hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transform hover:-translate-y-0.5 active:translate-y-0">
            Get Quote
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-white/10 mt-3"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {["Home", "About", "Categories", "Products", "Contact"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-white font-medium text-lg block">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 overflow-hidden flex whitespace-nowrap mt-[76px] md:mt-[88px] border-y border-white/10 relative z-40 shadow-lg">
      <motion.div 
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        className="flex gap-12 text-xs md:text-sm font-bold tracking-widest uppercase"
      >
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Hero({ onContact }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20" id="home">
      {/* Dynamic Background Elements */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(5,5,5,1)_100%)]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-amber-500/30 text-amber-500 text-xs font-bold tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            TRUSTED SINCE 2005 · ANDHRA PRADESH
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Engine Parts</span> <br/> For Heavy Vehicles.
          </h1>
          <p className="text-lg text-neutral-400 mb-10 max-w-xl leading-relaxed">
            Genuine quality spare parts for Lorries, Tractors, JCBs, Generators, Harvesters & Cars. Serving workshops and fleet owners with 500+ parts in stock.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={onContact} className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transform hover:-translate-y-1 transition-all flex items-center gap-2 group">
              Enquire Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#products" className="px-8 py-4 rounded-full glass text-white font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
              Browse Catalog
            </a>
          </div>
          
          <div className="mt-16 flex gap-12 border-t border-white/10 pt-8">
            {[["15+", "YEARS EXPERIENCE"], ["1000+", "HAPPY CUSTOMERS"], ["500+", "PARTS IN STOCK"]].map(([n, l]) => (
              <div key={l}>
                <div className="text-3xl font-bold text-white mb-1">{n}</div>
                <div className="text-xs text-neutral-500 font-medium tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative hidden lg:block"
        >
          {/* 3D Floating Elements Representation */}
          <div className="relative w-full aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
            
            {CATEGORIES.slice(0, 4).map((c, i) => (
              <motion.div
                key={c.id}
                animate={{ 
                  y: [0, -20, 0], 
                  rotateZ: [0, 5, 0] 
                }}
                transition={{ 
                  duration: 5 + i, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: i * 0.5 
                }}
                className={`absolute glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-3 w-40 h-40 shadow-2xl ${
                  i === 0 ? "top-10 left-10" : 
                  i === 1 ? "top-20 right-10" : 
                  i === 2 ? "bottom-20 left-20" : 
                  "bottom-10 right-20"
                }`}
                style={{ zIndex: 10 - i }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-3xl shadow-lg`}>
                  {c.icon}
                </div>
                <span className="text-white font-semibold text-sm text-center">{c.name}</span>
              </motion.div>
            ))}
            
            {/* Center Core */}
            <motion.div 
              className="w-48 h-48 rounded-full glass-panel flex flex-col items-center justify-center z-20 border border-white/20 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
               <div className="text-5xl mb-2">⚙️</div>
               <div className="text-white font-bold tracking-widest text-sm">OEM PARTS</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="py-24 relative" id="about">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="text-amber-500 font-bold tracking-widest text-sm mb-4">ABOUT US</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Powering India's Backbone</h2>
          <p className="text-neutral-400 text-lg">
            Based in Andhra Pradesh, we are a leading supplier of genuine engine spare parts for heavy commercial vehicles, agricultural tractors, construction equipment and industrial generators. We believe in quality, reliability and honest pricing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck size={32}/>, title: "Genuine Parts", desc: "100% OEM-grade quality assured directly from trusted manufacturers." },
            { icon: <Truck size={32}/>, title: "Fast Delivery", desc: "Pan India shipping available with express options for urgent breakdowns." },
            { icon: <Wrench size={32}/>, title: "Expert Support", desc: "Over 15 years of technical expertise to help you find the exact part you need." }
          ].map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-panel p-8 rounded-3xl group hover:border-amber-500/50 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform group-hover:bg-amber-500/10">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories({ onSelect, active }) {
  return (
    <section className="py-24 relative overflow-hidden" id="categories">
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-indigo-500/10 blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-amber-500 font-bold tracking-widest text-sm mb-4">CATEGORIES</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">What We Specialise In</h2>
          </div>
          <p className="text-neutral-400 max-w-md text-right hidden md:block">
            Select a vehicle category to explore our extensive range of high-quality engine components.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((c, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={c.id}
            >
              <TiltCard 
                className={`glass-panel p-8 rounded-3xl cursor-pointer transition-all duration-300 h-full ${active === c.id ? "ring-2 ring-amber-500 bg-white/10" : "hover:bg-white/10"}`}
              >
                <div onClick={() => onSelect(c.id)} className="h-full flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-3xl shadow-lg`} style={{ boxShadow: `0 10px 25px ${c.glow}` }}>
                      {c.icon}
                    </div>
                    <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 ${active === c.id ? "bg-amber-500 text-white border-transparent" : ""}`}>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{c.name}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mt-auto">{c.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Products({ activeCat, setActiveCat, onEnquire }) {
  const all = "all";
  const tabs = [{ id: all, label: "All Parts" }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.name }))];
  const filtered = activeCat === all ? PRODUCTS : PRODUCTS.filter((p) => p.cat === activeCat);

  return (
    <section className="py-24 relative" id="products">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-amber-500 font-bold tracking-widest text-sm mb-4">INVENTORY</div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Browse Our Spare Parts</h2>
          
          {/* Custom Scrollable Tabs */}
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4 justify-start md:justify-center">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveCat(t.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  activeCat === t.id 
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                    : "glass text-neutral-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filtered.map((p) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={p.id}
                className="group perspective"
              >
                <TiltCard className="glass p-6 rounded-2xl h-full flex flex-col border-t border-l border-white/20 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                  {/* Background Glow on hover */}
                  <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-500 rounded-2xl"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6 min-h-[28px]">
                      {p.tag === "Best Seller" && <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">🔥 Best Seller</span>}
                      {p.tag === "New Arrival" && <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">✨ New</span>}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">{p.name}</h3>
                    <p className="text-amber-500 font-medium text-sm mb-6">{p.brand} <span className="text-neutral-500 mx-2">|</span> <span className="text-neutral-300">{p.model}</span></p>
                    
                    <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Part Number</span>
                        <span className="font-mono text-sm text-neutral-300">{p.partNo}</span>
                      </div>
                      <button 
                        onClick={() => onEnquire(p)}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-amber-500 hover:text-black transition-all transform hover:scale-110 shadow-lg"
                        title="Enquire"
                      >
                        <Mail size={16} />
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function Brands() {
  return (
    <section className="py-20 relative border-y border-white/5 bg-white/[0.02]" id="brands">
      <div className="max-w-7xl mx-auto px-6 text-center mb-10">
        <h2 className="text-2xl font-bold text-neutral-400">Trusted By Leading Brands</h2>
      </div>
      <div className="w-full overflow-hidden flex whitespace-nowrap">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
          className="flex gap-8 items-center"
        >
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <div key={i} className="px-8 py-4 rounded-xl glass-panel text-neutral-300 font-bold text-lg grayscale hover:grayscale-0 hover:text-white hover:border-amber-500/30 transition-all cursor-default">
              {b}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Contact({ prefill }) {
  const [form, setForm] = useState({ name: "", phone: "", location: "", vehicle: prefill?.vehicle || "", parts: [], message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [partInput, setPartInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
            setForm(f => ({ ...f, location: data.display_name }));
          } else {
            setForm(f => ({ ...f, location: `${latitude}, ${longitude}` }));
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          setForm(f => ({ ...f, location: `${latitude}, ${longitude}` }));
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setIsLocating(false);
      }
    );
  };

  useEffect(() => {
    if (prefill) {
      setForm((f) => ({
        ...f,
        vehicle: prefill.vehicle || f.vehicle,
        parts: prefill.part && !f.parts.includes(prefill.part) ? [...f.parts, prefill.part] : f.parts
      }));
    }
  }, [prefill]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    setIsSending(true);

    const partsList = form.parts.length > 0 ? form.parts.join(", ") : "None Specified";
    const formattedMessage = `Name: ${form.name}\nPhone: ${form.phone}\nLocation: ${form.location || "Not Specified"}\nVehicle Type: ${form.vehicle || "Not Specified"}\nParts Required: ${partsList}\n\nMessage:\n${form.message || "None"}`;

    const templateParams = {
      from_name: form.name,
      name: form.name,
      sender_name: form.name,
      phone: form.phone,
      location: form.location || "Not Specified",
      vehicle: form.vehicle || "Not Specified",
      parts: partsList,
      message: formattedMessage,
    };

    emailjs.send("service_r362fk7", "template_ubeg9af", templateParams, "oHiJeitoYhgXoVpoG")
      .then(() => {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setForm({ name: "", phone: "", location: "", vehicle: "", parts: [], message: "" });
        setPartInput("");
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to send enquiry ❌");
      })
      .finally(() => setIsSending(false));
  };

  const handleAddPart = (partName) => {
    if (!partName.trim()) return;
    if (!form.parts.includes(partName.trim())) {
      setForm({ ...form, parts: [...form.parts, partName.trim()] });
    }
    setPartInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRemovePart = (partToRemove) => {
    setForm({ ...form, parts: form.parts.filter(p => p !== partToRemove) });
  };

  const selectedCat = CATEGORIES.find(c => c.name === form.vehicle)?.id;

  const filteredProducts = partInput.trim()
    ? PRODUCTS.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(partInput.toLowerCase());
        const matchCat = selectedCat ? p.cat === selectedCat : true;
        const notSelected = !form.parts.includes(p.name);
        return matchSearch && matchCat && notSelected;
      }).slice(0, 5)
    : [];

  return (
    <section className="py-24 relative" id="contact">
      {/* Background blobs for form area */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-16">
        <div className="lg:col-span-2">
          <div className="text-amber-500 font-bold tracking-widest text-sm mb-4">CONTACT US</div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Let's Get Your Engine Running!</h2>
          <p className="text-neutral-400 mb-12 text-lg">
            Send us an enquiry or walk into our store. Our team will help you find the right spare part at the best price.
          </p>
          
          <div className="flex flex-col gap-8">
            {[
              { icon: <MapPin />, title: "Visit Us", desc: "Plot No 325, Phase-I & II, 2nd Road, Agatavarappadu, AP 522001" },
              { icon: <Phone />, title: "Call Us", desc: "+91 9395180999 \n +91 6304938125" },
              { icon: <Clock />, title: "Opening Hours", desc: "Mon – Sat: 10:00 AM – 8:00 PM" },
              { icon: <Mail />, title: "Email", desc: "munnangi24@gmail.com" },
            ].map((info, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors shrink-0">
                  {info.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{info.title}</h4>
                  <p className="text-neutral-400 whitespace-pre-line text-sm">{info.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur opacity-20"></div>
          <form onSubmit={handleSubmit} className="relative glass-panel rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-white mb-2">Request a Quote</h3>
            <p className="text-neutral-400 mb-8 text-sm">We'll get back to you within a few hours.</p>

            <AnimatePresence>
              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2"
                >
                  <ShieldCheck size={18} /> Enquiry sent successfully! We'll contact you shortly.
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 tracking-wider">FULL NAME</label>
                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 tracking-wider">PHONE NUMBER</label>
                <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-neutral-400 tracking-wider">LOCATION</label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="text-xs text-amber-500 font-bold hover:text-amber-400 transition-colors disabled:opacity-50"
                  >
                    {isLocating ? "⏳ Locating..." : "📍 Get Current Location"}
                  </button>
                </div>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all" placeholder="City / Town" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 tracking-wider">VEHICLE TYPE</label>
                <select className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none" value={form.vehicle} onChange={(e) => setForm({ ...form, vehicle: e.target.value })}>
                  <option value="" className="text-neutral-500">Select Vehicle</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-neutral-400 mb-2 tracking-wider">PARTS REQUIRED</label>
              <div className="w-full bg-white/5 border border-white/10 rounded-xl p-2 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all min-h-[52px] flex flex-wrap gap-2 relative">
                {form.parts.map(p => (
                  <span key={p} className="bg-white/10 border border-white/20 text-white text-sm px-3 py-1 rounded-lg flex items-center gap-2">
                    {p}
                    <button type="button" onClick={() => handleRemovePart(p)} className="text-neutral-400 hover:text-white"><X size={14}/></button>
                  </span>
                ))}
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 bg-transparent min-w-[150px] px-2 py-1 text-white focus:outline-none text-sm placeholder:text-neutral-500"
                  placeholder={form.parts.length === 0 ? "Type part name (e.g. Oil Filter)..." : ""}
                  value={partInput}
                  onChange={(e) => { setPartInput(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPart(partInput); } }}
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && partInput.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => (
                        <div key={p.id} className="px-4 py-3 hover:bg-white/5 cursor-pointer flex justify-between items-center" onMouseDown={(e) => { e.preventDefault(); handleAddPart(p.name); }}>
                          <span className="text-white text-sm">{p.name}</span>
                          <span className="text-neutral-500 text-xs">{p.brand}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 hover:bg-white/5 cursor-pointer text-amber-500 text-sm" onMouseDown={(e) => { e.preventDefault(); handleAddPart(partInput); }}>
                        Add custom part "{partInput}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-neutral-400 mb-2 tracking-wider">ADDITIONAL MESSAGE</label>
              <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all h-28 resize-none" placeholder="Engine model, brand, quantity, etc..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>

            <button type="submit" disabled={isSending} className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2">
              {isSending ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</>
              ) : (
                <>Send Enquiry <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="pt-20 pb-8 border-t border-white/10 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-600/10 rounded-t-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                RAE
              </div>
              <span className="text-white font-bold tracking-wide">Ravi Auto Enterprises</span>
            </a>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Your reliable partner for premium engine spare parts. Quality guaranteed. Andhra Pradesh's trusted name since 2005.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Products</h4>
            <ul className="flex flex-col gap-3">
              {["Lorry Parts", "Tractor Parts", "JCB Parts", "Generator Parts"].map(l => (
                <li key={l}><a href="#products" className="text-neutral-400 hover:text-amber-500 text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Brands</h4>
            <ul className="flex flex-col gap-3">
              {["Ashok Leyland", "TATA Motors", "Mahindra", "Cummins"].map(l => (
                <li key={l}><a href="#brands" className="text-neutral-400 hover:text-amber-500 text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {["About Us", "Contact Us", "Get Quote", "Bulk Orders"].map(l => (
                <li key={l}><a href="#about" className="text-neutral-400 hover:text-amber-500 text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-neutral-500 text-xs">
          <p>© {new Date().getFullYear()} Ravi Auto Enterprises. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Premium UI Redesign</p>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeCat, setActiveCat] = useState("all");
  const [enquirePrefill, setEnquirePrefill] = useState(null);
  const [toast, setToast] = useState(null);

  const handleCatSelect = (id) => {
    setActiveCat(id);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleEnquire = (product) => {
    const cat = CATEGORIES.find((c) => c.id === product.cat);
    setEnquirePrefill({ vehicle: cat?.name || "", part: product.name });
    setToast(`Enquiring about: ${product.name}`);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => setToast(null), 3000);
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar onContact={scrollToContact} />
      <Ticker />
      <Hero onContact={scrollToContact} />
      <About />
      <Categories onSelect={handleCatSelect} active={activeCat} />
      <Products activeCat={activeCat} setActiveCat={setActiveCat} onEnquire={handleEnquire} />
      <Brands />
      <Contact prefill={enquirePrefill} />
      <Footer />
      
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-panel border border-amber-500/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_10px_40px_rgba(245,158,11,0.2)]"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-white text-sm font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
