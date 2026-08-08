/* ============================================================================
   GoVisor — CAPA DE DATOS
   ----------------------------------------------------------------------------
   ESTE ES EL UNICO ARCHIVO QUE NECESITAS EDITAR.
   Todo lo que aparece en el portal sale de aqui.

   REGLA DE ORO: cada registro tiene un campo `verificado`.
     verificado: true   -> lo comprobaste en El Peruano / Congreso / PCM
     verificado: false  -> se muestra con el sello naranja "POR VERIFICAR"

   No inventes numeros de resolucion. Deja "" y el portal lo mostrara
   como pendiente, que es informacion honesta y util.
   ========================================================================== */

const GOVISOR = {

  /* --------------------------------------------------------------------
     1. METADATOS DEL PORTAL
     ------------------------------------------------------------------ */
  meta: {
    titulo: "GoVisor",
    subtitulo: "Visor ciudadano del gobierno · Republica del Peru",
    ultimaActualizacion: "2026-08-08",
    // Nota que aparece en el banner superior. Dejala en "" cuando ya
    // hayas verificado todo el contenido de este archivo.
    aviso: "Portal en configuracion. Los datos marcados POR VERIFICAR aun no han sido contrastados con fuentes oficiales."
  },

  /* --------------------------------------------------------------------
     2. PRESIDENCIA
     ------------------------------------------------------------------ */
  presidencia: {
    nombre: "Keiko Sofia Fujimori Higuchi",
    cargo: "Presidenta de la Republica del Peru",
    // Formato estricto: "AAAA-MM-DD". El contador de dias parte de aqui.
    // En el Peru el mandato presidencial se inicia el 28 de julio.
    fechaAsuncion: "2026-07-28",
    periodo: "2026 - 2031",
    partido: "",
    foto: "", // opcional: ruta o URL de imagen. Si esta vacia se usa un monograma.
    verificado: false,
    // Norma que formaliza el cargo (acta de juramentacion / resolucion).
    norma: {
      tipo: "",        // ej. "Resolucion Suprema"
      numero: "",      // ej. "001-2026-PCM"
      fecha: "",       // "AAAA-MM-DD"
      enlace: "",      // URL directa a El Peruano
      verificado: false
    }
  },

  /* --------------------------------------------------------------------
     3. CONSEJO DE MINISTROS
     ------------------------------------------------------------------
     Las 19 carteras que componen el Consejo de Ministros del Peru ya
     estan listadas (esto si es informacion estructural verificable).
     Falta completar: ministro, norma de nombramiento y fecha.

     estado: "activo" | "cesado"
     Si un ministro cesa, pon estado:"cesado" y llena fechaCese: el
     contador se congela y la tarjeta pasa a gris.
     ------------------------------------------------------------------ */
  ministerios: [
    { sigla:"PCM",      cartera:"Presidencia del Consejo de Ministros",  ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"RREE",     cartera:"Relaciones Exteriores",                 ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MEF",      cartera:"Economia y Finanzas",                   ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MINDEF",   cartera:"Defensa",                               ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MININTER", cartera:"Interior",                              ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MINJUSDH", cartera:"Justicia y Derechos Humanos",           ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MINEDU",   cartera:"Educacion",                             ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MINSA",    cartera:"Salud",                                 ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MIDAGRI",  cartera:"Desarrollo Agrario y Riego",            ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MTPE",     cartera:"Trabajo y Promocion del Empleo",        ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"PRODUCE",  cartera:"Produccion",                            ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MINCETUR", cartera:"Comercio Exterior y Turismo",           ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MINEM",    cartera:"Energia y Minas",                       ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MTC",      cartera:"Transportes y Comunicaciones",          ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MVCS",     cartera:"Vivienda, Construccion y Saneamiento",  ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MIMP",     cartera:"Mujer y Poblaciones Vulnerables",       ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MINAM",    cartera:"Ambiente",                              ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MINCUL",   cartera:"Cultura",                               ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } },
    { sigla:"MIDIS",    cartera:"Desarrollo e Inclusion Social",         ministro:"", estado:"activo", fechaNombramiento:"", fechaCese:"", verificado:false, norma:{ tipo:"", numero:"", fecha:"", enlace:"" } }
  ],

  /* --------------------------------------------------------------------
     4. NORMAS (columna derecha, la que se ve al costado)
     ------------------------------------------------------------------
     origen:  "congreso"  -> Leyes aprobadas por el Poder Legislativo
              "ejecutivo" -> Decretos Supremos, Decretos Legislativos,
                             Decretos de Urgencia (Presidencia / Consejo
                             de Ministros)
              "viaje"     -> Resoluciones Legislativas / Supremas que
                             autorizan viajes al exterior

     accion:  "promulgada" | "derogada" | "observada" | "modificada"

     Ejemplo de un registro ya verificado (estructura de referencia):
     {
       tipo:"Ley", numero:"00000",
       sumilla:"Sumilla breve de la norma",
       fecha:"2026-08-05", origen:"congreso", accion:"promulgada",
       enlace:"https://busquedas.elperuano.pe/...", verificado:true
     }
     ------------------------------------------------------------------ */
  normas: [
    // Vacio a proposito. Agrega registros aqui conforme los verifiques.
  ],

  /* --------------------------------------------------------------------
     5. VIAJES OFICIALES
     ------------------------------------------------------------------
     quien: "Presidenta" o el nombre del ministro.
     ------------------------------------------------------------------ */
  viajes: [
    // { quien:"Presidenta", destino:"", motivo:"", desde:"", hasta:"",
    //   norma:{ tipo:"Resolucion Legislativa", numero:"", enlace:"" },
    //   verificado:false }
  ],

  /* --------------------------------------------------------------------
     6. FUENTES OFICIALES (bloque de verificacion)
     ------------------------------------------------------------------ */
  fuentes: [
    { nombre:"Diario Oficial El Peruano — Normas Legales",    url:"https://busquedas.elperuano.pe/", nota:"Buscador oficial de normas. Fuente primaria para resoluciones y leyes." },
    { nombre:"Congreso de la Republica — Leyes aprobadas",    url:"https://www.congreso.gob.pe/leyes/", nota:"Listado oficial de leyes por periodo legislativo." },
    { nombre:"Sistema Peruano de Informacion Juridica (SPIJ)", url:"https://spij.minjus.gob.pe/", nota:"Texto vigente y concordado de las normas." },
    { nombre:"Presidencia del Consejo de Ministros",          url:"https://www.gob.pe/pcm", nota:"Composicion del gabinete y comunicados oficiales." },
    { nombre:"Plataforma unica del Estado — gob.pe",          url:"https://www.gob.pe/", nota:"Directorio de ministerios y autoridades." },
    { nombre:"Jurado Nacional de Elecciones",                 url:"https://www.jne.gob.pe/", nota:"Resultados electorales y credenciales." }
  ],

  /* --------------------------------------------------------------------
     7. NOTICIAS — feeds RSS
     ------------------------------------------------------------------
     El portal es 100% estatico (no hay servidor), y los navegadores
     bloquean la lectura directa de RSS por CORS. Por eso se usa un
     lector publico intermediario, configurable aqui abajo.

     Si prefieres no depender de terceros: pon proxy:"" y el portal
     mostrara los feeds como enlaces directos para abrir en otra pestana.
     ------------------------------------------------------------------ */
  noticias: {
    proxy: "https://api.rss2json.com/v1/api.json?rss_url=",
    feeds: [
      { nombre:"Gobierno",             query:"Keiko Fujimori gobierno Peru" },
      { nombre:"Consejo de Ministros", query:"Consejo de Ministros Peru gabinete" },
      { nombre:"Congreso",             query:"Congreso de la Republica Peru ley" },
      { nombre:"El Peruano",           query:"El Peruano normas legales decreto supremo" }
    ],
    // Plantilla de Google Noticias en espanol / edicion Peru.
    plantilla: "https://news.google.com/rss/search?q={Q}&hl=es-419&gl=PE&ceid=PE:es-419"
  },

  /* --------------------------------------------------------------------
     8. YOUTUBE
     ------------------------------------------------------------------
     La API key NO se guarda aqui. Se ingresa desde el portal y queda
     unicamente en el navegador (localStorage) de quien la escribe.
     ------------------------------------------------------------------ */
  youtube: {
    consultas: [
      "Keiko Fujimori presidenta",
      "Consejo de Ministros Peru",
      "Congreso de la Republica Peru",
      "gobierno del Peru politica"
    ]
  }
};
