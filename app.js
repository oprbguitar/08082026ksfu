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

  /* Los formateadores se construyen en cada llamada porque el locale
     depende del idioma activo. La zona horaria siempre es Lima. */
  function fechaLarga(iso) {
    const f = fecha(iso);
    return f ? new Intl.DateTimeFormat(I18N.locale, {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    }).format(f) : "";
  }

  function fechaCorta(iso) {
    const f = fecha(iso);
    return f ? new Intl.DateTimeFormat(I18N.locale, {
      day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC"
    }).format(f) : "";
  }

  const numero = (n) => Number(n).toLocaleString(I18N.locale);

  /** Días -> frase legible. */
  function enPalabras(d) {
    if (d == null) return "";
    if (d === 0) return t("t.hoyMismo");
    if (d === 1) return t("t.unDia");
    const a = Math.floor(d / 365), r = d % 365, m = Math.floor(r / 30), x = r % 30;
    const p = [];
    if (a) p.push(a === 1 ? t("t.anio") : t("t.anios", { n: a }));
    if (m) p.push(m === 1 ? t("t.mes") : t("t.meses", { n: m }));
    if (x && !a) p.push(x === 1 ? t("t.unDiaN") : t("t.diasN", { n: x }));
    return p.join(", ") || t("t.diasN", { n: d });
  }

  // Numeros en letra, para la seccion "en pocas palabras".
  const PALABRAS = {
    es: ["ninguna","una","dos","tres","cuatro","cinco","seis","siete","ocho","nueve",
         "diez","once","doce","trece","catorce","quince","dieciséis","diecisiete",
         "dieciocho","diecinueve","veinte"],
    en: ["none","one","two","three","four","five","six","seven","eight","nine",
         "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen",
         "seventeen","eighteen","nineteen","twenty"]
  };
  function palabra(n) {
    const L = PALABRAS[I18N.idioma] || PALABRAS.es;
    return (n >= 0 && n < L.length) ? L[n] : String(n);
  }

  function iniciales(n) {
    const p = String(n || "").trim().split(/\s+/).filter(Boolean);
    return p.length ? ((p[0][0] || "") + (p[1] ? p[1][0] : "")).toUpperCase() : "··";
  }

  const sello = (ok) => ok
    ? `<span class="b b-ok">${t("b.verificado")}</span>`
    : `<span class="b b-pend">${t("b.porVerificar")}</span>`;

  /** Chip de norma: enlace si hay URL, texto plano si solo hay número. */
  function chipNorma(n, corto) {
    if (!n || (!n.numero && !n.tipo)) return `<span class="rs-txt">${t("n.sinResolucion")}</span>`;
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
  const fmtFecha = () => new Intl.DateTimeFormat(I18N.locale, {
    timeZone: ZONA, weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  const fmtHora = () => new Intl.DateTimeFormat(I18N.locale, {
    timeZone: ZONA, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  });

  let ultimoDia = "";
  let arrancado = false;   // iniciar() ya pinto todo al menos una vez
  function ticTac() {
    const ahora = new Date();
    const dia = fmtFecha().format(ahora);
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
    $("tbHora").textContent = fmtHora().format(ahora);
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

    $("cargoTxt").textContent = p.cargo || "";
    $("nombrePres").textContent = p.nombre || "Sin registrar";
    $("periodoTxt").textContent = [
      p.periodo || "",
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
      $("diasTexto").textContent = t("d.faltaFecha");
      $("barraPie").textContent = "";
      return;
    }

    contarHasta($("dias"), dias, 1100);
    $("tbDia").textContent = dias.toLocaleString("es-PE");
    // Rótulo y pie cortos: la tarjeta KPI no admite frases largas sin
    // desencajarse. El detalle en palabras vive en «El gobierno, en pocas
    // palabras» y en la ficha presidencial.
    $("kpiDiaRot").textContent = t("kpi.diaN", { n: dias });
    $("diasTexto").textContent = t("kpi.desde", { f: fechaCorta(p.fechaAsuncion) });

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
    $("subGab").textContent = t("sec.carteras", { a: activos, b: todos.length });

    if (!lista.length) {
      cont.innerHTML = `<p class="vac"><b>${t("tn.sinResultados")}</b>${t("tn.ningunaCartera")}</p>`;
      return;
    }

    cont.innerHTML = lista.map((m) => {
      const clase = !m.ministro ? "pendiente" : (m.estado === "cesado" ? "cesado" : "activo");
      const fin = m.estado === "cesado" ? fecha(m.fechaCese) : hoy;
      const dias = diasEntre(fecha(m.fechaNombramiento), fin);

      let badge;
      if (dias == null)               badge = `<span class="dias nulo">${t("e.sinFecha")}</span>`;
      else if (m.estado === "cesado") badge = `<span class="dias frio">${t("e.enCargo", { n: dias })}</span>`;
      else                            badge = `<span class="dias">${t("e.diaN", { n: dias })}</span>`;

      return `<div class="fila ${clase}">
        <span class="sig">${esc(m.sigla)}</span>
        <span>
          <span class="quien">${esc(m.ministro || t("n.titularSR"))}</span>
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
    congreso:  ["b-con", "f.congreso"],
    ejecutivo: ["b-eje", "f.ejecutivo"],
    viaje:     ["b-via", "f.viajes"]
  };

  function pintarNormas() {
    const cont = $("listaNormas");

    if (!GOVISOR.normas.length) {
      cont.innerHTML = `<p class="vac"><b>${t("tn.sinNormas")}</b>${t("tn.sinNormasTxt")}</p>`;
      return;
    }

    const q = busqueda.trim().toLowerCase();
    const lista = GOVISOR.normas
      .filter((n) => filtroNorma === "todos" || n.origen === filtroNorma)
      .filter((n) => !q || `${n.tipo} ${n.numero} ${n.sumilla}`.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => String(b.fecha || "").localeCompare(String(a.fecha || "")));

    if (!lista.length) {
      cont.innerHTML = `<p class="vac"><b>${t("tn.sinCoincidencias")}</b>${t("tn.otroFiltro")}</p>`;
      return;
    }

    // Tabla en escritorio; el CSS la convierte en tarjetas apiladas en movil.
    const visibles = lista.slice(0, normasVisibles);
    const filas = visibles.map((n) => {
      const [cls, clave] = ORIGEN[n.origen] || ["b-neu", "b.otro"];
      const txt = t(clave);
      const der = n.accion === "derogada" ? `<span class="b b-der">${t("b.derogada")}</span>` : "";
      const titulo = [n.tipo, n.numero].filter(Boolean).join(" N.º ");
      const url = urlSegura(n.enlace);
      const estado = sello(!!n.verificado);

      const attrs = url
        ? ` data-visor="${esc(url)}" data-titulo="${esc(titulo)}" data-sumilla="${esc(n.sumilla || "")}" tabindex="0" role="link"`
        : "";

      return `<tr${attrs}>
        <td class="n-fec" data-r="${esc(t("tn.fecha"))}">${esc(fechaCorta(n.fecha) || "—")}</td>
        <td data-r="${esc(t("tn.tipo"))}"><span class="b ${cls}">${esc(txt)}</span></td>
        <td class="n-num" data-r="${esc(t("tn.numero"))}">${esc(n.numero || "—")}</td>
        <td class="n-sum" data-r="${esc(t("tn.titulo"))}">${esc(n.sumilla || t("n.sinSumilla"))}${der}</td>
        <td class="n-est" data-r="${esc(t("tn.estado"))}">${estado}</td>
      </tr>`;
    }).join("");

    const restan = lista.length - visibles.length;
    cont.innerHTML = `<table class="ntab">
      <thead><tr><th>${t("tn.fecha")}</th><th>${t("tn.tipo")}</th><th>${t("tn.numero")}</th><th>${t("tn.titulo")}</th><th>${t("tn.estado")}</th></tr></thead>
      <tbody>${filas}</tbody></table>
      <div class="normas-pie">
        <span class="normas-cnt">${t("tn.mostrando", { a: visibles.length, b: lista.length })}</span>
        ${restan > 0 ? `<button class="btn-mas" id="masNormas">${t("tn.verMas", { n: Math.min(restan, PASO_NORMAS) })}</button>` : ""}
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
    $("visorTitulo").textContent = titulo || t("v.documento");
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
      [t("l.mandato"), (dias == null || dias < 0)
        ? t("l.mandatoSF")
        : t("l.mandatoTxt", { t: esc(enPalabras(dias)) })],

      [t("l.gabinete"), cesados
        ? t("l.gabineteCon", { a: palabra(conNombre - cesados), b: palabra(cesados) })
        : t("l.gabineteSin", { n: palabra(conNombre) })],

      // Frases sin verbo entre las cifras: evita problemas de concordancia
      // cuando alguno de los conteos es cero.
      [t("l.produccion"), (leyes + ejec) === 0
        ? t("l.produccionSin")
        : t("l.produccionCon", { a: palabra(leyes), b: palabra(ejec) })],

      [t("l.trazabilidad"), totalN === 0
        ? t("l.trazaVacio")
        : verif === 0
          ? t("l.trazaCero", { n: palabra(totalN) })
          : verif === totalN
            ? t("l.trazaTodas")
            : t("l.trazaParte", { a: palabra(verif), b: palabra(totalN) })]
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
      ? t("s.registros", { n: GOVISOR.viajes.length }) : t("s.sinRegistros");

    if (!GOVISOR.viajes.length) {
      cont.innerHTML = `<p class="vac"><b>${t("sv.sinViajes")}</b>${t("sv.txt")}</p>`;
      return;
    }
    cont.innerHTML = GOVISOR.viajes.map((v) => `
      <article class="viaje">
        <h3>${esc(v.destino || t("sv.destinoSR"))}</h3>
        <p><b>${esc(v.quien || "—")}</b> · ${esc(v.motivo || t("sv.motivoSR"))}</p>
        <p>${esc(fechaCorta(v.desde))}${v.hasta ? t("sv.al") + esc(fechaCorta(v.hasta)) : ""}</p>
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

    cont.innerHTML = `<p class="vac">${t("nt.cargando")}</p>`;
    try {
      const r = await fetch(proxy + encodeURIComponent(rss));
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();
      const items = data.items || [];
      if (!items.length) throw new Error(t("nt.sinItems"));

      cont.innerHTML = items.slice(0, 9).map((it) => {
        const url = urlSegura(it.link);
        const corte = String(it.title || "").lastIndexOf(" - ");
        const titular = corte > 0 ? it.title.slice(0, corte) : (it.title || t("nt.sinTitulo"));
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
      cont.innerHTML = `<p class="vac">${t("yt.ingresa")}</p>`;
      return;
    }

    const q = GOVISOR.youtube.consultas[ytConsulta] || "";
    cont.innerHTML = `<p class="vac">${t("yt.buscando")}</p>`;

    const url = "https://www.googleapis.com/youtube/v3/search"
      + "?part=snippet&type=video&maxResults=9&order=date&relevanceLanguage=es&regionCode=PE"
      + "&q=" + encodeURIComponent(q) + "&key=" + encodeURIComponent(key);

    try {
      const r = await fetch(url);
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error((data.error && data.error.message) || ("HTTP " + r.status));

      const items = data.items || [];
      if (!items.length) {
        estadoYT(t("yt.sinResultados"), "");
        cont.innerHTML = `<p class="vac">${t("yt.sinVideos")}</p>`;
        return;
      }
      estadoYT(t("yt.activa", { n: items.length }), "ok");
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
      cont.innerHTML = `<p class="vac"><b>${t("yt.errorTit")}</b>
        ${esc(e.message)}<br>${t("yt.errorTxt")}</p>`;
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     MÓDULOS DEL OBSERVATORIO
     Todo lo que sigue se CALCULA a partir de los datos ya verificados.
     Ninguna cifra se estima: si el dato no está cargado, el módulo lo dice.
     ══════════════════════════════════════════════════════════════════ */

  const EV_CLAVES = ["oficial", "verificado", "preliminar", "investigacion"];
  /** Etiqueta de nivel de evidencia. Sin nivel declarado, no se inventa. */
  function sellEv(nivel) {
    if (!nivel || EV_CLAVES.indexOf(nivel) < 0) return "";
    return `<span class="ev ev-${esc(nivel)}">${t("ev." + nivel)}</span>`;
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
        titulo: t("tl.asuncion"),
        detalle: t("tl.juraTxt", { n: p.nombre, c: p.cargo }),
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
          ? t("tl.juraN", { n: g.length })
          : t("tl.nombraEn", { c: g[0].cartera }),
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
        titulo: t("tl.ceseEn", { c: m.cartera }), detalle: m.ministro, ev: m.evidencia
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
        titulo: t("tl.viajeA", { d: v.destino || t("tl.destinoSR") }),
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
      const cuando = d === 0 ? t("t.hoy") : d === 1 ? t("t.ayer") : t("t.haceN", { n: d });
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
      $("cambiosVentana").textContent = t("c.ventana", { n: VENTANA_DIAS });
      cont.innerHTML = recientes.slice(0, 6).map(fila).join("");
    } else {
      // Sin movimientos en la ventana: se dice, y se muestra lo último real.
      $("cambiosVentana").textContent = t("c.sinMov");
      cont.innerHTML = `<li><span class="pip pip-ambar"></span>
        <span class="cambio-t"><b>${t("c.sinCambios", { n: VENTANA_DIAS })}</b>
        <time>${t("c.loMasReciente")}</time></span></li>` +
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
    const base = `<p class="r130-base">${t("r130.base", { n: PLAZO_ART130 })}</p>`;

    if (!inicio) {
      box.innerHTML = `<div class="r130-cab"><h2>${t("r130.titulo")}</h2></div>
        <p class="r130-txt">${t("d.faltaFecha")}</p>${base}`;
      return;
    }

    // Ya ocurrió la investidura: el reloj se detiene y muestra el resultado.
    if (inv.fecha) {
      const res = inv.resultado === "confianza_otorgada" ? t("r130.otorgada")
                : inv.resultado === "confianza_rehusada" ? t("r130.rehusada")
                : t("r130.porRegistrar");
      const v = inv.votos || {};
      const votos = (v.si != null || v.no != null)
        ? `<p class="r130-txt">${t("r130.votacion", { a: esc(v.si), b: esc(v.no), c: esc(v.abstenciones) })}</p>`
        : "";
      box.innerHTML = `<div class="r130-cab"><h2>${t("r130.titulo")}</h2>${sellEv(inv.evidencia)}</div>
        <p class="r130-cifra" style="font-size:1.5rem">${esc(res)}</p>
        <p class="r130-txt">${t("r130.exposicion", { f: esc(fechaLarga(inv.fecha)) })}</p>${votos}${base}`;
      return;
    }

    const limite = new Date(inicio.getTime() + PLAZO_ART130 * 86400000);
    const restan = diasEntre(hoyLima(), limite);

    if (restan < 0) {
      box.innerHTML = `<div class="r130-cab"><h2>${t("r130.titulo")}</h2></div>
        <p class="r130-cifra vencido">${Math.abs(restan)}<i>${t("r130.vencido")}</i></p>
        <p class="r130-txt">${t("r130.vencidoTxt", { f: esc(fechaLargaD(limite)) })}</p>${base}`;
      return;
    }

    box.innerHTML = `<div class="r130-cab"><h2>${t("r130.titulo")}</h2></div>
      <p class="r130-cifra">${restan}<i>${restan === 1 ? t("r130.restante") : t("r130.restantes")}</i></p>
      <p class="r130-txt">${t("r130.txt", { f: esc(fechaLargaD(limite)) })}</p>
      <p class="r130-txt">${t("r130.bicameral")}</p>${base}`;
  }

  /* ── Primeros 100 días ─────────────────────────────────────────────── */
  function pintar100() {
    const dias = diasEntre(fecha(GOVISOR.presidencia.fechaAsuncion), hoyLima());
    const med = GOVISOR.medidas100 || [];

    if (dias == null || dias < 0) {
      $("d100Dia").textContent = "—";
      $("d100Pie").textContent = t("d.faltaFecha");
      return;
    }

    const enCurso = dias <= 100;
    $("d100Dia").textContent = Math.min(dias, 100);
    $("d100Sub").textContent = enCurso ? t("kpi.transcurridos") : t("kpi.concluida");

    const pct = Math.min(100, (dias / 100) * 100);
    $("d100Fill").style.width = pct.toFixed(1) + "%";
    pintarAnillo(pct);
    $("d100Pie").textContent = enCurso
      ? t("d.pct", { p: pct.toFixed(0) })
      : t("d.concluida", { n: dias });

    const cuenta = (e) => med.filter((m) => m.estado === e).length;
    $("d100Semaforo").innerHTML = med.length
      ? `<span class="sem sem-verde">🟢 <b>${cuenta("ejecutada")}</b> ${t("d.ejecutadas")}</span>
         <span class="sem sem-ambar">🟡 <b>${cuenta("en_proceso")}</b> ${t("d.enProceso")}</span>
         <span class="sem sem-rojo">🔴 <b>${cuenta("no_iniciada")}</b> ${t("d.noIniciadas")}</span>`
      : `<span class="sem">${t("d.sinMedidas")}</span>`;

    $("medidas100").innerHTML = med.length
      ? med.map((m) => {
          const u = urlSegura(m.enlace);
          const titulo = u
            ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(m.titulo)} &#8599;</a>`
            : esc(m.titulo);
          const nota = m.nota ? `<span class="medida-n">${esc(m.nota)}</span>` : "";
          return `<div class="medida ${esc(m.estado || "")}">
          <span class="sig">${esc(m.sector || "—")}</span>
          <span><span class="medida-t">${titulo}</span>
          <span class="medida-d">${esc(m.detalle || "")}</span>${nota}</span>
          ${sellEv(m.evidencia)}
        </div>`;
        }).join("")
      : `<p class="vac"><b>${t("d.sinMedidasT")}</b>${t("d.sinMedidasTxt")}</p>`;
  }

  /* ── Promesas vs. realidad ─────────────────────────────────────────── */
  let filtroPromesa = "todos";
  const EST_PROMESA = ["cumplida", "en_proceso", "no_iniciada", "incumplida"];

  function pintarFiltrosPromesas() {
    const claves = ["todos"].concat(EST_PROMESA);
    $("fPromesas").innerHTML = claves.map((k) =>
      `<button class="chip ${k === filtroPromesa ? "on" : ""}" data-fprom="${k}"
        aria-pressed="${k === filtroPromesa}">${
        k === "todos" ? t("f.todas") : t("p." + k)}</button>`).join("");
  }

  function pintarPromesas() {
    const cont = $("listaPromesas");
    const todas = GOVISOR.promesas || [];

    if (!todas.length) {
      cont.innerHTML = `<p class="vac"><b>${t("pv.titulo")}</b>${t("pv.txt")}</p>`;
      return;
    }

    const lista = filtroPromesa === "todos"
      ? todas : todas.filter((p) => p.estado === filtroPromesa);

    if (!lista.length) {
      cont.innerHTML = `<p class="vac"><b>${t("tn.sinCoincidencias")}</b>${t("pv.sinCoincidencias")}</p>`;
      return;
    }

    /* Documentación que valida el anuncio: se contrasto una por una y se
       lista aqui para que el lector pueda comprobarlo sin salir del visor. */
    const docFuentes = (fs) => {
      if (!Array.isArray(fs) || !fs.length) return "";
      const links = fs.map((f) => {
        const u = urlSegura(f && f.u);
        return u
          ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(f.n || u)} &#8599;</a>`
          : "";
      }).filter(Boolean).join("");
      return links
        ? `<p class="prom-doc"><b>${t("p.documentacion", { n: fs.length })}</b>${links}</p>`
        : "";
    };

    const eslabon = (rotulo, valor, url) => {
      if (!valor) return `<div class="eslabon vacio"><b>${rotulo}</b><span>${t("p.sinRegistro")}</span></div>`;
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
          <span class="b b-neu">${esc(p.estado ? t("p." + p.estado) : t("p.sinEstado"))}</span>
          <span class="sig">${esc(p.sector || "—")}</span>
          ${sellEv(p.nivel)}
        </div>
        <h3>${esc(p.promesa)}</h3>
        <div class="cadena">
          ${eslabon(t("p.dijo"), p.origen && p.origen.tipo, p.origen && p.origen.enlace)}
          ${eslabon(t("p.hizo"), ev && ev.que, ev && ev.enlace)}
          ${eslabon(t("p.normo"), norma, p.norma && p.norma.enlace)}
          ${eslabon(t("p.presupuesto"), p.presupuesto)}
          ${eslabon(t("p.resultado"), p.resultado)}
        </div>
        ${docFuentes(p.fuentes)}
      </article>`;
    }).join("");
    escalonar(cont);
  }

  /* ── Línea de tiempo ───────────────────────────────────────────────── */
  let filtroLinea = "todos";
  const TIPOS_LINEA = ["todos", "nombramiento", "norma", "cese", "viaje", "hito"];

  function pintarFiltrosLinea() {
    $("fLinea").innerHTML = TIPOS_LINEA.map((k) =>
      `<button class="chip ${k === filtroLinea ? "on" : ""}" data-flinea="${k}"
        aria-pressed="${k === filtroLinea}">${t("tl." + k)}</button>`).join("");
  }

  function pintarTimeline() {
    const cont = $("timeline");
    const todos = construirLinea();
    $("lineaSub").textContent = t("sec.hitos", { n: todos.length });

    const lista = filtroLinea === "todos"
      ? todos : todos.filter((i) => i.tipo === filtroLinea);

    if (!lista.length) {
      cont.innerHTML = `<li class="vac"><b>${t("tl.sinHitos")}</b>${t("tl.sinTipo")}</li>`;
      return;
    }

    cont.innerHTML = lista.slice(0, 40).map((i) => {
      const d = diasEntre(fecha(GOVISOR.presidencia.fechaAsuncion), fecha(i.fecha));
      const dia = (d != null && d >= 0) ? `<b>${t("tl.dia", { n: d })}</b> · ` : "";
      const url = urlSegura(i.enlace);
      const titulo = url
        ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(i.titulo)} &#8599;</a>`
        : esc(i.titulo);
      const grupo = i.grupo ? `<span class="tl-agrupado">${t("tl.resoluciones", { n: i.grupo })}</span>` : "";
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
      ? `${esc(e.peor)} <small>${t("e.titulares", { n: e.max })}</small>`
      : `${t("e.ninguna")} <small>${t("e.sinRelevos")}</small>`;

    $("estabilidad").innerHTML = `
      <div class="est"><dt>${t("e.originales")}</dt><dd>${e.originales}<small> / ${e.carteras}</small></dd></div>
      <div class="est"><dt>${t("e.relevos")}</dt><dd>${e.cesados}</dd></div>
      <div class="est"><dt>${t("e.permanencia")}</dt><dd>${e.prom == null ? "—" : e.prom}<small> ${t("t.dias")}</small></dd></div>
      <div class="est"><dt>${t("e.rotacion")}</dt><dd style="font-size:.85rem">${rotTxt}</dd></div>`;
  }

  /* ── Gobierno y Congreso ───────────────────────────────────────────── */
  function pintarCongreso() {
    const c = GOVISOR.congreso || {};
    const total = (c.interpelaciones || []).length + (c.censuras || []).length
      + (c.confianza || []).length + (c.facultades || []).length
      + (c.proyectosEjecutivo || []).length;
    $("cntCongreso").textContent = total ? t("s.registros", { n: total }) : t("s.sinRegistros");

    const bloque = (titulo, arr, cols, fila) => {
      if (!arr || !arr.length) {
        return `<h4 style="font-size:.78rem;margin:10px 0 4px">${titulo}</h4>
          <p class="fine">${t("sc.sinRegistros")}</p>`;
      }
      return `<h4 style="font-size:.78rem;margin:10px 0 4px">${titulo}</h4>
        <div class="mini-wrap"><table class="mini"><thead><tr>${
          cols.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${arr.map(fila).join("")}</tbody></table></div>`;
    };

    $("congresoBox").innerHTML =
      `<p class="fine">${t("sc.art130")}</p>` +
      bloque(t("sc.interpelaciones"), c.interpelaciones, [t("sc.ministro"), t("sc.sector"), t("tn.fecha"), t("sc.resultado")],
        (x) => `<tr><td>${esc(x.ministro)}</td><td>${esc(x.sector)}</td><td>${esc(fechaCorta(x.fecha))}</td><td>${esc(x.resultado || "—")}</td></tr>`) +
      bloque(t("sc.censuras"), c.censuras, [t("sc.ministro"), t("tn.fecha"), t("sc.votos"), t("sc.resultado")],
        (x) => `<tr><td>${esc(x.ministro)}</td><td>${esc(fechaCorta(x.fecha))}</td><td>${esc(x.votos || "—")}</td><td>${esc(x.resultado || "—")}</td></tr>`) +
      bloque(t("sc.facultades"), c.facultades, [t("sc.materia"), t("sc.plazo"), t("sc.otorgada")],
        (x) => `<tr><td>${esc(x.materia)}</td><td>${esc(x.plazo || "—")}</td><td>${x.otorgada ? t("sc.si") : t("sc.no")}</td></tr>`) +
      bloque(t("sc.proyectos"), c.proyectosEjecutivo, [t("sc.nro"), t("sc.tituloCol"), t("sc.sector"), t("sc.estado")],
        (x) => `<tr><td>${esc(x.numero)}</td><td>${esc(x.titulo)}</td><td>${esc(x.sector)}</td><td>${esc(x.estado || "—")}</td></tr>`);
  }

  /* ── Radar de nombramientos (más allá del gabinete) ────────────────── */
  function pintarCargos() {
    const cargos = GOVISOR.altosCargos || [];
    $("cntCargos").textContent = cargos.length ? t("s.cargosN", { n: cargos.length }) : t("s.soloGabinete");

    if (!cargos.length) {
      $("cargosBox").innerHTML = `<p class="vac"><b>${t("sr.soloGab")}</b>${t("sr.txt")}</p>`;
      return;
    }

    const hoy = hoyLima();
    $("cargosBox").innerHTML = `<div class="mini-wrap"><table class="mini">
      <thead><tr><th>${t("sr.nombre")}</th><th>${t("sr.cargo")}</th><th>${t("sr.entidad")}</th><th>${t("sr.dias")}</th><th>${t("sr.norma")}</th></tr></thead>
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
    $("cntPpto").textContent = sec.length ? t("s.sectores", { n: sec.length }) : t("s.sinDatos");

    const u = urlSegura(p.url);
    const fuente = u
      ? `<p class="fine">${t("sp.fuente")}<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(p.fuente)} &#8599;</a></p>`
      : "";

    if (!sec.length) {
      $("pptoBox").innerHTML = `<p class="vac"><b>${t("sp.sinCifras")}</b>${t("sp.txt")}</p>${fuente}`;
      return;
    }

    const fmt = (n) => n == null ? "—" : "S/ " + Number(n).toLocaleString("es-PE");
    $("pptoBox").innerHTML = `<div class="mini-wrap"><table class="mini">
      <thead><tr><th>${t("sp.sector")}</th><th>PIA</th><th>PIM</th><th>Devengado</th><th>${t("sp.ejec")}</th></tr></thead>
      <tbody>${sec.map((s) => {
        const pct = (s.pim && s.devengado != null) ? (s.devengado / s.pim * 100) : null;
        return `<tr><td><b>${esc(s.sigla)}</b></td><td>${fmt(s.pia)}</td>
          <td>${fmt(s.pim)}</td><td>${fmt(s.devengado)}</td>
          <td>${pct == null ? "—" : pct.toFixed(1) + " %"}</td></tr>`;
      }).join("")}</tbody></table></div>
      ${p.actualizado ? `<p class="fine">${t("sp.actualizado", { f: fechaLarga(p.actualizado) })}</p>` : ""}${fuente}`;
  }

  /* ── Metodología ───────────────────────────────────────────────────── */
  function pintarMetodologia() {
    $("metodologia").innerHTML = `<div class="meto">
      <p>${t("m.intro")}</p>
      <p style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0">
        ${sellEv("oficial")} ${sellEv("verificado")} ${sellEv("preliminar")} ${sellEv("investigacion")}
      </p>
      <ul>
        <li>${t("m.oficial")}</li>
        <li>${t("m.verificado")}</li>
        <li>${t("m.preliminar")}</li>
        <li>${t("m.investigacion")}</li>
      </ul>
      <h4>${t("m.queCalcula")}</h4>
      <ul><li>${t("m.calcula")}</li><li>${t("m.mano")}</li></ul>
      <h4>${t("m.nombres")}</h4>
      <p>${t("m.nombresTxt")}</p>
      <h4>${t("m.idioma")}</h4>
      <p>${t("m.idiomaTxt")}</p>
      <h4>${t("m.noHace")}</h4>
      <p>${t("m.noHaceTxt")}</p>
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
      ? `${t("kpi.verificados", { n: ver })}${rango ? `<br>${esc(rango)}` : ""}`
      : t("kpi.sinTitulares");

    // 4) Normas del periodo — nunca se inventa una cifra.
    const n = sel.normas().length;
    const kn = $("kpiNormas");
    // El nodo huerfano no tiene padre: en paginas sin KPI (fuentes.html)
    // esto seria un TypeError que abortaria iniciar() entero.
    const knPadre = kn.parentElement || document.createElement("div");
    if (n) {
      kn.textContent = numero(n);
      knPadre.classList.remove("kpi-val-sm");
      $("kpiNormasSub").innerHTML =
        `${t("kpi.conEnlace", { n: sel.normasVerificadas() })}<br><a href="#normas">${t("kpi.verNormas")}</a>`;
    } else {
      kn.textContent = t("kpi.enRegistro");
      knPadre.classList.add("kpi-val-sm");
      $("kpiNormasSub").innerHTML = `<a href="#normas">${t("kpi.verNormas")}</a>`;
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
    const total = sel.promesas().length;
    const cont = $("promesasResumen");

    const bloque = (icono, rotulo, valor, sub) =>
      `<div class="c3"><p class="c3-rot"><span aria-hidden="true">${icono}</span> ${rotulo}</p>
       <p class="c3-val">${esc(valor)}</p><p class="c3-sub">${esc(sub)}</p></div>`;

    if (!total) {
      cont.innerHTML =
        bloque("💬", t("tab.dijo"), t("kpi.enRegistro"), t("tab.compromisos")) +
        bloque("📋", t("tab.normo"), t("kpi.enRegistro"), t("tab.normasRel")) +
        bloque("✓", t("tab.ejecuto"), t("kpi.enRegistro"), t("tab.acciones"));
      $("promesasNota").textContent = t("tab.construccion");
      return;
    }

    const conNorma = sel.promesasConNorma();
    const conEv = sel.promesasConEvidencia();
    cont.innerHTML =
      bloque("💬", t("tab.dijo"), total, total === 1 ? t("tab.compromisoN") : t("tab.compromisosN")) +
      bloque("📋", t("tab.normo"), conNorma || t("tab.sinEv"), conNorma ? t("tab.conNorma") : t("tab.sinNorma")) +
      bloque("✓", t("tab.ejecuto"), conEv || t("tab.sinEv"), conEv ? t("tab.conAccion") : t("tab.sinEvidencia"));

    $("promesasNota").textContent = conEv
      ? t("tab.notaEv", { a: conEv, b: total })
      : t("tab.notaSinEv", { n: total });
  }

  /* ── Timeline compacto de portada ──────────────────────────────────── */
  function pintarTimelineMini() {
    const items = construirLinea().slice(0, 4);
    const cont = $("timelineMini");
    if (!items.length) {
      cont.innerHTML = `<li class="t">${t("tab.sinHitos")}</li>`;
      return;
    }
    const filas = items.map((i) =>
      `<li><span class="f">${esc(fechaCorta(i.fecha))}</span>
       <span class="t">${esc(i.titulo)}</span></li>`).join("");

    // Estado en curso: solo si los 100 días siguen corriendo (dato real).
    const d = sel.diaGobierno();
    const curso = (d != null && d >= 0 && d <= 100)
      ? `<li class="curso"><span class="f">${t("tab.enCurso")}</span>
         <span class="t">${t("tab.primeros100")}</span></li>` : "";
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
      cont.innerHTML = `<li><span class="t">${t("tab.sinTitulares")}</span></li>`;
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

  /* ══════════════════════════════════════════════════════════════════════
     IDIOMA
     ══════════════════════════════════════════════════════════════════ */

  /** Repinta todo lo que genera JavaScript. El HTML estatico lo traduce
      I18N.aplicarEstaticos() con los atributos data-i18n. */
  function repintar() {
    pintarMandato();
    pintarLectura();
    pintarGabinete();
    pintarNormas();
    pintarViajes();
    pintarFuentes();
    pintarKPIs();
    pintarPromesasResumen();
    pintarTimelineMini();
    pintarGabineteResumen();
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
    ultimoDia = "";            // fuerza el refresco de la fecha en el reloj
    ticTac();
  }

  function conectarIdioma() {
    const btn = $("idiomaBtn");
    const marca = () => { $("idiomaTxt").textContent = I18N.idioma.toUpperCase(); };

    marca();
    btn.addEventListener("click", () => I18N.alternar());

    I18N.alCambiar(() => {
      marca();
      repintar();
      if (noticiasCargadas) cargarNoticias();
      if (leerClave()) estadoYT(t("yt.cargada"), "ok");
    });
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

    // Al elegir una sección en el menú, su bloque se abre solo: de otro
    // modo el enlace saltaría a un acordeón cerrado y parecería roto.
    document.addEventListener("click", (ev) => {
      const a = ev.target.closest('a[href^="#"]');
      if (!a) return;
      const destino = document.getElementById(a.getAttribute("href").slice(1));
      if (!destino) return;
      const bloque = destino.closest("details") || (destino.tagName === "DETAILS" ? destino : null);
      if (bloque) {
        bloque.open = true;
        const padre = bloque.parentElement && bloque.parentElement.closest("details");
        if (padre) padre.open = true;
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

  /* ── Diálogo "Acerca de" ───────────────────────────────────────────── */
  let focoAcerca = null;

  function abrirAcerca() {
    focoAcerca = document.activeElement;
    $("acerca").hidden = false;
    document.body.classList.add("sin-scroll");
    const b = document.querySelector("#acerca .btn");
    if (b) b.focus();
  }
  function cerrarAcerca() {
    $("acerca").hidden = true;
    document.body.classList.remove("sin-scroll");
    if (focoAcerca && focoAcerca.focus) focoAcerca.focus();
  }

  function conectar() {
    // ── Acerca de ──
    document.addEventListener("click", (ev) => {
      if (ev.target.closest("#acercaBtn")) { ev.preventDefault(); abrirAcerca(); return; }
      if (ev.target.closest("[data-cerrar-acerca]")) { cerrarAcerca(); }
    });
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && !$("acerca").hidden) cerrarAcerca();
    });

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
      if (!v) { estadoYT(t("yt.escribe"), "err"); return; }
      try {
        localStorage.setItem(CLAVE_YT, v);
        estadoYT(t("yt.guardada"), "ok");
        cargarYouTube();
      } catch { estadoYT(t("yt.bloqueado"), "err"); }
    });

    $("ytBorrar").addEventListener("click", () => {
      try { localStorage.removeItem(CLAVE_YT); } catch { /* sin acción */ }
      $("ytKey").value = "";
      estadoYT(t("yt.borrada"), "");
      $("ytGrid").innerHTML = `<p class="vac">${t("yt.ingresa")}</p>`;
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
    I18N.aplicarEstaticos();

    const m = GOVISOR.meta;
    $("marcaTitulo").textContent = m.titulo;
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
    if (key) { $("ytKey").value = key; estadoYT(t("yt.cargada"), "ok"); }

    conectar();
    conectarCabecera();
    conectarIdioma();
    observarEntradas();
    arrancado = true;
    ticTac();
    setInterval(ticTac, 1000);
  }

  /* ── Frescura: el visor se refresca al entrar ───────────────────────
     GitHub Pages sirve los archivos con cache de navegador, asi que una
     visita posterior puede quedarse con datos viejos. `version.json` se
     pide siempre con `cache:"no-store"` —nunca sale del cache— y lleva el
     mismo sello que `GOVISOR.meta.version`. Si los dos dejan de coincidir,
     lo cargado es antiguo y se recarga la pagina con un sello nuevo en la
     URL, lo que obliga a traer HTML, CSS y datos frescos del servidor.

     Se comprueba: al entrar (arranque de sesion), al volver a la pestana,
     al restaurar desde el cache de retroceso, y cada 5 minutos si la
     pestana queda abierta.
     ------------------------------------------------------------------ */
  const VERSION_URL = "version.json";
  const CHEQUEO_MS  = 5 * 60 * 1000;   // pestana abierta
  const MIN_ENTRE   = 30 * 1000;       // no repreguntar antes de 30 s
  let ultimoChequeo = 0;
  let recargando    = false;

  function nuevaSesion() {
    try {
      if (sessionStorage.getItem("govisor.sesion")) return false;
      sessionStorage.setItem("govisor.sesion", String(Date.now()));
      return true;
    } catch (_) { return true; }   // sin sessionStorage: se trata como nueva
  }

  /** Sello que ya trae la URL, si esta pagina es fruto de una recarga. */
  function selloEnURL() {
    try { return new URL(location.href).searchParams.get("v") || ""; }
    catch (_) { return ""; }
  }

  function recargarLimpio(version) {
    if (recargando) return;
    // Cortafuegos: si ya venimos recargados con este mismo sello y los
    // archivos siguen siendo viejos, es que version.json se publico sin
    // acompanarlo de data.js/index.html. Recargar otra vez no lo arreglaria
    // y dejaria al visitante en un bucle: mejor avisar y seguir sirviendo.
    if (selloEnURL() === String(version)) {
      console.warn(
        "GoVisor: version.json anuncia " + version + " pero los archivos " +
        "cargados son " + ((GOVISOR.meta && GOVISOR.meta.version) || "?") +
        ". Publica el sello con scripts/publicar.mjs para que coincidan.");
      return;
    }
    recargando = true;
    try {
      const u = new URL(location.href);
      u.searchParams.set("v", version || String(Date.now()));
      location.replace(u.toString());
    } catch (_) { location.reload(); }
  }

  function vigilarFrescura(forzar) {
    const ahora = Date.now();
    if (!forzar && ahora - ultimoChequeo < MIN_ENTRE) return;
    ultimoChequeo = ahora;

    fetch(VERSION_URL + "?t=" + ahora, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        const remota = j && j.version ? String(j.version) : "";
        const local  = (GOVISOR.meta && GOVISOR.meta.version) || "";
        if (remota && local && remota !== local) recargarLimpio(remota);
      })
      .catch(() => { /* sin red: se sigue con lo ya cargado */ });
  }

  function iniciarFrescura() {
    nuevaSesion();                               // marca el inicio de sesion
    vigilarFrescura(true);                       // y comprueba de inmediato
    setInterval(() => vigilarFrescura(false), CHEQUEO_MS);
    window.addEventListener("pageshow", (e) => {
      // Vuelta desde el cache de retroceso: la pagina puede llevar horas ahi.
      if (e.persisted) vigilarFrescura(true);
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) vigilarFrescura(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { iniciar(); iniciarFrescura(); });
  } else { iniciar(); iniciarFrescura(); }
})();
