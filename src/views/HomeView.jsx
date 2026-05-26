import { useOutletContext } from "react-router";
import { motion } from "motion/react";
import HeroBanner           from "../components/index_comp/HeroBanner";
import QuickAccess          from "../components/index_comp/QuickAccess";
import MarqueeText          from "../components/index_comp/MarqueeText";
import MisionVisionAcordion from "../components/index_comp/MisionVisionAcordion";
import LatestConvocatorias  from "../components/index_comp/LatestConvocatorias";
import LatestCursos         from "../components/index_comp/LatestCursos";
import LatestPublicaciones  from "../components/index_comp/LatestPublicaciones"; // ← NUEVO IMPORT
import VideoVision          from "../components/index_comp/VideoVision";
import GacetaCarousel       from "../components/index_comp/GacetaCarousel";
import Autoridades          from "../components/index_comp/Autoridades";
import LogosBar             from "../components/index_comp/LogosBar";

export default function HomeView() {
  const {
    loading,
    institucion,
    portadas,
    autoridades,
    videos,
    publicaciones,
    linksExternos,
    convocatorias,
    cursos,
    eventos,
    gaceta,
    ofertas,
    servicios,
  } = useOutletContext();

  // Obtener colores de la API
  const descripcion = institucion?.Descripcion || institucion;
  const colors = descripcion?.colorinstitucion?.[0] || {};
  const primaryColor = colors.color_primario || "#e68600";
  const secondaryColor = colors.color_secundario || "#a75c06";

  return (
    <main id="contenido" className="min-h-screen font-sans text-gray-800 relative overflow-hidden">
      
      {/* ─── FONDO DINÁMICO CON DEGRADADO Y EFECTO HUMO ───────────────────── */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}10 0%, ${secondaryColor}10 25%, transparent 50%, ${primaryColor}05 75%, ${secondaryColor}05 100%)`
          }}
        />
        
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-20"
          style={{
            background: `radial-gradient(circle, ${primaryColor}40 0%, transparent 70%)`,
            top: "-20%",
            left: "-10%"
          }}
          animate={{
            x: [0, 30, 0, -30, 0],
            y: [0, -20, 0, 20, 0],
            scale: [1, 1.1, 1, 1.05, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-15"
          style={{
            background: `radial-gradient(circle, ${secondaryColor}40 0%, transparent 70%)`,
            bottom: "-10%",
            right: "-5%"
          }}
          animate={{
            x: [0, -25, 0, 25, 0],
            y: [0, 30, 0, -30, 0],
            scale: [1, 1.15, 1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* 1 — HERO */}
      <section className="relative">
        <HeroBanner
          institucion={institucion}
          portadas={portadas}
          loading={loading}
          overlayOpacity="bg-gradient-to-t from-black/85 via-black/60 to-transparent"
          height="min-h-[750px] lg:min-h-[850px]"
          childrenPosition="bottom-8 lg:bottom-12 left-0 right-0 px-4 sm:px-6 lg:px-8"
          autoSlide={true}
          slideInterval={6000}
          showButtons={true}
        >
          <QuickAccess linksExternos={linksExternos} loading={loading} />
        </HeroBanner>
      </section>

      {/* 2 — MARQUEE */}
      <section className="bg-white/50 backdrop-blur-sm border-y border-primary/10 relative z-10">
        <MarqueeText institucion={institucion} />
      </section>

      {/* 3 — MISIÓN/VISIÓN */}
      <section className="py-24 bg-white/60 backdrop-blur-sm relative z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">
              {institucion?.institucion_nombre ?? "Universidad Pública de El Alto"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Nuestra Institución
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full" 
                 style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }} />
          </div>
          <MisionVisionAcordion institucion={institucion} loading={loading} />
        </div>
      </section>

      {/* 4 — CURSOS Y SEMINARIOS */}
      <section className="py-20 bg-gradient-to-b from-white/80 to-gray-50/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LatestCursos cursos={cursos} loading={loading} />
        </div>
      </section>

      {/* 5 — VIDEO */}
      <section className="py-20 relative z-10" 
               style={{ background: `linear-gradient(135deg, ${primaryColor}95 0%, ${secondaryColor}95 100%)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VideoVision institucion={institucion} loading={loading} />
        </div>
      </section>

  
<section className="py-20 bg-white/70 backdrop-blur-sm relative z-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <LatestPublicaciones 
      publicaciones={publicaciones} 
      loading={loading} 
    />
  </div>
</section>

      {/* 7 — GACETA */}
      <section className="py-20 bg-gradient-to-b from-gray-50/60 to-white/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GacetaCarousel gaceta={gaceta} loading={loading} />
        </div>
      </section>

      {/* 8 — AUTORIDADES */}
      <section className="py-20 bg-white/60 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Autoridades autoridades={autoridades} loading={loading} />
        </div>
      </section>

      {/* 9 — LOGOS */}
      <section className="py-12 bg-gradient-to-t from-white to-gray-50/50 border-t border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LogosBar institucion={institucion} loading={loading} />
        </div>
      </section>

    </main>
  );
}