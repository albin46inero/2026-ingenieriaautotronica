import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { FileText, Calendar, Eye, Clock, Download, ChevronRight, Sparkles, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// ─── CONFIGURACIÓN DEL WORKER LOCAL ──────────────────────────────────────────
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// ─── FONDO OSCURO CON DEGRADADO Y HUMO ──────────────────────────────────────
function DarkSmokeBackground({ primaryColor, secondaryColor }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Degradado base oscuro con colores institucionales */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top, ${primaryColor}15 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, ${secondaryColor}20 0%, transparent 50%),
            linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)
          `
        }}
      />

      {/* Humo 1 - Arriba izquierda */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${primaryColor}25 0%, transparent 70%)`,
          top: "-20%",
          left: "-10%"
        }}
        animate={{
          x: [0, 40, 0, -40, 0],
          y: [0, -30, 0, 30, 0],
          scale: [1, 1.15, 1, 1.1, 1],
          opacity: [0.2, 0.35, 0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Humo 2 - Abajo derecha */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${secondaryColor}30 0%, transparent 70%)`,
          bottom: "-15%",
          right: "-5%"
        }}
        animate={{
          x: [0, -35, 0, 35, 0],
          y: [0, 40, 0, -40, 0],
          scale: [1, 1.2, 1, 1.1, 1],
          opacity: [0.15, 0.3, 0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />

      {/* Humo 3 - Centro */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-2xl"
        style={{
          background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)"
        }}
        animate={{
          x: [0, 25, 0, -25, 0],
          y: [0, 20, 0, -20, 0],
          scale: [1, 1.1, 1, 1.05, 1],
          opacity: [0.1, 0.2, 0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />

      {/* Partículas decorativas flotantes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: i % 2 === 0 ? primaryColor : secondaryColor,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.15
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.15, 0.3, 0.15]
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5
          }}
        />
      ))}

      {/* Textura de ruido sutil */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}

function formatFecha(fecha) {
  if (!fecha) return "";
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

const getColorFilter = (color) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `brightness(0) saturate(100%) invert(${Math.round((1 - r/255) * 100)}%) sepia(100%) hue-rotate(${Math.round(Math.atan2(b, r) * 180 / Math.PI)}deg) saturate(500%)`;
};

const FloatingDecorator = ({ src, size, x, y, delay, duration = 12, rotate = true, color = null }) => (
  <motion.img
    src={src}
    alt="decorador"
    className="absolute pointer-events-none z-0"
    style={{
      width: size,
      height: "auto",
      left: x,
      top: y,
      filter: color ? getColorFilter(color) : "none",
    }}
    animate={{
      y: [0, -25, 0],
      rotate: rotate ? [0, 360] : 0,
      scale: [1, 1.08, 1],
    }}
    transition={{
      y: { duration, delay, repeat: Infinity, ease: "easeInOut" },
      rotate: rotate ? { duration: 20, delay, repeat: Infinity, ease: "linear" } : {},
      scale: { duration: duration / 2, delay, repeat: Infinity, ease: "easeInOut" },
    }}
  />
);

// ─── VISOR PDF LOCAL ──────────────────────────────────────────────────────────
function PdfPreview({ url, primaryColor }) {
  const [status, setStatus] = useState("idle");

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-black/20">
      {status === "error" && (
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <FileText size={36} style={{ color: primaryColor, opacity: 0.5 }} />
          <span className="text-xs text-white/50">Vista previa no disponible</span>
        </div>
      )}

      <Document
        file={url}
        loading={
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              {[0, 0.15, 0.3].map((delay) => (
                <div
                  key={delay}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: primaryColor, animationDelay: `${delay}s` }}
                />
              ))}
            </div>
            <span className="text-xs text-white/50">Cargando vista previa…</span>
          </div>
        }
        onLoadSuccess={() => setStatus("success")}
        onLoadError={() => setStatus("error")}
        className={status === "error" ? "hidden" : ""}
      >
        <Page
          pageNumber={1}
          height={220}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function GacetaRecientes({ gaceta = [], loading, institucion }) {
  const [visibleItems, setVisibleItems] = useState({});
  const observerRefs = useRef({});

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor   = colors.color_primario   || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  const documentosRecientes = [...gaceta]
    .sort((a, b) => new Date(b.gaceta_fecha) - new Date(a.gaceta_fecha))
    .slice(0, 3);

  useEffect(() => {
    if (documentosRecientes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");
          if (entry.isIntersecting && id) {
            setVisibleItems((prev) => ({ ...prev, [id]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    Object.values(observerRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [documentosRecientes]);

  // ── LOADING STATE ──
  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gray-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-32 h-6 bg-white/10 rounded animate-pulse mb-2" />
          <div className="w-64 h-8 bg-white/10 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (documentosRecientes.length === 0) return null;

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">

      {/* ─── FONDO OSCURO CON DEGRADADO Y HUMO ────────────────────────── */}
      <DarkSmokeBackground primaryColor={primaryColor} secondaryColor={secondaryColor} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── ENCABEZADO CON ESTILO OSCURO ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
               style={{ 
                 background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
                 border: `1px solid ${primaryColor}40`
               }}>
            <Sparkles size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Gaceta Universitaria
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            <span className="relative inline-block">
              <span 
                className="relative z-10"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, #ffffff)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: `0 0 40px ${primaryColor}40`
                }}
              >
                Documentos Oficiales
              </span>
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                  boxShadow: `0 0 20px ${primaryColor}60`
                }}
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              />
            </span>
          </h2>
          <p className="text-white/60 mt-3 text-sm max-w-2xl mx-auto">
            Los documentos más recientes publicados en la gaceta universitaria
          </p>
        </motion.div>

        {/* ─── GRID DE CARDS CON ESTILO DARK ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {documentosRecientes.map((item, index) => (
            <motion.div
              key={item.gaceta_id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-white/10 hover:border-white/30">
                
                {/* Barra superior con glow */}
                <div
                  className="h-1.5 w-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                    boxShadow: `0 0 10px ${primaryColor}60`
                  }}
                />

                <div className="p-5 flex-1 flex flex-col">

                  {/* ── VISTA PREVIA PDF LOCAL ── */}
                  <Link to={`/gaceta/${item.gaceta_id}`} className="block mb-4">
                    <div
                      ref={(el) => (observerRefs.current[item.gaceta_id] = el)}
                      data-id={item.gaceta_id}
                      className="relative w-full h-[220px] rounded-xl overflow-hidden cursor-pointer group/preview bg-black/20 border border-white/10"
                    >
                      {visibleItems[item.gaceta_id] ? (
                        <>
                          <PdfPreview
                            url={item.gaceta_documento}
                            primaryColor={primaryColor}
                          />

                          {/* Overlay hover */}
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20">
                              <ExternalLink size={14} className="text-white" />
                              <span className="text-xs text-white font-medium">Ver documento completo</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-3">
                          <div className="flex items-center gap-1">
                            {[0, 0.15, 0.3].map((d) => (
                              <div
                                key={d}
                                className="w-2 h-2 rounded-full animate-bounce"
                                style={{ backgroundColor: primaryColor, animationDelay: `${d}s` }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-white/50">Desplázate para ver vista previa</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Badge + fecha */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${primaryColor}25`, 
                        color: primaryColor,
                        border: `1px solid ${primaryColor}40`
                      }}
                    >
                      GACETA
                    </span>
                    <div className="flex items-center gap-1.5 text-white/60">
                      <Calendar size={12} style={{ color: primaryColor }} />
                      <span className="text-xs">{formatFecha(item.gaceta_fecha)}</span>
                    </div>
                  </div>

                  {/* Título con texto blanco */}
                  <Link to={`/gaceta/${item.gaceta_id}`}>
                    <h3 className="font-bold text-white text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-white transition-colors leading-tight drop-shadow-sm">
                      {item.gaceta_titulo}
                    </h3>
                  </Link>

                  {/* Metadatos con texto claro */}
                  <div className="flex items-center gap-3 mt-2 mb-3 text-xs text-white/50">
                    <div className="flex items-center gap-1">
                      <Eye size={11} style={{ color: primaryColor }} />
                      <span>Documento oficial</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="flex items-center gap-1">
                      <Clock size={11} style={{ color: primaryColor }} />
                      <span>PDF</span>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="mt-auto flex items-center gap-2 pt-3 border-t border-white/10">
                    <Link
                      to={`/gaceta/${item.gaceta_id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        color: "white",
                        boxShadow: `0 4px 15px ${primaryColor}40`
                      }}
                    >
                      <span>Ver documento</span>
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    {item.gaceta_documento && (
                      <a
                        href={item.gaceta_documento}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border transition-all duration-300 hover:scale-105"
                        style={{ 
                          borderColor: `${primaryColor}40`, 
                          color: primaryColor,
                          backgroundColor: `${primaryColor}10`
                        }}
                        title="Descargar PDF"
                      >
                        <Download size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Footer oscuro */}
                <div className="px-5 py-3 bg-black/20 border-t border-white/10">
                  <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span>Universidad Pública de El Alto</span>
                    <span>#{String(index + 1).padStart(2, "0")}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ver todos con estilo oscuro */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10 sm:mt-12"
        >
          <Link
            to="/gaceta"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
              color: primaryColor,
              border: `1px solid ${primaryColor}40`,
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
              e.currentTarget.style.color = "white";
              e.currentTarget.style.boxShadow = `0 8px 25px ${primaryColor}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`;
              e.currentTarget.style.color = primaryColor;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span>Ver todos los documentos de la gaceta</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" style={{ color: primaryColor }} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}