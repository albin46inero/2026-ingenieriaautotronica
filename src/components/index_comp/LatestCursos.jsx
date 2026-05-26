import { Link } from "react-router";
import { ArrowRight, MapPin, Calendar, Sparkles, ChevronRight, Zap, CalendarDays, PlayCircle } from "lucide-react";
import { motion } from "motion/react";

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

/**
 * LatestCursos
 * Props:
 *   cursos  {Array}  — de getGacetaEventos()
 *   loading {boolean}
 *   institucion {object} — para colores de la API
 */

function formatFecha(fecha) {
  if (!fecha) return "";
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  const d = new Date(fecha);
  return `${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
}

// Función para obtener el estado del curso
function getCursoStatus(fechaInicio, fechaFin) {
  if (!fechaInicio) return { text: "", icon: null, color: "" };
  
  const ahora = new Date();
  const inicio = new Date(fechaInicio);
  const fin = fechaFin ? new Date(fechaFin) : null;
  
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const fechaInicioSinHora = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
  const fechaFinSinHora = fin ? new Date(fin.getFullYear(), fin.getMonth(), fin.getDate()) : null;
  
  const diffDiasInicio = (fechaInicioSinHora - hoy) / (1000 * 60 * 60 * 24);
  
  if (fin && hoy >= fechaInicioSinHora && hoy <= fechaFinSinHora) {
    return { text: "EN CURSO", icon: PlayCircle, color: "from-blue-500 to-indigo-600" };
  }
  
  if (diffDiasInicio >= 0 && diffDiasInicio <= 7) {
    return { text: "PRÓXIMAMENTE", icon: CalendarDays, color: "from-amber-500 to-orange-600" };
  }
  
  if (diffDiasInicio < 0 && diffDiasInicio >= -2) {
    return { text: "NUEVO", icon: Zap, color: "from-emerald-500 to-green-600" };
  }
  
  return { text: "", icon: null, color: "" };
}

// Función para colorear PNG con filtros CSS
const getColorFilter = (color) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `brightness(0) saturate(100%) invert(${Math.round((1 - r/255) * 100)}%) sepia(100%) hue-rotate(${Math.round(Math.atan2(b, r) * 180 / Math.PI)}deg) saturate(500%)`;
};

// Componente decorador flotante con color de API
const FloatingDecorator = ({ src, size, x, y, delay, duration = 12, rotate = true, color = null }) => {
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

export default function LatestCursos({ cursos = [], loading, institucion }) {
  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  const activos = cursos.filter(c => c.det_estado === "1");
  const latestCurso = activos.find(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === "CURSOS");
  const latestSeminario = activos.find(c => c.tipo_curso_otro?.tipo_conv_curso_nombre === "SEMINARIOS");
  const items = [latestCurso, latestSeminario].filter(Boolean);

  if (loading) {
    return (
      <section className="relative py-8 sm:py-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-24 h-5 bg-white/10 rounded animate-pulse mb-1" />
          <div className="w-48 h-7 bg-white/10 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse border border-white/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="relative py-8 sm:py-10 lg:py-12 overflow-hidden">
      
      {/* ─── FONDO OSCURO CON DEGRADADO Y HUMO ────────────────────────── */}
      <DarkSmokeBackground primaryColor={primaryColor} secondaryColor={secondaryColor} />

    

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado con estilo oscuro */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mb-2"
               style={{ 
                 background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
                 border: `1px solid ${primaryColor}40`
               }}>
            <Sparkles size={12} style={{ color: primaryColor }} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/90">
              Recientes
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
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
                Cursos y Seminarios
              </span>
              <motion.div 
                className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                  boxShadow: `0 0 15px ${primaryColor}60`
                }}
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              />
            </span>
          </h2>
          <p className="text-white/60 mt-2 text-xs max-w-2xl mx-auto">
            Capacitación y formación continua para profesionales y estudiantes
          </p>
        </motion.div>

        {/* Grid más compacto con cards oscuras */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {items.map((item, index) => {
            const status = getCursoStatus(item.det_fecha_ini, item.det_fecha_fin);
            
            return (
              <motion.div
                key={item.iddetalle_cursos_academicos}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/cursos/${item.iddetalle_cursos_academicos}`}
                  className="group block bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-white/30"
                >
                  {/* Imagen - más compacta con overlay oscuro */}
                  <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden bg-black/20">
                    {item.det_img_portada ? (
                      <>
                        <img
                          src={item.det_img_portada}
                          alt={item.det_titulo}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90" />
                      </>
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` }}
                      >
                        <span 
                          className="text-xl font-bold opacity-40 text-white"
                        >
                          {item.tipo_curso_otro?.tipo_conv_curso_nombre}
                        </span>
                      </div>
                    )}
                    
                    {/* Badge de tipo - más pequeño con glow */}
                    <span 
                      className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        boxShadow: `0 0 10px ${primaryColor}60`
                      }}
                    >
                      {item.tipo_curso_otro?.tipo_conv_curso_nombre}
                    </span>

                    {/* Badge de modalidad - más pequeño */}
                    <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-medium border border-white/10">
                      {item.det_modalidad}
                    </span>

                    {/* Badge de estado con glow */}
                    {status.text && (
                      <motion.div
                        initial={{ scale: 0, x: -15 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 400, delay: 0.15 }}
                        className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, ${status.color.split(' ')[1]?.replace('to-', '') || '#10b981'}, ${status.color.split(' ')[2]?.replace('to-', '') || '#059669'})`,
                          boxShadow: `0 0 10px ${status.color.split(' ')[1]?.replace('to-', '') || '#10b981'}60`
                        }}
                      >
                        <status.icon size={10} className="text-white" />
                        <span className="text-white text-[10px] font-bold">{status.text}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Contenido - más compacto con texto blanco */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-white text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-white transition-colors drop-shadow-sm">
                      {item.det_titulo}
                    </h3>

                    {/* Información del curso - más compacta */}
                    <div className="flex flex-col gap-1.5 text-xs text-white/60 mb-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" 
                             style={{ backgroundColor: `${primaryColor}20` }}>
                          <Calendar size={10} style={{ color: primaryColor }} />
                        </div>
                        <span className="truncate">Inicio: <span className="font-medium text-white/90">{formatFecha(item.det_fecha_ini)}</span></span>
                      </div>
                      {item.det_fecha_fin && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" 
                               style={{ backgroundColor: `${primaryColor}20` }}>
                            <Calendar size={10} style={{ color: primaryColor }} />
                          </div>
                          <span className="truncate">Fin: <span className="font-medium text-white/90">{formatFecha(item.det_fecha_fin)}</span></span>
                        </div>
                      )}
                      {item.det_lugar_curso && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" 
                               style={{ backgroundColor: `${primaryColor}20` }}>
                            <MapPin size={10} style={{ color: primaryColor }} />
                          </div>
                          <span className="truncate text-xs text-white/70">{item.det_lugar_curso}</span>
                        </div>
                      )}
                    </div>

                    {/* Botón de acción - más compacto */}
                    <div className="flex items-center justify-end pt-2 border-t border-white/10">
                      <motion.div
                        whileHover={{ x: 3 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
                        style={{ 
                          backgroundColor: `${primaryColor}20`,
                          color: primaryColor,
                          border: `1px solid ${primaryColor}40`
                        }}
                      >
                        <span>Ver detalles</span>
                        <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" style={{ color: primaryColor }} />
                      </motion.div>
                    </div>
                  </div>

                  {/* Barra inferior animada con glow */}
                  <motion.div 
                    className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
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

        {/* Ver todos - más compacto con estilo oscuro */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mt-6 sm:mt-8"
        >
          <Link
            to="/cursos"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 group"
            style={{ 
              background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`,
              color: primaryColor,
              border: `1px solid ${primaryColor}40`,
              backdropFilter: "blur(10px)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.boxShadow = `0 8px 25px ${primaryColor}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)`;
              e.currentTarget.style.color = primaryColor;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <span>Ver todos los cursos y seminarios</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" style={{ color: primaryColor }} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}