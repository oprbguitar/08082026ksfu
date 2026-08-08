/* ============================================================================
   GoVisor — CAPA DE DATOS
   ----------------------------------------------------------------------------
   ESTE ES EL UNICO ARCHIVO QUE NECESITAS EDITAR.

   Estado de verificacion (8 de agosto de 2026):
   - Presidencia y los 19 ministros: CONTRASTADOS con El Peruano.
     Los nombres se transcriben tal como figuran en la Resolucion Suprema,
     que es la fuente primaria (no como aparecen en notas de prensa).
   - Normas del periodo: en registro.

   REGLA DE ORO: `verificado: true` solo cuando lo comprobaste en la fuente.
   No inventes numeros de resolucion; deja "" y el portal lo marca pendiente.
   ========================================================================== */

const GOVISOR = {

  /* 1. METADATOS ------------------------------------------------------- */
  meta: {
    titulo: "GoVisor",
    subtitulo: "Visor estrategico del gobierno · Peru",
    ultimaActualizacion: "2026-08-08",
    aviso: ""   // vacio = sin banner de advertencia
  },

  /* 2. PRESIDENCIA ------------------------------------------------------
     Nota juridica: la Presidencia es cargo de eleccion popular, no se
     "nombra" por Resolucion Suprema. El acto formal es la proclamacion
     del JNE (Resolucion 1625-2026-JNE) y luego el juramento ante el
     Congreso el 28 de julio de 2026.
     ------------------------------------------------------------------ */
  presidencia: {
    nombre: "Keiko Sofia Fujimori Higuchi",
    cargo: "Presidenta de la Republica del Peru",
    fechaAsuncion: "2026-07-28",
    periodo: "2026 - 2031",
    partido: "Fuerza Popular",
    foto: "",
    verificado: true,
    norma: {
      tipo: "Resolucion",
      numero: "1625-2026-JNE",
      fecha: "2026-07-05",
      enlace: "https://elperuano.pe/noticia/299509-elecciones-2026-jne-oficializa-proclamacion-de-keiko-fujimori-como-presidenta-electa",
      verificado: true
    },
    // Datos de contexto que se muestran en la ficha compacta.
    hitos: [
      { rotulo: "Votos validos",          valor: "9 223 396  ·  50,135 %" },
      { rotulo: "Participacion",          valor: "19 683 383  ·  72,03 %" },
      { rotulo: "Primer vicepresidente",  valor: "Luis Fernando Galarreta Velarde" },
      { rotulo: "Segundo vicepresidente", valor: "Miguel Angel Torres Morales" }
    ]
  },

  /* 3. CONSEJO DE MINISTROS --------------------------------------------
     Gabinete Galarreta. Juramentacion: 28 de julio de 2026, Palacio de
     Gobierno. Resoluciones Supremas correlativas 223 a 241-2026-PCM,
     publicadas por El Peruano.
     Enlace individual: busquedas.elperuano.pe/dispositivo/EX/2538529-N
     donde N = (numero de R.S.) - 222.
     ------------------------------------------------------------------ */
  ministerios: [
    { sigla:"PCM", cartera:"Presidencia del Consejo de Ministros", ministro:"Luis Fernando Galarreta Velarde", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"223-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-1" } },

    { sigla:"RREE", cartera:"Relaciones Exteriores", ministro:"Alfonso Carlos Espa y Garces-Alvear", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"224-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-2" } },

    { sigla:"MINDEF", cartera:"Defensa", ministro:"Rafael Jorge Belaunde Llosa", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"225-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-3" } },

    { sigla:"MEF", cartera:"Economia y Finanzas", ministro:"Elmer Rafael Cuba Bustinza", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"226-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-4" } },

    { sigla:"MININTER", cartera:"Interior", ministro:"Cesar Augusto Astudillo Salcedo", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"227-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-5" } },

    { sigla:"MINJUSDH", cartera:"Justicia y Derechos Humanos", ministro:"Ernesto Julio Alvarez Miranda", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"228-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-6" } },

    { sigla:"MINEDU", cartera:"Educacion", ministro:"Jose Antonio Chang Escobedo", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"229-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-7" } },

    { sigla:"MINSA", cartera:"Salud", ministro:"Luis Williams Dyer Fernandez", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"230-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-8" } },

    { sigla:"MIDAGRI", cartera:"Desarrollo Agrario y Riego", ministro:"Marco Antonio Vinelli Ruiz", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"231-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-9" } },

    // El texto de la R.S. consigna "Kosme" (con K); las notas de prensa
    // publicaron "Cosme". Se transcribe la resolucion, fuente primaria.
    { sigla:"MTPE", cartera:"Trabajo y Promocion del Empleo", ministro:"Juan Manuel Kosme Sheput Moore", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"232-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-10" } },

    { sigla:"PRODUCE", cartera:"Produccion", ministro:"Juan Carlos Requejo Aleman", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"233-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-11" } },

    { sigla:"MINCETUR", cartera:"Comercio Exterior y Turismo", ministro:"Rogers Martin Valencia Espinoza", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"234-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-12" } },

    { sigla:"MINEM", cartera:"Energia y Minas", ministro:"Guillermo Shinno Huamani", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"235-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-13" } },

    { sigla:"MTC", cartera:"Transportes y Comunicaciones", ministro:"Rafael Rey Rey", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"236-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-14" } },

    // El Peruano consigna "Gonzales" (con s) en la relacion oficial.
    { sigla:"MVCS", cartera:"Vivienda, Construccion y Saneamiento", ministro:"Mauricio Fernando Arnillas Gonzales", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"237-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-15" } },

    { sigla:"MIMP", cartera:"Mujer y Poblaciones Vulnerables", ministro:"Maria Magdalena Seminario Maron", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"238-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-16" } },

    { sigla:"MINAM", cartera:"Ambiente", ministro:"Vladimiro Huaroc Portocarrero", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"239-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-17" } },

    { sigla:"MINCUL", cartera:"Cultura", ministro:"Alberto Ismael Beingolea Delgado", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"240-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-18" } },

    { sigla:"MIDIS", cartera:"Desarrollo e Inclusion Social", ministro:"Maritza Ivonne Canales Martinez", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true,
      norma:{ tipo:"Resolucion Suprema", numero:"241-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-19" } }
  ],

  /* 4. NORMAS DEL PERIODO -----------------------------------------------
     origen: "congreso" | "ejecutivo" | "viaje"
     accion: "promulgada" | "derogada" | "observada" | "modificada"
     ------------------------------------------------------------------ */
  normas: [
    { tipo:"Resolucion Suprema", numero:"242-2026-PCM",
      sumilla:"Encarga el Despacho de Justicia y Derechos Humanos al ministro de Desarrollo Agrario y Riego durante la licencia del titular (28/07 al 05/08).",
      fecha:"2026-07-28", origen:"ejecutivo", accion:"promulgada",
      enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-20",
      verificado:false }
  ],

  /* 5. VIAJES OFICIALES -------------------------------------------------- */
  viajes: [
    // { quien:"Presidenta", destino:"", motivo:"", desde:"", hasta:"",
    //   norma:{ tipo:"Resolucion Legislativa", numero:"", enlace:"" }, verificado:false }
  ],

  /* 6. FUENTES OFICIALES ------------------------------------------------- */
  fuentes: [
    { nombre:"El Peruano — Normas Legales",         url:"https://busquedas.elperuano.pe/",    nota:"Fuente primaria de resoluciones y leyes." },
    { nombre:"Congreso — Leyes aprobadas",          url:"https://www.congreso.gob.pe/leyes/", nota:"Listado oficial por periodo legislativo." },
    { nombre:"SPIJ — Ministerio de Justicia",       url:"https://spij.minjus.gob.pe/",        nota:"Texto vigente y concordado de las normas." },
    { nombre:"Presidencia del Consejo de Ministros", url:"https://www.gob.pe/pcm",            nota:"Gabinete y comunicados oficiales." },
    { nombre:"Plataforma del Estado — gob.pe",      url:"https://www.gob.pe/",                nota:"Directorio de ministerios y autoridades." },
    { nombre:"Jurado Nacional de Elecciones",       url:"https://portal.jne.gob.pe/",         nota:"Proclamacion y resultados electorales." }
  ],

  /* 7. NOTICIAS ---------------------------------------------------------- */
  noticias: {
    proxy: "https://api.rss2json.com/v1/api.json?rss_url=",
    feeds: [
      { nombre:"Gobierno",   query:"Keiko Fujimori gobierno Peru" },
      { nombre:"Gabinete",   query:"Consejo de Ministros Peru Galarreta gabinete" },
      { nombre:"Congreso",   query:"Congreso de la Republica Peru ley" },
      { nombre:"El Peruano", query:"El Peruano normas legales decreto supremo" }
    ],
    plantilla: "https://news.google.com/rss/search?q={Q}&hl=es-419&gl=PE&ceid=PE:es-419"
  },

  /* 8. YOUTUBE ----------------------------------------------------------- */
  youtube: {
    consultas: [
      "Keiko Fujimori presidenta",
      "gabinete Galarreta Consejo de Ministros",
      "Congreso de la Republica Peru",
      "gobierno del Peru politica"
    ]
  }
};
