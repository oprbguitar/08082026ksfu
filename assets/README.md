# assets/

## `govisor-peru-banner.webp` — imagen del héroe

**Este archivo todavía no está en el repositorio.** El sitio funciona sin él:
`styles.css` declara un degradado teal de respaldo detrás de la imagen, así que
el héroe se ve correcto y el texto sigue siendo legible. Al colocar el archivo
aquí, aparece automáticamente. No hay que tocar código.

### Qué debe contener

Panorámica del Perú en un solo plano, de izquierda a derecha:

| Zona | Contenido |
|---|---|
| Izquierda | Palacio de Gobierno / Lima institucional |
| Centro | Machu Picchu y los Andes |
| Derecha | Acantilados de la Costa Verde / Lima moderna |

**La imagen no debe llevar texto incrustado.** Todos los titulares del héroe son
HTML real, para que sean seleccionables, traducibles y accesibles.

### Especificaciones

- Formato: **WebP** (mejor compresión que JPEG a igual calidad).
- Ancho: **2400 px** aproximadamente; relación ~21:9.
- Peso: **por debajo de 500–700 KB**. No subir un archivo de 8–15 MB.
- El texto del héroe se apoya sobre el tercio izquierdo: deja esa zona sin
  detalle crítico, porque un velo blanco en degradado la cubre parcialmente.

### Variantes opcionales

Si quieres servir tamaños distintos por dispositivo, añade también:

```
govisor-peru-banner-1600.webp
govisor-peru-banner-1200.webp
govisor-peru-banner-768.webp
```

y declara las reglas `@media` correspondientes en `styles.css`, junto a la regla
`.hero-img`.

### Cómo convertir y optimizar

Con [`cwebp`](https://developers.google.com/speed/webp/download):

```bash
cwebp -q 82 -resize 2400 0 panorama-original.jpg -o govisor-peru-banner.webp
```

### Derechos

Usa solo imágenes propias, de dominio público o con licencia que permita el uso.
GoVisor es un proyecto de fiscalización ciudadana: la procedencia de sus
materiales también debe ser trazable.
