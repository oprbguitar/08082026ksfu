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
    version: "20260828",          // <- debe coincidir con version.json
    ultimaActualizacion: "2026-08-28",
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
    /* Generado por scripts/scrape-elperuano.mjs — 28/07/2026 al 08/08/2026.
       161 dispositivos del Consejo de Ministros y sectores, con cada enlace
       comprobado uno por uno: 0 rotos. Regenerar con:
         node scripts/scrape-elperuano.mjs
       No hay normas de origen "congreso" porque en ese periodo el Congreso
       no publico leyes en El Peruano. La ausencia es real, no un filtro. */
{ tipo:"RESOLUCIÓN MINISTERIAL", numero:"267-2026-JUS", rango:"RM", sector:"MINJUSDH",
      sumilla:"Designan Asesora de Alta Dirección del Despacho Viceministerial de Justicia",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"JUSTICIA Y DERECHOS HUMANOS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541408-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"266-2026-JUS", rango:"RM", sector:"MINJUSDH",
      sumilla:"Designan Asesor de Alta Dirección de la Secretaría General del Ministerio",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"JUSTICIA Y DERECHOS HUMANOS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541407-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"265-2026-JUS", rango:"RM", sector:"MINJUSDH",
      sumilla:"Designan Asesora de Alta Dirección del Despacho Ministerial",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"JUSTICIA Y DERECHOS HUMANOS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541406-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"00933-2026-DE", rango:"RM", sector:"MINDEF",
      sumilla:"Autorizan viaje de personal militar de la Fuerza Aérea del Perú a Argentina, en comisión de servicios",
      fecha:"2026-08-08", origen:"viaje", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541405-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"00935-2026-DE", rango:"RM", sector:"MINDEF",
      sumilla:"Autorizan viaje de personal militar del Ejército del Perú a Brasil, en comisión de servicios",
      fecha:"2026-08-08", origen:"viaje", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541404-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"300-2026-VIVIENDA", rango:"RM", sector:"MVCS",
      sumilla:"Designan Asesora de la Secretaría General del Ministerio",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"VIVIENDA, CONSTRUCCIÓN Y SANEAMIENTO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541403-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"299-2026-VIVIENDA", rango:"RM", sector:"MVCS",
      sumilla:"Designan Asesor de Secretaría General del Ministerio",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"VIVIENDA, CONSTRUCCIÓN Y SANEAMIENTO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541402-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"278-2026-PCM", rango:"RM", sector:"PCM",
      sumilla:"Designan Secretario de la Secretaría de Gestión del Riesgo de Desastres de la PCM",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541399-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"00931-2026-DE", rango:"RM", sector:"MINDEF",
      sumilla:"Designan Jefa de la Oficina General de Gestión Documentaria del Ministerio de Defensa",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541398-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN JEFATURAL", numero:"000105-2026-ANIN/JEF", rango:"Res", sector:"PCM",
      sumilla:"Aceptan renuncias y designan funcionarios en diversos puestos de la Autoridad Nacional de Infraestructura",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541397-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN DIRECTORAL", numero:"000128- 2026-MINEDU-VMGI-PRONIED-DE", rango:"Res", sector:"MINEDU",
      sumilla:"Designan Directora del Sistema Administrativo II de la Unidad de Recursos Humanos de la Oficina General de Administración del PRONIED",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541395-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN DIRECTORAL", numero:"000126- 2026-MINEDU-VMGI-PRONIED-DE", rango:"Res", sector:"MINEDU",
      sumilla:"Designan Director de Sistema Administrativo II de la Unidad de Abastecimiento de la Oficina General de Administración del PRONIED",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541392-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"D000298-2026-MIDAGRI-DM", rango:"RM", sector:"MIDAGRI",
      sumilla:"Designan Jefa de Desarrollo del Talento Humano de la Oficina de Desarrollo del Talento Humano de la Oficina General de Gestión de Recursos Humanos",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO AGRARIO Y RIEGO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541360-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"D000297-2026-MIDAGRI-DM", rango:"RM", sector:"MIDAGRI",
      sumilla:"Designan Jefe de Administración de Recursos Humanos de la Oficina de Administración de Recursos Humanos",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO AGRARIO Y RIEGO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541357-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN JEFATURAL", numero:"000051-2026-FONDEPES/J", rango:"Res", sector:"PRODUCE",
      sumilla:"Designan Director de la Dirección General de Proyectos y Gestión Financiera para el Desarrollo Pesquero Artesanal y Acuícola del FONDEPES",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541345-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"D000196-2026-MIDIS", rango:"RM", sector:"MIDIS",
      sumilla:"Designan Asesora de la Secretaría General del Ministerio",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO E INCLUSIÓN SOCIAL",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541334-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN DIRECTORAL", numero:"121-2026-DIGEMID-DG-MINSA", rango:"Res", sector:"MINSA",
      sumilla:"Modifican el “Listado de Documentos Considerados Equivalentes al Certificado de Buenas Prácticas de Manufactura”",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"SALUD",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2541050-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN VICE MINISTERIAL", numero:"015-2026-EF/15.01", rango:"Res", sector:"MEF",
      sumilla:"Fijan índices de corrección monetaria para efectos de determinar el costo computable de los inmuebles enajenados por personas naturales, sucesiones indivisas o sociedades conyugales que optaron por tributar como tales",
      fecha:"2026-08-08", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540940-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"012-2026-MIDIS", rango:"RS", sector:"MIDIS",
      sumilla:"Encargan funciones de Presidente Ejecutivo del Organismo de Focalización e Información Social (OFIS)",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO E INCLUSIÓN SOCIAL",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540927-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"014-2026-MIDIS", rango:"RS", sector:"MIDIS",
      sumilla:"Designan Viceministro de Políticas y Evaluación Social",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO E INCLUSIÓN SOCIAL",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540926-2",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"013-2026-MIDIS", rango:"RS", sector:"MIDIS",
      sumilla:"Aceptan renuncia de Viceministro de Políticas y Evaluación Social",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO E INCLUSIÓN SOCIAL",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540926-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"D000293-2026-MIDAGRI-DM", rango:"RM", sector:"MIDAGRI",
      sumilla:"Designan Jefe de Defensa Nacional y Gestión de Riesgo de Desastres de la Oficina de Defensa Nacional y Gestión del Riesgo de Desastres",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO AGRARIO Y RIEGO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540919-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN DIRECTORAL", numero:"000124-2026-MINEDU-VMGI-PRONIED-DE", rango:"Res", sector:"MINEDU",
      sumilla:"Designan Director de Sistema Administrativo III de la Unidad Gerencial de Supervisión de Convenios del Programa Nacional de Infraestructura Educativa - PRONIED",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540918-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN DIRECTORAL", numero:"000120-2026-MINEDU-VMGI-PRONIED-DE", rango:"Res", sector:"MINEDU",
      sumilla:"Designan Director de Sistema Administrativo III de la Oficina General de Administración del Programa Nacional de Infraestructura Educativa - PRONIED",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540917-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN DIRECTORAL", numero:"0022-2026-EF/50.01", rango:"Res", sector:"MEF",
      sumilla:"Aprueban el Convenio de Apoyo Presupuestario al Programa Presupuestal 0057: “Conservación de la diversidad biológica y aprovechamiento sostenible de los recursos naturales en área natural protegida”, a través de acuerdos de conservación y sus procedimientos",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540916-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"00247-2026-PRODUCE", rango:"RM", sector:"PRODUCE",
      sumilla:"Designan Jefa de Cooperación Técnica y Asuntos Internacionales de la Oficina de Cooperación Técnica y Asuntos Internacionales de la Oficina General de Planeamiento, Presupuesto y Modernización",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540908-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"227-2026-TR", rango:"RM", sector:"MTPE",
      sumilla:"Designan Jefa General de Cooperación y Asuntos Internacionales",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRABAJO Y PROMOCIÓN DEL EMPLEO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540907-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"D000193-2026-MIDIS", rango:"RM", sector:"MIDIS",
      sumilla:"Designan Jefa de la Oficina General de Administración del Ministerio",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO E INCLUSIÓN SOCIAL",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540840-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"D000194-2026-MIDIS", rango:"RM", sector:"MIDIS",
      sumilla:"Designan Jefa de la Oficina General de Recursos Humanos del Ministerio",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO E INCLUSIÓN SOCIAL",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540828-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"304-2026-MINEM/DM", rango:"RM", sector:"MINEM",
      sumilla:"Aprueban primera modificación al Contrato de Concesión N° 599-2023, con la empresa ERA NOVA DEVELOPMENT S.A., para desarrollar la actividad de transmisión de energía eléctrica en proyecto de línea de transmisión, ubicado en los departamentos de Ica y Arequipa",
      fecha:"2026-08-07", origen:"ejecutivo", accion:"promulgada",
      entidad:"ENERGÍA Y MINAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539107-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"028-2026-EF", rango:"RS", sector:"MEF",
      sumilla:"Nombran Presidenta del Tribunal Fiscal",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540905-4",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"027-2026-EF", rango:"RS", sector:"MEF",
      sumilla:"Designan Superintendente Nacional de Aduanas y de Administración Tributaria",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540905-3",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"250-2026-PCM", rango:"RS", sector:"PCM",
      sumilla:"Designan miembros del Directorio del Banco Central de Reserva del Perú, en representación del Poder Ejecutivo",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540905-2",
      verificado:true, evidencia:"oficial" },

    { tipo:"DECRETO SUPREMO", numero:"155-2026-EF", rango:"DS", sector:"MEF",
      sumilla:"Decreto Supremo que autoriza Transferencia de Partidas en el Presupuesto del Sector Público para el Año Fiscal 2026 a favor de la Reserva de Contingencia",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540905-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"034-2026-TR", rango:"RS", sector:"MTPE",
      sumilla:"Designan Viceministro de Promoción del Empleo y Capacitación Laboral",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRABAJO Y PROMOCIÓN DEL EMPLEO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540903-5",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"033-2026-TR", rango:"RS", sector:"MTPE",
      sumilla:"Designan Viceministra de Trabajo",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRABAJO Y PROMOCIÓN DEL EMPLEO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540903-4",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"032-2026-TR", rango:"RS", sector:"MTPE",
      sumilla:"Dan por concluida designación de Viceministro de Trabajo",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRABAJO Y PROMOCIÓN DEL EMPLEO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540903-3",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"054-2026-DE", rango:"RS", sector:"MINDEF",
      sumilla:"Designan Jefe del Centro Nacional de Estimación, Prevención y Reducción del Riesgo de Desastres - CENEPRED",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540903-2",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"053-2026-DE", rango:"RS", sector:"MINDEF",
      sumilla:"Aceptan renuncia de Jefe del Centro Nacional de Estimación, Prevención y Reducción del Riesgo de Desastres - CENEPRED",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540903-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"263-2026-JUS", rango:"RM", sector:"MINJUSDH",
      sumilla:"Designan Jefa de la Oficina General de Administración del Ministerio",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"JUSTICIA Y DERECHOS HUMANOS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540902-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"476-2026-RE", rango:"RM", sector:"RREE",
      sumilla:"Autorizan viaje de funcionarios diplomáticos a Colombia, en comisión de servicios",
      fecha:"2026-08-06", origen:"viaje", accion:"promulgada",
      entidad:"RELACIONES EXTERIORES",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540901-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"000243-2026-PRODUCE", rango:"RM", sector:"PRODUCE",
      sumilla:"Autorizan Transferencia Financiera a favor del Núcleo Ejecutor de Compras (NEC) para el sector productivo de Textil - confecciones",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540898-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"000244-2026-PRODUCE", rango:"RM", sector:"PRODUCE",
      sumilla:"Designan Jefa de Presupuesto de la Oficina de Presupuesto de la Oficina General de Planeamiento, Presupuesto y Modernización del Ministerio",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540896-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"D000284-2026-MIDAGRI-DM", rango:"RM", sector:"MIDAGRI",
      sumilla:"Designan Jefa de Atención al Ciudadano y Gestión Documental de la Oficina de Atención al Ciudadano y Gestión Documental de la Secretaría General del Ministerio",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO AGRARIO Y RIEGO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540861-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN JEFATURAL", numero:"000104-2026-ANIN/JEF", rango:"Res", sector:"PCM",
      sumilla:"Aprueban ejecución de la expropiación de área afectada de inmueble por la ejecución de proyecto de infraestructura ubicada en distritos de la provincia de Chiclayo del departamento de Lambayeque y la provincia de San Miguel del departamento de Cajamarca, y su valor de tasación",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540784-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"261-2026-JUS", rango:"RM", sector:"MINJUSDH",
      sumilla:"Designan Jefa de Gabinete de Asesores del Ministerio",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"JUSTICIA Y DERECHOS HUMANOS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540729-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"260-2026-JUS", rango:"RM", sector:"MINJUSDH",
      sumilla:"Designan Jefe de la Oficina General de Asesoría Jurídica",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"JUSTICIA Y DERECHOS HUMANOS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540726-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"00929-2026-DE", rango:"RM", sector:"MINDEF",
      sumilla:"Designan Director de Sistema Administrativo I de la Oficina General de Prensa, Relaciones Públicas y Protocolo",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540719-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"443-2026-MINEDU", rango:"RM", sector:"MINEDU",
      sumilla:"Designan Asesor II de la Secretaría General del Ministerio",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540700-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"266-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Jefe de la Oficina de Contabilidad y Control Previo de la Oficina General de Administración del Ministerio",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540492-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"264-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Jefa de la Oficina de Planeamiento y Presupuesto de la Oficina General de Planeamiento, Presupuesto y Modernización del Ministerio",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540487-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN DIRECTORAL", numero:"0405-2026-MTC/17.03", rango:"Res", sector:"MTC",
      sumilla:"Autorizan a la empresa GRUPO EMPRESARIAL DE REVISIONES TECNICAS EN EL PERU S.A.C., para operar como Centro de Inspección Técnica Vehicular Fijo",
      fecha:"2026-08-06", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRANSPORTES Y COMUNICACIONES",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539316-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"014-2026-SA", rango:"RS", sector:"MINSA",
      sumilla:"Designan Viceministro de Prestaciones y Aseguramiento en Salud",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"SALUD",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-9",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"013-2026-SA", rango:"RS", sector:"MINSA",
      sumilla:"Aceptan renuncia de Viceministro de Prestaciones y Aseguramiento en Salud",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"SALUD",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-8",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"219-2026-IN", rango:"RS", sector:"MININTER",
      sumilla:"Designan Viceministro del Despacho Viceministerial de Seguridad Pública",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"INTERIOR",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-7",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"218-2026-IN", rango:"RS", sector:"MININTER",
      sumilla:"Aceptan renuncia de Viceministro del Despacho Viceministerial de Seguridad Pública",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"INTERIOR",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-6",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"052-2026-DE", rango:"RS", sector:"MINDEF",
      sumilla:"Designan Viceministro de Recursos para la Defensa",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-5",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"051-2026-DE", rango:"RS", sector:"MINDEF",
      sumilla:"Aceptan renuncia de Viceministro de Recursos para la Defensa",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-4",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"050-2026-DE", rango:"RS", sector:"MINDEF",
      sumilla:"Designan Viceministro de Políticas para la Defensa",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-3",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"049-2026-DE", rango:"RS", sector:"MINDEF",
      sumilla:"Aceptan renuncia de Viceministro de Políticas para la Defensa",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-2",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"031-2026-TR", rango:"RS", sector:"MTPE",
      sumilla:"Formalizan aceptación de renuncia y declaran la vacancia del cargo de Vocal Alterno de la Segunda Sala del Tribunal de Fiscalización Laboral de la Superintendencia Nacional de Fiscalización Laboral - SUNAFIL",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRABAJO Y PROMOCIÓN DEL EMPLEO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-16",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"030-2026-TR", rango:"RS", sector:"MTPE",
      sumilla:"Designan Superintendente de la Superintendencia Nacional de Fiscalización Laboral - SUNAFIL",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRABAJO Y PROMOCIÓN DEL EMPLEO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-15",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"029-2026-TR", rango:"RS", sector:"MTPE",
      sumilla:"Aceptan renuncia de Superintendente de la Superintendencia Nacional de Fiscalización Laboral - SUNAFIL",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRABAJO Y PROMOCIÓN DEL EMPLEO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-14",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"155-2026-JUS", rango:"RS", sector:"MINJUSDH",
      sumilla:"Designan Viceministro de Derechos Humanos y Acceso a la Justicia",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"JUSTICIA Y DERECHOS HUMANOS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-13",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"154-2026-JUS", rango:"RS", sector:"MINJUSDH",
      sumilla:"Aceptan renuncia de Viceministra de Derechos Humanos y Acceso a la Justicia",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"JUSTICIA Y DERECHOS HUMANOS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-12",
      verificado:true, evidencia:"oficial" },

    { tipo:"DECRETO SUPREMO", numero:"008-2026-MIDAGRI", rango:"DS", sector:"MIDAGRI",
      sumilla:"Decreto Supremo que declara en reorganización el Ministerio de Desarrollo Agrario y Riego",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO AGRARIO Y RIEGO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540304-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"427-2026-MTC/01", rango:"RM", sector:"MTC",
      sumilla:"Designan Asesor II del Despacho Ministerial",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRANSPORTES Y COMUNICACIONES",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540303-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"273-2026-PCM", rango:"RM", sector:"PCM",
      sumilla:"Designan Jefa de Oficina I de la Oficina de Abastecimiento de la Oficina General de Administración de la Presidencia del Consejo de Ministros",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540302-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"220-2026-TR", rango:"RM", sector:"MTPE",
      sumilla:"Designan Jefe General de Planeamiento y Presupuesto del Ministerio",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRABAJO Y PROMOCIÓN DEL EMPLEO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540297-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"218-2026-TR", rango:"RM", sector:"MTPE",
      sumilla:"Designan Directora General de Normalización, Formación para el Empleo y Certificación de Competencias Laborales de la Dirección General de Normalización, Formación para el Empleo y Certificación de Competencias Laborales",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRABAJO Y PROMOCIÓN DEL EMPLEO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540296-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"216-2026-TR", rango:"RM", sector:"MTPE",
      sumilla:"Designan Asesor de Secretaría General II del Ministerio",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRABAJO Y PROMOCIÓN DEL EMPLEO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540293-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN", numero:"000080-2026-SANIPES/PE", rango:"Res", sector:"MINCUL",
      sumilla:"Designan Asesora de la Presidencia Ejecutiva de la Autoridad Nacional de Sanidad e Inocuidad en Pesca y Acuicultura – SANIPES",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"AUTORIDAD NACIONAL DE SANIDAD E INOCUIDAD EN PESCA Y ACUICULTURA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540278-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"262-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Asesora del Despacho Ministerial",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540272-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN DIRECTORAL", numero:"00076-2026-MIDAGRI-DVDAFIR/PSI", rango:"Res", sector:"MIDAGRI",
      sumilla:"Designan Asesora de la Dirección Ejecutiva del Programa Subsectorial de Irrigaciones",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO AGRARIO Y RIEGO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540269-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN", numero:"000079-2026-SANIPES/PE", rango:"Res", sector:"MINCUL",
      sumilla:"Designan Gerente General de la Autoridad Nacional de Sanidad e Inocuidad en Pesca y Acuicultura – SANIPES",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"AUTORIDAD NACIONAL DE SANIDAD E INOCUIDAD EN PESCA Y ACUICULTURA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540257-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"261-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Presidente Ejecutivo de la Comisión de Promoción del Perú para la Exportación y el Turismo – PROMPERÚ",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540253-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"326-2026-EF/49", rango:"RM", sector:"MEF",
      sumilla:"Designan Asesora de Secretaría General II del Ministerio",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540199-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"325-2026-EF/49", rango:"RM", sector:"MEF",
      sumilla:"Designan Jefe de la Oficina General de Administración del Ministerio",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540197-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"270-2026-PCM", rango:"RM", sector:"PCM",
      sumilla:"Designan Asesora de Alta Dirección del Despacho de la Presidencia del Consejo de Ministros",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540157-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"269-2026-PCM", rango:"RM", sector:"PCM",
      sumilla:"Designan Asesor de Alta Dirección del Despacho de la Presidencia del Consejo de Ministros",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540156-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"268-2026-PCM", rango:"RM", sector:"PCM",
      sumilla:"Designan Asesora de Alta Dirección del Despacho de la Presidencia del Consejo de Ministros",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540155-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"259-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Director Ejecutivo de la Dirección Ejecutiva de la Unidad Ejecutora de Inversión en Comercio Exterior y Turismo",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2540018-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"472-2026-RE", rango:"RM", sector:"RREE",
      sumilla:"Autorizan viaje de funcionario diplomático al Estado Plurinacional de Bolivia, en comisión de servicios",
      fecha:"2026-08-05", origen:"viaje", accion:"promulgada",
      entidad:"RELACIONES EXTERIORES",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539976-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"426-2026-MTC/01.02", rango:"RM", sector:"MTC",
      sumilla:"Autorizan viaje de inspector de la Dirección General de Aeronáutica Civil a los Estados Unidos de América, en comisión de servicios",
      fecha:"2026-08-05", origen:"viaje", accion:"promulgada",
      entidad:"TRANSPORTES Y COMUNICACIONES",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539952-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"251-2026-MINEM/DM", rango:"RM", sector:"MINEM",
      sumilla:"Otorgan a favor de la empresa ZAPOTE S.A.C., la concesión temporal de transmisión de proyecto de línea de transmisión, ubicado en los distritos de Olmos y Mórrope, provincia y departamento de Lambayeque",
      fecha:"2026-08-05", origen:"ejecutivo", accion:"promulgada",
      entidad:"ENERGÍA Y MINAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2529570-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"152-2026-JUS", rango:"RS", sector:"MINJUSDH",
      sumilla:"Aceptan renuncia de Viceministra de Justicia",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"JUSTICIA Y DERECHOS HUMANOS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-9",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"019-2026-ED", rango:"RS", sector:"MINEDU",
      sumilla:"Designan Viceministra de Gestión Pedagógica",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-8",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"018-2026-ED", rango:"RS", sector:"MINEDU",
      sumilla:"Aceptan renuncia de Viceministro de Gestión Pedagógica",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-7",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"017-2026-ED", rango:"RS", sector:"MINEDU",
      sumilla:"Designan Viceministro de Gestión Institucional",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-6",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"016-2026-ED", rango:"RS", sector:"MINEDU",
      sumilla:"Aceptan renuncia de Viceministra de Gestión Institucional",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-5",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"026-2026-EF", rango:"RS", sector:"MEF",
      sumilla:"Designan Viceministro de Economía",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-4",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"025-2026-EF", rango:"RS", sector:"MEF",
      sumilla:"Aceptan renuncia de Viceministro de Economía",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-3",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"024-2026-EF", rango:"RS", sector:"MEF",
      sumilla:"Designan Viceministro de Hacienda",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-2",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"009-2026-VIVIENDA", rango:"RS", sector:"MVCS",
      sumilla:"Designan Presidente Ejecutivo del Organismo Técnico de la Administración de los Servicios de Saneamiento - OTASS",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"VIVIENDA, CONSTRUCCIÓN Y SANEAMIENTO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-14",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"012-2026-PRODUCE", rango:"RS", sector:"PRODUCE",
      sumilla:"Encargan las funciones de Presidente Ejecutivo del Instituto del Mar del Perú - IMARPE",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-13",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"011-2026-PRODUCE", rango:"RS", sector:"PRODUCE",
      sumilla:"Designan Jefe del Fondo Nacional de Desarrollo Pesquero - FONDEPES",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-12",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"010-2026-PRODUCE", rango:"RS", sector:"PRODUCE",
      sumilla:"Aceptan renuncia de Jefa del Fondo Nacional de Desarrollo Pesquero - FONDEPES",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-11",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"153-2026-JUS", rango:"RS", sector:"MINJUSDH",
      sumilla:"Designan Viceministro de Justicia",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"JUSTICIA Y DERECHOS HUMANOS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-10",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"023-2026-EF", rango:"RS", sector:"MEF",
      sumilla:"Aceptan renuncia de Viceministro de Hacienda",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539838-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"339-2026-MINEM/DM", rango:"RM", sector:"MINEM",
      sumilla:"Designan Asesora de Alta Dirección de Secretaría General del Ministerio",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"ENERGÍA Y MINAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539833-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"338-2026-MINEM/DM", rango:"RM", sector:"MINEM",
      sumilla:"Designan Asesor de Coordinación Parlamentaria del Despacho Ministerial",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"ENERGÍA Y MINAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539832-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"267-2026-PCM", rango:"RM", sector:"PCM",
      sumilla:"Designan Subsecretaria I de la Subsecretaría de Administración Pública de la Secretaría de Gestión Pública de la PCM",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539829-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"266-2026-PCM", rango:"RM", sector:"PCM",
      sumilla:"Designan Subsecretaria I de la Subsecretaría de Simplificación y Análisis Regulatorio de la Secretaría de Gestión Pública de la PCM",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539828-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"265-2026-PCM", rango:"RM", sector:"PCM",
      sumilla:"Designan Secretario Administrativo de la Secretaría Administrativa de la PCM",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539827-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"438-2026-MINEDU", rango:"RM", sector:"MINEDU",
      sumilla:"Designan Jefe de la Oficina de Planificación Estratégica y Presupuesto",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539825-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN DIRECTORAL", numero:"000117-2026-MINEDU-VMGI-PRONIED-DE", rango:"Res", sector:"MINEDU",
      sumilla:"Designan Asesor II de la Dirección Ejecutiva del Programa Nacional de Infraestructura Educativa - PRONIED",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539821-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"257-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Jefe de la Oficina de Comunicaciones del Ministerio",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539820-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"335-2026-MINEM/DM", rango:"RM", sector:"MINEM",
      sumilla:"Designan Jefa de la Oficina de Imagen Institucional y Comunicaciones del Ministerio",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"ENERGÍA Y MINAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539816-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"292-2026-VIVIENDA", rango:"RM", sector:"MVCS",
      sumilla:"Designan Secretaria General del Ministerio",
      fecha:"2026-08-04", origen:"ejecutivo", accion:"promulgada",
      entidad:"VIVIENDA, CONSTRUCCIÓN Y SANEAMIENTO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539697-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"253-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Asesor del Despacho Ministerial",
      fecha:"2026-08-03", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539414-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"436-2026-MINEDU", rango:"RM", sector:"MINEDU",
      sumilla:"Designan Secretaria de Planificación Estratégica",
      fecha:"2026-08-03", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539413-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"333-2026-MINEM/DM", rango:"RM", sector:"MINEM",
      sumilla:"Designan Jefe de la Oficina General de Gestión Social",
      fecha:"2026-08-03", origen:"ejecutivo", accion:"promulgada",
      entidad:"ENERGÍA Y MINAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539412-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"290-2026-VIVIENDA", rango:"RM", sector:"MVCS",
      sumilla:"Designan Jefe General de Estadística e Informática",
      fecha:"2026-08-03", origen:"ejecutivo", accion:"promulgada",
      entidad:"VIVIENDA, CONSTRUCCIÓN Y SANEAMIENTO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539404-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"000228-2026-PRODUCE", rango:"RM", sector:"PRODUCE",
      sumilla:"Designan Asesor del Despacho Ministerial",
      fecha:"2026-08-03", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539403-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"000227-2026-PRODUCE", rango:"RM", sector:"PRODUCE",
      sumilla:"Designan Jefe General de Planeamiento, Presupuesto y Modernización",
      fecha:"2026-08-03", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539402-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN", numero:"D000153-2026-MIDIS/PNPDS-DE", rango:"Res", sector:"MIDIS",
      sumilla:"Incorporan al “Cronograma de Pagos del Programa Nacional CONTIGO” correspondiente al ejercicio fiscal 2026, el Cronograma de Pagos del Padrón IV-2026 focalizado para usuarios continuadores de la región Junín",
      fecha:"2026-08-02", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO E INCLUSIÓN SOCIAL",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539400-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"251-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Jefe de la Oficina General de Tecnologías de la Información del Ministerio",
      fecha:"2026-08-02", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539398-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"249-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Jefe de la Oficina General de Planeamiento, Presupuesto y Modernización del Ministerio",
      fecha:"2026-08-02", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539397-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN VICE MINISTERIAL", numero:"0007-2026-EF/11.01", rango:"Res", sector:"MEF",
      sumilla:"Resolución Viceministerial que aprueba el Convenio de Traspaso de Recursos a ser suscrito entre el Ministerio de Economía y Finanzas y la Municipalidad Distrital de Pastaza, en el marco de lo previsto en el Decreto Supremo N° 085-2026-EF",
      fecha:"2026-08-02", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539382-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN VICE MINISTERIAL", numero:"0006-2026-EF/11.01", rango:"Res", sector:"MEF",
      sumilla:"Resolución Viceministerial que aprueba el Convenio de Traspaso de Recursos a ser suscrito entre el Ministerio de Economía y Finanzas y la Municipalidad Distrital de Napo, en el marco de lo previsto en el Decreto Supremo N° 086-2026-EF",
      fecha:"2026-08-02", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539381-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN JEFATURAL", numero:"000100-2026-ANIN/JEF", rango:"Res", sector:"PCM",
      sumilla:"Designan Jefe de la Oficina de Gestión de Proyectos, Director de la Dirección de Gestión de Equipamiento y Recursos Mobiliarios y Directora de la Dirección de Gestión Predial de la ANIN",
      fecha:"2026-08-02", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539378-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"248-2026-PCM", rango:"RS", sector:"PCM",
      sumilla:"Aceptan renuncia de Secretaria de la Secretaría del Consejo de Ministros del Despacho Presidencial",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539375-4",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"247-2026-PCM", rango:"RS", sector:"PCM",
      sumilla:"Designan Secretaria General del Despacho Presidencial",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539375-3",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"246-2026-PCM", rango:"RS", sector:"PCM",
      sumilla:"Aceptan renuncia de Secretario General del Despacho Presidencial",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539375-2",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"245-2026-PCM", rango:"RS", sector:"PCM",
      sumilla:"Designan Director de Inteligencia Nacional de la Dirección Nacional de Inteligencia - DINI",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539375-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN", numero:"0023-2026-SUNEDU-CD", rango:"Res", sector:"MINEDU",
      sumilla:"Aprueban modificación de licencia institucional solicitada por la Universidad San Ignacio de Loyola S.R.L. respecto a la creación de filial",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"SUPERINTENDENCIA NACIONAL DE EDUCACION SUPERIOR UNIVERSITARIA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539374-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"00922-2026-DE", rango:"RM", sector:"MINDEF",
      sumilla:"Designan Asesora I de la Secretaría General del Ministerio",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539373-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"00921-2026-DE", rango:"RM", sector:"MINDEF",
      sumilla:"Designan Jefe de la Oficina General de Tecnologías de la Información y Estadística del Ministerio de Defensa - Director de Sistema Administrativo II",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539372-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"00920-2026-DE", rango:"RM", sector:"MINDEF",
      sumilla:"Designan Jefe de la Oficina General de Asesoría Jurídica del Ministerio de Defensa - Director de Sistema Administrativo II",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539371-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"00919-2026-DE", rango:"RM", sector:"MINDEF",
      sumilla:"Designan Secretaria General del Ministerio de Defensa",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539370-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"247-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Jefa de la Oficina General de Administración del Ministerio",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539369-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN", numero:"0022-2026-SUNEDU-CD", rango:"Res", sector:"MINEDU",
      sumilla:"Otorgan licencia institucional solicitada por la Universidad Peruana de las Américas S.A.C., para ofrecer el servicio educativo superior universitario",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"SUPERINTENDENCIA NACIONAL DE EDUCACION SUPERIOR UNIVERSITARIA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539361-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"322-2026-EF/49", rango:"RM", sector:"MEF",
      sumilla:"Designan Jefe de la Oficina General de Asesoría Jurídica del Ministerio",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539359-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"321-2026-EF/49", rango:"RM", sector:"MEF",
      sumilla:"Designan Secretaria General del Ministerio de Economía y Finanzas",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539356-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"320-2026-EF/49", rango:"RM", sector:"MEF",
      sumilla:"Designan Jefe de la Oficina General de Recursos Humanos del Ministerio",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539354-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"286-2026-VIVIENDA", rango:"RM", sector:"MVCS",
      sumilla:"Designan Director General de Programas y Proyectos de Vivienda y Urbanismo de la Dirección General de Programas y Proyectos en Vivienda y Urbanismo",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"VIVIENDA, CONSTRUCCIÓN Y SANEAMIENTO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539344-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"D000270-2026-MIDAGRI-DM", rango:"RM", sector:"MIDAGRI",
      sumilla:"Designan Jefe de Abastecimiento de la Oficina de Abastecimiento de la Oficina General de Administración del Ministerio",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO AGRARIO Y RIEGO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539326-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"D000186-2026-MIDIS", rango:"RM", sector:"MIDIS",
      sumilla:"Designan Jefe de la Oficina General de Asesoría Jurídica del Ministerio",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO E INCLUSIÓN SOCIAL",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539323-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"D000269-2026-MIDAGRI-DM", rango:"RM", sector:"MIDAGRI",
      sumilla:"Designan Jefa General de Gestión de Recursos Humanos de la Oficina General de Gestión de Recursos Humanos del Ministerio",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO AGRARIO Y RIEGO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539306-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"D000268-2026-MIDAGRI-DM", rango:"RM", sector:"MIDAGRI",
      sumilla:"Designan Jefa General de la Oficina General de Planeamiento y Presupuesto del Ministerio",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"DESARROLLO AGRARIO Y RIEGO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539300-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN", numero:"000116-2026-SUSALUD/SUP", rango:"Res", sector:"MINSA",
      sumilla:"Designan Gerente General de la Superintendencia Nacional de Salud",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"SUPERINTENDENCIA NACIONAL DE SALUD",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539265-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"000223-2026-PRODUCE", rango:"RM", sector:"PRODUCE",
      sumilla:"Designan Secretario General de la Secretaría General del Ministerio de la Producción",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539258-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"258-2026-PCM", rango:"RM", sector:"PCM",
      sumilla:"Designan Secretario de la Secretaría de Gestión Pública de la Presidencia del Consejo de Ministros",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2539033-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"245-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Jefa de la Oficina General de Recursos Humanos del Ministerio",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538993-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"243-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Designan Secretaria General del Ministerio",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538944-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"282-2026-VIVIENDA", rango:"RM", sector:"MVCS",
      sumilla:"Designan Jefe de Gabinete de Asesores del Despacho Ministerial",
      fecha:"2026-08-01", origen:"ejecutivo", accion:"promulgada",
      entidad:"VIVIENDA, CONSTRUCCIÓN Y SANEAMIENTO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538937-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"241-2026-MINCETUR", rango:"RM", sector:"MINCETUR",
      sumilla:"Aprueban transferencia financiera a favor del Gobierno Regional del Departamento de Amazonas, para el financiamiento exclusivo de la contrapartida nacional de diversos proyectos de inversión",
      fecha:"2026-07-31", origen:"ejecutivo", accion:"promulgada",
      entidad:"COMERCIO EXTERIOR Y TURISMO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538839-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"000220-2026-PRODUCE", rango:"RM", sector:"PRODUCE",
      sumilla:"Designan Jefa de Comunicaciones e Imagen Institucional",
      fecha:"2026-07-31", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538838-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN", numero:"018-2026-PRODUCE/PROINNÓVATE", rango:"Res", sector:"PRODUCE",
      sumilla:"Aprueban el otorgamiento de subvenciones a favor de beneficiarios para cofinanciar proyectos del “Programa de Innovación, Modernización Tecnológica y Emprendimiento”",
      fecha:"2026-07-31", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRODUCE",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538809-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"313-2026-EF/49", rango:"RM", sector:"MEF",
      sumilla:"Designan Jefe de Gabinete de Asesores del Despacho Ministerial",
      fecha:"2026-07-31", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538798-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"00913-2026-DE", rango:"RM", sector:"MINDEF",
      sumilla:"Designan Jefe de la Oficina General de Prensa, Relaciones Públicas y Protocolo",
      fecha:"2026-07-31", origen:"ejecutivo", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538770-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"203-2026-TR", rango:"RM", sector:"MTPE",
      sumilla:"Designan Asesora de Despacho Ministerial I",
      fecha:"2026-07-31", origen:"ejecutivo", accion:"promulgada",
      entidad:"TRABAJO Y PROMOCIÓN DEL EMPLEO",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538769-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN VICE MINISTERIAL", numero:"000220-2026-VMPCIC/MC", rango:"Res", sector:"MINCUL",
      sumilla:"Declaran Patrimonio Cultural de la Nación al Sitio Arqueológico Jagüey Negro, ubicado en el distrito de Motupe, provincia y departamento de Lambayeque",
      fecha:"2026-07-31", origen:"ejecutivo", accion:"promulgada",
      entidad:"CULTURA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538739-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"417-2026-MINEDU", rango:"RM", sector:"MINEDU",
      sumilla:"Designan Jefa de la Oficina General de Recursos Humanos",
      fecha:"2026-07-31", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538551-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"418-2026-MINEDU", rango:"RM", sector:"MINEDU",
      sumilla:"Designan Secretaria General del Ministerio de Educación",
      fecha:"2026-07-30", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538536-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN DIRECTORAL", numero:"0021-2026-EF/50.01", rango:"Res", sector:"MEF",
      sumilla:"Resolución Directoral que modifica e incorpora precisiones al Anexo B “Fichas Técnicas de los indicadores del Programa de Incentivos a la Mejora de la Gestión Municipal correspondiente al año 2026” aprobado con la Resolución Directoral N° 0003-2026-EF/50.01",
      fecha:"2026-07-29", origen:"ejecutivo", accion:"promulgada",
      entidad:"ECONOMÍA Y FINANZAS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538528-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"409-2026-MINEDU", rango:"RM", sector:"MINEDU",
      sumilla:"Aprueban la incorporación de ocho inversiones no programadas en la Cartera de Inversiones del “Programa Multianual de Inversiones (PMI) del Sector Educación 2026-2028”",
      fecha:"2026-07-29", origen:"ejecutivo", accion:"promulgada",
      entidad:"EDUCACIÓN",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538518-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"659-2026/MINSA", rango:"RM", sector:"MINSA",
      sumilla:"Crean el Observatorio Nacional de Salud Bucal (ONSB)",
      fecha:"2026-07-29", origen:"ejecutivo", accion:"promulgada",
      entidad:"SALUD",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538517-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN SUPREMA", numero:"242-2026-PCM", rango:"RS", sector:"PCM",
      sumilla:"Encargan temporalmente Despacho de Justicia y Derechos Humanos al Ministro de Desarrollo Agrario y Riego",
      fecha:"2026-07-28", origen:"ejecutivo", accion:"promulgada",
      entidad:"PRESIDENCIA DEL CONSEJO DE MINISTROS",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538530-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"00907-2026-DE", rango:"RM", sector:"MINDEF",
      sumilla:"Autorizan viaje de personal militar a la República de Corea, en comisión de servicios",
      fecha:"2026-07-28", origen:"viaje", accion:"promulgada",
      entidad:"DEFENSA",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538467-1",
      verificado:true, evidencia:"oficial" },

    { tipo:"RESOLUCIÓN MINISTERIAL", numero:"654-2026/MINSA", rango:"RM", sector:"MINSA",
      sumilla:"Autorizan viaje de profesionales de la Dirección General de Medicamentos, Insumos y Drogas, a la República Popular China, en comisión de servicios",
      fecha:"2026-07-28", origen:"viaje", accion:"promulgada",
      entidad:"SALUD",
      enlace:"https://busquedas.elperuano.pe/dispositivo/NL/2538430-1",
      verificado:true, evidencia:"oficial" }
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
  promesas: [
    /* Transcritas del Mensaje a la Nacion del 28/07/2026, ante el Congreso.
       Se registran solo compromisos CONCRETOS y comprobables (con cifra,
       plazo o entregable definido). Las declaraciones de intencion generica
       —"respetar la independencia de poderes"— no se listan: no son
       verificables y ensuciarian el tablero de cumplimiento.

       CONTRASTE DOCUMENTAL — 19/08/2026. Cada promesa se cotejo contra
       fuentes publicadas y se le asigno un nivel de evidencia:

         "oficial"    el anuncio consta en un medio del Estado —Diario
                      Oficial El Peruano o TV Peru—, que actua como registro
                      publico del discurso.
         "verificado" lo consignan al menos dos medios independientes entre si.
         "preliminar" lo reporta una sola fuente, o las fuentes discrepan
                      sobre la cifra. Se mantiene el sello hasta contrastarlo
                      con la transcripcion oficial del Congreso.

       El campo `fuentes` lista esa documentacion; el visor la muestra bajo
       cada promesa para que cualquiera pueda comprobarla.

       ESTADO: nadie sube de "no_iniciada" sin una entrada en `evidencia`.
       Al 19/08/2026 (dia 22 de 100) solo dos promesas tienen acto de
       gobierno documentado; el resto sigue siendo anuncio. */
    { id:"seg-01", promesa:"Elevar la remuneracion minima vital de S/ 1 130 a S/ 1 300", sector:"MTPE",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"en_proceso", evidencia:[ { fecha:"2026-07-29", que:"El MEF confirma que prepara el alza y evalua aplicarla por tramos; falta convocar al Consejo Nacional de Trabajo y emitir el Decreto Supremo.", enlace:"https://www.infobae.com/peru/2026/07/29/gobierno-ya-se-alista-para-el-incremento-del-sueldo-minimo-en-peru-y-buscara-preparar-a-las-mypes/" } ], norma:{}, presupuesto:"",
      resultado:"Sin Decreto Supremo publicado en El Peruano al 19/08/2026: la RMV vigente sigue en S/ 1 130.",
      fuentes:[ { n:"El Peruano", u:"https://www.elperuano.pe/noticia/301268-gobierno-anuncia-aumento-de-la-remuneracion-minima-vital-a-s-1300-y-bono-para-las-mypes" }, { n:"El Peruano", u:"https://elperuano.pe/noticia/301314-gobierno-subira-a-s-1300-la-remuneracion-minima-vital" }, { n:"El Peruano", u:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" }, { n:"Infobae", u:"https://www.infobae.com/peru/2026/07/29/gobierno-ya-se-alista-para-el-incremento-del-sueldo-minimo-en-peru-y-buscara-preparar-a-las-mypes/" }, { n:"El Comercio", u:"https://elcomercio.pe/respuestas/cuanto/aumento-de-sueldo-minimo-2026-en-peru-nuevo-monto-y-que-anuncio-el-mef-sobre-la-rmv-tdpe-noticia/" }, { n:"La Republica", u:"https://larepublica.pe/economia/2026/08/18/aumento-del-sueldo-minimo-que-pasara-con-los-trabajadores-que-ya-ganan-mas-de-s1300-hnews-741546" } ],
      nivel:"oficial", verificado:true },
    { id:"soc-01", promesa:"Duplicar Pension 65: de S/ 350 a S/ 700 bimestrales", sector:"MIDIS",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"en_proceso", evidencia:[ { fecha:"2026-08-01", que:"El Gobierno ratifica el alza a S/ 700 bimestrales, de aplicacion progresiva y sin fecha de inicio anunciada.", enlace:"https://elcomercio.pe/respuestas/quien/aumento-de-pension-65-quienes-accederan-a-los-s-700-y-cuando-estara-disponible-tdpe-noticia/" } ], norma:{}, presupuesto:"",
      resultado:"Sin norma de aprobacion ni cronograma de pago con el nuevo monto al 19/08/2026.",
      fuentes:[ { n:"El Peruano", u:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" }, { n:"TV Peru", u:"https://www.tvperu.gob.pe/noticias/politica/mensaje-a-la-nacion-pension-65-subira-a-s700-para-adultos-mayores-en-pobreza-extrema" }, { n:"Infobae", u:"https://www.infobae.com/peru/2026/07/28/pension-65-keiko-fujimori-anuncia-entrega-de-s700-bimestrales-para-adultos-mayores-en-situacion-de-pobreza-extrema/" }, { n:"El Comercio", u:"https://elcomercio.pe/respuestas/quien/aumento-de-pension-65-quienes-accederan-a-los-s-700-y-cuando-estara-disponible-tdpe-noticia/" } ],
      nivel:"oficial", verificado:true },
    { id:"emp-01", promesa:"Programa \"Jovenes con Futuro\": reducir a la mitad el desempleo juvenil", sector:"MTPE",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"",
      fuentes:[ { n:"El Peruano", u:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" }, { n:"Infobae", u:"https://www.infobae.com/peru/2026/07/29/las-5-claves-del-primer-mensaje-a-la-nacion-de-keiko-fujimori-seguridad-sueldo-minimo-y-reforma-del-estado/" }, { n:"Altavoz", u:"https://altavoz.pe/politica/keiko-fujimori-horizonte-laboral-plantea-17-medidas-para-los-primeros-100-dias-de-gobierno-en-materia-laboral/" } ],
      nivel:"verificado", verificado:true },
    { id:"emp-02", promesa:"Reactivar Promype via Cofide dentro de los primeros cien dias", sector:"PRODUCE",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"Compromiso con plazo explicito: primeros cien dias (vence el 05/11/2026).",
      fuentes:[ { n:"El Peruano", u:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" }, { n:"PQS", u:"https://pqs.pe/actualidad/keiko-fujimori-los-principales-anuncios-de-su-primer-mensaje-a-la-nacion/" }, { n:"Diario El Pueblo", u:"https://diarioelpueblo.com.pe/2026/07/29/mensaje-a-la-nacion-de-la-presidenta-keiko-fujimori/" } ],
      nivel:"oficial", verificado:true },
    { id:"emp-03", promesa:"Bono compensatorio por unica vez para micro y pequenas empresas", sector:"PRODUCE",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"Ligado al alza de la RMV: sin norma que lo cree al 19/08/2026.",
      fuentes:[ { n:"El Peruano", u:"https://www.elperuano.pe/noticia/301268-gobierno-anuncia-aumento-de-la-remuneracion-minima-vital-a-s-1300-y-bono-para-las-mypes" }, { n:"El Peruano", u:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" }, { n:"Infobae", u:"https://www.infobae.com/peru/2026/07/29/gobierno-ya-se-alista-para-el-incremento-del-sueldo-minimo-en-peru-y-buscara-preparar-a-las-mypes/" } ],
      nivel:"oficial", verificado:true },
    { id:"soc-02", promesa:"Reducir a la mitad la desnutricion cronica y la anemia infantil", sector:"MIDIS",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"Las fuentes difieren entre desnutricion cronica y anemia: falta contrastar con la transcripcion oficial.",
      fuentes:[ { n:"Diario Correo", u:"https://diariocorreo.pe/politica/keiko-fujimori-plantea-siete-objetivos-de-gobierno-en-su-primer-mensaje-a-la-nacion-noticia/" }, { n:"Infobae", u:"https://www.infobae.com/peru/2026/07/29/las-5-claves-del-primer-mensaje-a-la-nacion-de-keiko-fujimori-seguridad-sueldo-minimo-y-reforma-del-estado/" } ],
      nivel:"preliminar", verificado:false },
    { id:"edu-01", promesa:"Relanzar el PRONAA para la alimentacion en colegios publicos", sector:"MINEDU",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"",
      fuentes:[ { n:"El Peruano", u:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" }, { n:"Caretas", u:"https://caretas.pe/politica/que-es-el-pronaa-el-programa-que-keiko-fujimori-busca-relanzar-en-el-peru-a-mas-de-una-decada-de-su-cierre-noticia" }, { n:"PQS", u:"https://pqs.pe/actualidad/keiko-fujimori-los-principales-anuncios-de-su-primer-mensaje-a-la-nacion/" } ],
      nivel:"oficial", verificado:true },
    { id:"edu-02", promesa:"Ampliar Beca 18 dentro del programa \"Jovenes con Futuro\"", sector:"MINEDU",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"",
      fuentes:[ { n:"El Peruano", u:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" }, { n:"Infobae", u:"https://www.infobae.com/peru/2026/07/29/las-5-claves-del-primer-mensaje-a-la-nacion-de-keiko-fujimori-seguridad-sueldo-minimo-y-reforma-del-estado/" }, { n:"Diario Correo", u:"https://diariocorreo.pe/politica/keiko-fujimori-plantea-siete-objetivos-de-gobierno-en-su-primer-mensaje-a-la-nacion-noticia/" } ],
      nivel:"verificado", verificado:true },
    { id:"inf-01", promesa:"Culminar la Linea 2 del Metro de Lima", sector:"MTC",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"",
      fuentes:[ { n:"El Comercio", u:"https://elcomercio.pe/economia/peru/keiko-fujimori-promete-culminar-la-linea-2-del-metro-de-lima-y-sistemas-de-metro-en-arequipa-piura-y-trujillo-noticia/" }, { n:"La Republica", u:"https://larepublica.pe/sociedad/2026/07/28/culminacion-de-las-lineas-2-3-4-5-y-6-del-metro-de-lima-tren-de-cercanias-a-ica-y-barranca-y-trenes-para-arequipa-piura-y-trujillo-las-obras-viales-que-anuncio-keiko-fujimori-en-su-mensaje-a-la-nacion-2118116" }, { n:"Energiminas", u:"https://energiminas.com/2026/07/28/keiko-fujimori-se-propone-culminar-linea-2-del-metro-de-lima-y-ejecutar-las-lineas-3-4-5-y-6-durante-su-gestion/" } ],
      nivel:"verificado", verificado:true },
    { id:"inf-02", promesa:"Ejecutar las Lineas 3, 4, 5 y 6 del Metro de Lima", sector:"MTC",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"",
      fuentes:[ { n:"Energiminas", u:"https://energiminas.com/2026/07/28/keiko-fujimori-se-propone-culminar-linea-2-del-metro-de-lima-y-ejecutar-las-lineas-3-4-5-y-6-durante-su-gestion/" }, { n:"Infobae", u:"https://www.infobae.com/peru/2026/07/28/keiko-fujimori-anuncia-las-lineas-3-4-5-y-6-del-metro-de-lima-y-metros-para-arequipa-piura-y-trujillo-en-su-primer-mensaje-a-la-nacion/" }, { n:"La Republica", u:"https://larepublica.pe/sociedad/2026/07/28/culminacion-de-las-lineas-2-3-4-5-y-6-del-metro-de-lima-tren-de-cercanias-a-ica-y-barranca-y-trenes-para-arequipa-piura-y-trujillo-las-obras-viales-que-anuncio-keiko-fujimori-en-su-mensaje-a-la-nacion-2118116" } ],
      nivel:"verificado", verificado:true },
    { id:"inf-03", promesa:"Culminar la Nueva Carretera Central", sector:"MTC",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"",
      fuentes:[ { n:"TV Peru", u:"https://www.tvperu.gob.pe/noticias/politica/presidenta-fujimori-anuncia-que-culminara-la-nueva-carretera-central" }, { n:"Peru Construye", u:"https://peruconstruye.net/2026/07/28/presidenta-keiko-fujimori-apunta-como-obra-prioritaria-la-culminacion-de-la-nueva-carretera-central/" }, { n:"Caretas", u:"https://caretas.pe/politica/estas-son-las-obras-y-carreteras-que-anuncio-keiko-fujimori" } ],
      nivel:"oficial", verificado:true },
    { id:"inf-04", promesa:"Sistemas de metro en Arequipa, Piura y Trujillo", sector:"MTC",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"",
      fuentes:[ { n:"El Comercio", u:"https://elcomercio.pe/economia/peru/keiko-fujimori-promete-culminar-la-linea-2-del-metro-de-lima-y-sistemas-de-metro-en-arequipa-piura-y-trujillo-noticia/" }, { n:"Infobae", u:"https://www.infobae.com/peru/2026/07/28/keiko-fujimori-anuncia-las-lineas-3-4-5-y-6-del-metro-de-lima-y-metros-para-arequipa-piura-y-trujillo-en-su-primer-mensaje-a-la-nacion/" }, { n:"La Republica", u:"https://larepublica.pe/sociedad/2026/07/28/culminacion-de-las-lineas-2-3-4-5-y-6-del-metro-de-lima-tren-de-cercanias-a-ica-y-barranca-y-trenes-para-arequipa-piura-y-trujillo-las-obras-viales-que-anuncio-keiko-fujimori-en-su-mensaje-a-la-nacion-2118116" } ],
      nivel:"verificado", verificado:true },
    { id:"inf-05", promesa:"Trenes de cercanias Lima-Ica y Lima-Barranca", sector:"MTC",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"",
      fuentes:[ { n:"Trome", u:"https://trome.com/actualidad/politica/keiko-fujimori-promete-trenes-lima-ica-y-lima-barranca-anuncia-expansion-del-metro-y-megaplan-vial-para-conectar-el-peru-video-mensaje-noticia/" }, { n:"La Republica", u:"https://larepublica.pe/sociedad/2026/07/28/culminacion-de-las-lineas-2-3-4-5-y-6-del-metro-de-lima-tren-de-cercanias-a-ica-y-barranca-y-trenes-para-arequipa-piura-y-trujillo-las-obras-viales-que-anuncio-keiko-fujimori-en-su-mensaje-a-la-nacion-2118116" }, { n:"Caretas", u:"https://caretas.pe/politica/estas-son-las-obras-y-carreteras-que-anuncio-keiko-fujimori" } ],
      nivel:"verificado", verificado:true },
    { id:"seg-02", promesa:"Videovigilancia nacional interconectada y plataformas de IA para mapear el delito", sector:"MININTER",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"El plan de gobierno cifra 10 000 camaras interconectadas; el mensaje del 28/07 no repitio la cifra.",
      fuentes:[ { n:"El Comercio", u:"https://elcomercio.pe/peru/seguridad-bajo-el-gobierno-de-keiko-fujimori-las-medidas-contra-el-crimen-organizado-y-los-vacios-de-su-primer-mensaje-noticia/" }, { n:"Caretas", u:"https://caretas.pe/politica/seguridad-y-prevencion-marcaran-los-primeros-100-dias-de-keiko-fujimori" }, { n:"TV Peru", u:"https://www.tvperu.gob.pe/noticias/politica/tu-decision-2026-planes-de-gobierno-de-keiko-fujimori-de-fuerza-popular" } ],
      nivel:"preliminar", verificado:false },
    { id:"seg-03", promesa:"Reforma penitenciaria para evitar que las carceles operen como centros del crimen", sector:"MINJUSDH",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"",
      fuentes:[ { n:"El Comercio", u:"https://elcomercio.pe/peru/seguridad-bajo-el-gobierno-de-keiko-fujimori-las-medidas-contra-el-crimen-organizado-y-los-vacios-de-su-primer-mensaje-noticia/" }, { n:"Infobae", u:"https://www.infobae.com/peru/2026/07/28/keiko-fujimori-anuncia-que-las-fuerzas-armadas-lideraran-operativos-durante-estados-de-emergencia/" } ],
      nivel:"preliminar", verificado:false },
    { id:"nin-01", promesa:"Plan de contingencia nacional frente al fenomeno El Nino", sector:"PCM",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"Declarado eje de los primeros cien dias junto con la seguridad ciudadana.",
      fuentes:[ { n:"Diario Correo", u:"https://diariocorreo.pe/politica/keiko-fujimori-anuncia-que-sus-primeros-100-dias-estaran-enfocados-en-seguridad-y-fenomeno-el-nino-noticia/" }, { n:"Caretas", u:"https://caretas.pe/politica/seguridad-y-prevencion-marcaran-los-primeros-100-dias-de-keiko-fujimori" } ],
      nivel:"verificado", verificado:true },
    { id:"dig-01", promesa:"Crear la Autoridad Nacional Digital y otorgar identidad digital a cada ciudadano", sector:"PCM",
      origen:{ tipo:"Mensaje a la Nacion", fecha:"2026-07-28", enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso" },
      estado:"no_iniciada", evidencia:[], norma:{}, presupuesto:"",
      resultado:"",
      fuentes:[ { n:"Infobae", u:"https://www.infobae.com/peru/2026/07/29/las-5-claves-del-primer-mensaje-a-la-nacion-de-keiko-fujimori-seguridad-sueldo-minimo-y-reforma-del-estado/" }, { n:"Diario Correo", u:"https://diariocorreo.pe/politica/keiko-fujimori-plantea-siete-objetivos-de-gobierno-en-su-primer-mensaje-a-la-nacion-noticia/" }, { n:"Infobae", u:"https://www.infobae.com/peru/2026/07/29/el-mensaje-de-keiko-fujimori-en-1826-dias-alcanzara-el-tiempo-para-cumplir-lo-prometido/" } ],
      nivel:"preliminar", verificado:false }
  ],

  /* 6. PRIMEROS 100 DIAS -------------------------------------------------
     Medidas anunciadas para el arranque, con semaforo.

       estado: "ejecutada"   VERDE  — hay acto de gobierno consumado
                             (norma publicada, programa operando, obra entregada).
               "en_proceso"  AMBAR  — hay acto formal de tramite verificable
                             (convocatoria, solicitud, anuncio con fecha), pero
                             el entregable todavia no existe.
               "no_iniciada" ROJO   — solo el anuncio; ningun acto documentado.

     Recuento levantado el 19/08/2026 (dia 22 de 100) a partir del Mensaje a
     la Nacion del 28/07/2026, del plan de gobierno "Peru con Orden" y de la
     cobertura contrastada. Cada medida enlaza a la fuente que la documenta.

     REGLA: ninguna medida sube de rojo sin enlace que lo pruebe. Si la
     fuente es una sola nota de prensa, el sello queda en "preliminar".
     ------------------------------------------------------------------ */
  medidas100: [
    { titulo:"Exponer la politica general del Gobierno ante la Camara de Diputados",
      sector:"PCM", estado:"en_proceso",
      detalle:"Art. 130 de la Constitucion. El premier Galarreta pidio el pleno del 20/08/2026; con el Congreso bicameral la cuestion de confianza ya no es obligatoria.",
      enlace:"https://www.infobae.com/peru/2026/08/17/luis-galarreta-y-su-gabinete-se-presentan-este-jueves-ante-la-camara-de-diputados-expondran-la-politica-general-del-gobierno/",
      evidencia:"verificado", verificado:true,
      nota:"Plazo constitucional: 30 dias desde la asuncion." },

    { titulo:"Desplegar a las Fuerzas Armadas en apoyo a la Policia",
      sector:"MINDEF", estado:"en_proceso",
      detalle:"Anunciado el 03/08/2026: personal militar a las calles para reforzar el control policial durante los estados de emergencia.",
      enlace:"https://www.diariolasamericas.com/america-latina/keiko-fujimori-ordena-el-despliegue-militares-enfrentar-la-inseguridad-n5399920",
      evidencia:"preliminar", verificado:false,
      nota:"Sin decreto supremo propio del nuevo Gobierno publicado al 19/08/2026." },

    { titulo:"Elevar la remuneracion minima vital a S/ 1 300",
      sector:"MTPE", estado:"en_proceso",
      detalle:"El MEF prepara el alza y evalua aplicarla por tramos; requiere convocar al Consejo Nacional de Trabajo antes del Decreto Supremo.",
      enlace:"https://www.infobae.com/peru/2026/07/29/gobierno-ya-se-alista-para-el-incremento-del-sueldo-minimo-en-peru-y-buscara-preparar-a-las-mypes/",
      evidencia:"oficial", verificado:true,
      nota:"La RMV vigente sigue en S/ 1 130 (D.S. 006-2024-TR)." },

    { titulo:"Duplicar Pension 65 a S/ 700 bimestrales",
      sector:"MIDIS", estado:"en_proceso",
      detalle:"Confirmado por el Gobierno como aplicacion progresiva; aun sin fecha de inicio ni cronograma con el nuevo monto.",
      enlace:"https://elcomercio.pe/respuestas/quien/aumento-de-pension-65-quienes-accederan-a-los-s-700-y-cuando-estara-disponible-tdpe-noticia/",
      evidencia:"oficial", verificado:true },

    { titulo:"Reactivar Promype: creditos para la micro y pequena empresa via Cofide",
      sector:"PRODUCE", estado:"no_iniciada",
      detalle:"Unica medida del mensaje con plazo explicito de cien dias. Vence el 05/11/2026.",
      enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso",
      evidencia:"oficial", verificado:true },

    { titulo:"Reactivar las compras estatales MYPeru",
      sector:"PRODUCE", estado:"no_iniciada",
      detalle:"Anunciada en el mismo bloque de los cien dias que Promype.",
      enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso",
      evidencia:"oficial", verificado:true },

    { titulo:"Impulsar el factoring para dar liquidez a las MYPE",
      sector:"PRODUCE", estado:"no_iniciada",
      detalle:"Tercer componente del paquete MYPE de los cien dias.",
      enlace:"https://elperuano.pe/noticia/301279-sueldo-minimo-pension-65-y-pronaa-todos-los-anuncios-de-la-presidenta-fujimori-en-su-mensaje-al-congreso",
      evidencia:"oficial", verificado:true },

    { titulo:"Bono compensatorio por unica vez para las MYPE",
      sector:"PRODUCE", estado:"no_iniciada",
      detalle:"Contrapeso al alza de la RMV para no golpear el empleo formal. Sin norma que lo cree.",
      enlace:"https://www.elperuano.pe/noticia/301268-gobierno-anuncia-aumento-de-la-remuneracion-minima-vital-a-s-1300-y-bono-para-las-mypes",
      evidencia:"oficial", verificado:true },

    { titulo:"Poner en operacion el sistema C5i en Lima y Callao",
      sector:"MININTER", estado:"no_iniciada",
      detalle:"Centro de comando, control, comunicaciones, computo, ciberseguridad e inteligencia previsto para el arranque del Gobierno.",
      enlace:"https://caretas.pe/politica/seguridad-y-prevencion-marcaran-los-primeros-100-dias-de-keiko-fujimori",
      evidencia:"verificado", verificado:true },

    { titulo:"Fortalecer las Unidades de Flagrancia Express en Lima, Piura y Trujillo",
      sector:"MINJUSDH", estado:"no_iniciada",
      detalle:"Medida de los cien dias para acortar el tiempo entre detencion y sentencia.",
      enlace:"https://caretas.pe/politica/seguridad-y-prevencion-marcaran-los-primeros-100-dias-de-keiko-fujimori",
      evidencia:"verificado", verificado:true },

    { titulo:"Intervencion conjunta FF.AA. y PNP en Tumbes para el control fronterizo",
      sector:"MINDEF", estado:"no_iniciada",
      detalle:"Operacion prevista para el arranque, orientada a la frontera norte.",
      enlace:"https://caretas.pe/politica/seguridad-y-prevencion-marcaran-los-primeros-100-dias-de-keiko-fujimori",
      evidencia:"verificado", verificado:true },

    { titulo:"Decretos de urgencia: 1 000 patrulleros, 10 000 camaras y 200 comisarias",
      sector:"MININTER", estado:"no_iniciada",
      detalle:"El plan de gobierno cifra la compra de 1 000 patrulleros inteligentes, 10 000 camaras interconectadas y la modernizacion de 200 comisarias.",
      enlace:"https://www.tvperu.gob.pe/noticias/politica/tu-decision-2026-planes-de-gobierno-de-keiko-fujimori-de-fuerza-popular",
      evidencia:"verificado", verificado:true,
      nota:"Ningun decreto de urgencia con este objeto al 19/08/2026." },

    { titulo:"Plan de contingencia nacional frente al fenomeno El Nino",
      sector:"PCM", estado:"no_iniciada",
      detalle:"Declarado, junto con la seguridad, eje de los primeros cien dias.",
      enlace:"https://diariocorreo.pe/politica/keiko-fujimori-anuncia-que-sus-primeros-100-dias-estaran-enfocados-en-seguridad-y-fenomeno-el-nino-noticia/",
      evidencia:"verificado", verificado:true },

    { titulo:"Recuperar el orden interno y la capacidad operativa del Estado",
      sector:"PCM", estado:"no_iniciada",
      detalle:"\"Lo mas importante en los proximos 100 dias es recuperar el orden\", dijo la mandataria antes de asumir.",
      enlace:"https://elcomercio.pe/politica/keiko-fujimori-lo-mas-importante-en-los-proximos-100-dias-es-recuperar-el-orden-ultimas-noticia/",
      evidencia:"preliminar", verificado:false,
      nota:"Objetivo declarativo: se seguira por sus medidas concretas, no por el enunciado." },

    { titulo:"Relanzar el PRONAA para la alimentacion escolar",
      sector:"MINEDU", estado:"no_iniciada",
      detalle:"Anunciado en el mensaje del 28/07; su relanzamiento exige norma de creacion y presupuesto.",
      enlace:"https://caretas.pe/politica/que-es-el-pronaa-el-programa-que-keiko-fujimori-busca-relanzar-en-el-peru-a-mas-de-una-decada-de-su-cierre-noticia",
      evidencia:"oficial", verificado:true },

    { titulo:"Agenda laboral de los primeros cien dias (17 medidas)",
      sector:"MTPE", estado:"no_iniciada",
      detalle:"Horizonte Laboral planteo 17 medidas para el arranque, con EsSalud y la formalizacion como prioridades.",
      enlace:"https://altavoz.pe/politica/keiko-fujimori-horizonte-laboral-plantea-17-medidas-para-los-primeros-100-dias-de-gobierno-en-materia-laboral/",
      evidencia:"preliminar", verificado:false,
      nota:"Propuesta de un colectivo tecnico, no compromiso formal del Ejecutivo." }
  ],

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
  eventos: [
    { fecha:"2026-08-03", tipo:"hito",
      titulo:"Se anuncia el despliegue militar en apoyo a la Policia",
      detalle:"La presidenta informa que en los proximos dias saldran a las calles efectivos de las Fuerzas Armadas.",
      enlace:"https://www.diariolasamericas.com/america-latina/keiko-fujimori-ordena-el-despliegue-militares-enfrentar-la-inseguridad-n5399920",
      evidencia:"preliminar", verificado:false },

    { fecha:"2026-08-17", tipo:"hito",
      titulo:"El gabinete pide exponer la politica general ante Diputados",
      detalle:"Galarreta solicita el pleno del 20/08/2026. Con el Congreso bicameral la cuestion de confianza ya no es obligatoria.",
      enlace:"https://diariocorreo.pe/politica/galarreta-solicito-a-camara-de-diputados-acudir-al-pleno-este-20-de-agosto-para-exponer-politica-general-del-gobierno-noticia/",
      evidencia:"verificado", verificado:true }
  ],

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
    { nombre:"Congreso — Portal de proyectos de ley", url:"https://wb2server.congreso.gob.pe/spley-portal/#/expediente/search", nota:"Seguimiento de expedientes legislativos." },
    { nombre:"Congreso de la Republica",             url:"https://www.congreso.gob.pe/", nota:"Portal institucional." },
    { nombre:"SPIJ — Ministerio de Justicia",        url:"https://spij.minjus.gob.pe/",        nota:"Texto vigente y concordado de las normas." },
    { nombre:"Presidencia del Consejo de Ministros", url:"https://www.gob.pe/pcm",             nota:"Gabinete y comunicados oficiales." },
    { nombre:"MEF — Consulta Amigable",              url:"https://apps5.mineco.gob.pe/transparencia/Navegador/default.aspx", nota:"Ejecucion presupuestal por sector y region." },
    { nombre:"INEI — Estadisticas",                  url:"https://www.inei.gob.pe/",           nota:"PBI, inflacion, empleo y pobreza." },
    { nombre:"BCRP — Estadisticas",                  url:"https://www.bcrp.gob.pe/estadisticas.html", nota:"Tipo de cambio, reservas y riesgo pais." },
    { nombre:"Defensoria — Conflictos sociales",     url:"https://www.defensoria.gob.pe/temas/conflictos-sociales/", nota:"Reporte mensual de conflictividad." },
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
