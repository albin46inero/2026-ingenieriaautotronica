import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router";
import { motion } from "motion/react";
import { 
  Calendar, Sparkles, ChevronRight, 
  BookOpen, User, FileText, Eye,
  AlertCircle, TrendingUp, Heart, 
  Share2, Bookmark, Clock
} from "lucide-react";

// Componente decorador flotante
const FloatingDecorator = ({ src, size, x, y, delay, duration = 12, rotate = true, color = null }) => {
  const getColorFilter = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `brightness(0) saturate(100%) invert(${Math.round((1 - r/255) * 100)}%) sepia(100%) hue-rotate(${Math.round(Math.atan2(b, r) * 180 / Math.PI)}deg) saturate(500%)`;
  };

  return (
    <motion.img
      src={src}
      alt="decorador"
      className="absolute pointer-events-none z-0"
      style={{ 
        width: size, 
        height: 'auto', 
        left: x, 
        top: y,
        filter: color ? getColorFilter(color) : 'none'
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
};

// ─── FONDO CON DEGRADADO OSCURO Y EFECTO HUMO ───────────────────────────────
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

      {/* Overlay de textura sutil */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}

// Formatear fecha
function formatFecha(fecha) {
  if (!fecha) return "";
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

// Obtener estilo por tipo
const getTypeStyle = (tipo) => {
  const styles = {
    Curso: {
      bg: "from-blue-500 to-indigo-500",
      icon: BookOpen,
      label: "Curso",
      color: "#3b82f6"
    },
    UPEA: {
      bg: "from-emerald-500 to-teal-500",
      icon: TrendingUp,
      label: "Institucional",
      color: "#10b981"
    },
    SIS: {
      bg: "from-purple-500 to-fuchsia-500",
      icon: Heart,
      label: "Estudiantil",
      color: "#8b5cf6"
    },
    default: {
      bg: "from-gray-500 to-gray-600",
      icon: FileText,
      label: "Publicación",
      color: "#6b7280"
    }
  };
  return styles[tipo] || styles.default;
};

// Calcular tiempo relativo
function getRelativeTime(fecha) {
  if (!fecha) return "";
  const d = new Date(fecha);
  const ahora = new Date();
  const diffDias = Math.floor((ahora - d) / (1000 * 60 * 60 * 24));
  
  if (diffDias === 0) return "Hoy";
  if (diffDias === 1) return "Ayer";
  if (diffDias < 7) return `Hace ${diffDias} días`;
  if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semanas`;
  return formatFecha(fecha);
}

export default function PublicacionesView() {
  const { publicaciones, loading, institucion } = useOutletContext();
  const [filteredItems, setFilteredItems] = useState([]);

  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  useEffect(() => {
    if (!publicaciones) return;
    
    let filtered = [...publicaciones];
    filtered.sort((a, b) => new Date(b.publicaciones_fecha) - new Date(a.publicaciones_fecha));
    setFilteredItems(filtered);
  }, [publicaciones]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border-4 border-t-transparent"
          style={{ borderColor: `${primaryColor} transparent transparent transparent` }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* ─── FONDO OSCURO CON DEGRADADO Y HUMO ───────────────────────────── */}
      <DarkSmokeBackground primaryColor={primaryColor} secondaryColor={secondaryColor} />


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Encabezado con efecto glow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
               style={{ 
                 background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
                 border: `1px solid ${primaryColor}40`
               }}>
            <Sparkles size={14} style={{ color: primaryColor }} />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Biblioteca Digital
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
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
                Publicaciones
              </span>
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                  boxShadow: `0 0 20px ${primaryColor}60`
                }}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.6 }}
              />
            </span>
          </h1>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Explora nuestro repositorio de artículos, investigaciones y material académico
          </p>
        </motion.div>

        {/* Grid de publicaciones con estilo dark */}
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <BookOpen size={32} className="text-white/40" />
            </div>
            <p className="text-white/60">No hay publicaciones disponibles</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const typeStyle = getTypeStyle(item.publicaciones_tipo);
              const relativeTime = getRelativeTime(item.publicaciones_fecha);
              const isNew = new Date(item.publicaciones_fecha) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              
              return (
                <motion.div
                  key={item.publicaciones_id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8 }}
                  className="group h-full"
                >
                  <Link
                    to={`/publicaciones/${item.publicaciones_id}`}
                    className="block bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 h-full flex flex-col cursor-pointer hover:border-white/30"
                  >
                    {/* Imagen con overlay oscuro mejorado */}
                    <div className="relative h-52 overflow-hidden bg-black/20">
                      {item.publicaciones_imagen && item.publicaciones_imagen.startsWith('http') ? (
                        <>
                          <img
                            src={item.publicaciones_imagen}
                            alt={item.publicaciones_titulo}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90" />
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` 
                          }}
                        >
                          <BookOpen size={56} style={{ color: primaryColor }} className="opacity-40" />
                        </div>
                      )}
                      
                      {/* Badge tipo con glow */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span 
                          className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg bg-gradient-to-r ${typeStyle.bg}`}
                          style={{ 
                            boxShadow: `0 0 15px ${typeStyle.color}60`
                          }}
                        >
                          {typeStyle.label}
                        </span>
                        {isNew && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-green-500 text-white shadow-lg"
                                style={{ boxShadow: '0 0 15px #22c55e60' }}>
                            <Sparkles size={10} />
                            NUEVO
                          </span>
                        )}
                      </div>

                      {/* Indicador de tiempo relativo */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 border border-white/10">
                        <div className="flex items-center gap-1 text-white/80 text-[10px]">
                          <Clock size={10} />
                          <span>{relativeTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Contenido con texto claro */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-white text-base sm:text-lg mb-3 line-clamp-2 group-hover:text-white transition-colors drop-shadow-sm">
                        {item.publicaciones_titulo}
                      </h3>
                      
                      {/* Autor y fecha */}
                      <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-white/60">
                        {item.publicaciones_autor && (
                          <div className="flex items-center gap-1.5">
                            <User size={12} />
                            <span className="truncate">{item.publicaciones_autor}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          <span>{formatFecha(item.publicaciones_fecha)}</span>
                        </div>
                      </div>

                      {/* Botón de acción */}
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                          >
                            <Bookmark size={14} className="text-white/70" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                          >
                            <Share2 size={14} className="text-white/70" />
                          </motion.button>
                        </div>
                        <motion.div
                          whileHover={{ x: 3 }}
                          className="flex items-center gap-1.5 text-sm font-medium text-white/90"
                        >
                          <span>Leer más</span>
                          <ChevronRight size={14} style={{ color: primaryColor }} />
                        </motion.div>
                      </div>
                    </div>

                    {/* Barra inferior animada con glow */}
                    <motion.div 
                      className="h-1 w-0 group-hover:w-full transition-all duration-500"
                      style={{ 
                        background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                        boxShadow: `0 0 10px ${primaryColor}80`
                      }}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Contador mejorado */}
        {filteredItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-10"
          >
            <p className="text-sm text-white/40 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <BookOpen size={14} className="text-white/50" />
              Mostrando {filteredItems.length} {filteredItems.length === 1 ? "publicación" : "publicaciones"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}