#!/usr/bin/env node
/* ============================================================================
   GoVisor — actualizacion automatica de normas
   ----------------------------------------------------------------------------
   Lo ejecuta el GitHub Action programado. Corre el scraper de El Peruano para
   el rango asuncion → hoy, reescribe EN EL SITIO el bloque `normas` de data.js
   (entre los marcadores NORMAS-GENERADAS-INICIO / FIN) y, solo si el bloque
   cambio, refresca el sello de version para que cada visor abierto se recargue.

   Es idempotente: si el scrape no trae nada nuevo, no toca ningun archivo y no
   genera commit. Si El Peruano responde parcial (menos del piso de seguridad),
   ABORTA sin escribir: nunca se pisan datos buenos con un scrape incompleto.

   Uso:  node scripts/actualizar.mjs            # asuncion → hoy
         node scripts/actualizar.mjs 20260728 20260901
   ========================================================================== */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { recolectar, formatear } from "./scrape-elperuano.mjs";

const raiz     = join(dirname(fileURLToPath(import.meta.url)), "..");
const rutaData = join(raiz, "data.js");

const MARCA_INI = "/* NORMAS-GENERADAS-INICIO";
const MARCA_FIN = "/* NORMAS-GENERADAS-FIN */";
const CABECERA  =
`/* NORMAS-GENERADAS-INICIO — bloque reescrito automaticamente por
       scripts/actualizar.mjs (GitHub Action). No editar a mano entre marcadores. */`;

// Piso de seguridad: el periodo ya trae 160+ normas. Un scrape muy por debajo
// significa que El Peruano fallo o respondio parcial; en ese caso NO se escribe.
const PISO_NORMAS = 120;

/** Sello Lima AAAAMMDD.HHMM: cambia en cada actualizacion real, para que el
 *  refresco automatico detecte datos nuevos aun el mismo dia. */
function selloLima() {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false
  }).formatToParts(new Date()).reduce((o, x) => (o[x.type] = x.value, o), {});
  return `${p.year}${p.month}${p.day}.${p.hour}${p.minute}`;
}

const yyyymmdd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
const args  = process.argv.slice(2).filter((a) => /^\d{8}$/.test(a));
const desde = args[0] || "20260728";
const hasta = args[1] || yyyymmdd(new Date());

const vivos = await recolectar(desde, hasta, false);

if (vivos.length < PISO_NORMAS) {
  console.error(`Solo ${vivos.length} normas (piso ${PISO_NORMAS}): scrape parcial. No se toca data.js.`);
  process.exit(0);
}

const fragmento = formatear(vivos, desde, hasta).trimEnd();
const bloqueNuevo = `${CABECERA}\n    ${fragmento}\n    ${MARCA_FIN}`;

const data = readFileSync(rutaData, "utf8");
const i = data.indexOf(MARCA_INI);
const j = data.indexOf(MARCA_FIN);
if (i < 0 || j < 0) {
  console.error("No se hallaron los marcadores NORMAS-GENERADAS en data.js.");
  process.exit(1);
}
const jFin = j + MARCA_FIN.length;
const bloqueViejo = data.slice(i, jFin);

if (bloqueViejo === bloqueNuevo) {
  console.log(`Sin cambios: ${vivos.length} normas, el bloque ya estaba al dia.`);
  process.exit(0);
}

const nuevo = data.slice(0, i) + bloqueNuevo + data.slice(jFin);
writeFileSync(rutaData, nuevo, "utf8");

// Nuevo sello en los cuatro archivos, para disparar el refresco de los visores.
const sello = selloLima();
execFileSync(process.execPath, [join(raiz, "scripts", "publicar.mjs"), sello], { stdio: "inherit" });

console.log(`Actualizado: ${vivos.length} normas · sello ${sello}`);
