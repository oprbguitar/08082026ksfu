#!/usr/bin/env node
/* Publica un sello de version nuevo en TODOS los sitios a la vez.
   ------------------------------------------------------------------
   El visor se refresca solo comparando `version.json` con
   `GOVISOR.meta.version`. Para que eso funcione —y no acabe en un bucle
   de recargas— los cuatro archivos tienen que llevar el mismo sello:

     version.json      lo que anuncia el servidor (se pide sin cache)
     data.js           GOVISOR.meta.version, lo que tiene cargado el visor
     index.html        ?v= de styles.css, i18n.js, data.js y app.js
     fuentes.html      idem

   Uso:  node scripts/publicar.mjs            -> sello de hoy (AAAAMMDD)
         node scripts/publicar.mjs 20260901   -> sello explicito

   Ejecutalo despues de editar data.js y antes de hacer commit.
   ------------------------------------------------------------------ */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Fecha de Lima en AAAAMMDD: el sello debe leerse igual que el resto del sitio. */
function selloDeHoy() {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(new Date());
  return p.replaceAll("-", "");
}

const sello = process.argv[2] || selloDeHoy();
if (!/^\d{8}(\.\d+)?$/.test(sello)) {
  console.error(`Sello invalido: "${sello}". Se espera AAAAMMDD o AAAAMMDD.N`);
  process.exit(1);
}

const editar = (rel, fn) => {
  const ruta = join(raiz, rel);
  const antes = readFileSync(ruta, "utf8");
  const despues = fn(antes);
  writeFileSync(ruta, despues);
  return antes !== despues;
};

const cambios = [];

if (editar("version.json", (s) =>
  s.replace(/"version":\s*"[^"]*"/, `"version": "${sello}"`)
   .replace(/"actualizado":\s*"[^"]*"/,
            `"actualizado": "${sello.slice(0,4)}-${sello.slice(4,6)}-${sello.slice(6,8)}T00:00:00-05:00"`)
)) cambios.push("version.json");

if (editar("data.js", (s) =>
  s.replace(/version:\s*"[^"]*"/, `version: "${sello}"`)
   .replace(/ultimaActualizacion:\s*"[^"]*"/,
            `ultimaActualizacion: "${sello.slice(0,4)}-${sello.slice(4,6)}-${sello.slice(6,8)}"`)
)) cambios.push("data.js");

for (const html of ["index.html", "fuentes.html"]) {
  if (editar(html, (s) =>
    s.replace(/(styles\.css|i18n\.js|data\.js|app\.js)\?v=[^"]*/g, `$1?v=${sello}`)
  )) cambios.push(html);
}

console.log(`Sello publicado: ${sello}`);
console.log(cambios.length ? `Actualizados: ${cambios.join(", ")}` : "Sin cambios: ya estaba en ese sello.");
