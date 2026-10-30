#!/usr/bin/env node
/* ============================================================================
   GoVisor — actualizacion automatica de normas
   ----------------------------------------------------------------------------
   Lo ejecuta el GitHub Action programado. Corre el scraper de El Peruano para
   el rango asuncion → hoy, reescribe EN EL SITIO el bloque `normas` de data.js
   (entre los marcadores NORMAS-GENERADAS-INICIO / FIN) y, solo si el bloque
   cambio, refresca el sello de version para que cada visor abierto se recargue.

   FUSION SIN PERDIDAS: lo ya publicado nunca se borra. Cada corrida suma lo
   nuevo a lo que el bloque ya tenia (clave: el enlace del dispositivo). Una
   version anterior REEMPLAZABA el bloque con lo que devolvia el buscador, y
   como el buscador corta en 60 paginas, en octubre de 2026 el visor perdio
   todo julio, agosto y setiembre sin que nadie lo notara.

   Es idempotente: si el scrape no trae nada nuevo, no toca ningun archivo y no
   genera commit. Los enlaces ya verificados no se vuelven a pedir.

   Uso:  node scripts/actualizar.mjs               # ultimos 14 dias (corrida diaria)
         node scripts/actualizar.mjs --completo    # asuncion → hoy (barrido semanal)
         node scripts/actualizar.mjs 20260728 20260901
   ========================================================================== */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import vm from "node:vm";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recolectar, formatear } from "./scrape-elperuano.mjs";

const raiz     = join(dirname(fileURLToPath(import.meta.url)), "..");
const rutaData = join(raiz, "data.js");

const MARCA_INI = "/* NORMAS-GENERADAS-INICIO";
const MARCA_FIN = "/* NORMAS-GENERADAS-FIN */";
const CABECERA  =
`/* NORMAS-GENERADAS-INICIO — bloque reescrito automaticamente por
       scripts/actualizar.mjs (tarea programada). No editar a mano entre marcadores. */`;

/** Sello Lima AAAAMMDD.HHMM: cambia en cada actualizacion real, para que el
 *  refresco automatico detecte datos nuevos aun el mismo dia. */
function selloLima() {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false
  }).formatToParts(new Date()).reduce((o, x) => (o[x.type] = x.value, o), {});
  return `${p.year}${p.month}${p.day}.${p.hour}${p.minute}`;
}

const ASUNCION = "20260728";
const VENTANA_DIAS = 14;
const yyyymmdd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
const args  = process.argv.slice(2);
const fechas = args.filter((a) => /^\d{8}$/.test(a));
const hoy = new Date();
const haceVentana = yyyymmdd(new Date(hoy.getTime() - VENTANA_DIAS * 864e5));
const desde = fechas[0] || (args.includes("--completo") ? ASUNCION
                            : (haceVentana > ASUNCION ? haceVentana : ASUNCION));
const hasta = fechas[1] || yyyymmdd(hoy);

const data = readFileSync(rutaData, "utf8");
const i = data.indexOf(MARCA_INI);
const j = data.indexOf(MARCA_FIN);
if (i < 0 || j < 0) {
  console.error("No se hallaron los marcadores NORMAS-GENERADAS en data.js.");
  process.exit(1);
}
const jFin = j + MARCA_FIN.length;
const bloqueViejo = data.slice(i, jFin);

// Normas ya publicadas en el bloque: se leen evaluando solo el arreglo.
const previas = vm.runInNewContext("[" + bloqueViejo + "]");
const porEnlace = new Map(previas.filter((n) => n && n.enlace)
  .map((n) => [n.enlace, Object.assign({}, n, { href: n.enlace })]));

const vivos = await recolectar(desde, hasta, false, new Set(porEnlace.keys()));
let nuevas = 0;
for (const f of vivos) {
  if (!porEnlace.has(f.href)) nuevas++;
  porEnlace.set(f.href, f);          // lo recien leido manda sobre lo previo
}
const todas = [...porEnlace.values()];
console.log(`Scrape ${desde}→${hasta}: ${vivos.length} normas · ${nuevas} nuevas · total ${todas.length}`);

const fragmento = formatear(todas, ASUNCION, hasta).trimEnd();
const bloqueNuevo = `${CABECERA}\n    ${fragmento}\n    ${MARCA_FIN}`;

// El formato es determinista: mismo contenido, mismo texto.
if (bloqueViejo === bloqueNuevo) {
  console.log(`Sin cambios: ${todas.length} normas, el bloque ya estaba al dia.`);
  process.exit(0);
}

const nuevo = data.slice(0, i) + bloqueNuevo + data.slice(jFin);
writeFileSync(rutaData, nuevo, "utf8");

// Nuevo sello en los cuatro archivos, para disparar el refresco de los visores.
const sello = selloLima();
execFileSync(process.execPath, [join(raiz, "scripts", "publicar.mjs"), sello], { stdio: "inherit" });

console.log(`Actualizado: ${todas.length} normas (${nuevas} nuevas) · sello ${sello}`);
