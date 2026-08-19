/* ============================================================================
   GoVisor — idiomas (español / inglés)
   ----------------------------------------------------------------------------
   QUE SE TRADUCE:  la interfaz. Rotulos, titulos, filtros, estados vacios,
                    metodologia, avisos.

   QUE NO SE TRADUCE:  la evidencia. Nombres de ministerios y de ministros,
                    sumillas de resoluciones y numeros de norma vienen del
                    Diario Oficial El Peruano y son texto legal. Traducirlos
                    produciria la cita de un documento que no existe. En
                    ingles la interfaz cambia y el documento conserva su
                    titulo oficial en castellano, que es lo correcto en un
                    portal de fiscalizacion.

   USO
     t("clave", {n:3})          -> texto en el idioma activo
     I18N.idioma                -> "es" | "en"
     I18N.alternar()            -> cambia de idioma y avisa a los suscriptores
     I18N.alCambiar(fn)         -> registra un repintado
     I18N.aplicarEstaticos()    -> traduce los nodos con data-i18n
   ========================================================================== */

const I18N = (function () {
  "use strict";

  const CLAVE = "govisor.idioma";

  const DIC = {

    /* ── Cabecera y navegación ─────────────────────────────────────── */
    "nav.100":        { es:"100 días",  en:"100 days" },
    "nav.promesas":   { es:"Promesas",  en:"Promises" },
    "nav.timeline":   { es:"Timeline",  en:"Timeline" },
    "nav.gabinete":   { es:"Gabinete",  en:"Cabinet" },
    "nav.normas":     { es:"Normas",    en:"Regulations" },
    "nav.mas":        { es:"Más",       en:"More" },
    "nav.explorar":   { es:"Explorar datos", en:"Explore data" },
    "nav.buscar":     { es:"Buscar en las normas", en:"Search regulations" },
    "nav.menu":       { es:"Abrir menú", en:"Open menu" },
    "nav.idioma":     { es:"Cambiar idioma a inglés", en:"Switch language to Spanish" },
    "marca.sub":      { es:"Observatorio del Gobierno · Perú 2026-2031",
                        en:"Government Watch · Peru 2026-2031" },
    "saltar":         { es:"Saltar al contenido", en:"Skip to content" },

    "mas.congreso":   { es:"Gobierno y Congreso", en:"Government and Congress" },
    "mas.cargos":     { es:"Radar de nombramientos", en:"Appointments radar" },
    "mas.ppto":       { es:"Presupuesto y ejecución", en:"Budget and execution" },
    "mas.viajes":     { es:"Viajes oficiales", en:"Official travel" },
    "mas.noticias":   { es:"Noticias", en:"News" },
    "mas.video":      { es:"Video y configuración", en:"Video and settings" },
    "mas.fuentes":    { es:"Fuentes oficiales", en:"Official sources" },
    "mas.meto":       { es:"Metodología", en:"Methodology" },

    /* ── Héroe ─────────────────────────────────────────────────────── */
    "hero.h1":    { es:"La ciudadanía observa.<br><span>El país avanza.</span>",
                    en:"Citizens are watching.<br><span>The country moves forward.</span>" },
    "hero.sub":   { es:"Datos, evidencia y seguimiento para un gobierno que cumple.",
                    en:"Data, evidence and tracking for a government that delivers." },
    "hero.nota":  { es:"<span aria-hidden=\"true\">ⓘ</span> Proyecto informativo, sin afiliación al Estado ni a organización política.",
                    en:"<span aria-hidden=\"true\">ⓘ</span> Informational project, unaffiliated with the State or any political organization." },
    "hero.img":   { es:"Panorámica del Perú: Palacio de Gobierno, los Andes y la costa de Lima",
                    en:"Panorama of Peru: Government Palace, the Andes and the coast of Lima" },
    "actualizado":{ es:"Actualizado", en:"Updated" },

    /* ── Tarjetas KPI ──────────────────────────────────────────────── */
    "kpi.dia":        { es:"Día del Gobierno", en:"Day of Government" },
    "kpi.diaN":       { es:"Día {n} del Gobierno", en:"Day {n} of Government" },
    "kpi.desde":      { es:"Desde el {f}", en:"Since {f}" },
    "kpi.100":        { es:"Primeros 100 días", en:"First 100 days" },
    "kpi.de100":      { es:"de 100", en:"of 100" },
    "kpi.transcurridos":{ es:"Días transcurridos", en:"Days elapsed" },
    "kpi.concluida":  { es:"Etapa concluida", en:"Stage completed" },
    "kpi.gabinete":   { es:"Consejo de Ministros", en:"Council of Ministers" },
    "kpi.verificados":{ es:"{n} titulares verificados", en:"{n} verified office holders" },
    "kpi.sinTitulares":{ es:"Sin titulares registrados", en:"No office holders on record" },
    "kpi.normas":     { es:"Normas del periodo", en:"Regulations of the period" },
    "kpi.enRegistro": { es:"En registro", en:"Being recorded" },
    "kpi.conEnlace":  { es:"{n} con enlace verificado", en:"{n} with a verified link" },
    "kpi.verNormas":  { es:"Ver sección de normas", en:"Go to regulations" },
    "kpi.diaSR":      { es:"Día {n} de gobierno", en:"Day {n} of government" },

    /* ── Tablero ───────────────────────────────────────────────────── */
    "tab.cambio":     { es:"¿Qué cambió?", en:"What changed?" },
    "tab.verTimeline":{ es:"Ver timeline completo →", en:"View full timeline →" },
    "tab.promesas":   { es:"Promesas vs. realidad", en:"Promises vs. reality" },
    "tab.promesasSub":{ es:"Lo que dijo · lo que normó · lo que ejecutó",
                        en:"What was said · what was enacted · what was delivered" },
    "tab.verTodas":   { es:"Ver todas", en:"View all" },
    "tab.verTodo":    { es:"Ver todo", en:"View all" },
    "tab.timeline":   { es:"Timeline del Gobierno", en:"Government timeline" },
    "tab.verGabinete":{ es:"Ver gabinete", en:"View cabinet" },
    "tab.ver19":      { es:"Ver los 19 ministros y carteras →", en:"View all 19 ministers and portfolios →" },
    "tab.dijo":       { es:"Lo que dijo", en:"What was said" },
    "tab.normo":      { es:"Lo que normó", en:"What was enacted" },
    "tab.ejecuto":    { es:"Lo que ejecutó", en:"What was delivered" },
    "tab.compromisos":{ es:"Compromisos del Mensaje a la Nación", en:"Pledges from the State of the Nation address" },
    "tab.normasRel":  { es:"Normas relacionadas a compromisos", en:"Regulations tied to pledges" },
    "tab.acciones":   { es:"Acciones y resultados", en:"Actions and results" },
    "tab.construccion":{ es:"Información en construcción. Sin datos inventados.",
                         en:"Information under construction. No invented data." },
    "tab.compromisosN":{ es:"compromisos registrados", en:"pledges on record" },
    "tab.compromisoN": { es:"compromiso registrado", en:"pledge on record" },
    "tab.conNorma":   { es:"con norma publicada", en:"with a published regulation" },
    "tab.sinNorma":   { es:"ninguna norma vinculada aún", en:"no regulation linked yet" },
    "tab.conAccion":  { es:"con acción verificada", en:"with verified action" },
    "tab.sinEvidencia":{ es:"sin evidencia suficiente", en:"insufficient evidence" },
    "tab.sinEv":      { es:"Sin evidencia", en:"No evidence" },
    "tab.notaEv":     { es:"{a} de {b} promesas tienen evidencia de ejecución registrada.",
                        en:"{a} of {b} promises have recorded evidence of delivery." },
    "tab.notaSinEv":  { es:"Las {n} promesas están registradas; aún no hay evidencia de ejecución.",
                        en:"All {n} promises are on record; there is no evidence of delivery yet." },
    "tab.enCurso":    { es:"En curso", en:"Ongoing" },
    "tab.primeros100":{ es:"Primeros 100 días de gestión", en:"First 100 days in office" },
    "tab.sinHitos":   { es:"Sin hitos registrados.", en:"No milestones on record." },
    "tab.sinTitulares":{ es:"Sin titulares registrados.", en:"No office holders on record." },

    /* ── Secciones ─────────────────────────────────────────────────── */
    "sec.100":        { es:"Primeros 100 días", en:"First 100 days" },
    "sec.100sub":     { es:"Semáforo de las medidas anunciadas", en:"Traffic light of announced measures" },
    "sec.promesas":   { es:"Promesas vs. realidad", en:"Promises vs. reality" },
    "sec.promesasSub":{ es:"Cada promesa, con su cadena de evidencia", en:"Every promise, with its chain of evidence" },
    "sec.linea":      { es:"Línea de tiempo", en:"Timeline" },
    "sec.gabinete":   { es:"Consejo de Ministros", en:"Council of Ministers" },
    "sec.normas":     { es:"Normas del periodo", en:"Regulations of the period" },
    "sec.normasSub":  { es:"Publicadas en El Peruano desde el 28/07/2026",
                        en:"Published in El Peruano since 28/07/2026" },
    "sec.lectura":    { es:"El gobierno, en pocas palabras", en:"The government, in a few words" },
    "sec.lecturaSub": { es:"Lectura de lo registrado, sin cifras sueltas",
                        en:"A reading of the record, without loose figures" },
    "sec.seguir":     { es:"Seguimiento", en:"Tracking" },
    "sec.seguirSub":  { es:"Módulos de seguimiento activo", en:"Active tracking modules" },
    "sec.hitos":      { es:"{n} hitos desde el inicio del mandato", en:"{n} milestones since the term began" },
    "sec.carteras":   { es:"{a} de {b} carteras en funciones", en:"{a} of {b} portfolios in office" },

    /* ── Filtros ───────────────────────────────────────────────────── */
    "f.todos":        { es:"Todos", en:"All" },
    "f.todas":        { es:"Todas", en:"All" },
    "f.enFunciones":  { es:"En funciones", en:"In office" },
    "f.cesados":      { es:"Cesados", en:"Departed" },
    "f.sinDatos":     { es:"Sin datos", en:"No data" },
    "f.congreso":     { es:"Congreso", en:"Congress" },
    "f.ejecutivo":    { es:"Ejecutivo", en:"Executive" },
    "f.viajes":       { es:"Viajes", en:"Travel" },
    "f.gabinete":     { es:"Filtrar gabinete", en:"Filter cabinet" },
    "f.normas":       { es:"Filtrar normas", en:"Filter regulations" },
    "f.promesas":     { es:"Filtrar promesas", en:"Filter promises" },
    "f.linea":        { es:"Filtrar la línea de tiempo", en:"Filter the timeline" },
    "f.buscarNorma":  { es:"Buscar por número, título o palabra clave…",
                        en:"Search by number, title or keyword…" },
    "f.buscarLabel":  { es:"Buscar norma por número, título o palabra clave",
                        en:"Search regulations by number, title or keyword" },

    /* ── Estados de promesa ────────────────────────────────────────── */
    "p.cumplida":     { es:"Cumplida", en:"Delivered" },
    "p.en_proceso":   { es:"En proceso", en:"In progress" },
    "p.no_iniciada":  { es:"No iniciada", en:"Not started" },
    "p.incumplida":   { es:"Incumplida", en:"Broken" },
    "p.sinEstado":    { es:"Sin estado", en:"No status" },
    "p.dijo":         { es:"Dijo", en:"Said" },
    "p.hizo":         { es:"Hizo", en:"Did" },
    "p.normo":        { es:"Normó", en:"Enacted" },
    "p.presupuesto":  { es:"Presupuestó", en:"Budgeted" },
    "p.resultado":    { es:"Resultado", en:"Result" },
    "p.sinRegistro":  { es:"sin registro", en:"no record" },

    /* ── Tipos de la línea de tiempo ───────────────────────────────── */
    "tl.todos":         { es:"Todo", en:"All" },
    "tl.nombramiento":  { es:"Nombramientos", en:"Appointments" },
    "tl.norma":         { es:"Normas", en:"Regulations" },
    "tl.cese":          { es:"Ceses", en:"Departures" },
    "tl.viaje":         { es:"Viajes", en:"Travel" },
    "tl.hito":          { es:"Hitos", en:"Milestones" },
    "tl.dia":           { es:"Día {n}", en:"Day {n}" },
    "tl.asuncion":      { es:"Asunción del mando", en:"Assumption of office" },
    "tl.juraN":         { es:"Juramentación de {n} ministros", en:"Swearing-in of {n} ministers" },
    "tl.nombraEn":      { es:"Nombramiento en {c}", en:"Appointment at {c}" },
    "tl.ceseEn":        { es:"Cese en {c}", en:"Departure at {c}" },
    "tl.viajeA":        { es:"Viaje oficial · {d}", en:"Official travel · {d}" },
    "tl.destinoSR":     { es:"destino por registrar", en:"destination to be recorded" },
    "tl.juraTxt":       { es:"{n} juramenta como {c}", en:"{n} is sworn in as {c}" },
    "tl.resoluciones":  { es:"{n} resoluciones", en:"{n} resolutions" },
    "tl.sinTipo":       { es:"No hay eventos de ese tipo registrados.", en:"No events of that type on record." },
    "tl.sinHitos":      { es:"Sin hitos", en:"No milestones" },

    /* ── Tiempo relativo ───────────────────────────────────────────── */
    "t.hoy":    { es:"hoy",  en:"today" },
    "t.ayer":   { es:"ayer", en:"yesterday" },
    "t.haceN":  { es:"hace {n} días", en:"{n} days ago" },
    "t.hoyMismo":{ es:"hoy mismo", en:"today" },
    "t.unDia":  { es:"un día", en:"one day" },
    "t.anio":   { es:"1 año",  en:"1 year" },
    "t.anios":  { es:"{n} años", en:"{n} years" },
    "t.mes":    { es:"1 mes",  en:"1 month" },
    "t.meses":  { es:"{n} meses", en:"{n} months" },
    "t.unDiaN": { es:"1 día",  en:"1 day" },
    "t.diasN":  { es:"{n} días", en:"{n} days" },
    "t.dias":   { es:"días", en:"days" },
    "t.dia":    { es:"día",  en:"day" },

    /* ── Insignias y evidencia ─────────────────────────────────────── */
    "b.verificado":   { es:"Verificado", en:"Verified" },
    "b.porVerificar": { es:"Por verificar", en:"To be verified" },
    "b.derogada":     { es:"Derogada", en:"Repealed" },
    "b.otro":         { es:"Otro", en:"Other" },
    "b.viajeOficial": { es:"Viaje oficial", en:"Official travel" },
    "ev.oficial":     { es:"Oficial", en:"Official" },
    "ev.verificado":  { es:"Verificado", en:"Verified" },
    "ev.preliminar":  { es:"Preliminar", en:"Preliminary" },
    "ev.investigacion":{ es:"En investigación", en:"Under investigation" },
    "n.sinResolucion":{ es:"Sin resolución", en:"No resolution" },
    "n.sinSumilla":   { es:"Sin sumilla registrada", en:"No summary on record" },
    "n.titularSR":    { es:"Titular por registrar", en:"Office holder to be recorded" },
    "n.verificada":   { es:"verificada", en:"verified" },
    "n.porVerificar": { es:"por verificar", en:"to be verified" },
    "n.sinFecha":     { es:"sin fecha", en:"no date" },

    /* ── Tabla de normas ───────────────────────────────────────────── */
    "tn.fecha":   { es:"Fecha", en:"Date" },
    "tn.tipo":    { es:"Tipo", en:"Type" },
    "tn.numero":  { es:"Número", en:"Number" },
    "tn.titulo":  { es:"Título / sumilla", en:"Title / summary" },
    "tn.estado":  { es:"Estado", en:"Status" },
    "tn.mostrando":{ es:"Mostrando {a} de {b} normas", en:"Showing {a} of {b} regulations" },
    "tn.verMas":  { es:"Ver {n} más", en:"Show {n} more" },
    "tn.sinNormas":{ es:"Aún no hay normas registradas", en:"No regulations on record yet" },
    "tn.sinNormasTxt":{ es:"Agrégalas en el arreglo <code>normas</code> de data.js y aparecerán aquí con su enlace directo a la fuente.",
                        en:"Add them to the <code>normas</code> array in data.js and they will appear here with a direct link to the source." },
    "tn.sinCoincidencias":{ es:"Sin coincidencias", en:"No matches" },
    "tn.otroFiltro":  { es:"Prueba otro filtro o término.", en:"Try another filter or term." },
    "tn.sinResultados":{ es:"Sin resultados", en:"No results" },
    "tn.ningunaCartera":{ es:"Ninguna cartera coincide con este filtro.", en:"No portfolio matches this filter." },

    /* ── 100 días ──────────────────────────────────────────────────── */
    "d.ejecutadas":  { es:"ejecutadas", en:"delivered" },
    "d.enProceso":   { es:"en proceso", en:"in progress" },
    "d.noIniciadas": { es:"no iniciadas", en:"not started" },
    "d.sinMedidas":  { es:"Sin medidas registradas", en:"No measures on record" },
    "p.documentacion":{ es:"Documentación que lo respalda ({n})", en:"Supporting documentation ({n})" },
    "d.sinMedidasT": { es:"Sin medidas cargadas", en:"No measures loaded" },
    "d.sinMedidasTxt":{ es:"Este bloque necesita la lista de medidas efectivamente anunciadas para los primeros 100 días. Cárgalas en <code>medidas100</code> de data.js y el semáforo se calcula solo. El contador de días ya es real.",
                        en:"This block needs the list of measures actually announced for the first 100 days. Load them into <code>medidas100</code> in data.js and the traffic light computes itself. The day counter is already real." },
    "d.pct":         { es:"{p} % de la etapa transcurrido.", en:"{p}% of the stage elapsed." },
    "d.concluida":   { es:"La etapa de los primeros 100 días concluyó; el Gobierno lleva {n} días.",
                       en:"The first 100 days are over; the government has been in office for {n} days." },
    "d.faltaFecha":  { es:"Falta registrar la fecha de asunción.", en:"The date of assumption of office is missing." },

    /* ── Reloj constitucional ──────────────────────────────────────── */
    "r130.titulo":  { es:"Exposición de la política general", en:"Presentation of general policy" },
    "r130.bicameral":{ es:"Con el Congreso bicameral la cuestión de confianza dejó de ser obligatoria: el Consejo de Ministros expone su política general sin plantearla.",
                       en:"Under the bicameral Congress the vote of confidence is no longer mandatory: the Council of Ministers presents its general policy without calling one." },
    "r130.base":    { es:"Constitución, art. 130 — plazo de {n} días desde la asunción.",
                      en:"Constitution, art. 130 — {n}-day deadline from assumption of office." },
    "r130.restante":{ es:"día restante", en:"day left" },
    "r130.restantes":{ es:"días restantes", en:"days left" },
    "r130.txt":     { es:"El Presidente del Consejo de Ministros debe exponer la política general del Gobierno ante el Congreso, a más tardar el <b>{f}</b>.",
                      en:"The President of the Council of Ministers must present the government's general policy to Congress no later than <b>{f}</b>." },
    "r130.vencido": { es:"días vencido", en:"days overdue" },
    "r130.vencidoTxt":{ es:"El plazo constitucional venció el {f} y el visor aún no registra la exposición ante el Congreso.",
                        en:"The constitutional deadline expired on {f} and the tracker has no record of the presentation to Congress." },
    "r130.otorgada":{ es:"Confianza otorgada", en:"Confidence granted" },
    "r130.rehusada":{ es:"Confianza rehusada", en:"Confidence refused" },
    "r130.porRegistrar":{ es:"Resultado por registrar", en:"Result to be recorded" },
    "r130.exposicion":{ es:"Exposición ante el Pleno el {f}.", en:"Presentation to the plenary on {f}." },
    "r130.votacion":{ es:"Votación: {a} a favor · {b} en contra · {c} abstenciones.",
                      en:"Vote: {a} in favour · {b} against · {c} abstentions." },

    /* ── Promesas: estado vacío ────────────────────────────────────── */
    "pv.titulo":  { es:"Sin promesas registradas todavía", en:"No promises on record yet" },
    "pv.txt":     { es:"Este es el módulo central del observatorio y exige contrastar cinco cosas por cada promesa: qué se prometió, qué se anunció, qué norma se publicó, qué presupuesto se asignó y qué resultado se verificó.<br><br>Se alimenta del plan de gobierno inscrito ante el JNE, del Mensaje a la Nación del 28/07/2026 y de la exposición de política general del PCM ante el Congreso. GoVisor no infiere promesas: deben transcribirse de la fuente.",
                    en:"This is the core module of the observatory and it requires checking five things for each promise: what was promised, what was announced, which regulation was published, what budget was assigned and what result was verified.<br><br>It draws on the government plan filed with the JNE, the State of the Nation address of 28/07/2026 and the PCM's general policy presentation to Congress. GoVisor does not infer promises: they must be transcribed from the source." },
    "pv.sinCoincidencias":{ es:"No hay promesas en ese estado.", en:"No promises with that status." },

    /* ── Estabilidad ───────────────────────────────────────────────── */
    "e.originales":{ es:"Titulares originales", en:"Original office holders" },
    "e.relevos":   { es:"Relevos", en:"Replacements" },
    "e.permanencia":{ es:"Permanencia media", en:"Average tenure" },
    "e.rotacion":  { es:"Mayor rotación", en:"Highest turnover" },
    "e.ninguna":   { es:"Ninguna", en:"None" },
    "e.sinRelevos":{ es:"sin relevos", en:"no replacements" },
    "e.titulares": { es:"{n} titulares", en:"{n} office holders" },
    "e.enCargo":   { es:"{n} d · cesó", en:"{n} d · left" },
    "e.diaN":      { es:"día {n}", en:"day {n}" },
    "e.sinFecha":  { es:"sin fecha", en:"no date" },

    /* ── Lectura rápida ────────────────────────────────────────────── */
    "l.mandato":   { es:"Mandato", en:"Term" },
    "l.mandatoTxt":{ es:"Lleva <b>{t}</b> en el cargo, sobre un periodo de cinco años.",
                     en:"Has been in office for <b>{t}</b>, out of a five-year term." },
    "l.mandatoSF": { es:"La fecha de inicio aún no está registrada.", en:"The start date is not on record yet." },
    "l.gabinete":  { es:"Gabinete", en:"Cabinet" },
    "l.gabineteSin":{ es:"Las <b>{n}</b> carteras mantienen a su titular original, sin cambios desde la juramentación.",
                      en:"All <b>{n}</b> portfolios keep their original holder, unchanged since the swearing-in." },
    "l.gabineteCon":{ es:"<b>{a}</b> carteras en funciones y <b>{b}</b> con cambio de titular.",
                      en:"<b>{a}</b> portfolios in office and <b>{b}</b> with a change of holder." },
    "l.produccion":{ es:"Producción normativa", en:"Regulatory output" },
    "l.produccionSin":{ es:"Todavía no se registran normas del periodo.", en:"No regulations of the period on record yet." },
    "l.produccionCon":{ es:"Normas registradas: <b>{a}</b> del Congreso y <b>{b}</b> del Ejecutivo.",
                        en:"Regulations on record: <b>{a}</b> from Congress and <b>{b}</b> from the Executive." },
    "l.trazabilidad":{ es:"Trazabilidad", en:"Traceability" },
    "l.trazaVacio":{ es:"Cada registro llevará su enlace directo a la fuente oficial.",
                     en:"Every record will carry a direct link to its official source." },
    "l.trazaCero": { es:"Ninguna de las {n} registradas ha sido contrastada todavía.",
                     en:"None of the {n} on record has been checked yet." },
    "l.trazaTodas":{ es:"Todas las normas registradas están contrastadas con su fuente.",
                     en:"Every regulation on record has been checked against its source." },
    "l.trazaParte":{ es:"<b>{a}</b> de {b} normas contrastadas con la fuente oficial.",
                     en:"<b>{a}</b> of {b} regulations checked against the official source." },

    /* ── Seguimiento ───────────────────────────────────────────────── */
    "s.congresoSub":{ es:"Interacciones y control político", en:"Interactions and political oversight" },
    "s.cargosSub":  { es:"Designaciones y ceses en el Estado", en:"Appointments and departures in the State" },
    "s.pptoSub":    { es:"PIA, PIM y devengado por pliego", en:"PIA, PIM and accrued spending by agency" },
    "s.viajesSub":  { es:"Autorizaciones y comisiones", en:"Authorizations and missions" },
    "s.noticiasSub":{ es:"Información contextual externa, no oficial", en:"External contextual information, not official" },
    "s.videoSub":   { es:"Requiere tu propia API key de YouTube", en:"Requires your own YouTube API key" },
    "s.fuentesSub": { es:"Evidencia y transparencia", en:"Evidence and transparency" },
    "s.metoSub":    { es:"Cómo leer este visor", en:"How to read this tracker" },
    "s.sinRegistros":{ es:"Sin registros", en:"No records" },
    "s.registros":  { es:"{n} registro(s)", en:"{n} record(s)" },
    "s.soloGabinete":{ es:"Solo gabinete", en:"Cabinet only" },
    "s.cargosN":    { es:"{n} cargo(s)", en:"{n} position(s)" },
    "s.sinDatos":   { es:"Sin datos", en:"No data" },
    "s.sectores":   { es:"{n} sector(es)", en:"{n} sector(s)" },
    "s.noticiasCtx":{ es:"Titulares de agregadores públicos. <b>No son fuente oficial</b> y GoVisor no respalda su contenido.",
                      en:"Headlines from public aggregators. <b>They are not an official source</b> and GoVisor does not endorse their content." },

    "sv.sinViajes": { es:"Sin viajes registrados", en:"No travel on record" },
    "sv.txt":       { es:"Las salidas al exterior de la Presidencia requieren autorización del Congreso mediante Resolución Legislativa.",
                      en:"Presidential trips abroad require authorization from Congress through a Legislative Resolution." },
    "sv.destinoSR": { es:"Destino por registrar", en:"Destination to be recorded" },
    "sv.motivoSR":  { es:"Motivo no registrado", en:"Purpose not recorded" },
    "sv.al":        { es:" al ", en:" to " },

    "sc.art130":    { es:"La Constitución (art. 130) obliga al Presidente del Consejo de Ministros a exponer la política general ante el Congreso dentro de los 30 días de asumir, y a plantear cuestión de confianza. El reloj de ese plazo está arriba.",
                      en:"The Constitution (art. 130) requires the President of the Council of Ministers to present the general policy to Congress within 30 days of taking office, and to call a vote of confidence. The countdown for that deadline is above." },
    "sc.interpelaciones":{ es:"Interpelaciones", en:"Interpellations" },
    "sc.censuras":  { es:"Mociones de censura", en:"Censure motions" },
    "sc.facultades":{ es:"Facultades legislativas", en:"Delegated legislative powers" },
    "sc.proyectos": { es:"Proyectos del Ejecutivo", en:"Executive bills" },
    "sc.sinRegistros":{ es:"Sin registros.", en:"No records." },
    "sc.ministro":  { es:"Ministro", en:"Minister" },
    "sc.sector":    { es:"Sector", en:"Sector" },
    "sc.resultado": { es:"Resultado", en:"Outcome" },
    "sc.votos":     { es:"Votos", en:"Votes" },
    "sc.materia":   { es:"Materia", en:"Subject" },
    "sc.plazo":     { es:"Plazo", en:"Term" },
    "sc.otorgada":  { es:"Otorgada", en:"Granted" },
    "sc.si":        { es:"Sí", en:"Yes" },
    "sc.no":        { es:"No", en:"No" },
    "sc.nro":       { es:"N.º", en:"No." },
    "sc.tituloCol": { es:"Título", en:"Title" },
    "sc.estado":    { es:"Estado", en:"Status" },

    "sr.soloGab":   { es:"Solo el gabinete está cargado", en:"Only the cabinet is loaded" },
    "sr.txt":       { es:"El radar cubre viceministros, secretarios generales, jefes de organismos y titulares de empresas públicas. Esos nombramientos se publican como R.M. y R.S. en El Peruano; cárgalos en <code>altosCargos</code> de data.js. Las 19 carteras ministeriales ya están en la sección Gabinete.",
                      en:"The radar covers deputy ministers, secretaries-general, heads of agencies and chairs of state companies. Those appointments are published as R.M. and R.S. in El Peruano; load them into <code>altosCargos</code> in data.js. The 19 ministerial portfolios are already in the Cabinet section." },
    "sr.nombre":    { es:"Nombre", en:"Name" },
    "sr.cargo":     { es:"Cargo", en:"Position" },
    "sr.entidad":   { es:"Entidad", en:"Body" },
    "sr.dias":      { es:"Días", en:"Days" },
    "sr.norma":     { es:"Norma", en:"Regulation" },

    "sp.sinCifras": { es:"Sin cifras presupuestales cargadas", en:"No budget figures loaded" },
    "sp.txt":       { es:"GoVisor no estima presupuesto: las cifras de PIA, PIM y devengado deben tomarse de la Consulta Amigable del MEF y actualizarse periódicamente. Una cifra inventada aquí sería peor que un vacío.",
                      en:"GoVisor does not estimate budget: PIA, PIM and accrued figures must be taken from the MEF's Consulta Amigable and updated periodically. An invented figure here would be worse than a blank." },
    "sp.fuente":    { es:"Fuente: ", en:"Source: " },
    "sp.sector":    { es:"Sector", en:"Sector" },
    "sp.ejec":      { es:"% ejec.", en:"% exec." },
    "sp.actualizado":{ es:"Actualizado al {f}.", en:"Updated as of {f}." },

    /* ── Noticias y video ──────────────────────────────────────────── */
    "nt.cargando":  { es:"Cargando titulares…", en:"Loading headlines…" },
    "nt.error":     { es:"No se pudieron cargar los titulares", en:"Headlines could not be loaded" },
    "nt.abrirFeed": { es:"Abre el feed directamente:", en:"Open the feed directly:" },
    "nt.sinTitulo": { es:"Sin título", en:"Untitled" },
    "nt.desactivada":{ es:"Lectura directa desactivada", en:"Direct reading disabled" },
    "nt.abrirEn":   { es:'Abrir "{n}" en Google Noticias ↗', en:'Open "{n}" in Google News ↗' },
    "nt.sinItems":  { es:"el agregador no devolvió titulares", en:"the aggregator returned no headlines" },

    "yt.label":     { es:"Tu API key de YouTube Data API v3", en:"Your YouTube Data API v3 key" },
    "yt.placeholder":{ es:"Pega aquí tu API key", en:"Paste your API key here" },
    "yt.guardar":   { es:"Guardar", en:"Save" },
    "yt.borrar":    { es:"Borrar", en:"Delete" },
    "yt.privacidad":{ es:"La clave se guarda <b>solo en este navegador</b> (localStorage). No se envía a ningún servidor de GoVisor ni se versiona en el repositorio.",
                      en:"The key is stored <b>only in this browser</b> (localStorage). It is never sent to any GoVisor server nor committed to the repository." },
    "yt.ingresa":   { es:"Ingresa tu API key para cargar videos.", en:"Enter your API key to load videos." },
    "yt.buscando":  { es:"Buscando videos…", en:"Searching for videos…" },
    "yt.sinResultados":{ es:"Consulta sin resultados.", en:"Query returned no results." },
    "yt.sinVideos": { es:"Sin videos para esta consulta.", en:"No videos for this query." },
    "yt.activa":    { es:"Clave activa · {n} videos.", en:"Key active · {n} videos." },
    "yt.escribe":   { es:"Escribe una clave antes de guardar.", en:"Enter a key before saving." },
    "yt.guardada":  { es:"Clave guardada en este navegador. Consultando…", en:"Key saved in this browser. Querying…" },
    "yt.bloqueado": { es:"Este navegador bloquea el almacenamiento local.", en:"This browser blocks local storage." },
    "yt.borrada":   { es:"Clave borrada de este navegador.", en:"Key removed from this browser." },
    "yt.cargada":   { es:"Clave cargada desde este navegador.", en:"Key loaded from this browser." },
    "yt.errorTit":  { es:"No se pudo consultar YouTube", en:"YouTube could not be queried" },
    "yt.errorTxt":  { es:"Verifica que la clave tenga habilitada la YouTube Data API v3 y que sus restricciones de referente permitan este sitio.",
                      en:"Check that the key has the YouTube Data API v3 enabled and that its referrer restrictions allow this site." },

    /* ── Metodología ───────────────────────────────────────────────── */
    "m.intro":  { es:"GoVisor distingue entre lo que está probado documentalmente y lo que no. Cada registro lleva una etiqueta de nivel de evidencia:",
                  en:"GoVisor distinguishes between what is documented and what is not. Each record carries an evidence-level label:" },
    "m.oficial":{ es:"<b>Oficial</b> — publicado en El Peruano, el Congreso o una entidad del Estado.",
                  en:"<b>Official</b> — published in El Peruano, Congress or a State body." },
    "m.verificado":{ es:"<b>Verificado</b> — contrastado con dos fuentes independientes.",
                     en:"<b>Verified</b> — checked against two independent sources." },
    "m.preliminar":{ es:"<b>Preliminar</b> — reportado por prensa, sin documento oficial todavía.",
                     en:"<b>Preliminary</b> — reported by the press, without an official document yet." },
    "m.investigacion":{ es:"<b>En investigación</b> — denuncia o proceso en curso. <b>No es un hecho probado.</b>",
                        en:"<b>Under investigation</b> — a complaint or ongoing case. <b>It is not a proven fact.</b>" },
    "m.queCalcula":{ es:"Qué se calcula y qué se carga a mano", en:"What is computed and what is loaded by hand" },
    "m.calcula":{ es:"<b>Se calcula en vivo</b> desde los datos verificados: días de mandato, día de los primeros 100, plazo del artículo 130, línea de tiempo, índice de estabilidad, permanencia por ministro y «qué cambió».",
                  en:"<b>Computed live</b> from verified data: days in office, day of the first 100, the article 130 deadline, the timeline, the stability index, tenure per minister and «what changed»." },
    "m.mano":   { es:"<b>Se carga a mano</b>, porque exige contrastar fuente por fuente: promesas, medidas de los 100 días, presupuesto, actos del Congreso y altos cargos.",
                  en:"<b>Loaded by hand</b>, because it requires checking source by source: promises, 100-day measures, budget, acts of Congress and senior appointments." },
    "m.nombres":{ es:"Nombres propios", en:"Proper names" },
    "m.nombresTxt":{ es:"Se transcriben tal como figuran en la resolución, no como aparecen en la prensa. Por eso el visor dice «Kosme Sheput» y «Arnillas Gonzales».",
                     en:"They are transcribed exactly as they appear in the resolution, not as the press writes them. That is why the tracker says «Kosme Sheput» and «Arnillas Gonzales»." },
    "m.idioma": { es:"Idioma", en:"Language" },
    "m.idiomaTxt":{ es:"La interfaz está en español e inglés. <b>La evidencia no se traduce:</b> los nombres de ministerios y ministros, las sumillas de las resoluciones y los números de norma conservan su redacción oficial en castellano. Traducirlos produciría la cita de un documento que no existe.",
                    en:"The interface is available in Spanish and English. <b>The evidence is not translated:</b> ministry and minister names, resolution summaries and regulation numbers keep their official Spanish wording. Translating them would produce a citation of a document that does not exist." },
    "m.noHace": { es:"Lo que este visor no hace", en:"What this tracker does not do" },
    "m.noHaceTxt":{ es:"No estima cifras, no infiere promesas y no publica denuncias como si fueran hechos. Cuando un dato falta, lo dice.",
                    en:"It does not estimate figures, does not infer promises and does not publish allegations as facts. When a datum is missing, it says so." },

    /* ── Visor de documentos ───────────────────────────────────────── */
    "v.documento":  { es:"Documento oficial", en:"Official document" },
    "v.abrir":      { es:"Abrir en El Peruano ↗", en:"Open in El Peruano ↗" },
    "v.cerrar":     { es:"Cerrar", en:"Close" },
    "v.cargando":   { es:"Cargando el documento oficial…", en:"Loading the official document…" },
    "v.pie":        { es:"Contenido servido por el Diario Oficial El Peruano. GoVisor no lo modifica ni lo almacena.",
                      en:"Content served by the Official Gazette El Peruano. GoVisor neither modifies nor stores it." },
    "v.iframe":     { es:"Documento oficial en El Peruano", en:"Official document in El Peruano" },
    "v.nuevaPestana":{ es:"(se abre en una pestaña nueva)", en:"(opens in a new tab)" },

    /* ── Pie y Acerca de ───────────────────────────────────────────── */
    "pie.sub":     { es:"Observatorio ciudadano del Gobierno del Perú", en:"Citizen watchdog of the Government of Peru" },
    "pie.lema":    { es:"Transparencia que genera confianza.", en:"Transparency that builds trust." },
    "pie.lemaSub": { es:"Datos abiertos · Evidencia oficial · Seguimiento continuo",
                     en:"Open data · Official evidence · Continuous tracking" },
    "pie.meto":    { es:"Metodología", en:"Methodology" },
    "pie.fuentes": { es:"Fuentes", en:"Sources" },
    "pie.acerca":  { es:"Acerca de GoVisor", en:"About GoVisor" },
    "pie.legal":   { es:"Proyecto informativo, independiente y sin afiliación al Estado peruano ni a organización política. Cada dato enlaza a su fuente; contrasta siempre con El Peruano y el Congreso. Datos al ",
                     en:"An informational, independent project unaffiliated with the Peruvian State or any political organization. Every datum links to its source; always check against El Peruano and Congress. Data as of " },
    "pie.creado":  { es:"Creado por", en:"Created by" },

    "ac.titulo":   { es:"Acerca de GoVisor", en:"About GoVisor" },
    "ac.p1":       { es:"<b>GoVisor es una página informativa</b> que da seguimiento a la gestión del Gobierno del Perú: el gabinete, las normas publicadas, las promesas anunciadas y los plazos constitucionales.",
                     en:"<b>GoVisor is an informational site</b> that tracks the work of the Government of Peru: the cabinet, published regulations, announced promises and constitutional deadlines." },
    "ac.p2":       { es:"No es un sitio oficial del Estado ni está afiliado a organización política alguna. Cada dato que se muestra enlaza a su fuente —El Peruano, el Congreso, el JNE— para que cualquiera pueda comprobarlo. Cuando un dato no está contrastado, el visor lo dice en lugar de rellenarlo.",
                     en:"It is not an official State site and is not affiliated with any political organization. Every datum shown links to its source —El Peruano, Congress, the JNE— so that anyone can verify it. When a datum has not been checked, the tracker says so instead of filling it in." },
    "ac.visitar":  { es:"Visitar Andesnova ↗", en:"Visit Andesnova ↗" },

    /* ── Página de fuentes ─────────────────────────────────────────── */
    "fu.intro":    { es:"Todo dato de GoVisor procede de alguna de estas fuentes. Si algo no puede contrastarse en ellas, el visor lo marca como pendiente en vez de darlo por cierto.",
                     en:"Every datum in GoVisor comes from one of these sources. If something cannot be checked against them, the tracker marks it as pending instead of treating it as fact." },
    "fu.comoTitulo":{ es:"Cómo verificar un dato", en:"How to verify a datum" },
    "fu.paso1":    { es:"Busca el número de la resolución en El Peruano.",
                     en:"Search for the resolution number in El Peruano." },
    "fu.paso2":    { es:"Compara el nombre con el que aparece en el texto de la norma, no con el de la prensa.",
                     en:"Compare the name with the one in the text of the regulation, not the one in the press." },
    "fu.paso3":    { es:"Si difieren, la resolución manda: es el documento con valor legal.",
                     en:"If they differ, the resolution prevails: it is the document with legal force." },
    "fu.nota":     { es:"GoVisor no aloja documentos: los enlaza. Cada resolución se abre en el propio sitio del Diario Oficial.",
                     en:"GoVisor does not host documents: it links to them. Each resolution opens on the Official Gazette's own site." },

    /* ── ¿Qué cambió? ──────────────────────────────────────────────── */
    "c.ventana":   { es:"Últimos {n} días", en:"Last {n} days" },
    "c.sinMov":    { es:"Sin movimientos recientes", en:"No recent activity" },
    "c.sinCambios":{ es:"Sin cambios registrados en los últimos {n} días.",
                     en:"No changes recorded in the last {n} days." },
    "c.loMasReciente":{ es:"Lo más reciente en el visor:", en:"Most recent in the tracker:" },

    /* ── Avisos generales ──────────────────────────────────────────── */
    "g.aviso":     { es:"Aviso ·", en:"Notice ·" }
  };

  /* ── Estado ─────────────────────────────────────────────────────── */
  let idioma = "es";
  try {
    const g = localStorage.getItem(CLAVE);
    if (g === "es" || g === "en") idioma = g;
  } catch { /* almacenamiento bloqueado: se queda en español */ }

  const suscriptores = [];

  /** Texto traducido. Los marcadores {x} se sustituyen con `vars`. */
  function t(clave, vars) {
    const e = DIC[clave];
    let s = e ? (e[idioma] != null ? e[idioma] : e.es) : clave;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        s = s.split("{" + k + "}").join(String(vars[k]));
      });
    }
    return s;
  }

  /** Traduce los nodos marcados con data-i18n en el HTML estatico. */
  function aplicarEstaticos(raiz) {
    const r = raiz || document;
    r.querySelectorAll("[data-i18n]").forEach((el) => {
      el.innerHTML = t(el.dataset.i18n);
    });
    // formato de data-i18n-attr: "atributo:clave" separado por comas
    r.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(",").forEach((par) => {
        const i = par.indexOf(":");
        if (i < 0) return;
        el.setAttribute(par.slice(0, i).trim(), t(par.slice(i + 1).trim()));
      });
    });
    document.documentElement.lang = idioma === "en" ? "en" : "es-PE";
  }

  function cambiar(nuevo) {
    if (nuevo !== "es" && nuevo !== "en") return;
    idioma = nuevo;
    try { localStorage.setItem(CLAVE, idioma); } catch { /* sin persistencia */ }
    aplicarEstaticos();
    suscriptores.forEach((fn) => { try { fn(idioma); } catch (e) { console.error(e); } });
  }

  return {
    t,
    aplicarEstaticos,
    cambiar,
    alCambiar: (fn) => suscriptores.push(fn),
    alternar: () => cambiar(idioma === "es" ? "en" : "es"),
    get idioma() { return idioma; },
    /** Locale para Intl. La zona horaria SIEMPRE es America/Lima. */
    get locale() { return idioma === "en" ? "en-GB" : "es-PE"; }
  };
})();

const t = I18N.t;
