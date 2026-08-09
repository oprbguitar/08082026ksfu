# assets/

## Imagen del héroe — ya incorporada

| Archivo | Dimensiones | Peso | Se sirve en |
|---|---|---:|---|
| `govisor-peru-banner.webp` | 1717 × 693 | 242 KB | ≥ 1600 px |
| `govisor-peru-banner-1600.webp` | 1600 × 646 | 219 KB | 1200–1599 px |
| `govisor-peru-banner-1200.webp` | 1200 × 484 | 141 KB | 768–1199 px |
| `govisor-peru-banner-768.webp` | 768 × 310 | 61 KB | ≤ 767 px |

Panorámica del Perú en un solo plano: **Palacio de Gobierno** a la izquierda,
**Machu Picchu y los Andes** al centro, **Costa Verde y Lima moderna** a la
derecha. Sin texto incrustado: todos los titulares del héroe son HTML real.

### Cómo se procesó

El original (PNG, 1717 × 916, 2,3 MB) traía franjas blancas arriba y abajo. Se
detectó el recuadro útil y se recortó a **1717 × 693** (relación 2,48:1), luego
se generaron las cuatro variantes en WebP con Pillow (calidad 78–80, `method=6`).

**No se amplió a 2400 px**: el original mide 1717 de ancho y escalar hacia
arriba solo habría degradado la imagen sin ganar detalle.

### Cómo regenerarlas

```bash
python - <<'EOF'
from PIL import Image, ImageChops
im = Image.open('origen.png').convert('RGB')
fondo = Image.new('RGB', im.size, (255,255,255))
im = im.crop(ImageChops.difference(im, fondo).convert('L').point(lambda p: 255 if p>12 else 0).getbbox())
for ancho, suf, q in [(2400,'',80),(1600,'-1600',80),(1200,'-1200',80),(768,'-768',78)]:
    w = min(ancho, im.size[0]); h = round(im.size[1]*w/im.size[0])
    im.resize((w,h), Image.LANCZOS).save(f'assets/govisor-peru-banner{suf}.webp','WEBP',quality=q,method=6)
EOF
```

### Respaldo

`styles.css` mantiene un degradado teal **debajo** de la imagen. Si un archivo
faltara, el héroe se sigue viendo correcto y el titular sigue siendo legible.

### Derechos

Usa solo imágenes propias, de dominio público o con licencia que permita el uso.
GoVisor es un proyecto de fiscalización ciudadana: la procedencia de sus
materiales también debe ser trazable.
