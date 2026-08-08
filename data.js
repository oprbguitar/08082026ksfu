/* ============================================================================
   GoVisor — CAPA DE DATOS  ·  Observatorio del Gobierno 2026-2031
   ----------------------------------------------------------------------------
   ESTE ES EL UNICO ARCHIVO QUE NECESITAS EDITAR.

   NIVELES DE EVIDENCIA (campo `evidencia` en cada registro):
     "oficial"       Publicado en El Peruano / Congreso / entidad del Estado.
     "verificado"    Contrastado con dos fuentes independientes.
     "preliminar"    Reportado por prensa, sin documento oficial todavia.
     "investigacion" Denuncia o investigacion en curso. NO es hecho probado.

   REGLA DE ORO: si no lo comprobaste, no lo inventes. Deja el campo vacio.
   El visor muestra huecos honestos; eso es informacion util, no un defecto.

   Estado al 8 de agosto de 2026:
   - Presidencia y 19 ministros: CONTRASTADOS con El Peruano, uno por uno.
   - Promesas, presupuesto, indicadores: SIN registrar (ver notas de cada bloque).
   ========================================================================== */

const GOVISOR = {

  /* 1. METADATOS ------------------------------------------------------- */
  meta: {
    titulo: "GoVisor",
    subtitulo: "Observatorio del Gobierno · Perú 2026-2031",
    ultimaActualizacion: "2026-08-08",
    aviso: ""
  },

  /* 2. PRESIDENCIA ------------------------------------------------------
     Nota juridica: la Presidencia es cargo de eleccion popular; no se
     "nombra" por Resolucion Suprema. El acto formal es la proclamacion del
     JNE (Resolucion 1625-2026-JNE) y el juramento ante el Congreso.
     ------------------------------------------------------------------ */
  presidencia: {
    nombre: "Keiko Sofia Fujimori Higuchi",
    cargo: "Presidenta de la Republica del Peru",
    fechaAsuncion: "2026-07-28",
    periodo: "2026 - 2031",
    partido: "Fuerza Popular",
    foto: "",
    verificado: true,
    evidencia: "oficial",
    norma: {
      tipo: "Resolucion", numero: "1625-2026-JNE", fecha: "2026-07-05",
      enlace: "https://elperuano.pe/noticia/299509-elecciones-2026-jne-oficializa-proclamacion-de-keiko-fujimori-como-presidenta-electa",
      verificado: true
    },
    hitos: [
      { rotulo: "Votos validos",          valor: "9 223 396  ·  50,135 %" },
      { rotulo: "Participacion",          valor: "19 683 383  ·  72,03 %" },
      { rotulo: "Primer vicepresidente",  valor: "Luis Fernando Galarreta Velarde" },
      { rotulo: "Segundo vicepresidente", valor: "Miguel Angel Torres Morales" }
    ]
  },

  /* 3. CONSEJO DE MINISTROS --------------------------------------------
     Gabinete Galarreta. Juramentacion 28/07/2026, Palacio de Gobierno.
     R.S. correlativas 223 a 241-2026-PCM publicadas por El Peruano.
     Enlace: busquedas.elperuano.pe/dispositivo/EX/2538529-N  (N = R.S. - 222)

     Para registrar un cambio de ministro:
       1) en el saliente: estado:"cesado" + fechaCese
       2) agregar el entrante como NUEVO objeto con la misma `sigla`
     El visor calcula solo la rotacion y el indice de estabilidad.
     ------------------------------------------------------------------ */
  ministerios: [
    { sigla:"PCM", cartera:"Presidencia del Consejo de Ministros", ministro:"Luis Fernando Galarreta Velarde", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"223-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-1" } },

    { sigla:"RREE", cartera:"Relaciones Exteriores", ministro:"Alfonso Carlos Espa y Garces-Alvear", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"224-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-2" } },

    { sigla:"MINDEF", cartera:"Defensa", ministro:"Rafael Jorge Belaunde Llosa", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"225-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-3" } },

    { sigla:"MEF", cartera:"Economia y Finanzas", ministro:"Elmer Rafael Cuba Bustinza", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"226-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-4" } },

    { sigla:"MININTER", cartera:"Interior", ministro:"Cesar Augusto Astudillo Salcedo", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"227-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-5" } },

    { sigla:"MINJUSDH", cartera:"Justicia y Derechos Humanos", ministro:"Ernesto Julio Alvarez Miranda", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"228-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-6" } },

    { sigla:"MINEDU", cartera:"Educacion", ministro:"Jose Antonio Chang Escobedo", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"229-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-7" } },

    { sigla:"MINSA", cartera:"Salud", ministro:"Luis Williams Dyer Fernandez", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"230-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-8" } },

    { sigla:"MIDAGRI", cartera:"Desarrollo Agrario y Riego", ministro:"Marco Antonio Vinelli Ruiz", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"231-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-9" } },

    // El texto de la R.S. consigna "Kosme" (con K); la prensa publico "Cosme".
    // Se transcribe la resolucion, que es la fuente primaria.
    { sigla:"MTPE", cartera:"Trabajo y Promocion del Empleo", ministro:"Juan Manuel Kosme Sheput Moore", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"232-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-10" } },

    { sigla:"PRODUCE", cartera:"Produccion", ministro:"Juan Carlos Requejo Aleman", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"233-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-11" } },

    { sigla:"MINCETUR", cartera:"Comercio Exterior y Turismo", ministro:"Rogers Martin Valencia Espinoza", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"234-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-12" } },

    { sigla:"MINEM", cartera:"Energia y Minas", ministro:"Guillermo Shinno Huamani", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"235-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-13" } },

    { sigla:"MTC", cartera:"Transportes y Comunicaciones", ministro:"Rafael Rey Rey", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"236-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-14" } },

    // El Peruano consigna "Gonzales" (con s) en la relacion oficial.
    { sigla:"MVCS", cartera:"Vivienda, Construccion y Saneamiento", ministro:"Mauricio Fernando Arnillas Gonzales", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"237-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-15" } },

    { sigla:"MIMP", cartera:"Mujer y Poblaciones Vulnerables", ministro:"Maria Magdalena Seminario Maron", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"238-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-16" } },

    { sigla:"MINAM", cartera:"Ambiente", ministro:"Vladimiro Huaroc Portocarrero", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"239-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-17" } },

    { sigla:"MINCUL", cartera:"Cultura", ministro:"Alberto Ismael Beingolea Delgado", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"240-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-18" } },

    { sigla:"MIDIS", cartera:"Desarrollo e Inclusion Social", ministro:"Maritza Ivonne Canales Martinez", estado:"activo", fechaNombramiento:"2026-07-28", fechaCese:"", verificado:true, evidencia:"oficial",
      norma:{ tipo:"Resolucion Suprema", numero:"241-2026-PCM", fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-19" } }
  ],

  /* 4. NORMAS DEL PERIODO -----------------------------------------------
     origen: "congreso" | "ejecutivo" | "viaje"
     rango:  "Ley" | "DL" | "DU" | "DS" | "RS" | "RM" | "RL"
     accion: "promulgada" | "derogada" | "observada" | "modificada"
     sector: sigla del ministerio, para el analisis por cartera.
     Fuente diaria: https://diariooficial.elperuano.pe/Normas
     ------------------------------------------------------------------ */
  normas: [
    { tipo:"Resolucion Suprema", numero:"242-2026-PCM", rango:"RS", sector:"MINJUSDH",
      sumilla:"Encarga el Despacho de Justicia y Derechos Humanos al ministro de Desarrollo Agrario y Riego durante la licencia del titular (28/07 al 05/08).",
      fecha:"2026-07-28", origen:"ejecutivo", accion:"promulgada",
      enlace:"https://busquedas.elperuano.pe/dispositivo/EX/2538529-20",
      verificado:false, evidencia:"preliminar" }
  ],

  /* 5. PROMESAS vs. REALIDAD --------------------------------------------
     El corazon del observatorio: no basta con lo que el Gobierno hizo,
     sino si coincide con lo que dijo, normo, presupuesto y ejecuto.

     estado: "cumplida" | "en_proceso" | "no_iniciada" | "incumplida"

     PENDIENTE DE CARGA. Fuentes para llenarlo:
       - Plan de gobierno inscrito ante el JNE
       - Mensaje a la Nacion del 28/07/2026
       - Exposicion de politica general del PCM ante el Congreso (art. 130)

     Estructura de cada registro:
     { id:"seg-01", promesa:"...", sector:"MININTER",
       origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"..." },
       estado:"en_proceso",
       evidencia:[ { que:"...", fecha:"2026-08-01", enlace:"..." } ],
       norma:{ tipo:"", numero:"", enlace:"" },
       presupuesto:"", resultado:"", nivel:"preliminar", verificado:false }
     ------------------------------------------------------------------ */
  promesas: [],

  /* 6. PRIMEROS 100 DIAS -------------------------------------------------
     Medidas anunciadas para el arranque, con semaforo.
     estado: "ejecutada" (verde) | "en_proceso" (ambar) | "no_iniciada" (rojo)

     PENDIENTE DE CARGA: requiere la lista de medidas efectivamente
     anunciadas. El contador Dia 1 -> Dia 100 ya funciona, calculado sobre
     la fecha real de asuncion.

     { titulo:"...", sector:"MEF", estado:"en_proceso",
       detalle:"...", enlace:"", verificado:false }
     ------------------------------------------------------------------ */
  medidas100: [],

  /* 7. RELACION GOBIERNO - CONGRESO --------------------------------------
     Constitucion, art. 130: dentro de los treinta dias de haber asumido,
     el Presidente del Consejo de Ministros concurre al Congreso, expone la
     politica general del Gobierno y plantea cuestion de confianza.
     El visor calcula solo la cuenta regresiva de ese plazo.
     ------------------------------------------------------------------ */
  congreso: {
    // Cuando ocurra la investidura, llena esto y el reloj se detiene.
    investidura: {
      fecha: "",            // "AAAA-MM-DD" de la exposicion ante el Pleno
      resultado: "",        // "confianza_otorgada" | "confianza_rehusada"
      votos: { si:null, no:null, abstenciones:null },
      enlace: "", verificado:false, evidencia:""
    },
    interpelaciones: [],    // { ministro, sector, fecha, motivo, resultado, enlace }
    censuras:        [],    // { ministro, sector, fecha, votos, resultado, enlace }
    confianza:       [],    // { materia, fecha, resultado, enlace }
    facultades:      [],    // { materia, plazo, solicitada, otorgada, enlace }
    proyectosEjecutivo: []  // { numero, titulo, sector, comision, estado, enlace }
  },

  /* 8. PRESUPUESTO ------------------------------------------------------
     PENDIENTE DE CARGA. GoVisor no estima cifras presupuestales: deben
     tomarse de la fuente oficial y actualizarse periodicamente.
     Fuente: Consulta Amigable del MEF (PIA / PIM / devengado).
     { sigla:"MINSA", pia:0, pim:0, devengado:0 }
     ------------------------------------------------------------------ */
  presupuesto: {
    fuente: "Consulta Amigable — Ministerio de Economia y Finanzas",
    url: "https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx",
    actualizado: "",
    sectores: []
  },

  /* 9. EVENTOS MANUALES DE LA LINEA DE TIEMPO ----------------------------
     El visor DERIVA la linea de tiempo a partir de la asuncion, los
     nombramientos y las normas ya registradas. Aqui solo se agregan hechos
     que no salen de esos datos.
     tipo: "anuncio" | "crisis" | "reunion" | "viaje" | "congreso" | "otro"
     { fecha:"AAAA-MM-DD", tipo:"anuncio", titulo:"...", detalle:"",
       enlace:"", evidencia:"preliminar", verificado:false }
     ------------------------------------------------------------------ */
  eventos: [],

  /* 10. VIAJES OFICIALES ------------------------------------------------- */
  viajes: [],

  /* 11. ALTOS CARGOS (mas alla del gabinete) -----------------------------
     Radar de nombramientos: viceministros, secretarios generales, jefes de
     organismos y titulares de empresas publicas.
     nivel: "viceministro" | "organismo" | "empresa" | "otro"
     PENDIENTE DE CARGA: se alimenta de las R.M. y R.S. de El Peruano.
     { nombre:"", cargo:"", entidad:"", nivel:"viceministro",
       desde:"", hasta:"", norma:{...}, verificado:false }
     ------------------------------------------------------------------ */
  altosCargos: [],

  /* 12. FUENTES OFICIALES ------------------------------------------------ */
  fuentes: [
    { nombre:"El Peruano — Normas Legales",          url:"https://busquedas.elperuano.pe/",   nota:"Fuente primaria de resoluciones y leyes." },
    { nombre:"El Peruano — Normas del dia",          url:"https://diariooficial.elperuano.pe/Normas", nota:"Publicacion diaria de DS, DU, DL, RS y RM." },
    { nombre:"Congreso — Leyes aprobadas",           url:"https://www.congreso.gob.pe/leyes/", nota:"Listado oficial por periodo legislativo." },
    { nombre:"SPIJ — Ministerio de Justicia",        url:"https://spij.minjus.gob.pe/",        nota:"Texto vigente y concordado de las normas." },
    { nombre:"Presidencia del Consejo de Ministros", url:"https://www.gob.pe/pcm",             nota:"Gabinete y comunicados oficiales." },
    { nombre:"MEF — Consulta Amigable",              url:"https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx", nota:"Ejecucion presupuestal por sector y region." },
    { nombre:"INEI — Estadisticas",                  url:"https://www.inei.gob.pe/",           nota:"PBI, inflacion, empleo y pobreza." },
    { nombre:"BCRP — Estadisticas",                  url:"https://www.bcrp.gob.pe/estadisticas.html", nota:"Tipo de cambio, reservas y riesgo pais." },
    { nombre:"Defensoria — Conflictos sociales",     url:"https://www.defensoria.gob.pe/areas_tematicas/conflictos-sociales/", nota:"Reporte mensual de conflictividad." },
    { nombre:"Jurado Nacional de Elecciones",        url:"https://portal.jne.gob.pe/",         nota:"Proclamacion y resultados electorales." }
  ],

  /* 13. NOTICIAS --------------------------------------------------------- */
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

  /* 14. YOUTUBE ---------------------------------------------------------- */
  youtube: {
    consultas: [
      "Keiko Fujimori presidenta",
      "gabinete Galarreta Consejo de Ministros",
      "Congreso de la Republica Peru",
      "gobierno del Peru politica"
    ]
  }
};
