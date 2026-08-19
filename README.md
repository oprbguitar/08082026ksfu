# GoVisor

**Visor ciudadano del gobierno · República del Perú**

Portal web que muestra, en tiempo real y con trazabilidad a la fuente oficial:
el tiempo transcurrido del mandato presidencial, el Consejo de Ministros con la
resolución que nombró a cada titular, las normas promulgadas o derogadas, los
viajes oficiales, y un panel de noticias y video.

---

**En línea:** https://gobierno.quest/

## Estado de verificación

| Dato | Estado | Fuente |
|---|---|---|
| Juramentación presidencial (28/07/2026) | ✅ Verificado | Congreso de la República |
| Proclamación — Resolución 1625-2026-JNE | ✅ Verificado | El Peruano / JNE |
| Los 19 ministros y sus R.S. 223 a 241-2026-PCM | ✅ Verificado | El Peruano, dispositivo por dispositivo |
| Leyes y decretos del periodo | ⬜ En registro | — |
| Las 17 promesas del Mensaje a la Nación (28/07/2026) | ✅ Contrastadas | El Peruano, TV Perú y prensa nacional |
| Las 16 medidas de los primeros 100 días, con semáforo | ✅ Contrastadas | El Peruano, TV Perú, plan «Perú con Orden» |

Los nombres se transcriben **tal como figuran en la Resolución Suprema**, que es
la fuente primaria. Dos difieren de las notas de prensa: la R.S. 232-2026-PCM dice
«Juan Manuel **Kosme** Sheput Moore» (no «Cosme»), y El Peruano consigna
«Arnillas **Gonzales**» (no «González»).

Todo registro no contrastado se muestra con el sello `POR VERIFICAR`. El portal
prefiere un vacío honesto antes que un dato sin respaldo documental.

## Dominio

El sitio se publica en **https://gobierno.quest** (dominio propio, registrado en Porkbun).
El archivo `CNAME` de la raíz es lo que le dice a GitHub Pages qué dominio
servir: si se borra, Pages vuelve a la URL `github.io`.

En Porkbun, con los nameservers de Porkbun ya activos, los registros DNS son:

| Tipo | Host | Valor |
|---|---|---|
| A | *(vacío / raíz)* | `185.199.108.153` |
| A | *(vacío / raíz)* | `185.199.109.153` |
| A | *(vacío / raíz)* | `185.199.110.153` |
| A | *(vacío / raíz)* | `185.199.111.153` |
| CNAME | `www` | `oprbguitar.github.io.` |

Después, en **Settings → Pages** del repositorio, poner `gobierno.quest` como
*Custom domain* y marcar **Enforce HTTPS** cuando GitHub termine de emitir el
certificado (tarda unos minutos tras propagar el DNS).

### La URL `github.io` no debe verse

Tres capas se encargan de ello, de la más fuerte a la más débil:

1. **`CNAME`** — con el dominio configurado, GitHub Pages responde **301** desde
   `oprbguitar.github.io/08082026ksfu/*` hacia `gobierno.quest/*`. Es la
   redirección real, del lado del servidor.
2. **Guardia en el `<head>`** de `index.html` y `fuentes.html` — un script
   inline que corre antes de pintar o descargar nada: si el host termina en
   `.github.io`, salta al dominio propio conservando ruta, query y ancla. Cubre
   el rato en que Pages aún no aplicó el `CNAME` y las páginas que el navegador
   sirva desde su caché. No toca `localhost` ni ningún otro host, así que el
   desarrollo local sigue funcionando igual.
3. **`404.html`** — Pages la sirve ante cualquier ruta desconocida. Lleva el
   mismo guardia más un `meta refresh`, para que un enlace roto tampoco deje al
   visitante en el 404 genérico de `github.io`.

## Promesas: cómo se contrastan

Las 17 promesas registradas se cotejaron una por una contra fuentes publicadas
(19/08/2026). Cada una lleva un **nivel de evidencia** y la lista de enlaces que
la respaldan, visible bajo la promesa en el propio visor:

| Nivel | Qué significa |
|---|---|
| `oficial` | El anuncio consta en un medio del Estado — El Peruano o TV Perú. |
| `verificado` | Lo consignan al menos dos medios independientes entre sí. |
| `preliminar` | Lo reporta una sola fuente, o las fuentes discrepan sobre la cifra. |

Ninguna promesa sube de `no_iniciada` sin una entrada en `evidencia` que
enlace al acto de gobierno que la ejecuta.

## Primeros 100 días: el semáforo

`medidas100` en `data.js` lleva las medidas anunciadas para el arranque, con
tres estados:

| Semáforo | Estado | Criterio |
|---|---|---|
| 🟢 | `ejecutada` | Acto de gobierno consumado: norma publicada, programa operando, obra entregada. |
| 🟡 | `en_proceso` | Acto formal de trámite verificable, pero el entregable aún no existe. |
| 🔴 | `no_iniciada` | Solo el anuncio; ningún acto documentado. |

El contador Día N / 100 se calcula en vivo sobre la fecha real de asunción; el
semáforo se cuenta solo a partir de `medidas100`.

## Refresco automático

GitHub Pages sirve los archivos con caché de navegador, así que una visita
posterior podría quedarse con datos viejos. El visor lo resuelve así:

1. `version.json` se pide siempre con `cache: "no-store"` — nunca sale de la
   caché — y lleva el mismo sello que `GOVISOR.meta.version`.
2. Si los dos dejan de coincidir, lo cargado es antiguo y la página se recarga
   con un sello nuevo en la URL, lo que obliga a traer HTML, CSS y datos
   frescos del servidor.
3. Se comprueba **al entrar** (arranque de sesión), al volver a la pestaña, al
   restaurar desde la caché de retroceso y cada 5 minutos si la pestaña queda
   abierta.

Un cortafuegos evita el bucle: si la URL ya trae ese mismo sello y los archivos
siguen siendo viejos, avisa por consola en vez de recargar otra vez.

**Al publicar, corre siempre:**

```bash
node scripts/publicar.mjs          # sello de hoy (AAAAMMDD), zona de Lima
node scripts/publicar.mjs 20260901 # o un sello explícito
```

Deja el mismo sello en `version.json`, en `GOVISOR.meta.version` y en los
`?v=` de `index.html` y `fuentes.html`. Si se editan a mano y quedan
descoordinados, el refresco no funciona.

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
styles.css    presentación — identidad teal institucional, mobile-first
assets/       imagen del héroe (ver assets/README.md)
scripts/      scraper de El Peruano y publicador del sello de versión
version.json  sello de publicación — dispara el refresco del visor
CNAME         dominio propio que sirve GitHub Pages
404.html      ruta desconocida → redirige al dominio propio
data.js       ← EDITA SOLO ESTE ARCHIVO
app.js        render, contadores, filtros y llamadas externas
PROYECTO.md   qué es, cómo funciona, tecnologías y valuación
```

## Tecnologías

HTML5 semántico · CSS3 (Grid, Flexbox, design tokens) · JavaScript ES2020 ·
`Intl.DateTimeFormat` con zona `America/Lima` · YouTube Data API v3 · RSS.

**Sin frameworks. Sin dependencias. Sin build.** Menos de 60 KB en total.

Detalle completo, costos y hoja de ruta técnica en [PROYECTO.md](PROYECTO.md).

## Fuentes oficiales

- [El Peruano — Normas Legales](https://busquedas.elperuano.pe/)
- [El Peruano — Normas del día](https://diariooficial.elperuano.pe/Normas)
- [Congreso de la República](https://www.congreso.gob.pe/)
- [SPIJ — Sistema Peruano de Información Jurídica](https://spij.minjus.gob.pe/)
- [Presidencia del Consejo de Ministros](https://www.gob.pe/pcm)
- [Jurado Nacional de Elecciones](https://portal.jne.gob.pe/)

## Licencia y propósito

Proyecto de información y fiscalización ciudadana. No está afiliado a ninguna
entidad del Estado peruano ni a organización política alguna. Los datos deben
contrastarse siempre con las fuentes oficiales enlazadas.
