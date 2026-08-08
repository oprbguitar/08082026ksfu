/* ============================================================================
   GoVisor — lógica del visor estratégico
   Lee la global GOVISOR (data.js) y pinta el portal. Sin dependencias.
   ========================================================================== */
(function () {
  "use strict";

  const ZONA = "America/Lima";
  const CLAVE_YT = "govisor.youtube.key";
  const TOTAL_PERIODO = 1826;              // 5 años ≈ 1826 días
  const $ = (id) => document.getElementById(id);
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
  function ticTac() {
    const ahora = new Date();
    const dia = fmtFecha.format(ahora);
    if (dia !== ultimoDia) {          // el día cambió en Lima: repintar contadores
      ultimoDia = dia;
      $("tbFecha").textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
      pintarMandato();
      pintarGabinete();
      pintarLectura();
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
    $("diasTexto").innerHTML =
      `<b>${esc(enPalabras(dias))}</b> desde el ${esc(fechaLarga(p.fechaAsuncion))}`;

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

    cont.innerHTML = lista.map((n) => {
      const [cls, txt] = ORIGEN[n.origen] || ["b-neu", "Otro"];
      const der = n.accion === "derogada" ? '<span class="b b-der">Derogada</span>' : "";
      const cuerpo = `
        <div class="n-cab">
          <span class="n-num">${esc([n.tipo, n.numero].filter(Boolean).join(" N.º "))}</span>
          <span class="b ${cls}">${txt}</span>${der}
        </div>
        <p class="n-sum">${esc(n.sumilla || "Sin sumilla registrada")}</p>
        <p class="n-pie">${esc(fechaCorta(n.fecha) || "sin fecha")} · ${n.verificado ? "verificada" : "por verificar"}</p>`;
      const url = urlSegura(n.enlace);
      return url
        ? `<a class="norma" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${cuerpo}</a>`
        : `<div class="norma">${cuerpo}</div>`;
    }).join("");

    escalonar(cont);
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
  function pintarFuentes() {
    $("fuentes").innerHTML = GOVISOR.fuentes.map((f) => {
      const url = urlSegura(f.url);
      return url ? `<a class="fuente" href="${esc(url)}" target="_blank" rel="noopener noreferrer">
        <b>${esc(f.nombre)} &#8599;</b><span>${esc(f.nota || "")}</span></a>` : "";
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

  /* ══════════ EVENTOS ══════════ */
  function marcar(grupo, btn) {
    grupo.querySelectorAll(".chip").forEach((c) => c.classList.remove("on"));
    btn.classList.add("on");
  }

  function conectar() {
    document.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".chip");
      if (!btn) return;
      const d = btn.dataset;
      if (d.fgab)        { filtroGab = d.fgab;     marcar(btn.parentElement, btn); pintarGabinete(); }
      else if (d.fnorma) { filtroNorma = d.fnorma; marcar(btn.parentElement, btn); pintarNormas(); }
      else if (d.feed)   { feedActivo = +d.feed;   marcar(btn.parentElement, btn); cargarNoticias(); }
      else if (d.yt)     { ytConsulta = +d.yt;     marcar(btn.parentElement, btn); cargarYouTube(); }
    });

    let temp;
    $("buscar").addEventListener("input", (ev) => {
      clearTimeout(temp);
      const v = ev.target.value;
      temp = setTimeout(() => { busqueda = v; pintarNormas(); }, 170);
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
    pintarFiltrosNoticias();
    pintarFiltrosYT();

    const key = leerClave();
    if (key) { $("ytKey").value = key; estadoYT("Clave cargada desde este navegador.", "ok"); }

    conectar();
    observarEntradas();
    ticTac();
    setInterval(ticTac, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else { iniciar(); }
})();
