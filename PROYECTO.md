# PROYECTO — GoVisor

> Documento vivo. Se actualiza en **cada petición** que modifique el proyecto.
> Registra: qué es, qué hace, cómo funciona, tecnologías, y valuación en USD.

| Campo | Valor |
|---|---|
| **Nombre** | GoVisor |
| **Tipo** | Portal web de fiscalización ciudadana / visor de datos gubernamentales |
| **Estado** | v0.2 — visor estratégico, gabinete verificado en fuente oficial |
| **Repositorio** | https://github.com/oprbguitar/08082026ksfu |
| **Inicio** | 8 de agosto de 2026 |
| **Última actualización de este documento** | 8 de agosto de 2026 |

---

## 1. De qué se trata

GoVisor es un **visor en tiempo real del ejercicio de un gobierno**. Toma la fecha
de asunción de la Presidencia de la República del Perú como punto cero y, a partir
de ahí, contabiliza y organiza todo lo que ese gobierno produce: el gabinete que
nombra, las normas que se promulgan o derogan, y los viajes oficiales que autoriza
el Congreso — cada dato acompañado del enlace a su fuente oficial.

El principio de diseño es la **trazabilidad**: ningún dato aparece sin la norma que
lo respalda, y todo registro no contrastado se marca visiblemente como
`POR VERIFICAR`. El portal prefiere mostrar un vacío honesto antes que un dato
inventado.

## 2. Qué hace

| Función | Descripción |
|---|---|
| **Reloj de Lima** | Fecha larga y hora con segundos en zona `America/Lima`, independiente del reloj del visitante. |
| **Contador de mandato** | Días transcurridos desde la asunción, con equivalencia en palabras y barra de avance del periodo constitucional (1826 días). |
| **Contador por ministro** | Cada cartera muestra su propio "Día N". Si el ministro cesó, el contador se congela en los días que ejerció. |
| **Consejo de Ministros** | Las 19 carteras del Estado peruano, con titular, resolución de nombramiento y filtros (en funciones / cesados / sin datos). |
| **Normas del periodo** | Columna lateral fija con leyes y decretos, filtrables por origen (Congreso / Ejecutivo / Viajes), buscables, y con clic directo a El Peruano. |
| **Viajes oficiales** | Salidas al exterior con la Resolución Legislativa que las autoriza. |
| **Estadística con letras** | Cuatro tarjetas que narran el estado del gobierno en prosa, no en cifras sueltas. |
| **Portal de noticias** | Titulares públicos por tema, con enlace a la fuente original. |
| **Video (YouTube)** | Búsqueda de videos por tema usando la API key que el usuario ingresa y que queda solo en su navegador. |
| **Fuentes oficiales** | Bloque de enlaces a El Peruano, Congreso, SPIJ, PCM, gob.pe y JNE para verificar cada dato. |

## 3. Cómo funciona

Arquitectura deliberadamente simple: **sitio estático de cuatro archivos**, sin
build, sin servidor, sin dependencias.

```
index.html   →  estructura semántica y contenedores vacíos
styles.css   →  presentación (naranja + blanco, mobile-first)
data.js      →  LA VERDAD: constante global GOVISOR con todos los datos
app.js       →  lee GOVISOR y pinta el DOM; contadores, filtros, fetch
```

**Flujo:** el navegador carga `data.js` (define `GOVISOR`), luego `app.js` ejecuta
`iniciar()`, que pinta cada sección. Un `setInterval` de 1 segundo actualiza el
reloj; cuando detecta cambio de día en Lima, repinta los contadores para que
avancen exactamente a medianoche hora peruana.

**Cálculo de fechas:** las fechas ISO `"AAAA-MM-DD"` se normalizan a mediodía UTC
antes de restar. Esto evita el error clásico de corrimiento de un día por zona
horaria (Perú es UTC−5 sin horario de verano).

**Para actualizar el portal se edita únicamente `data.js`.** No hace falta tocar
código. Cada registro lleva `verificado: true|false`, y el portal renderiza el sello
correspondiente.

**Seguridad del render:** todo texto pasa por `esc()` (escape de HTML) y toda URL
por `urlSegura()`, que acepta solo `http:`/`https:`. Los datos vienen de un archivo
local, pero las noticias y YouTube vienen de terceros: se tratan como no confiables.

## 4. Tecnologías implementadas

| Capa | Tecnología | Por qué |
|---|---|---|
| Estructura | HTML5 semántico (`<article>`, `<aside>`, `<nav>`, ARIA) | Accesibilidad y SEO sin coste añadido. |
| Estilos | CSS3 puro: Custom Properties, Grid, Flexbox, `clamp()`, media queries | Cero dependencias; el tema completo son 8 variables. |
| Lógica | JavaScript ES2020 (IIFE, `async/await`, template literals) | Corre en cualquier navegador moderno sin transpilar. |
| Fechas/i18n | `Intl.DateTimeFormat` con `timeZone: "America/Lima"` | Zona horaria correcta sin librería (evita ~70 KB de moment/dayjs). |
| Persistencia | `localStorage` (solo la API key de YouTube) | La clave nunca sale del navegador del usuario. |
| Datos externos | YouTube Data API v3; RSS de Google Noticias vía lector JSON público | Titulares y video sin backend propio. |
| Accesibilidad | `prefers-reduced-motion`, `aria-label`, foco visible, contraste AA | Portal público: debe ser usable por todos. |
| Animación | `IntersectionObserver` (entradas al hacer scroll), `@keyframes` CSS con retardo escalonado, contador `requestAnimationFrame` con *easeOutCubic* | Movimiento sin librerías (ahorra ~30 KB de AOS/GSAP). |
| Interacción | `<details>`/`<summary>` nativos para los acordeones | Plegado accesible con teclado y sin JavaScript. |
| Rendimiento | Carga diferida de noticias (solo al abrir el acordeón), `backdrop-filter` en cabecera | Menos peticiones en el arranque; la página abre de inmediato. |
| Extras | Hoja de impresión, favicon SVG embebido, `theme-color` | Detalles de producto terminado. |
| Versionado | Git + GitHub | — |

**Dependencias de terceros instaladas: cero.** No hay `node_modules`, ni bundler,
ni framework. El sitio completo pesa por debajo de 60 KB.

## 5. Valuación del proyecto (USD)

Estimación del **valor de reemplazo**: lo que costaría contratar esta misma
implementación en el mercado. Base: ~1.150 líneas de código de producción y
documentación, entregadas y funcionales.

### 5.1 Esfuerzo estimado

| Actividad | Horas |
|---|---:|
| Arquitectura y modelado del esquema de datos | 4 |
| Diseño UI/UX y CSS responsive (3 breakpoints) | 8 |
| Lógica de render, contadores y filtros | 10 |
| Integración de noticias y YouTube API | 5 |
| Accesibilidad, seguridad de render y pruebas | 4 |
| Documentación y puesta en repositorio | 3 |
| Verificación documental en fuentes oficiales | 5 |
| Rediseño compacto y sistema de animaciones | 7 |
| Corrección de defectos y publicación | 2 |
| **Total** | **48 h** |

### 5.2 Valuación por estándar de mercado

| Estándar | Tarifa/hora | Valuación |
|---|---:|---:|
| Freelance LatAm (Perú, Colombia, México) | $25 – $45 | **$1.200 – $2.160** |
| Freelance internacional (Upwork/Toptal, perfil senior) | $60 – $95 | **$2.880 – $4.560** |
| Agencia digital EE. UU. / Europa Occidental | $110 – $160 | **$5.280 – $7.680** |
| Precio por producto (fixed-bid, entregable cerrado) | — | **$3.800 – $5.500** |

**Valuación de referencia recomendada: $4.500 USD.** Punto medio del rango
fixed-bid internacional. Refleja un producto funcional, accesible, documentado,
sin deuda técnica de dependencias y —lo que más pesa— **con sus datos
contrastados contra fuente primaria**, no copiados de segunda mano.

**Nota sobre el valor real:** el activo más valioso de un portal de fiscalización
no es el código, es **la curaduría verificada de los datos**. El trabajo recurrente
de contrastar cada resolución en El Peruano vale, de forma sostenida, más que la
construcción inicial: estimado en **$400 – $900 mensuales** de trabajo de
investigación si se mantiene actualizado a diario.

### 5.3 Costo de operación

| Modalidad | Infraestructura | Costo mensual |
|---|---|---:|
| **Local** (abrir `index.html` o servidor estático en la PC) | Ninguna | **$0** |
| **En línea — estático** (GitHub Pages, Netlify, Cloudflare Pages, Vercel) | Hosting gratuito, HTTPS y CDN incluidos | **$0** |
| **En línea — con dominio propio** | Dominio `.pe` o `.com` | **$1 – $4** (≈ $12–$45/año) |
| **En línea — con backend** (si se automatiza la ingesta) | VPS pequeño o funciones serverless + base de datos | **$5 – $25** |

**YouTube Data API v3:** cuota gratuita de 10.000 unidades/día. Cada búsqueda
consume 100 unidades → ~100 búsquedas diarias sin costo. Suficiente de sobra para
uso personal; **$0** en la práctica.

**Conclusión operativa:** en su forma actual el portal cuesta **$0/mes** tanto en
local como publicado en línea. Solo un dominio propio introduce costo real.

## 6. Tecnologías futuras recomendadas

Ordenadas por relación valor/esfuerzo:

| Prioridad | Mejora | Tecnología | Beneficio | Costo |
|---|---|---|---|---|
| **1** | Publicación en línea | GitHub Pages + GitHub Actions | Portal público con despliegue automático en cada push | $0 |
| **2** | Ingesta automática de normas | Scraper de El Peruano en Python (`requests` + `BeautifulSoup`) ejecutado por GitHub Actions cron, que reescribe `data.js` | Elimina el trabajo manual de curaduría, el mayor costo del proyecto | $0 |
| **3** | Migrar datos a JSON | `data.json` + `fetch()` | Permite que scripts externos escriban los datos sin tocar JavaScript | $0 |
| **4** | Historial y comparación | SQLite o Supabase (capa gratuita) | Ver evolución del gabinete en el tiempo, comparar con gobiernos previos | $0 – $25/mes |
| **5** | Instalable / offline | PWA: Service Worker + Web App Manifest | Funciona sin conexión y se instala en el móvil | $0 |
| **6** | Backend de noticias | Función serverless (Cloudflare Workers) que lea los RSS | Elimina la dependencia del lector RSS de terceros | $0 (capa gratuita) |
| **7** | Visualización temporal | D3.js o Chart.js | Línea de tiempo del gabinete, densidad legislativa por mes | $0 |
| **8** | Escala mayor | Migración a Astro o SvelteKit | Solo si el proyecto crece a decenas de vistas; hoy sería sobre-ingeniería | $0 |

**Recomendación:** las mejoras 1 y 2, juntas, convierten el proyecto de "portal que
alguien debe actualizar a mano" en "portal que se actualiza solo". Es el salto de
valor más grande disponible, y su costo de infraestructura sigue siendo cero.

---

## 7. Bitácora de peticiones

| # | Fecha | Petición | Entregado | Horas | Valor acumulado |
|---|---|---|---|---:|---:|
| 1 | 2026-08-08 | Portal visor del gobierno: contador presidencial, gabinete con resoluciones, normas al costado, viajes, noticias, YouTube API key, responsive naranja/blanco | `index.html`, `styles.css`, `data.js`, `app.js`, `README.md` | 31 | $2.900 |
| 2 | 2026-08-08 | Versionado en GitHub + documento de proyecto con valuación como práctica permanente | Repositorio Git inicializado y publicado; `PROYECTO.md` | 3 | $3.200 |
| 3 | 2026-08-08 | Validar los datos en fuentes oficiales; rediseño compacto tipo visor estratégico con animaciones; publicación en GitHub Pages | Verificación en El Peruano de la presidencia y las 19 R.S.; rediseño completo de las 3 capas; acordeones; animaciones; 3 defectos corregidos | 14 | **$4.500** |

### Detalle de la petición 3

**Verificación documental (5 h).** Se contrastaron con fuente primaria: la
juramentación del 28/07/2026, la Resolución 1625-2026-JNE de proclamación, y las
19 Resoluciones Supremas 223 a 241-2026-PCM. Se detectaron y corrigieron dos
discrepancias entre las notas de prensa y el texto de las resoluciones
(«Kosme» y «Gonzales»).

**Rediseño (7 h).** Densidad: las fichas de ministro pasaron de tarjetas de tres
bloques a filas de una línea. Las secciones secundarias se plegaron en
acordeones. La página quedó **~40 % más corta** con la misma información.

**Corrección de defectos (2 h).** Tres fallos detectados en verificación:
contador y barra dependían de `requestAnimationFrame` (se quedaban en cero si la
pestaña no componía), y dos frases con concordancia gramatical rota cuando un
conteo era cero.
