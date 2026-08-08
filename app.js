/* ============================================================================
   GoVisor — logica del visor
   Lee la constante global GOVISOR (definida en data.js) y pinta el portal.
   Sin frameworks ni dependencias externas.
   ========================================================================== */
(function () {
  "use strict";

  const ZONA = "America/Lima";
  const CLAVE_YT = "govisor.youtube.key";
  const $ = (id) => document.getElementById(id);

  /* ══════════════════════════════════════════════════════════════════════
     UTILIDADES
     ══════════════════════════════════════════════════════════════════ */

  /** Escapa texto antes de inyectarlo como HTML. */
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }

  /** Solo se aceptan URLs http/https; cualquier otra cosa se descarta. */
  function urlSegura(u) {
    if (!u) return "";
    try {
      const p = new URL(u, location.href);
      return (p.protocol === "http:" || p.protocol === "https:") ? p.href : "";
    } catch { return ""; }
  }

  /** "AAAA-MM-DD" -> Date en mediodia UTC (evita corrimientos por zona horaria). */
  function fecha(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
    const [a, m, d] = iso.split("-").map(Number);
    const f = new Date(Date.UTC(a, m - 1, d, 12, 0, 0));
    return isNaN(f) ? null : f;
  }

  /** Hoy en Lima, normalizado a mediodia UTC para restar dias sin error. */
  function hoyLima() {
    const partes = new Intl.DateTimeFormat("en-CA", {
      timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date());
    return fecha(partes);
  }

  /** Dias transcurridos entre dos fechas. */
  function diasEntre(desde, hasta) {
    if (!desde || !hasta) return null;
    return Math.floor((hasta - desde) / 86400000);
  }

  function fechaLarga(iso) {
    const f = fecha(iso);
    if (!f) return "";
    return new Intl.DateTimeFormat("es-PE", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    }).format(f);
  }

  /** Convierte un numero de dias a una frase legible en anios/meses/dias. */
  function enPalabras(dias) {
    if (dias == null) return "";
    if (dias === 0) return "hoy mismo";
    if (dias === 1) return "un dia";
    const anios = Math.floor(dias / 365);
    const resto = dias % 365;
    const meses = Math.floor(resto / 30);
    const d = resto % 30;
    const p = [];
    if (anios) p.push(anios === 1 ? "1 anio" : anios + " anios");
    if (meses) p.push(meses === 1 ? "1 mes" : meses + " meses");
    if (d && !anios) p.push(d === 1 ? "1 dia" : d + " dias");
    return p.join(", ") || dias + " dias";
  }

  /** Numero a palabra, para la seccion de "estadistica con letras". */
  const PALABRAS = ["ninguna", "una", "dos", "tres", "cuatro", "cinco", "seis",
    "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce",
    "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve", "veinte"];
  function palabra(n) {
    return (n >= 0 && n < PALABRAS.length) ? PALABRAS[n] : String(n);
  }

  function iniciales(nombre) {
    const p = String(nombre || "").trim().split(/\s+/).filter(Boolean);
    if (!p.length) return "??";
    return ((p[0][0] || "") + (p[1] ? p[1][0] : "")).toUpperCase();
  }

  const sello = (ok) => ok
    ? '<span class="badge badge-ok">Verificado</span>'
    : '<span class="badge badge-pendiente">Por verificar</span>';

  /** Chip de norma: enlace si hay URL, texto plano si solo hay numero. */
  function chipNorma(n) {
    if (!n || (!n.numero && !n.tipo)) {
      return '<span class="norma-texto">Resolucion pendiente de registro</span>';
    }
    const txt = esc([n.tipo, n.numero].filter(Boolean).join(" N.o "));
    const f = n.fecha ? " · " + esc(fechaLarga(n.fecha)) : "";
    const url = urlSegura(n.enlace);
    return url
      ? `<a class="norma-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${txt}${f} &#8599;</a>`
      : `<span class="norma-texto">${txt}${f}</span>`;
  }

  /* ══════════════════════════════════════════════════════════════════════
     RELOJ DE LIMA — se actualiza cada segundo
     ══════════════════════════════════════════════════════════════════ */
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
    if (dia !== ultimoDia) {           // solo repinta la fecha si cambio
      ultimoDia = dia;
      $("relojFecha").textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
      pintarMandato();                 // el contador de dias avanza a medianoche
      pintarGabinete();
      pintarResumen();
    }
    $("relojHora").textContent = fmtHora.format(ahora);
  }

  /* ══════════════════════════════════════════════════════════════════════
     MANDATO PRESIDENCIAL
     ══════════════════════════════════════════════════════════════════ */
  function pintarMandato() {
    const p = GOVISOR.presidencia;
    const inicio = fecha(p.fechaAsuncion);
    const hoy = hoyLima();
    const dias = diasEntre(inicio, hoy);

    $("cargoTxt").textContent = p.cargo || "Presidencia de la Republica";
    $("h-mandato").textContent = p.nombre || "Sin registrar";
    $("periodoTxt").textContent = p.periodo
      ? `Periodo constitucional ${p.periodo}` : "";

    const retrato = $("retrato");
    const foto = urlSegura(p.foto);
    if (foto) {
      retrato.style.backgroundImage = `url("${foto}")`;
      retrato.textContent = "";
    } else {
      retrato.textContent = iniciales(p.nombre);
    }

    $("normaPresidencia").innerHTML = chipNorma(p.norma) + sello(!!p.verificado);

    if (dias == null || dias < 0) {
      $("diasMandato").textContent = "—";
      $("diasUnidad").textContent = "";
      $("detalleMandato").textContent = (dias != null && dias < 0)
        ? "La fecha de asuncion registrada aun no ocurre."
        : "Falta registrar la fecha de asuncion en data.js";
      $("piePeriodo").textContent = "";
      return;
    }

    $("diasMandato").textContent = dias.toLocaleString("es-PE");
    $("diasUnidad").textContent = dias === 1 ? "dia" : "dias";
    $("detalleMandato").innerHTML =
      `Equivale a <strong>${esc(enPalabras(dias))}</strong> desde el ${esc(fechaLarga(p.fechaAsuncion))}.`;

    // Avance del periodo constitucional (5 anios ~ 1826 dias)
    const TOTAL = 1826;
    const pct = Math.max(0, Math.min(100, (dias / TOTAL) * 100));
    requestAnimationFrame(() => { $("barraPeriodo").style.width = pct.toFixed(2) + "%"; });
    $("piePeriodo").textContent =
      `Avance del periodo: ${pct.toFixed(1)} %  ·  restan ${Math.max(0, TOTAL - dias).toLocaleString("es-PE")} dias`;
  }

  /* ══════════════════════════════════════════════════════════════════════
     GABINETE
     ══════════════════════════════════════════════════════════════════ */
  let filtroGab = "todos";

  function claseMinistro(m) {
    if (!m.ministro) return "pendiente";
    return m.estado === "cesado" ? "cesado" : "activo";
  }

  function pintarGabinete() {
    const hoy = hoyLima();
    const cont = $("ministrosGrid");
    const lista = GOVISOR.ministerios.filter((m) => {
      if (filtroGab === "todos") return true;
      if (filtroGab === "pendiente") return !m.ministro;
      return m.ministro && m.estado === filtroGab;
    });

    const conNombre = GOVISOR.ministerios.filter((m) => m.ministro).length;
    $("subGabinete").textContent =
      `${conNombre} de ${GOVISOR.ministerios.length} carteras con titular registrado`;

    if (!lista.length) {
      cont.innerHTML = '<p class="vacio"><strong>Sin resultados</strong>No hay carteras que coincidan con este filtro.</p>';
      return;
    }

    cont.innerHTML = lista.map((m) => {
      const clase = claseMinistro(m);
      const inicio = fecha(m.fechaNombramiento);
      const fin = m.estado === "cesado" ? fecha(m.fechaCese) : hoy;
      const dias = diasEntre(inicio, fin);

      let contador;
      if (dias == null) {
        contador = '<span class="badge badge-neutro">Sin fecha</span>';
      } else if (m.estado === "cesado") {
        contador = `<span class="badge badge-dias congelado">${dias.toLocaleString("es-PE")} dias en el cargo</span>`;
      } else {
        contador = `<span class="badge badge-dias">Dia ${dias.toLocaleString("es-PE")}</span>`;
      }

      const nombre = m.ministro
        ? `<p class="ministro-nombre">${esc(m.ministro)}</p>`
        : `<p class="ministro-nombre sin-dato">Titular por registrar</p>`;

      const cese = (m.estado === "cesado" && m.fechaCese)
        ? `<p class="ministro-cartera">Ceso el ${esc(fechaLarga(m.fechaCese))}</p>` : "";

      const desde = m.fechaNombramiento
        ? `<p class="ministro-cartera">Desde el ${esc(fechaLarga(m.fechaNombramiento))}</p>` : "";

      return `<article class="ministro ${clase}">
        <div class="ministro-top">
          <span class="sigla">${esc(m.sigla)}</span>
          <div>
            <h3>${esc(m.cartera)}</h3>
            ${nombre}
            ${desde}${cese}
          </div>
        </div>
        <div class="ministro-meta">${contador}${sello(!!m.verificado)}</div>
        <div class="ministro-meta">${chipNorma(m.norma)}</div>
      </article>`;
    }).join("");
  }

  /* ══════════════════════════════════════════════════════════════════════
     NORMAS
     ══════════════════════════════════════════════════════════════════ */
  let filtroNorma = "todos";
  let busqueda = "";

  const ETIQUETA_ORIGEN = {
    congreso:  ["et-congreso",  "Congreso"],
    ejecutivo: ["et-ejecutivo", "Ejecutivo"],
    viaje:     ["et-viaje",     "Viaje oficial"]
  };

  function pintarNormas() {
    const cont = $("normasLista");
    const q = busqueda.trim().toLowerCase();

    if (!GOVISOR.normas.length) {
      cont.innerHTML = `<p class="vacio">
        <strong>Aun no hay normas registradas</strong>
        Agrega los registros verificados en el arreglo <code>normas</code> de data.js.
        Cada uno aparecera aqui con su enlace directo a la fuente.</p>`;
      return;
    }

    const lista = GOVISOR.normas
      .filter((n) => filtroNorma === "todos" || n.origen === filtroNorma)
      .filter((n) => !q || `${n.tipo} ${n.numero} ${n.sumilla}`.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => String(b.fecha || "").localeCompare(String(a.fecha || "")));

    if (!lista.length) {
      cont.innerHTML = '<p class="vacio"><strong>Sin coincidencias</strong>Prueba con otro filtro o termino de busqueda.</p>';
      return;
    }

    cont.innerHTML = lista.map((n) => {
      const [cls, txt] = ETIQUETA_ORIGEN[n.origen] || ["badge-neutro", "Otro"];
      const derogada = n.accion === "derogada"
        ? '<span class="badge et-derogada">Derogada</span>' : "";
      const accion = (n.accion && n.accion !== "derogada")
        ? `<span class="badge badge-neutro">${esc(n.accion)}</span>` : "";

      const cuerpo = `<div class="norma-cab">
          <span class="norma-num">${esc([n.tipo, n.numero].filter(Boolean).join(" N.o "))}</span>
          <span class="badge ${cls}">${txt}</span>${derogada}${accion}
        </div>
        <p class="norma-sumilla">${esc(n.sumilla || "Sin sumilla registrada")}</p>
        <p class="norma-pie">
          <span>${esc(fechaLarga(n.fecha) || "Sin fecha")}</span>
          <span>${n.verificado ? "Verificada" : "Por verificar"}</span>
        </p>`;

      const url = urlSegura(n.enlace);
      return url
        ? `<a class="norma" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${cuerpo}</a>`
        : `<div class="norma">${cuerpo}</div>`;
    }).join("");
  }

  /* ══════════════════════════════════════════════════════════════════════
     VIAJES
     ══════════════════════════════════════════════════════════════════ */
  function pintarViajes() {
    const cont = $("viajesLista");
    if (!GOVISOR.viajes.length) {
      cont.innerHTML = `<p class="vacio">
        <strong>Sin viajes registrados</strong>
        Los viajes al exterior de la Presidencia requieren autorizacion del Congreso
        mediante Resolucion Legislativa. Registralos en <code>viajes</code> de data.js.</p>`;
      return;
    }
    cont.innerHTML = GOVISOR.viajes.map((v) => `
      <article class="viaje">
        <h3>${esc(v.destino || "Destino por registrar")}</h3>
        <p><strong>${esc(v.quien || "—")}</strong> · ${esc(v.motivo || "Motivo no registrado")}</p>
        <p>${esc(fechaLarga(v.desde))}${v.hasta ? " al " + esc(fechaLarga(v.hasta)) : ""}</p>
        <div class="ministro-meta">${chipNorma(v.norma)}${sello(!!v.verificado)}</div>
      </article>`).join("");
  }

  /* ══════════════════════════════════════════════════════════════════════
     RESUMEN EN PALABRAS  (la "estadistica con letras")
     ══════════════════════════════════════════════════════════════════ */
  function pintarResumen() {
    const p = GOVISOR.presidencia;
    const dias = diasEntre(fecha(p.fechaAsuncion), hoyLima());
    const mins = GOVISOR.ministerios;
    const conNombre = mins.filter((m) => m.ministro).length;
    const cesados = mins.filter((m) => m.estado === "cesado").length;
    const pendientes = mins.length - conNombre;

    const leyes = GOVISOR.normas.filter((n) => n.origen === "congreso").length;
    const ejec = GOVISOR.normas.filter((n) => n.origen === "ejecutivo").length;
    const derog = GOVISOR.normas.filter((n) => n.accion === "derogada").length;
    const verif = GOVISOR.normas.filter((n) => n.verificado).length;

    const tarjetas = [
      ["Tiempo de gobierno", (dias == null || dias < 0)
        ? "La fecha de inicio del mandato aun no esta confirmada en el visor."
        : `El mandato lleva <strong>${esc(enPalabras(dias))}</strong> en curso desde su instalacion.`],

      ["Gabinete", pendientes === mins.length
        ? "Ninguna cartera tiene todavia un titular registrado en el visor."
        : `De las diecinueve carteras, <strong>${palabra(conNombre)}</strong> ${conNombre === 1 ? "tiene" : "tienen"} titular registrado` +
          (cesados ? `, y <strong>${palabra(cesados)}</strong> ${cesados === 1 ? "ha cesado" : "han cesado"}` : "") +
          (pendientes ? `. Quedan <strong>${palabra(pendientes)}</strong> por completar.` : ".")],

      ["Actividad legislativa", (leyes + ejec) === 0
        ? "Todavia no se ha registrado ninguna norma del periodo en el visor."
        : `Se han registrado <strong>${palabra(leyes)}</strong> ${leyes === 1 ? "norma" : "normas"} de origen parlamentario y ` +
          `<strong>${palabra(ejec)}</strong> del Poder Ejecutivo` +
          (derog ? `, de las cuales <strong>${palabra(derog)}</strong> ${derog === 1 ? "fue derogada" : "fueron derogadas"}.` : ".")],

      ["Trazabilidad", GOVISOR.normas.length === 0
        ? "Cada registro que agregues llevara su enlace directo a la fuente oficial."
        : verif === GOVISOR.normas.length
          ? "Todas las normas registradas estan contrastadas con su fuente oficial."
          : `<strong>${palabra(verif)}</strong> de ${palabra(GOVISOR.normas.length)} normas han sido contrastadas con la fuente oficial.`]
    ];

    $("resumenGrid").innerHTML = tarjetas.map(([t, txt]) =>
      `<article class="resumen-tarjeta"><h3>${esc(t)}</h3><p>${txt}</p></article>`).join("");
  }

  /* ══════════════════════════════════════════════════════════════════════
     FUENTES
     ══════════════════════════════════════════════════════════════════ */
  function pintarFuentes() {
    $("fuentesGrid").innerHTML = GOVISOR.fuentes.map((f) => {
      const url = urlSegura(f.url);
      if (!url) return "";
      return `<a class="fuente" href="${esc(url)}" target="_blank" rel="noopener noreferrer">
        <strong>${esc(f.nombre)} &#8599;</strong><span>${esc(f.nota || "")}</span></a>`;
    }).join("");
  }

  /* ══════════════════════════════════════════════════════════════════════
     NOTICIAS
     ══════════════════════════════════════════════════════════════════ */
  let feedActivo = 0;

  function urlFeed(query) {
    return GOVISOR.noticias.plantilla.replace("{Q}", encodeURIComponent(query));
  }

  function pintarFiltrosNoticias() {
    $("filtrosNoticias").innerHTML = GOVISOR.noticias.feeds.map((f, i) =>
      `<button class="chip ${i === feedActivo ? "activo" : ""}" data-feed="${i}">${esc(f.nombre)}</button>`
    ).join("");
  }

  async function cargarNoticias() {
    const cont = $("noticiasGrid");
    const feed = GOVISOR.noticias.feeds[feedActivo];
    if (!feed) return;

    const rss = urlFeed(feed.query);
    const proxy = GOVISOR.noticias.proxy;

    // Sin proxy configurado: se ofrece el enlace directo, sin fingir que carga.
    if (!proxy) {
      cont.innerHTML = `<p class="vacio">
        <strong>Lectura directa desactivada</strong>
        <a href="${esc(rss)}" target="_blank" rel="noopener noreferrer">Abrir "${esc(feed.nombre)}" en Google Noticias &#8599;</a></p>`;
      return;
    }

    cont.innerHTML = '<p class="vacio">Cargando titulares...</p>';
    try {
      const r = await fetch(proxy + encodeURIComponent(rss));
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = await r.json();
      const items = data.items || [];
      if (!items.length) throw new Error("el agregador no devolvio titulares");

      cont.innerHTML = items.slice(0, 12).map((it) => {
        const url = urlSegura(it.link);
        // Google Noticias formatea el titulo como "Titular - Medio".
        const corte = String(it.title || "").lastIndexOf(" - ");
        const titular = corte > 0 ? it.title.slice(0, corte) : (it.title || "Sin titulo");
        const medio = corte > 0 ? it.title.slice(corte + 3) : (it.author || "");
        const cuando = it.pubDate
          ? new Intl.DateTimeFormat("es-PE", {
              timeZone: ZONA, day: "numeric", month: "short",
              hour: "2-digit", minute: "2-digit"
            }).format(new Date(it.pubDate.replace(" ", "T") + "Z"))
          : "";
        const cuerpo = `<h3>${esc(titular)}</h3>
          <div class="noticia-meta">
            <span class="noticia-medio">${esc(medio)}</span><span>${esc(cuando)}</span>
          </div>`;
        return url
          ? `<a class="noticia" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${cuerpo}</a>`
          : `<div class="noticia">${cuerpo}</div>`;
      }).join("");
    } catch (e) {
      cont.innerHTML = `<p class="vacio">
        <strong>No se pudieron cargar los titulares</strong>
        ${esc(e.message)}. Puedes abrir el feed directamente:
        <a href="${esc(rss)}" target="_blank" rel="noopener noreferrer">${esc(feed.nombre)} &#8599;</a></p>`;
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     YOUTUBE
     ══════════════════════════════════════════════════════════════════ */
  let ytConsulta = 0;

  function leerClave() {
    try { return localStorage.getItem(CLAVE_YT) || ""; } catch { return ""; }
  }

  function estadoYT(msg, tipo) {
    const el = $("ytEstado");
    el.textContent = msg;
    el.className = "yt-estado" + (tipo ? " " + tipo : "");
  }

  function pintarFiltrosYT() {
    $("ytFiltros").innerHTML = GOVISOR.youtube.consultas.map((q, i) =>
      `<button class="chip ${i === ytConsulta ? "activo" : ""}" data-yt="${i}">${esc(q)}</button>`
    ).join("");
  }

  async function cargarYouTube() {
    const key = leerClave();
    const cont = $("ytGrid");
    if (!key) {
      cont.innerHTML = '<p class="vacio">Ingresa tu API key para cargar videos.</p>';
      return;
    }

    const q = GOVISOR.youtube.consultas[ytConsulta] || "";
    cont.innerHTML = '<p class="vacio">Buscando videos...</p>';

    const url = "https://www.googleapis.com/youtube/v3/search"
      + "?part=snippet&type=video&maxResults=9&order=date&relevanceLanguage=es&regionCode=PE"
      + "&q=" + encodeURIComponent(q) + "&key=" + encodeURIComponent(key);

    try {
      const r = await fetch(url);
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error?.message || ("HTTP " + r.status));

      const items = data.items || [];
      if (!items.length) {
        estadoYT("Consulta sin resultados.", "");
        cont.innerHTML = '<p class="vacio">Sin videos para esta consulta.</p>';
        return;
      }
      estadoYT(`Clave activa. ${items.length} videos cargados.`, "ok");
      cont.innerHTML = items.map((it) => {
        const id = it.id && it.id.videoId;
        if (!id) return "";
        const s = it.snippet || {};
        const th = s.thumbnails || {};
        const thumb = urlSegura((th.medium && th.medium.url) || (th.default && th.default.url));
        const cuando = s.publishedAt
          ? new Intl.DateTimeFormat("es-PE", {
              timeZone: ZONA, day: "numeric", month: "short", year: "numeric"
            }).format(new Date(s.publishedAt))
          : "";
        return `<a class="yt-card" href="https://www.youtube.com/watch?v=${encodeURIComponent(id)}"
                   target="_blank" rel="noopener noreferrer">
          ${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy">` : ""}
          <div class="yt-card-body">
            <h3>${esc(s.title || "Sin titulo")}</h3>
            <p>${esc(s.channelTitle || "")} · ${esc(cuando)}</p>
          </div></a>`;
      }).join("");
    } catch (e) {
      estadoYT("Error: " + e.message, "error");
      cont.innerHTML = `<p class="vacio"><strong>No se pudo consultar YouTube</strong>
        ${esc(e.message)}<br>Revisa que la clave tenga habilitada la YouTube Data API v3
        y que las restricciones de referente permitan este sitio.</p>`;
    }
  }

  /* ══════════════════════════════════════════════════════════════════════
     EVENTOS
     ══════════════════════════════════════════════════════════════════ */
  function marcarActivo(grupo, btn) {
    grupo.querySelectorAll(".chip").forEach((c) => c.classList.remove("activo"));
    btn.classList.add("activo");
  }

  function conectarEventos() {
    document.addEventListener("click", (ev) => {
      const btn = ev.target.closest(".chip");
      if (!btn) return;

      if (btn.dataset.fgab) {
        filtroGab = btn.dataset.fgab;
        marcarActivo(btn.parentElement, btn);
        pintarGabinete();
      } else if (btn.dataset.fnorma) {
        filtroNorma = btn.dataset.fnorma;
        marcarActivo(btn.parentElement, btn);
        pintarNormas();
      } else if (btn.dataset.feed) {
        feedActivo = Number(btn.dataset.feed);
        marcarActivo(btn.parentElement, btn);
        cargarNoticias();
      } else if (btn.dataset.yt) {
        ytConsulta = Number(btn.dataset.yt);
        marcarActivo(btn.parentElement, btn);
        cargarYouTube();
      }
    });

    let temporizador;
    $("buscarNorma").addEventListener("input", (ev) => {
      clearTimeout(temporizador);
      const v = ev.target.value;
      temporizador = setTimeout(() => { busqueda = v; pintarNormas(); }, 180);
    });

    $("ytGuardar").addEventListener("click", () => {
      const v = $("ytKey").value.trim();
      if (!v) { estadoYT("Escribe una clave antes de guardar.", "error"); return; }
      try {
        localStorage.setItem(CLAVE_YT, v);
        estadoYT("Clave guardada en este navegador. Consultando...", "ok");
        cargarYouTube();
      } catch {
        estadoYT("Este navegador bloquea el almacenamiento local.", "error");
      }
    });

    $("ytBorrar").addEventListener("click", () => {
      try { localStorage.removeItem(CLAVE_YT); } catch { /* nada que hacer */ }
      $("ytKey").value = "";
      estadoYT("Clave borrada de este navegador.", "");
      $("ytGrid").innerHTML = '<p class="vacio">Ingresa tu API key para cargar videos.</p>';
    });
  }

  /* ══════════════════════════════════════════════════════════════════════
     ARRANQUE
     ══════════════════════════════════════════════════════════════════ */
  function iniciar() {
    const m = GOVISOR.meta;
    document.title = `${m.titulo} · Visor del gobierno del Peru`;
    $("marcaTitulo").textContent = m.titulo;
    $("marcaSub").textContent = m.subtitulo;
    $("pieActualizacion").textContent = fechaLarga(m.ultimaActualizacion) || "—";

    if (m.aviso) {
      $("avisoTxt").textContent = m.aviso;
      $("avisoBar").hidden = false;
    }

    pintarMandato();
    pintarResumen();
    pintarGabinete();
    pintarNormas();
    pintarViajes();
    pintarFuentes();

    pintarFiltrosNoticias();
    cargarNoticias();

    pintarFiltrosYT();
    const key = leerClave();
    if (key) {
      $("ytKey").value = key;
      estadoYT("Clave cargada desde este navegador.", "ok");
      cargarYouTube();
    }

    conectarEventos();
    ticTac();
    setInterval(ticTac, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
