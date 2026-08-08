# GoVisor

**Visor ciudadano del gobierno · República del Perú**

Portal web que muestra, en tiempo real y con trazabilidad a la fuente oficial:
el tiempo transcurrido del mandato presidencial, el Consejo de Ministros con la
resolución que nombró a cada titular, las normas promulgadas o derogadas, los
viajes oficiales, y un panel de noticias y video.

---

## ⚠️ Antes de usarlo: lee esto

Este repositorio contiene **el visor, no los datos**. La capa de datos
(`data.js`) viene con:

- ✅ **Las 19 carteras reales** del Consejo de Ministros del Perú (dato estructural).
- ⬜ **Nombres, fechas y resoluciones vacíos**, marcados `POR VERIFICAR`.

Los nombres, fechas de nombramiento y números de resolución **deben ser
verificados por ti** en el Diario Oficial El Peruano y el Congreso de la República
antes de publicarse. El portal está diseñado para mostrar vacíos honestos en lugar
de datos sin respaldo.

## Cómo ejecutarlo

**Local — la forma más simple:** abre `index.html` con doble clic. Funciona.

**Local — con servidor** (recomendado, evita restricciones del navegador):

```bash
python -m http.server 8080
```

Luego abre `http://localhost:8080`.

**En línea:** sube el repositorio a GitHub Pages, Netlify o Cloudflare Pages. No
requiere build ni configuración: es HTML, CSS y JS estáticos.

## Cómo cargar datos

Todo se edita en un solo archivo: **`data.js`**. No toques el resto.

### Fecha de asunción y contador presidencial

```js
presidencia: {
  nombre: "...",
  fechaAsuncion: "2026-07-28",   // "AAAA-MM-DD" — de aquí sale el contador
  verificado: false,             // ponlo en true cuando lo confirmes
  norma: { tipo:"Resolución Suprema", numero:"...", fecha:"...", enlace:"https://..." }
}
```

### Un ministro

```js
{ sigla:"MEF", cartera:"Economía y Finanzas",
  ministro:"Nombre Apellido",
  estado:"activo",                    // "activo" | "cesado"
  fechaNombramiento:"2026-07-28",
  fechaCese:"",                       // si cesa, el contador se congela aquí
  verificado:true,
  norma:{ tipo:"Resolución Suprema", numero:"000-2026-PCM",
          fecha:"2026-07-28", enlace:"https://busquedas.elperuano.pe/..." } }
```

### Una ley o decreto

```js
{ tipo:"Ley", numero:"00000",
  sumilla:"Descripción breve de la norma",
  fecha:"2026-08-05",
  origen:"congreso",       // "congreso" | "ejecutivo" | "viaje"
  accion:"promulgada",     // "promulgada" | "derogada" | "observada" | "modificada"
  enlace:"https://busquedas.elperuano.pe/...",
  verificado:true }
```

Guarda y recarga el navegador. El portal se repinta solo.

## YouTube

En la sección **Video** puedes ingresar tu propia API key de la
[YouTube Data API v3](https://console.cloud.google.com/).

La clave se guarda **únicamente en tu navegador** (`localStorage`). No se envía a
ningún servidor de este proyecto ni se versiona en el repositorio: el navegador
consulta directamente a Google.

**Recomendación de seguridad:** en Google Cloud, restringe la clave por referente
HTTP y habilítala solo para YouTube Data API v3. La cuota gratuita (10.000
unidades/día ≈ 100 búsquedas) es más que suficiente.

## Estructura

```
index.html    estructura y contenedores
styles.css    presentación — naranja/blanco, mobile-first
data.js       ← EDITA SOLO ESTE ARCHIVO
app.js        render, contadores, filtros y llamadas externas
PROYECTO.md   qué es, cómo funciona, tecnologías y valuación
```

## Tecnologías

HTML5 semántico · CSS3 (Grid, Flexbox, Custom Properties) · JavaScript ES2020 ·
`Intl.DateTimeFormat` con zona `America/Lima` · YouTube Data API v3 · RSS.

**Sin frameworks. Sin dependencias. Sin build.** Menos de 60 KB en total.

Detalle completo, costos y hoja de ruta técnica en [PROYECTO.md](PROYECTO.md).

## Fuentes oficiales

- [El Peruano — Normas Legales](https://busquedas.elperuano.pe/)
- [Congreso de la República — Leyes](https://www.congreso.gob.pe/leyes/)
- [SPIJ — Sistema Peruano de Información Jurídica](https://spij.minjus.gob.pe/)
- [Presidencia del Consejo de Ministros](https://www.gob.pe/pcm)
- [Jurado Nacional de Elecciones](https://www.jne.gob.pe/)

## Licencia y propósito

Proyecto de información y fiscalización ciudadana. No está afiliado a ninguna
entidad del Estado peruano ni a organización política alguna. Los datos deben
contrastarse siempre con las fuentes oficiales enlazadas.
