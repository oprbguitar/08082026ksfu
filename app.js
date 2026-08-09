/* ============================================================================
   GoVisor — lógica del visor estratégico
   Lee la global GOVISOR (data.js) y pinta el portal. Sin dependencias.
   ========================================================================== */
(function () {
  "use strict";

  const ZONA = "America/Lima";
  const CLAVE_YT = "govisor.youtube.key";
  const TOTAL_PERIODO = 1826;              // 5 años ≈ 1826 días
  /* Si un contenedor no existe, se devuelve un nodo desechable en vez de
     null. Un rediseno anterior elimino #lectura y el TypeError resultante
     abortaba iniciar() entero; esto degrada en lugar de romper. */
  const HUERFANO = document.createElement("div");
  const $ = (id) => document.getElementById(id) || HUERFANO;

  const menosMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ══════════ UTILIDADES ══════════ */

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }

  /** Solo http/https; cualquier otro esquema se descarta. */
  function urlSegura(u) {
    if (!u) return "";
    try {
      const p = new URL(u, location.href);
      return (p.protocol === "http:" || p.protocol === "https:") ? p.href : "";
    } catch { return ""; }
  }

  /** "AAAA-MM-DD" -> Date a mediodía UTC (evita corrimiento por zona). */
  function fecha(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const [a, m, d] = iso.split("-").map(Number);
    const f = new Date(Date.UTC(a, m - 1, d, 12, 0, 0));
    return isNaN(f) ? null : f;
  }

  function hoyLima() {
    return fecha(new Intl.DateTimeFormat("en-CA", {
      timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date()));
  }

  const diasEntre = (a, b) => (a && b) ? Math.floor((b - a) / 86400000) : null;

  function fechaLarga(iso) {
    const f = fecha(iso);
    return f ? new Intl.DateTimeFormat("es-PE", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    }).format(f) : "";
  }

  function fechaCorta(iso) {
    const f = fecha(iso);
    return f ? new Intl.DateTimeFormat("es-PE", {
      day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC"
    }).format(f) : "";
  }

  /** Días -> frase legible. */
  function enPalabras(d) {
    if (d == null) return "";
    if (d === 0) return "hoy mismo";
    if (d === 1) return "un día";
    const a = Math.floor(d / 365), r = d % 365, m = Math.floor(r / 30), x = r % 30;
    const p = [];
    if (a) p.push(a === 1 ? "1 año" : a + " años");
    if (m) p.push(m === 1 ? "1 mes" : m + " meses");
    if (x && !a) p.push(x === 1 ? "1 día" : x + " días");
    return p.join(", ") || d + " días";
  }

  const PALABRAS = ["ninguna","una","dos","tres","cuatro","cinco","seis","siete",
    "ocho","nueve","diez","once","doce","trece","catorce","quince","dieciséis",
    "diecisiete","dieciocho","diecinueve","veinte"];
  const palabra = (n) => (n >= 0 && n < PALABRAS.length) ? PALABRAS[n] : String(n);

  function iniciales(n) {
    const p = String(n || "").trim().split(/\s+/).filter(Boolean);
    return p.length ? ((p[0][0] || "") + (p[1] ? p[1][0] : "")).toUpperCase() : "··";
  }

  const sello = (ok) => ok
    ? '<span class="b b-ok">Verificado</span>'
    : '<span class="b b-pend">Por verificar</span>';

  /** Chip de norma: enlace si hay URL, texto plano si solo hay número. */
  function chipNorma(n, corto) {
    if (!n || (!n.numero && !n.tipo)) return '<span class="rs-txt">Sin resolución</span>';
    const txt = esc(corto ? (n.numero || n.tipo)
                          : [n.tipo, n.numero].filter(Boolean).join(" N.º "));
    const url = urlSegura(n.enlace);
    return url
      ? `<a class="rs" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${txt} &#8599;</a>`
      : `<span class="rs-txt">${txt}</span>`;
  }

  /** Marca los hijos para que entren escalonados. */
  function escalonar(cont) {
    if (menosMovimiento) return;
    cont.classList.add("stagger");
    [...cont.children].forEach((el, i) => el.style.setProperty("--i", i));
  }

  /* ══════════ RELOJ ══════════ */
  const fmtFecha = new Intl.DateTimeFormat("es-PE", {
    timeZone: ZONA, weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  const fmtHora = new Intl.DateTimeFormat("es-PE", {
    timeZone: ZONA, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });

  let ultimoDia = "";
  let arrancado = false;   // iniciar() ya pinto todo al menos una vez
  function ticTac() {
    const ahora = new Date();
    const dia = fmtFecha.format(ahora);
    if (dia !== ultimoDia) {          // el día cambió en Lima: repintar contadores
      ultimoDia = dia;
      $("tbFecha").textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
      pintarMandato();
      pintarGabinete();
      pintarLectura();
      // Modulos que dependen del dia actual (arrancan como no-op en el
      // primer tic, porque iniciar() aun no ha creado el DOM de todos).
      if (arrancado) {
        pintarKPIs();
        pintarCambios();
        pintarReloj130();
        pintar100();
        pintarTimeline();
        pintarTimelineMini();
        pintarEstabilidad();
      }
    }
    $("tbHora").textContent = fmtHora.format(ahora);
  }

  /* ══════════ CONTADOR ANIMADO ══════════ */
  function contarHasta(el, destino, ms) {
    // El valor final se escribe SIEMPRE primero: si la pestaña está en
    // segundo plano requestAnimationFrame no corre, y el contador debe
    // mostrar el dato correcto aunque la animación nunca se ejecute.
    el.textContent = Math.max(0, destino).toLocaleString("es-PE");
    if (menosMovimiento || destino <= 0) return;

    const t0 = performance.now();
    requestAnimationFrame(function paso(t) {
      const p = Math.min(1, (t - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
      el.textContent = Math.round(destino * eased).toLocaleString("es-PE");
      if (p < 1) requestAnimationFrame(paso);
    });
  }

  /* ══════════ MANDATO ══════════ */
  function pintarMandato() {
    const p = GOVISOR.presidencia;
    const dias = diasEntre(fecha(p.fechaAsuncion), hoyLima());

    $("cargoTxt").textContent = p.cargo || "Presidencia de la República";
    $("nombrePres").textContent = p.nombre || "Sin registrar";
    $("periodoTxt").textContent = [
      p.periodo ? "Periodo " + p.periodo : "",
      p.partido || ""
    ].filter(Boolean).join("  ·  ");

    const retrato = $("retrato");
    const foto = urlSegura(p.foto);
    if (foto) { retrato.style.backgroundImage = `url("${foto}")`; retrato.textContent = ""; }
    else { retrato.textContent = iniciales(p.nombre); }

    $("normaPres").innerHTML = chipNorma(p.norma) + sello(!!p.verificado);

    // Hitos de contexto
    const hitos = p.hitos || [];
    $("hitos").innerHTML = hitos.map((h) =>
      `<div><dt>${esc(h.rotulo)}</dt><dd>${esc(h.valor)}</dd></div>`).join("");

    if (dias == null || dias < 0) {
      $("dias").textContent = "—";
      $("tbDia").textContent = "—";
      $("diasTexto").textContent = "Falta registrar la fecha de asunción.";
      $("barraPie").textContent = "";
      return;
    }

    contarHasta($("dias"), dias, 1100);
    $("tbDia").textContent = dias.toLocaleString("es-PE");
    // Rótulo y pie cortos: la tarjeta KPI no admite frases largas sin
    // desencajarse. El detalle en palabras vive en «El gobierno, en pocas
    // palabras» y en la ficha presidencial.
    $("kpiDiaRot").textContent = `Día ${dias} del Gobierno`;
    $("diasTexto").textContent = `Desde el ${esc(fechaCorta(p.fechaAsuncion))}`;

    // Se asigna directamente: la transición CSS hace la animación, y así
    // el ancho es correcto aunque la pestaña esté en segundo plano.
    const pct = Math.max(0, Math.min(100, (dias / TOTAL_PERIODO) * 100));
    $("barraFill").style.width = pct.toFixed(2) + "%";
    $("barraPie").textContent =
      `${pct.toFixed(1)} % del periodo · restan ${Math.max(0, TOTAL_PERIODO - dias).toLocaleString("es-PE")} días`;
  }

  /* ══════════ GABINETE ══════════ */
  let filtroGab = "todos";

  function pintarGabinete() {
    const hoy = hoyLima();
    const cont = $("tablaGab");
    const todos = GOVISOR.ministerios;

    const lista = todos.filter((m) => {
      if (filtroGab === "todos") return true;
      if (filtroGab === "pendiente") return !m.ministro;
      return m.ministro && m.estado === filtroGab;
    });

    const activos = todos.filter((m) => m.ministro && m.estado === "activo").length;
    $("subGab").textContent = `${activos} de ${todos.length} carteras en funciones`;

    if (!lista.length) {
      cont.innerHTML = '<p class="vac"><b>Sin resultados</b>Ninguna cartera coincide con este filtro.</p>';
      return;
    }

    cont.innerHTML = lista.map((m) => {
      const clase = !m.ministro ? "pendiente" : (m.estado === "cesado" ? "cesado" : "activo");
      const fin = m.estado === "cesado" ? fecha(m.fechaCese) : hoy;
      const dias = diasEntre(fecha(m.fechaNombramiento), fin);

      let badge;
      if (dias == null)               badge = '<span class="dias nulo">sin fecha</span>';
      else if (m.estado === "cesado") badge = `<span class="dias frio">${dias} d · cesó</span>`;
      else                            badge = `<span class="dias">día ${dias}</span>`;

      return `<div class="fila ${clase}">
        <span class="sig">${esc(m.sigla)}</span>
        <span>
          <span class="quien">${esc(m.ministro || "Titular por registrar")}</span>
          <span class="cart">${esc(m.cartera)}</span>
        </span>
        ${badge}
        ${chipNorma(m.norma, true)}
      </div>`;
    }).join("");

    escalonar(cont);
  }

  /* ══════════ NORMAS ══════════ */
  let filtroNorma = "todos", busqueda = "";
  const PASO_NORMAS = 25;              // cuántas normas se añaden por clic
  let normasVisibles = PASO_NORMAS;
  const ORIGEN = {
    congreso:  ["b-con", "Congreso"],
    ejecutivo: ["b-eje", "Ejecutivo"],
    viaje:     ["b-via", "Viaje"]
  };

  function pintarNormas() {
    const cont = $("listaNormas");

    if (!GOVISOR.normas.length) {
      cont.innerHTML = `<p class="vac"><b>Aún no hay normas registradas</b>
        Agrégalas en el arreglo <code>normas</code> de data.js y aparecerán aquí
        con su enlace directo a la fuente.</p>`;
      return;
    }

    const q = busqueda.trim().toLowerCase();
    const lista = GOVISOR.normas
      .filter((n) => filtroNorma === "todos" || n.origen === filtroNorma)
      .filter((n) => !q || `${n.tipo} ${n.numero} ${n.sumilla}`.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => String(b.fecha || "").localeCompare(String(a.fecha || "")));

    if (!lista.length) {
      cont.innerHTML = '<p class="vac"><b>Sin coincidencias</b>Prueba otro filtro o término.</p>';
      return;
    }

    // Tabla en escritorio; el CSS la convierte en tarjetas apiladas en movil.
    const visibles = lista.slice(0, normasVisibles);
    const filas = visibles.map((n) => {
      const [cls, txt] = ORIGEN[n.origen] || ["b-neu", "Otro"];
      const der = n.accion === "derogada" ? '<span class="b b-der">Derogada</span>' : "";
      const titulo = [n.tipo, n.numero].filter(Boolean).join(" N.º ");
      const url = urlSegura(n.enlace);
      const estado = n.verificado
        ? '<span class="b b-ok">Verificado</span>'
        : '<span class="b b-pend">Por verificar</span>';

      const attrs = url
        ? ` data-visor="${esc(url)}" data-titulo="${esc(titulo)}" data-sumilla="${esc(n.sumilla || "")}" tabindex="0" role="link"`
        : "";

      return `<tr${attrs}>
        <td class="n-fec" data-r="Fecha">${esc(fechaCorta(n.fecha) || "—")}</td>
        <td data-r="Tipo"><span class="b ${cls}">${txt}</span></td>
        <td class="n-num" data-r="Número">${esc(n.numero || "—")}</td>
        <td class="n-sum" data-r="Título">${esc(n.sumilla || "Sin sumilla registrada")}${der}</td>
        <td class="n-est" data-r="Estado">${estado}</td>
      </tr>`;
    }).join("");

    const restan = lista.length - visibles.length;
    cont.innerHTML = `<table class="ntab">
      <thead><tr><th>Fecha</th><th>Tipo</th><th>Número</th><th>Título / sumilla</th><th>Estado</th></tr></thead>
      <tbody>${filas}</tbody></table>
      <div class="normas-pie">
        <span class="normas-cnt">Mostrando ${visibles.length} de ${lista.length} normas</span>
        ${restan > 0 ? `<button class="btn-mas" id="masNormas">Ver ${Math.min(restan, PASO_NORMAS)} más</button>` : ""}
      </div>`;
  }

  /* ── Visor de resoluciones ─────────────────────────────────────────
     El Peruano no envia X-Frame-Options ni CSP frame-ancestors, asi que
     el documento oficial puede leerse incrustado. Si el iframe falla, el
     boton "Abrir en El Peruano" siempre queda disponible como salida.
     ------------------------------------------------------------------ */
  let ultimoFoco = null;

  function abrirVisor(url, titulo, sumilla) {
    const seguro = urlSegura(url);
    if (!seguro) return;

    ultimoFoco = document.activeElement;
    $("visorTitulo").textContent = titulo || "Documento oficial";
    $("visorSumilla").textContent = sumilla || "";
    $("visorAbrir").href = seguro;
    $("visorCargando").classList.remove("oculto");

    const frame = $("visorFrame");
    frame.src = seguro;
    frame.onload = () => $("visorCargando").classList.add("oculto");

    $("visor").hidden = false;
    document.body.classList.add("sin-scroll");
    $("visorAbrir").focus();
  }

  function cerrarVisor() {
    $("visor").hidden = true;
    $("visorFrame").src = "about:blank";   // detiene la carga y libera memoria
    document.body.classList.remove("sin-scroll");
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  /** El foco no debe escaparse del diálogo mientras está abierto. */
  function atraparFoco(ev) {
    if (ev.key !== "Tab" || $("visor").hidden) return;
    const caja = document.querySelector(".visor-caja");
    if (!caja) return;
    const foco = caja.querySelectorAll('a[href],button,input,iframe,[tabindex]:not([tabindex="-1"])');
    if (!foco.length) return;
    const primero = foco[0], ultimo = foco[foco.length - 1];
    if (ev.shiftKey && document.activeElement === primero) { ev.preventDefault(); ultimo.focus(); }
    else if (!ev.shiftKey && document.activeElement === ultimo) { ev.preventDefault(); primero.focus(); }
  }

  /* ══════════ LECTURA RÁPIDA (estadística con letras) ══════════ */
  function pintarLectura() {
    const p = GOVISOR.presidencia;
    const dias = diasEntre(fecha(p.fechaAsuncion), hoyLima());
    const mins = GOVISOR.ministerios;
    const conNombre = mins.filter((m) => m.ministro).length;
    const cesados = mins.filter((m) => m.estado === "cesado").length;

    const leyes = GOVISOR.normas.filter((n) => n.origen === "congreso").length;
    const ejec  = GOVISOR.normas.filter((n) => n.origen === "ejecutivo").length;
    const verif = GOVISOR.normas.filter((n) => n.verificado).length;
    const totalN = GOVISOR.normas.length;

    const tarjetas = [
      ["Mandato", (dias == null || dias < 0)
        ? "La fecha de inicio aún no está registrada."
        : `Lleva <b>${esc(enPalabras(dias))}</b> en el cargo, sobre un periodo de cinco años.`],

      ["Gabinete", cesados
        ? `<b>${palabra(conNombre - cesados)}</b> carteras en funciones y <b>${palabra(cesados)}</b> con cambio de titular.`
        : `Las <b>${palabra(conNombre)}</b> carteras mantienen a su titular original, sin cambios desde la juramentación.`],

      // Frases sin verbo entre las cifras: evita problemas de concordancia
      // cuando alguno de los conteos es cero.
      ["Producción normativa", (leyes + ejec) === 0
        ? "Todavía no se registran normas del periodo."
        : `Normas registradas: <b>${palabra(leyes)}</b> del Congreso y <b>${palabra(ejec)}</b> del Ejecutivo.`],

      ["Trazabilidad", totalN === 0
        ? "Cada registro llevará su enlace directo a la fuente oficial."
        : verif === 0
          ? `Ninguna de las ${totalN === 1 ? "normas" : palabra(totalN) + " normas"} registradas ha sido contrastada todavía.`
          : verif === totalN
            ? "Todas las normas registradas están contrastadas con su fuente."
            : `<b>${palabra(verif)}</b> de ${palabra(totalN)} normas contrastadas con la fuente oficial.`]
    ];

    const cont = $("lectura");
    cont.innerHTML = tarjetas.map(([t, x]) =>
      `<article class="lec"><h3>${esc(t)}</h3><p>${x}</p></article>`).join("");
    escalonar(cont);
  }

  /* ══════════ VIAJES ══════════ */
  function pintarViajes() {
    const cont = $("viajes");
    $("cntViajes").textContent = GOVISOR.viajes.length
      ? `${GOVISOR.viajes.length} registrado(s)` : "Sin registros";

    if (!GOVISOR.viajes.length) {
      cont.innerHTML = `<p class="vac"><b>Sin viajes registrados</b>
        Las salidas al exterior de la Presidencia requieren autorización del
        Congreso mediante Resolución Legislativa.</p>`;
      return;
    }
    cont.innerHTML = GOVISOR.viajes.map((v) => `
      <article class="viaje">
        <h3>${esc(v.destino || "Destino por registrar")}</h3>
        <p><b>${esc(v.quien || "—")}</b> · ${esc(v.motivo || "Motivo no registrado")}</p>
        <p>${esc(fechaCorta(v.desde))}${v.hasta ? " al " + esc(fechaCorta(v.hasta)) : ""}</p>
        <div class="chips">${chipNorma(v.norma)}${sello(!!v.verificado)}</div>
      </article>`).join("");
  }

  /* ══════════ FUENTES ══════════ */
  /** Siglas cortas para el icono de cada fuente, derivadas del nombre. */
  function siglaFuente(nombre) {
    const n = String(nombre).toUpperCase();
    if (n.includes("PERUANO")) return "EP";
    if (n.includes("CONGRESO")) return "CR";
    if (n.includes("SPIJ")) return "SP";
    if (n.includes("CONSEJO DE MINISTROS")) return "PCM";
    if (n.includes("ELECCIONES")) return "JNE";
    if (n.includes("MEF")) return "MEF";
    if (n.includes("INEI")) return "INEI";
    if (n.includes("BCRP")) return "BCR";
    if (n.includes("DEFENSOR")) return "DP";
    if (n.includes("GOB.PE")) return "PE";
    return n.slice(0, 2);
  }

  function pintarFuentes() {
    $("fuentes").innerHTML = GOVISOR.fuentes.map((f) => {
      const url = urlSegura(f.url);
      if (!url) return "";
      return `<a class="fuente" href="${esc(url)}" target="_blank" rel="noopener noreferrer">
        <span class="fuente-ico" aria-hidden="true">${esc(siglaFuente(f.nombre))}</span>
        <span><b>${esc(f.nombre)}</b><span>${esc(f.nota || "")}</span></span>
        <span class="fuente-ext" aria-hidden="true">↗</span>
        <span class="sr-only">(se abre en una pestaña nueva)</span></a>`;
    }).join("");
  }

  /* ══════════ NOTICIAS ══════════ */
  let feedActivo = 0, noticiasCargadas = false;
  const urlFeed = (q) => GOVISOR.noticias.plantilla.replace("{Q}", encodeURIComponent(q));

  function pintarFiltrosNoticias() {
    $("fNoticias").innerHTML = GOVISOR.noticias.feeds.map((f, i) =>
      `<button class="chip ${i === feedActivo ? "on" : ""}" data-feed="${i}">${esc(f.nombre)}</button>`).join("");
  }

  async function cargarNoticias() {
    const cont = $("noticias");
    const feed = GOVISOR.noticias.feeds[feedActivo];
    if (!feed) return;
    noticiasCargadas = true;

    const rss = urlFeed(feed.query);
    const proxy = GOVISOR.noticias.proxy;

    if (!proxy) {
      cont.innerHTML = `<p class="vac"><b>Lectura directa desactivada</b>
        <a href="${esc(rss)}" target="_blank" rel="noopener noreferrer">Abrir "${esc(feed.nombre)}" en Google Noticias &#8599;</a></p>`;
      return;
    }

    cont.innerHTML = '<p class="vac">Cargando titulares…</p>';
    try {
      const r = await fetch(proxy + encodeURIComponent(rss));
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();
      const items = data.items || [];
      if (!items.length) throw new Error("el agregador no devolvió titulares");

      cont.innerHTML = items.slice(0, 9).map((it) => {
        const url = urlSegura(it.link);
        const corte = String(it.title || "").lastIndexOf(" - ");
        const titular = corte > 0 ? it.title.slice(0, corte) : (it.title || "Sin título");
        const medio = corte > 0 ? it.title.slice(corte + 3) : (it.author || "");
        const cuando = it.pubDate
          ? new Intl.DateTimeFormat("es-PE", {
              timeZone: ZONA, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
            }).format(new Date(String(it.pubDate).replace(" ", "T") + "Z"))
          : "";
        const cuerpo = `<h3>${esc(titular)}</h3>
          <p class="nota-meta"><b>${esc(medio)}</b> ${esc(cuando)}</p>`;
        return url
          ? `<a class="nota" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${cuerpo}</a>`
          : `<div class="nota">${cuerpo}</div>`;
      }).join("");
      escalonar(cont);
    } catch (e) {
      cont.innerHTML = `<p class="vac"><b>No se pudieron cargar los titulares</b>
        ${esc(e.message)}. Abre el feed directamente:
        <a href="${esc(rss)}" target="_blank" rel="noopener noreferrer">${esc(feed.nombre)} &#8599;</a></p>`;
    }
  }

  /* ══════════ YOUTUBE ══════════ */
  let ytConsulta = 0;
  const leerClave = () => { try { return localStorage.getItem(CLAVE_YT) || ""; } catch { return ""; } };

  function estadoYT(msg, tipo) {
    const el = $("ytEstado");
    el.textContent = msg;
    el.className = "yt-estado" + (tipo ? " " + tipo : "");
  }

  function pintarFiltrosYT() {
    $("fYt").innerHTML = GOVISOR.youtube.consultas.map((q, i) =>
      `<button class="chip ${i === ytConsulta ? "on" : ""}" data-yt="${i}">${esc(q)}</button>`).join("");
  }

  async function cargarYouTube() {
    const key = leerClave();
    const cont = $("ytGrid");
    if (!key) {
      cont.innerHTML = '<p class="vac">Ingresa tu API key para cargar videos.</p>';
      return;
    }

    const q = GOVISOR.youtube.consultas[ytConsulta] || "";
    cont.innerHTML = '<p class="vac">Buscando videos…</p>';

    const url = "https://www.googleapis.com/youtube/v3/search"
      + "?part=snippet&type=video&maxResults=9&order=date&relevanceLanguage=es&regionCode=PE"
      + "&q=" + encodeURIComponent(q) + "&key=" + encodeURIComponent(key);

    try {
      const r = await fetch(url);
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error((data.error && data.error.message) || ("HTTP " + r.status));

      const items = data.items || [];
      if (!items.length) {
        estadoYT("Consulta sin resultados.", "");
        cont.innerHTML = '<p class="vac">Sin videos para esta consulta.</p>';
        return;
      }
      estadoYT(`Clave activa · ${items.length} videos.`, "ok");
      cont.innerHTML = items.map((it) => {
        const id = it.id && it.id.videoId;
        if (!id) return "";
        const s = it.snippet || {}, th = s.thumbnails || {};
        const thumb = urlSegura((th.medium && th.medium.url) || (th.default && th.default.url));
        const cuando = s.publishedAt
          ? new Intl.DateTimeFormat("es-PE", { timeZone: ZONA, day: "numeric", month: "short", year: "numeric" })
              .format(new Date(s.publishedAt))
          : "";
        return `<a class="vid" href="https://www.youtube.com/watch?v=${encodeURIComponent(id)}"
                   target="_blank" rel="noopener noreferrer">
          ${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy">` : ""}
          <div><h3>${esc(s.title || "Sin título")}</h3>
          <p>${esc(s.channelTitle || "")} · ${esc(cuando)}</p></div></a>`;
      }).join("");
      escalonar(cont);
    } catch (e) {
      estadoYT("Error: " + e.message, "err");
      cont.innerHTML = `<p class="vac"><b>No se pudo consultar YouTube</b>
        ${esc(e.message)}<br>Verifica que la clave tenga habilitada la YouTube Data API v3
        y que sus restricciones de referente permitan este sitio.</p>`;
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     MÓDULOS DEL OBSERVATORIO
     Todo lo que sigue se CALCULA a partir de los datos ya verificados.
     Ninguna cifra se estima: si el dato no está cargado, el módulo lo dice.
     ══════════════════════════════════════════════════════════════════ */

  const EV_ROTULO = {
    oficial: "Oficial", verificado: "Verificado",
    preliminar: "Preliminar", investigacion: "En investigación"
  };
  /** Etiqueta de nivel de evidencia. Sin nivel declarado, no se inventa. */
  function sellEv(nivel) {
    if (!nivel || !EV_ROTULO[nivel]) return "";
    return `<span class="ev ev-${esc(nivel)}">${EV_ROTULO[nivel]}</span>`;
  }

  /** Igual que fechaLarga pero recibe un Date ya construido. */
  function fechaLargaD(d) {
    return d ? new Intl.DateTimeFormat("es-PE", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    }).format(d) : "";
  }

  /* ── Línea de tiempo derivada ───────────────────────────────────────
     Se construye desde la asunción, los nombramientos, los ceses, las
     normas, los viajes y los eventos manuales. Los nombramientos que
     comparten fecha se agrupan para no inundar la línea.
     ------------------------------------------------------------------ */
  function construirLinea() {
    const items = [];
    const p = GOVISOR.presidencia;

    if (p.fechaAsuncion) {
      items.push({
        fecha: p.fechaAsuncion, tipo: "hito",
        titulo: "Asunción del mando",
        detalle: `${p.nombre} juramenta como ${p.cargo}.`,
        enlace: p.norma && p.norma.enlace, ev: p.evidencia
      });
    }

    // Nombramientos agrupados por fecha
    const porFecha = {};
    GOVISOR.ministerios.forEach((m) => {
      if (!m.fechaNombramiento) return;
      if (!porFecha[m.fechaNombramiento]) porFecha[m.fechaNombramiento] = [];
      porFecha[m.fechaNombramiento].push(m);
    });
    Object.keys(porFecha).forEach((f) => {
      const g = porFecha[f];
      items.push({
        fecha: f, tipo: "nombramiento",
        titulo: g.length > 1
          ? `Juramentación de ${g.length} ministros`
          : `Nombramiento en ${g[0].cartera}`,
        detalle: g.length > 1 ? g.map((x) => x.sigla).join(" · ") : g[0].ministro,
        grupo: g.length > 1 ? g.length : 0,
        ev: "oficial"
      });
    });

    // Ceses
    GOVISOR.ministerios
      .filter((m) => m.estado === "cesado" && m.fechaCese)
      .forEach((m) => items.push({
        fecha: m.fechaCese, tipo: "cese",
        titulo: `Cese en ${m.cartera}`, detalle: m.ministro, ev: m.evidencia
      }));

    // Normas
    GOVISOR.normas.forEach((n) => {
      if (!n.fecha) return;
      items.push({
        fecha: n.fecha, tipo: "norma",
        titulo: [n.tipo, n.numero].filter(Boolean).join(" N.º "),
        detalle: n.sumilla, enlace: n.enlace, ev: n.evidencia
      });
    });

    // Viajes
    GOVISOR.viajes.forEach((v) => {
      if (!v.desde) return;
      items.push({
        fecha: v.desde, tipo: "viaje",
        titulo: `Viaje oficial · ${v.destino || "destino por registrar"}`,
        detalle: v.motivo, ev: v.evidencia
      });
    });

    // Eventos manuales
    GOVISOR.eventos.forEach((e) => {
      if (!e.fecha) return;
      items.push({
        fecha: e.fecha, tipo: e.tipo || "otro", titulo: e.titulo,
        detalle: e.detalle, enlace: e.enlace, ev: e.evidencia
      });
    });

    return items.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
  }

  /* ── ¿Qué cambió? ─────────────────────────────────────────────────── */
  const VENTANA_DIAS = 7;

  function pintarCambios() {
    const hoy = hoyLima();
    const linea = construirLinea();
    const cont = $("cambios24");

    const recientes = linea.filter((i) => {
      const d = diasEntre(fecha(i.fecha), hoy);
      return d != null && d >= 0 && d <= VENTANA_DIAS;
    });

    const PIP = {
      nombramiento: "naranja", cese: "rojo", norma: "azul",
      viaje: "verde", hito: "verde", crisis: "rojo", anuncio: "ambar"
    };

    // Icono ademas del color: el estado no se comunica solo con color.
    const ICO = {
      nombramiento:"👤", cese:"⨯", norma:"📄", viaje:"✈",
      hito:"🏛", crisis:"!", anuncio:"◆", otro:"•"
    };
    const fila = (i) => {
      const d = diasEntre(fecha(i.fecha), hoy);
      const cuando = d === 0 ? "hoy" : d === 1 ? "ayer" : `hace ${d} días`;
      const url = urlSegura(i.enlace);
      const tit = url
        ? `<a href="${esc(url)}" data-visor="${esc(url)}" data-titulo="${esc(i.titulo)}" data-sumilla="${esc(i.detalle || "")}">${esc(i.titulo)}</a>`
        : esc(i.titulo);
      return `<li>
        <span class="pip pip-${PIP[i.tipo] || "naranja"}" aria-hidden="true">${ICO[i.tipo] || "•"}</span>
        <span class="cambio-t"><b>${tit}</b>
        <time>${cuando} · ${esc(fechaCorta(i.fecha))}</time></span>
        ${sellEv(i.ev)}
      </li>`;
    };

    if (recientes.length) {
      $("cambiosVentana").textContent = `Últimos ${VENTANA_DIAS} días`;
      cont.innerHTML = recientes.slice(0, 6).map(fila).join("");
    } else {
      // Sin movimientos en la ventana: se dice, y se muestra lo último real.
      $("cambiosVentana").textContent = "Sin movimientos recientes";
      cont.innerHTML = `<li><span class="pip pip-ambar"></span>
        <span><b>Sin cambios registrados en los últimos ${VENTANA_DIAS} días.</b>
        <time>Lo más reciente en el visor:</time></span></li>` +
        linea.slice(0, 3).map(fila).join("");
    }
    escalonar(cont);
  }

  /* ── Reloj constitucional: artículo 130 ────────────────────────────
     «Dentro de los treinta días de haber asumido sus funciones, el
     Presidente del Consejo concurre al Congreso [...] y plantea cuestión
     de confianza.»  El plazo se calcula sobre la fecha real de asunción.
     ------------------------------------------------------------------ */
  const PLAZO_ART130 = 30;

  function pintarReloj130() {
    const box = $("reloj130");
    const inicio = fecha(GOVISOR.presidencia.fechaAsuncion);
    const inv = (GOVISOR.congreso && GOVISOR.congreso.investidura) || {};
    const base = `<p class="r130-base">Constitución, art. 130 — plazo de ${PLAZO_ART130} días desde la asunción.</p>`;

    if (!inicio) {
      box.innerHTML = `<div class="r130-cab"><h2>Cuestión de confianza</h2></div>
        <p class="r130-txt">Falta registrar la fecha de asunción.</p>${base}`;
      return;
    }

    // Ya ocurrió la investidura: el reloj se detiene y muestra el resultado.
    if (inv.fecha) {
      const res = inv.resultado === "confianza_otorgada" ? "Confianza otorgada"
                : inv.resultado === "confianza_rehusada" ? "Confianza rehusada"
                : "Resultado por registrar";
      const v = inv.votos || {};
      const votos = (v.si != null || v.no != null)
        ? `<p class="r130-txt">Votación: ${esc(v.si)} a favor · ${esc(v.no)} en contra · ${esc(v.abstenciones)} abstenciones.</p>`
        : "";
      box.innerHTML = `<div class="r130-cab"><h2>Cuestión de confianza</h2>${sellEv(inv.evidencia)}</div>
        <p class="r130-cifra" style="font-size:1.5rem">${esc(res)}</p>
        <p class="r130-txt">Exposición ante el Pleno el ${esc(fechaLarga(inv.fecha))}.</p>${votos}${base}`;
      return;
    }

    const limite = new Date(inicio.getTime() + PLAZO_ART130 * 86400000);
    const restan = diasEntre(hoyLima(), limite);

    if (restan < 0) {
      box.innerHTML = `<div class="r130-cab"><h2>Cuestión de confianza</h2></div>
        <p class="r130-cifra vencido">${Math.abs(restan)}<i>días vencido</i></p>
        <p class="r130-txt">El plazo constitucional venció el ${esc(fechaLargaD(limite))}
        y el visor aún no registra la exposición ante el Congreso.</p>${base}`;
      return;
    }

    box.innerHTML = `<div class="r130-cab"><h2>Cuestión de confianza</h2></div>
      <p class="r130-cifra">${restan}<i>${restan === 1 ? "día restante" : "días restantes"}</i></p>
      <p class="r130-txt">El Presidente del Consejo de Ministros debe exponer la política
      general del Gobierno ante el Congreso, a más tardar el
      <b>${esc(fechaLargaD(limite))}</b>.</p>${base}`;
  }

  /* ── Primeros 100 días ─────────────────────────────────────────────── */
  function pintar100() {
    const dias = diasEntre(fecha(GOVISOR.presidencia.fechaAsuncion), hoyLima());
    const med = GOVISOR.medidas100 || [];

    if (dias == null || dias < 0) {
      $("d100Dia").textContent = "—";
      $("d100Pie").textContent = "Falta registrar la fecha de asunción.";
      return;
    }

    const enCurso = dias <= 100;
    $("d100Dia").textContent = Math.min(dias, 100);
    $("d100Sub").textContent = enCurso ? "Días transcurridos" : "Etapa concluida";

    const pct = Math.min(100, (dias / 100) * 100);
    $("d100Fill").style.width = pct.toFixed(1) + "%";
    pintarAnillo(pct);
    $("d100Pie").textContent = enCurso
      ? `${pct.toFixed(0)} % de la etapa transcurrido.`
      : `La etapa de los primeros 100 días concluyó; el Gobierno lleva ${dias} días.`;

    const cuenta = (e) => med.filter((m) => m.estado === e).length;
    $("d100Semaforo").innerHTML = med.length
      ? `<span class="sem sem-verde">🟢 <b>${cuenta("ejecutada")}</b> ejecutadas</span>
         <span class="sem sem-ambar">🟡 <b>${cuenta("en_proceso")}</b> en proceso</span>
         <span class="sem sem-rojo">🔴 <b>${cuenta("no_iniciada")}</b> no iniciadas</span>`
      : `<span class="sem">Sin medidas registradas</span>`;

    $("medidas100").innerHTML = med.length
      ? med.map((m) => `<div class="medida ${esc(m.estado || "")}">
          <span class="sig">${esc(m.sector || "—")}</span>
          <span><span class="medida-t">${esc(m.titulo)}</span>
          <span class="medida-d">${esc(m.detalle || "")}</span></span>
          ${sellEv(m.evidencia)}
        </div>`).join("")
      : `<p class="vac"><b>Sin medidas cargadas</b>
         Este bloque necesita la lista de medidas efectivamente anunciadas para los
         primeros 100 días. Cárgalas en <code>medidas100</code> de data.js y el
         semáforo se calcula solo. El contador de días ya es real.</p>`;
  }

  /* ── Promesas vs. realidad ─────────────────────────────────────────── */
  let filtroPromesa = "todos";
  const EST_PROMESA = {
    cumplida: "Cumplida", en_proceso: "En proceso",
    no_iniciada: "No iniciada", incumplida: "Incumplida"
  };

  function pintarFiltrosPromesas() {
    const claves = ["todos"].concat(Object.keys(EST_PROMESA));
    $("fPromesas").innerHTML = claves.map((k) =>
      `<button class="chip ${k === filtroPromesa ? "on" : ""}" data-fprom="${k}">${
        k === "todos" ? "Todas" : EST_PROMESA[k]}</button>`).join("");
  }

  function pintarPromesas() {
    const cont = $("listaPromesas");
    const todas = GOVISOR.promesas || [];

    if (!todas.length) {
      cont.innerHTML = `<p class="vac"><b>Sin promesas registradas todavía</b>
        Este es el módulo central del observatorio y exige contrastar cinco cosas por
        cada promesa: qué se prometió, qué se anunció, qué norma se publicó, qué
        presupuesto se asignó y qué resultado se verificó.<br><br>
        Se alimenta del plan de gobierno inscrito ante el JNE, del Mensaje a la Nación
        del 28/07/2026 y de la exposición de política general del PCM ante el Congreso.
        GoVisor no infiere promesas: deben transcribirse de la fuente.</p>`;
      return;
    }

    const lista = filtroPromesa === "todos"
      ? todas : todas.filter((p) => p.estado === filtroPromesa);

    if (!lista.length) {
      cont.innerHTML = '<p class="vac"><b>Sin coincidencias</b>No hay promesas en ese estado.</p>';
      return;
    }

    const eslabon = (rotulo, valor, url) => {
      if (!valor) return `<div class="eslabon vacio"><b>${rotulo}</b><span>sin registro</span></div>`;
      const u = urlSegura(url);
      const txt = u
        ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(valor)} &#8599;</a>`
        : esc(valor);
      return `<div class="eslabon"><b>${rotulo}</b><span>${txt}</span></div>`;
    };

    cont.innerHTML = lista.map((p) => {
      const ev = (p.evidencia && p.evidencia.length) ? p.evidencia[p.evidencia.length - 1] : null;
      const norma = p.norma && p.norma.numero
        ? [p.norma.tipo, p.norma.numero].filter(Boolean).join(" N.º ") : "";
      return `<article class="promesa ${esc(p.estado || "")}">
        <div class="n-cab">
          <span class="b b-neu">${esc(EST_PROMESA[p.estado] || "Sin estado")}</span>
          <span class="sig">${esc(p.sector || "—")}</span>
          ${sellEv(p.nivel)}
        </div>
        <h3>${esc(p.promesa)}</h3>
        <div class="cadena">
          ${eslabon("Dijo", p.origen && p.origen.tipo, p.origen && p.origen.enlace)}
          ${eslabon("Hizo", ev && ev.que, ev && ev.enlace)}
          ${eslabon("Normó", norma, p.norma && p.norma.enlace)}
          ${eslabon("Presupuestó", p.presupuesto)}
          ${eslabon("Resultado", p.resultado)}
        </div>
      </article>`;
    }).join("");
    escalonar(cont);
  }

  /* ── Línea de tiempo ───────────────────────────────────────────────── */
  let filtroLinea = "todos";
  const TIPOS_LINEA = {
    todos: "Todo", nombramiento: "Nombramientos", norma: "Normas",
    cese: "Ceses", viaje: "Viajes", hito: "Hitos"
  };

  function pintarFiltrosLinea() {
    $("fLinea").innerHTML = Object.keys(TIPOS_LINEA).map((k) =>
      `<button class="chip ${k === filtroLinea ? "on" : ""}" data-flinea="${k}">${TIPOS_LINEA[k]}</button>`).join("");
  }

  function pintarTimeline() {
    const cont = $("timeline");
    const todos = construirLinea();
    $("lineaSub").textContent = `${todos.length} hitos desde el inicio del mandato`;

    const lista = filtroLinea === "todos"
      ? todos : todos.filter((i) => i.tipo === filtroLinea);

    if (!lista.length) {
      cont.innerHTML = '<li class="vac"><b>Sin hitos</b>No hay eventos de ese tipo registrados.</li>';
      return;
    }

    cont.innerHTML = lista.slice(0, 40).map((i) => {
      const d = diasEntre(fecha(GOVISOR.presidencia.fechaAsuncion), fecha(i.fecha));
      const dia = (d != null && d >= 0) ? `<b>Día ${d}</b> · ` : "";
      const url = urlSegura(i.enlace);
      const titulo = url
        ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(i.titulo)} &#8599;</a>`
        : esc(i.titulo);
      const grupo = i.grupo ? `<span class="tl-agrupado">${i.grupo} resoluciones</span>` : "";
      return `<li class="tl t-${esc(i.tipo)}">
        <p class="tl-fecha">${dia}${esc(fechaCorta(i.fecha))} ${sellEv(i.ev)}</p>
        <p class="tl-t">${titulo}</p>
        ${i.detalle ? `<p class="tl-d">${esc(i.detalle)}</p>` : ""}
        ${grupo}
      </li>`;
    }).join("");
    escalonar(cont);
  }

  /* ── Índice de estabilidad del gabinete ────────────────────────────── */
  function calcEstabilidad() {
    const ms = GOVISOR.ministerios;
    const hoy = hoyLima();
    const inicio = GOVISOR.presidencia.fechaAsuncion;

    const cesados = ms.filter((m) => m.estado === "cesado").length;
    const originales = ms.filter((m) =>
      m.fechaNombramiento === inicio && m.estado === "activo").length;

    const duraciones = ms
      .filter((m) => m.fechaNombramiento)
      .map((m) => diasEntre(fecha(m.fechaNombramiento),
        m.estado === "cesado" ? fecha(m.fechaCese) : hoy))
      .filter((d) => d != null);
    const prom = duraciones.length
      ? Math.round(duraciones.reduce((a, b) => a + b, 0) / duraciones.length) : null;

    // Rotación: cuántos titulares ha tenido cada cartera
    const rot = {};
    ms.forEach((m) => { rot[m.sigla] = (rot[m.sigla] || 0) + 1; });
    let peor = null, max = 0;
    Object.keys(rot).forEach((s) => { if (rot[s] > max) { max = rot[s]; peor = s; } });

    return { carteras: Object.keys(rot).length, cesados, originales, prom, peor, max };
  }

  function pintarEstabilidad() {
    const e = calcEstabilidad();
    const rotTxt = e.max > 1
      ? `${esc(e.peor)} <small>${e.max} titulares</small>`
      : `Ninguna <small>sin relevos</small>`;

    $("estabilidad").innerHTML = `
      <div class="est"><dt>Titulares originales</dt><dd>${e.originales}<small> / ${e.carteras}</small></dd></div>
      <div class="est"><dt>Relevos</dt><dd>${e.cesados}</dd></div>
      <div class="est"><dt>Permanencia media</dt><dd>${e.prom == null ? "—" : e.prom}<small> días</small></dd></div>
      <div class="est"><dt>Mayor rotación</dt><dd style="font-size:.85rem">${rotTxt}</dd></div>`;
  }

  /* ── Gobierno y Congreso ───────────────────────────────────────────── */
  function pintarCongreso() {
    const c = GOVISOR.congreso || {};
    const total = (c.interpelaciones || []).length + (c.censuras || []).length
      + (c.confianza || []).length + (c.facultades || []).length
      + (c.proyectosEjecutivo || []).length;
    $("cntCongreso").textContent = total ? `${total} registro(s)` : "Sin registros";

    const bloque = (titulo, arr, cols, fila) => {
      if (!arr || !arr.length) {
        return `<h4 style="font-size:.78rem;margin:10px 0 4px">${titulo}</h4>
          <p class="fine">Sin registros.</p>`;
      }
      return `<h4 style="font-size:.78rem;margin:10px 0 4px">${titulo}</h4>
        <div class="mini-wrap"><table class="mini"><thead><tr>${
          cols.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${arr.map(fila).join("")}</tbody></table></div>`;
    };

    $("congresoBox").innerHTML =
      `<p class="fine">La Constitución (art. 130) obliga al Presidente del Consejo de
       Ministros a exponer la política general ante el Congreso dentro de los 30 días de
       asumir, y a plantear cuestión de confianza. El reloj de ese plazo está arriba.</p>` +
      bloque("Interpelaciones", c.interpelaciones, ["Ministro", "Sector", "Fecha", "Resultado"],
        (x) => `<tr><td>${esc(x.ministro)}</td><td>${esc(x.sector)}</td><td>${esc(fechaCorta(x.fecha))}</td><td>${esc(x.resultado || "—")}</td></tr>`) +
      bloque("Mociones de censura", c.censuras, ["Ministro", "Fecha", "Votos", "Resultado"],
        (x) => `<tr><td>${esc(x.ministro)}</td><td>${esc(fechaCorta(x.fecha))}</td><td>${esc(x.votos || "—")}</td><td>${esc(x.resultado || "—")}</td></tr>`) +
      bloque("Facultades legislativas", c.facultades, ["Materia", "Plazo", "Otorgada"],
        (x) => `<tr><td>${esc(x.materia)}</td><td>${esc(x.plazo || "—")}</td><td>${x.otorgada ? "Sí" : "No"}</td></tr>`) +
      bloque("Proyectos del Ejecutivo", c.proyectosEjecutivo, ["N.º", "Título", "Sector", "Estado"],
        (x) => `<tr><td>${esc(x.numero)}</td><td>${esc(x.titulo)}</td><td>${esc(x.sector)}</td><td>${esc(x.estado || "—")}</td></tr>`);
  }

  /* ── Radar de nombramientos (más allá del gabinete) ────────────────── */
  function pintarCargos() {
    const cargos = GOVISOR.altosCargos || [];
    $("cntCargos").textContent = cargos.length ? `${cargos.length} cargo(s)` : "Solo gabinete";

    if (!cargos.length) {
      $("cargosBox").innerHTML = `<p class="vac"><b>Solo el gabinete está cargado</b>
        El radar cubre viceministros, secretarios generales, jefes de organismos y
        titulares de empresas públicas. Esos nombramientos se publican como R.M. y R.S.
        en El Peruano; cárgalos en <code>altosCargos</code> de data.js. Las 19 carteras
        ministeriales ya están en la sección Gabinete.</p>`;
      return;
    }

    const hoy = hoyLima();
    $("cargosBox").innerHTML = `<div class="mini-wrap"><table class="mini">
      <thead><tr><th>Nombre</th><th>Cargo</th><th>Entidad</th><th>Días</th><th>Norma</th></tr></thead>
      <tbody>${cargos.map((c) => {
        const d = diasEntre(fecha(c.desde), c.hasta ? fecha(c.hasta) : hoy);
        return `<tr><td>${esc(c.nombre)}</td><td>${esc(c.cargo)}</td>
          <td>${esc(c.entidad || "—")}</td><td>${d == null ? "—" : d}</td>
          <td>${chipNorma(c.norma, true)}</td></tr>`;
      }).join("")}</tbody></table></div>`;
  }

  /* ── Presupuesto ───────────────────────────────────────────────────── */
  function pintarPpto() {
    const p = GOVISOR.presupuesto || {};
    const sec = p.sectores || [];
    $("cntPpto").textContent = sec.length ? `${sec.length} sector(es)` : "Sin datos";

    const u = urlSegura(p.url);
    const fuente = u
      ? `<p class="fine">Fuente: <a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(p.fuente)} &#8599;</a></p>`
      : "";

    if (!sec.length) {
      $("pptoBox").innerHTML = `<p class="vac"><b>Sin cifras presupuestales cargadas</b>
        GoVisor no estima presupuesto: las cifras de PIA, PIM y devengado deben tomarse
        de la Consulta Amigable del MEF y actualizarse periódicamente. Una cifra
        inventada aquí sería peor que un vacío.</p>${fuente}`;
      return;
    }

    const fmt = (n) => n == null ? "—" : "S/ " + Number(n).toLocaleString("es-PE");
    $("pptoBox").innerHTML = `<div class="mini-wrap"><table class="mini">
      <thead><tr><th>Sector</th><th>PIA</th><th>PIM</th><th>Devengado</th><th>% ejec.</th></tr></thead>
      <tbody>${sec.map((s) => {
        const pct = (s.pim && s.devengado != null) ? (s.devengado / s.pim * 100) : null;
        return `<tr><td><b>${esc(s.sigla)}</b></td><td>${fmt(s.pia)}</td>
          <td>${fmt(s.pim)}</td><td>${fmt(s.devengado)}</td>
          <td>${pct == null ? "—" : pct.toFixed(1) + " %"}</td></tr>`;
      }).join("")}</tbody></table></div>
      ${p.actualizado ? `<p class="fine">Actualizado al ${esc(fechaLarga(p.actualizado))}.</p>` : ""}${fuente}`;
  }

  /* ── Metodología ───────────────────────────────────────────────────── */
  function pintarMetodologia() {
    $("metodologia").innerHTML = `<div class="meto">
      <p>GoVisor distingue entre lo que está probado documentalmente y lo que no.
      Cada registro lleva una etiqueta de nivel de evidencia:</p>
      <p style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0">
        ${sellEv("oficial")} ${sellEv("verificado")} ${sellEv("preliminar")} ${sellEv("investigacion")}
      </p>
      <ul>
        <li><b>Oficial</b> — publicado en El Peruano, el Congreso o una entidad del Estado.</li>
        <li><b>Verificado</b> — contrastado con dos fuentes independientes.</li>
        <li><b>Preliminar</b> — reportado por prensa, sin documento oficial todavía.</li>
        <li><b>En investigación</b> — denuncia o proceso en curso. <b>No es un hecho probado.</b></li>
      </ul>
      <h4>Qué se calcula y qué se carga a mano</h4>
      <ul>
        <li><b>Se calcula en vivo</b> desde los datos verificados: días de mandato, día
        de los primeros 100, plazo del artículo 130, línea de tiempo, índice de
        estabilidad, permanencia por ministro y «qué cambió».</li>
        <li><b>Se carga a mano</b>, porque exige contrastar fuente por fuente: promesas,
        medidas de los 100 días, presupuesto, actos del Congreso y altos cargos.</li>
      </ul>
      <h4>Nombres propios</h4>
      <p>Se transcriben tal como figuran en la resolución, no como aparecen en la prensa.
      Por eso el visor dice «Kosme Sheput» y «Arnillas Gonzales».</p>
      <h4>Lo que este visor no hace</h4>
      <p>No estima cifras, no infiere promesas y no publica denuncias como si fueran
      hechos. Cuando un dato falta, lo dice.</p>
    </div>`;
  }

  /* ══════════════════════════════════════════════════════════════════════
     SELECTORES DERIVADOS
     La portada NO duplica valores en el HTML: los deriva de GOVISOR.
     ══════════════════════════════════════════════════════════════════ */
  const sel = {
    diaGobierno: () => diasEntre(fecha(GOVISOR.presidencia.fechaAsuncion), hoyLima()),
    avance100:   () => { const d = sel.diaGobierno();
                         return d == null ? null : Math.min(100, Math.max(0, d)); },
    ministrosActivos: () => GOVISOR.ministerios.filter((m) => m.ministro && m.estado === "activo"),
    ministrosVerificados: () => GOVISOR.ministerios.filter((m) => m.verificado).length,
    normas:      () => GOVISOR.normas || [],
    normasVerificadas: () => sel.normas().filter((n) => n.verificado).length,
    promesas:    () => GOVISOR.promesas || [],
    promesasConNorma: () => sel.promesas().filter((p) => p.norma && p.norma.numero).length,
    promesasConEvidencia: () => sel.promesas().filter((p) => p.evidencia && p.evidencia.length).length
  };

  /* ── Tarjetas KPI del héroe ────────────────────────────────────────── */
  function pintarKPIs() {
    // 1) Día del Gobierno y 2) 100 días los pinta pintarMandato()/pintar100().

    // 3) Consejo de Ministros — con el rango real de R.S. de nombramiento.
    const act = sel.ministrosActivos().length;
    const ver = sel.ministrosVerificados();
    $("kpiGab").textContent = act || "—";

    const nums = GOVISOR.ministerios
      .map((m) => m.norma && m.norma.numero)
      .filter(Boolean)
      .map((s) => ({ n: parseInt(s, 10), s }))
      .filter((x) => !isNaN(x.n))
      .sort((a, b) => a.n - b.n);
    const rango = nums.length
      ? (nums.length > 1
          ? `R.S. ${nums[0].n}–${nums[nums.length - 1].s}`
          : `R.S. ${nums[0].s}`)
      : "";

    $("kpiGabSub").innerHTML = act
      ? `${ver} titulares verificados${rango ? `<br>${esc(rango)}` : ""}`
      : "Sin titulares registrados";

    // 4) Normas del periodo — nunca se inventa una cifra.
    const n = sel.normas().length;
    const kn = $("kpiNormas");
    if (n) {
      kn.textContent = n.toLocaleString("es-PE");
      kn.parentElement.classList.remove("kpi-val-sm");
      $("kpiNormasSub").innerHTML =
        `${sel.normasVerificadas()} con enlace verificado<br><a href="#normas">Ver sección de normas</a>`;
    } else {
      kn.textContent = "En registro";
      kn.parentElement.classList.add("kpi-val-sm");
      $("kpiNormasSub").innerHTML = '<a href="#normas">Ver sección de normas</a>';
    }
  }

  /** Anillo de avance de los 100 días (SVG, r=18 → circunferencia ≈113). */
  function pintarAnillo(pct) {
    const CIRC = 2 * Math.PI * 18;
    const p = Math.max(0, Math.min(100, pct || 0));
    $("anilloFill").style.strokeDashoffset = String(CIRC - (CIRC * p) / 100);
    $("anilloPct").textContent = Math.round(p) + "%";
  }

  /* ── Resumen de promesas (tres eslabones) ──────────────────────────── */
  function pintarPromesasResumen() {
    const t = sel.promesas().length;
    const cont = $("promesasResumen");

    const bloque = (icono, rotulo, valor, sub) =>
      `<div class="c3"><p class="c3-rot"><span aria-hidden="true">${icono}</span> ${rotulo}</p>
       <p class="c3-val">${esc(valor)}</p><p class="c3-sub">${esc(sub)}</p></div>`;

    if (!t) {
      cont.innerHTML =
        bloque("💬", "Lo que dijo", "En registro", "Compromisos del Mensaje a la Nación") +
        bloque("📋", "Lo que normó", "En registro", "Normas ligadas a compromisos") +
        bloque("✓", "Lo que ejecutó", "En registro", "Acciones y resultados");
      $("promesasNota").textContent = "Información en construcción. Sin datos inventados.";
      return;
    }

    const conNorma = sel.promesasConNorma();
    const conEv = sel.promesasConEvidencia();
    cont.innerHTML =
      bloque("💬", "Lo que dijo", t, t === 1 ? "compromiso registrado" : "compromisos registrados") +
      bloque("📋", "Lo que normó", conNorma || "Sin evidencia", conNorma ? "con norma publicada" : "ninguna norma vinculada aún") +
      bloque("✓", "Lo que ejecutó", conEv || "Sin evidencia", conEv ? "con acción verificada" : "sin evidencia suficiente");

    $("promesasNota").textContent = conEv
      ? `${conEv} de ${t} promesas tienen evidencia de ejecución registrada.`
      : `Las ${t} promesas están registradas; aún no hay evidencia de ejecución.`;
  }

  /* ── Timeline compacto de portada ──────────────────────────────────── */
  function pintarTimelineMini() {
    const items = construirLinea().slice(0, 4);
    const cont = $("timelineMini");
    if (!items.length) {
      cont.innerHTML = '<li class="t">Sin hitos registrados.</li>';
      return;
    }
    const filas = items.map((i) =>
      `<li><span class="f">${esc(fechaCorta(i.fecha))}</span>
       <span class="t">${esc(i.titulo)}</span></li>`).join("");

    // Estado en curso: solo si los 100 días siguen corriendo (dato real).
    const d = sel.diaGobierno();
    const curso = (d != null && d >= 0 && d <= 100)
      ? `<li class="curso"><span class="f">En curso</span>
         <span class="t">Primeros 100 días de gestión</span></li>` : "";
    cont.innerHTML = filas + curso;
  }

  /* ── Consejo de Ministros: 3 representativos ───────────────────────── */
  function pintarGabineteResumen() {
    const cont = $("gabineteResumen");
    // PCM primero, luego MEF e Interior si existen; si no, los tres primeros.
    const orden = ["PCM", "MEF", "MININTER"];
    const activos = sel.ministrosActivos();
    const elegidos = orden
      .map((s) => activos.find((m) => m.sigla === s))
      .filter(Boolean);
    while (elegidos.length < 3 && activos.length > elegidos.length) {
      const sig = activos.find((m) => !elegidos.includes(m));
      if (!sig) break;
      elegidos.push(sig);
    }

    if (!elegidos.length) {
      cont.innerHTML = '<li><span class="t">Sin titulares registrados.</span></li>';
      return;
    }

    cont.innerHTML = elegidos.map((m) => {
      const foto = urlSegura(m.foto);
      // Sin foto oficial se usan iniciales: no se fabrican retratos.
      const av = foto
        ? `<span class="avatar" style="background-image:url('${esc(foto)}')" aria-hidden="true"></span>`
        : `<span class="avatar" aria-hidden="true">${esc(iniciales(m.ministro))}</span>`;
      return `<li>${av}<span><b>${esc(m.ministro)}</b>
        <span>${esc(m.cartera)}</span></span></li>`;
    }).join("");
  }

  /* ══════════ EVENTOS ══════════ */
  function marcar(grupo, btn) {
    grupo.querySelectorAll(".chip").forEach((c) => {
      c.classList.remove("on");
      if (c.hasAttribute("aria-pressed")) c.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("on");
    if (btn.hasAttribute("aria-pressed")) btn.setAttribute("aria-pressed", "true");
  }

  /* ── Cabecera: menú móvil, desplegable "Más" y navegación activa ───── */
  function conectarCabecera() {
    const menuBtn = $("menuBtn"), nav = $("navPral");
    const masBtn = $("masBtn"), masMenu = $("masMenu");

    menuBtn.addEventListener("click", () => {
      const abierto = nav.classList.toggle("abierto");
      menuBtn.setAttribute("aria-expanded", String(abierto));
    });

    masBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const abierto = masMenu.hidden;
      masMenu.hidden = !abierto;
      masBtn.setAttribute("aria-expanded", String(abierto));
    });

    document.addEventListener("click", (ev) => {
      if (!masMenu.hidden && !ev.target.closest(".mas")) {
        masMenu.hidden = true;
        masBtn.setAttribute("aria-expanded", "false");
      }
      // Al elegir una sección en móvil, se cierra el menú.
      const enlace = ev.target.closest(".nav a");
      if (enlace && nav.classList.contains("abierto")) {
        nav.classList.remove("abierto");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (ev) => {
      if (ev.key !== "Escape") return;
      if (!masMenu.hidden) { masMenu.hidden = true; masBtn.setAttribute("aria-expanded", "false"); }
      if (nav.classList.contains("abierto")) {
        nav.classList.remove("abierto"); menuBtn.setAttribute("aria-expanded", "false");
      }
    });

    // Navegación activa según la sección visible.
    const enlaces = [...document.querySelectorAll(".nav a[data-nav]")];
    const secciones = enlaces.map((a) => document.getElementById(a.dataset.nav)).filter(Boolean);
    if (!secciones.length || !("IntersectionObserver" in window)) return;

    const obs = new IntersectionObserver((ent) => {
      ent.forEach((e) => {
        if (!e.isIntersecting) return;
        enlaces.forEach((a) => a.classList.toggle("activo", a.dataset.nav === e.target.id));
      });
    }, { rootMargin: "-88px 0px -62% 0px", threshold: 0 });
    secciones.forEach((s) => obs.observe(s));
  }

  function conectar() {
    // ── Visor: abrir/cerrar ──
    document.addEventListener("click", (ev) => {
      if (ev.target.closest("[data-cerrar-visor]")) { cerrarVisor(); return; }

      // Ctrl/Cmd/medio: respetar el comportamiento normal de abrir pestana.
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button === 1) return;

      const enNorma = ev.target.closest("[data-visor]");
      if (enNorma) {
        ev.preventDefault();
        abrirVisor(enNorma.dataset.visor, enNorma.dataset.titulo, enNorma.dataset.sumilla);
        return;
      }
      // Chips de Resolucion Suprema en gabinete, viajes y radar de cargos.
      const enRS = ev.target.closest("a.rs");
      if (enRS && enRS.href) {
        ev.preventDefault();
        abrirVisor(enRS.href, enRS.textContent.replace(/[↗\s]+$/, "").trim(), "");
      }
    });

    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && !$("visor").hidden) cerrarVisor();
      atraparFoco(ev);
    });

    // Las filas de la tabla de normas son "enlaces": Enter debe activarlas.
    document.addEventListener("keydown", (ev) => {
      if (ev.key !== "Enter") return;
      const fila = ev.target.closest("tr[data-visor]");
      if (!fila) return;
      ev.preventDefault();
      abrirVisor(fila.dataset.visor, fila.dataset.titulo, fila.dataset.sumilla);
    });

    // Paginación de la tabla de normas.
    document.addEventListener("click", (ev) => {
      if (!ev.target.closest("#masNormas")) return;
      normasVisibles += PASO_NORMAS;
      pintarNormas();
    });

    document.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".chip");
      if (!btn) return;
      const d = btn.dataset;
      if (d.fgab)        { filtroGab = d.fgab;     marcar(btn.parentElement, btn); pintarGabinete(); }
      else if (d.fnorma) { filtroNorma = d.fnorma; normasVisibles = PASO_NORMAS;
                           marcar(btn.parentElement, btn); pintarNormas(); }
      else if (d.fprom)  { filtroPromesa = d.fprom; marcar(btn.parentElement, btn); pintarPromesas(); }
      else if (d.flinea) { filtroLinea = d.flinea; marcar(btn.parentElement, btn); pintarTimeline(); }
      else if (d.feed)   { feedActivo = +d.feed;   marcar(btn.parentElement, btn); cargarNoticias(); }
      else if (d.yt)     { ytConsulta = +d.yt;     marcar(btn.parentElement, btn); cargarYouTube(); }
    });

    let temp;
    $("buscar").addEventListener("input", (ev) => {
      clearTimeout(temp);
      const v = ev.target.value;
      temp = setTimeout(() => { busqueda = v; normasVisibles = PASO_NORMAS; pintarNormas(); }, 170);
    });

    $("ytGuardar").addEventListener("click", () => {
      const v = $("ytKey").value.trim();
      if (!v) { estadoYT("Escribe una clave antes de guardar.", "err"); return; }
      try {
        localStorage.setItem(CLAVE_YT, v);
        estadoYT("Clave guardada en este navegador. Consultando…", "ok");
        cargarYouTube();
      } catch { estadoYT("Este navegador bloquea el almacenamiento local.", "err"); }
    });

    $("ytBorrar").addEventListener("click", () => {
      try { localStorage.removeItem(CLAVE_YT); } catch { /* sin acción */ }
      $("ytKey").value = "";
      estadoYT("Clave borrada de este navegador.", "");
      $("ytGrid").innerHTML = '<p class="vac">Ingresa tu API key para cargar videos.</p>';
    });

    // Las noticias solo se piden cuando el usuario abre el acordeón.
    document.querySelectorAll(".acor").forEach((ac) => {
      ac.addEventListener("toggle", () => {
        if (ac.open && ac.querySelector("#noticias") && !noticiasCargadas) cargarNoticias();
      });
    });
  }

  /* ══════════ ANIMACIÓN AL ENTRAR EN PANTALLA ══════════ */
  function observarEntradas() {
    const secciones = document.querySelectorAll(".anim");
    if (menosMovimiento || !("IntersectionObserver" in window)) {
      secciones.forEach((s) => s.classList.add("in"));
      return;
    }
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    secciones.forEach((s) => obs.observe(s));
  }

  /* ══════════ ARRANQUE ══════════ */
  function iniciar() {
    const m = GOVISOR.meta;
    $("marcaTitulo").textContent = m.titulo;
    $("marcaSub").textContent = m.subtitulo;
    $("pieAct").textContent = fechaLarga(m.ultimaActualizacion) || "—";
    if (m.aviso) { $("avisoTxt").textContent = m.aviso; $("avisoBar").hidden = false; }

    pintarMandato();
    pintarLectura();
    pintarGabinete();
    pintarNormas();
    pintarViajes();
    pintarFuentes();

    // Portada: KPIs y tablero, todo derivado de GOVISOR
    pintarKPIs();
    pintarPromesasResumen();
    pintarTimelineMini();
    pintarGabineteResumen();

    // Módulos del observatorio
    pintarCambios();
    pintarReloj130();
    pintar100();
    pintarFiltrosPromesas();
    pintarPromesas();
    pintarFiltrosLinea();
    pintarTimeline();
    pintarEstabilidad();
    pintarCongreso();
    pintarCargos();
    pintarPpto();
    pintarMetodologia();

    pintarFiltrosNoticias();
    pintarFiltrosYT();

    const key = leerClave();
    if (key) { $("ytKey").value = key; estadoYT("Clave cargada desde este navegador.", "ok"); }

    conectar();
    conectarCabecera();
    observarEntradas();
    arrancado = true;
    ticTac();
    setInterval(ticTac, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else { iniciar(); }
})();
