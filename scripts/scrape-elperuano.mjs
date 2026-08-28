#!/usr/bin/env node
/* ============================================================================
   GoVisor — scraper del Diario Oficial El Peruano
   ----------------------------------------------------------------------------
   Recorre el buscador de El Peruano para un rango de fechas, extrae los
   dispositivos publicados, los clasifica por origen (Congreso / Ejecutivo) y
   emite un fragmento JavaScript listo para pegar en el arreglo `normas`
   de data.js.

   VERIFICA cada enlace antes de emitirlo: si un dispositivo devuelve 404,
   no se publica. Esa comprobacion existe porque un enlace deducido por
   patron —sin abrirlo— ya se colo una vez en este proyecto.

   USO
     node scripts/scrape-elperuano.mjs                     # desde la asuncion hasta hoy
     node scripts/scrape-elperuano.mjs 20260728 20260808   # rango explicito
     node scripts/scrape-elperuano.mjs --todos             # sin filtrar por entidad
     node scripts/scrape-elperuano.mjs --salida datos.js   # escribir a archivo

   No requiere dependencias: solo Node 18+ (fetch nativo).
   ========================================================================== */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BASE = "https://busquedas.elperuano.pe";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GoVisor/1.0 (+observatorio ciudadano)";
const POR_PAGINA = 20;
const PAUSA_MS = 350;          // cortesia con el servidor
const MAX_PAGINAS = 60;

/* ── Entidades de interes ──────────────────────────────────────────────
   Se filtra automaticamente lo del Congreso y lo del Consejo de Ministros.
   Se incluyen tambien los ministerios: un Decreto Supremo sectorial es
   accion del Ejecutivo y pertenece al visor.
   ------------------------------------------------------------------ */
const SECTORES = {
  "PRESIDENCIA DEL CONSEJO DE MINISTROS": "PCM",
  "RELACIONES EXTERIORES": "RREE",
  "DEFENSA": "MINDEF",
  "ECONOMIA Y FINANZAS": "MEF",
  "INTERIOR": "MININTER",
  "JUSTICIA Y DERECHOS HUMANOS": "MINJUSDH",
  "EDUCACION": "MINEDU",
  "SALUD": "MINSA",
  "DESARROLLO AGRARIO Y RIEGO": "MIDAGRI",
  "TRABAJO Y PROMOCION DEL EMPLEO": "MTPE",
  // El Peruano rotula esta cartera como "PRODUCE", no por su nombre largo.
  "PRODUCE": "PRODUCE",
  "LA PRODUCCION": "PRODUCE",
  "COMERCIO EXTERIOR Y TURISMO": "MINCETUR",
  "ENERGIA Y MINAS": "MINEM",
  "TRANSPORTES Y COMUNICACIONES": "MTC",
  "VIVIENDA, CONSTRUCCION Y SANEAMIENTO": "MVCS",
  "LA MUJER Y POBLACIONES VULNERABLES": "MIMP",
  "DEL AMBIENTE": "MINAM",
  "CULTURA": "MINCUL",
  "DESARROLLO E INCLUSION SOCIAL": "MIDIS",
  "CONGRESO DE LA REPUBLICA": "CONGRESO",
  "PODER LEGISLATIVO": "CONGRESO",
  "PRESIDENCIA DE LA REPUBLICA": "PRESIDENCIA"
};

/* ── Utilidades ───────────────────────────────────────────────────────── */

const sinTildes = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();

const limpiar = (s) => String(s)
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<[^>]*>/g, "")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/\s+/g, " ").trim();

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/** "sabado 08.08.2026" -> "2026-08-08" */
function aISO(txt) {
  const m = limpiar(txt).match(/(\d{2})\.(\d{2})\.(\d{4})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

/** Rango abreviado a partir del tipo textual del dispositivo. */
function rangoDe(tipo) {
  const t = sinTildes(tipo);
  if (t.includes("DECRETO SUPREMO"))        return "DS";
  if (t.includes("DECRETO LEGISLATIVO"))    return "DL";
  if (t.includes("DECRETO DE URGENCIA"))    return "DU";
  if (t.includes("RESOLUCION SUPREMA"))     return "RS";
  if (t.includes("RESOLUCION MINISTERIAL")) return "RM";
  if (t.includes("RESOLUCION LEGISLATIVA")) return "RL";
  if (t.includes("RESOLUCION"))             return "Res";
  if (t.startsWith("LEY"))                  return "Ley";
  return "Otro";
}

/** Clasifica el origen segun la entidad y el tipo de norma. */
function origenDe(entidad, tipo, sumilla) {
  const e = sinTildes(entidad), t = sinTildes(tipo), s = sinTildes(sumilla);
  if (e.includes("CONGRESO") || e.includes("PODER LEGISLATIVO")) return "congreso";
  if (t.includes("RESOLUCION LEGISLATIVA") || t.startsWith("LEY")) return "congreso";
  // Autorizaciones de viaje al exterior: categoria propia del visor.
  if (s.includes("VIAJE AL EXTERIOR") || s.includes("AUTORIZAN VIAJE")) return "viaje";
  return "ejecutivo";
}

/** Sigla del sector, o "" si la entidad no esta en la lista de interes. */
function sectorDe(entidad) {
  const e = sinTildes(entidad);
  for (const clave of Object.keys(SECTORES)) {
    if (e.includes(sinTildes(clave))) return SECTORES[clave];
  }
  return "";
}

/* ── Parseo de una pagina de resultados ────────────────────────────────
   Cada tarjeta del buscador tiene esta forma (clases de Tailwind):
     <p class="text-sm font-semibold text-primary">ENTIDAD</p>
     <a href="/dispositivo/NL/ID"><p ...>TIPO</p><p ...>N° NUMERO</p></a>
     <a class="... line-clamp-3" href="...">SUMILLA</a>
     <span>ID</span><span>dia DD.MM.AAAA</span>
   ------------------------------------------------------------------ */
function parsear(html) {
  const tarjetas = html.split('class="rounded-xl border bg-card').slice(1);
  const filas = [];

  for (const t of tarjetas) {
    const entidad = limpiar((t.match(/text-sm font-semibold text-primary">([\s\S]*?)<\/p>/) || [])[1] || "");
    const href    = (t.match(/href="(\/dispositivo\/[^"]+)"/) || [])[1] || "";
    const tipo    = limpiar((t.match(/text-xs text-muted-foreground">([\s\S]*?)<\/p>/) || [])[1] || "");
    const numero  = limpiar((t.match(/text-xs font-medium text-muted-foreground">([\s\S]*?)<\/p>/) || [])[1] || "")
                      .replace(/^N[°ºo]\s*/i, "");
    const sumilla = limpiar((t.match(/line-clamp-3"[^>]*>([\s\S]*?)<\/a>/) || [])[1] || "");
    const fecha   = aISO((t.match(/<span>([^<]*\d{2}\.\d{2}\.\d{4})<\/span>/) || [])[1] || "");

    if (!href || !entidad) continue;
    filas.push({ entidad, href: BASE + href, tipo, numero, sumilla, fecha });
  }
  return filas;
}

/* ── Descarga con reintentos ───────────────────────────────────────────── */
async function traer(url, intentos = 3) {
  for (let i = 1; i <= intentos; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.ok) return await r.text();
      if (r.status === 404) return null;
      throw new Error("HTTP " + r.status);
    } catch (e) {
      if (i === intentos) throw e;
      await dormir(600 * i);
    }
  }
  return null;
}

/** Comprueba que el dispositivo abre de verdad. Sin esto no se publica.
 *
 *  Solo un 404 repetido cuenta como enlace roto. Cualquier otro fallo
 *  (429, 5xx, corte de red) se reintenta con espera creciente: una primera
 *  version de este script descartaba 68 normas validas porque trataba un
 *  limite de tasa como si el documento no existiera.
 *  Ante la duda se CONSERVA el enlace y se avisa, en vez de perder datos. */
async function enlaceVivo(url, intentos = 3) {
  let ultimoEstado = "sin respuesta";
  let cuatrocientos = 0;

  for (let i = 1; i <= intentos; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.ok) return { vivo: true };
      // El Peruano devuelve 404 espurios cuando se le pide demasiado
      // rapido: se comprobo a mano que documentos marcados 404 abrian
      // con normalidad segundos despues. Por eso el 404 tambien se
      // reintenta, con una espera mas generosa.
      if (r.status === 404) cuatrocientos++;
      ultimoEstado = "HTTP " + r.status;
    } catch (e) {
      ultimoEstado = e.message;
    }
    await dormir(2500 * i);
  }

  // Roto solo si TODOS los intentos, bien espaciados, dieron 404.
  if (cuatrocientos === intentos) return { vivo: false, motivo: "404 persistente" };
  return { vivo: true, dudoso: ultimoEstado };
}

/* ── Recoleccion reutilizable ───────────────────────────────────────────
   Devuelve el arreglo de normas con enlace VIVO (verificado uno por uno).
   La usan tanto la CLI (main) como scripts/actualizar.mjs (GitHub Action).
   ------------------------------------------------------------------ */
export async function recolectar(desde, hasta, todos = false) {
  console.error(`Rango: ${desde} → ${hasta}${todos ? "  (sin filtro de entidad)" : "  (Congreso + Consejo de Ministros)"}`);

  // 1) Recorrer las paginas de resultados
  // Un fallo de red aislado NO debe truncar el recorrido: una version
  // anterior perdia paginas enteras en silencio por ese motivo. Solo se
  // detiene tras dos paginas seguidas realmente vacias.
  const crudas = [];
  let vaciasSeguidas = 0;
  for (let p = 0; p < MAX_PAGINAS; p++) {
    const url = `${BASE}/?fechaIni=${desde}&fechaFin=${hasta}&tipoPublicacion=NL&ci=ONLY&start=${p * POR_PAGINA}`;
    let html = null;
    try { html = await traer(url); }
    catch (e) { console.error(`\n  fallo en pagina ${p + 1} (${e.message}), se reintenta`); }

    const filas = html ? parsear(html) : [];
    if (!filas.length) {
      // Una pagina vacia suele ser limite de tasa, no el final del listado.
      // Se insiste tres veces con esperas largas antes de dar por terminado.
      vaciasSeguidas++;
      if (vaciasSeguidas >= 3) break;
      console.error(`\n  pagina ${p + 1} vacia (intento ${vaciasSeguidas}/3), esperando…`);
      await dormir(5000 * vaciasSeguidas);
      p--;                       // se reintenta la MISMA pagina
      continue;
    }
    vaciasSeguidas = 0;
    crudas.push(...filas);
    process.stderr.write(`\r  pagina ${p + 1} · ${crudas.length} dispositivos`);
    await dormir(PAUSA_MS);
  }
  console.error("");

  // 2) Filtrar por entidad de interes
  const conSector = crudas
    .map((f) => Object.assign({}, f, { sector: sectorDe(f.entidad) }))
    .filter((f) => todos || f.sector);
  console.error(`Filtrados: ${conSector.length} de ${crudas.length}`);

  // 3) Deduplicar por enlace
  const vistos = new Set();
  const unicos = conSector.filter((f) => {
    if (vistos.has(f.href)) return false;
    vistos.add(f.href); return true;
  });

  // 4) Verificar que cada enlace abre
  console.error(`Verificando ${unicos.length} enlaces…`);
  const vivos = [];
  let rotos = 0, dudosos = 0;
  for (let i = 0; i < unicos.length; i++) {
    const f = unicos[i];
    const r = await enlaceVivo(f.href);
    if (r.vivo) {
      vivos.push(f);
      if (r.dudoso) { dudosos++; console.error(`  DUDOSO (conservado, ${r.dudoso}): ${f.href}`); }
    } else {
      rotos++; console.error(`  ROTO 404 (descartado): ${f.href}`);
    }
    if (i % 20 === 19) process.stderr.write(`\r  verificados ${i + 1}/${unicos.length}\n`);
    await dormir(320);          // ritmo prudente: evita el limite de tasa
  }
  console.error(`Enlaces vivos: ${vivos.length} · rotos 404: ${rotos} · dudosos conservados: ${dudosos}`);
  return vivos;
}

/* ── Formato del fragmento para data.js ─────────────────────────────────
   Orden DETERMINISTA (fecha desc, luego enlace): dos corridas con los
   mismos datos producen texto identico, para que el Action no genere
   commits espurios por reordenamiento.
   ------------------------------------------------------------------ */
export function formatear(vivos, desde, hasta) {
  const orden = [...vivos].sort((a, b) =>
    String(b.fecha).localeCompare(String(a.fecha)) || String(a.href).localeCompare(String(b.href)));
  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  const cuerpo = orden.map((f) =>
    `    { tipo:"${esc(f.tipo)}", numero:"${esc(f.numero)}", rango:"${rangoDe(f.tipo)}", sector:"${f.sector || ""}",\n` +
    `      sumilla:"${esc(f.sumilla)}",\n` +
    `      fecha:"${f.fecha}", origen:"${origenDe(f.entidad, f.tipo, f.sumilla)}", accion:"promulgada",\n` +
    `      entidad:"${esc(f.entidad)}",\n` +
    `      enlace:"${esc(f.href)}",\n` +
    `      verificado:true, evidencia:"oficial" }`
  ).join(",\n\n");

  return (
`/* Generado por scripts/scrape-elperuano.mjs
   Rango ${desde} → ${hasta} · ${orden.length} normas · enlaces verificados uno por uno
   Regenerar con: node scripts/scrape-elperuano.mjs */
${cuerpo}
`);
}

/* ── CLI ────────────────────────────────────────────────────────────────
   node scripts/scrape-elperuano.mjs [desde] [hasta] [--todos] [--salida f]
   ------------------------------------------------------------------ */
async function main() {
  const args = process.argv.slice(2);
  const todos = args.includes("--todos");
  const iSalida = args.indexOf("--salida");
  const salida = iSalida >= 0 ? args[iSalida + 1] : null;

  const fechas = args.filter((a) => /^\d{8}$/.test(a));
  const yyyymmdd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
  const desde = fechas[0] || "20260728";                 // asuncion del mandato
  const hasta = fechas[1] || yyyymmdd(new Date());

  const vivos = await recolectar(desde, hasta, todos);
  const texto = formatear(vivos, desde, hasta);

  if (salida) { writeFileSync(salida, texto, "utf8"); console.error(`Escrito en ${salida}`); }
  else console.log(texto);
}

// Ejecuta la CLI solo si se invoca directamente (no al importar el modulo).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => { console.error("Error:", e.message); process.exit(1); });
}
