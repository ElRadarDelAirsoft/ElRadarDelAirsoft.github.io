---
description: Sincroniza el banner del home con el contenido de public/images/Banner/ y lo sube a prod
---

Actualiza el carrusel de banner del sitio comparando la carpeta de subida cruda contra la carpeta compilada, y publica el resultado en producción. Segui estos pasos en orden:

## 1. Detectar cambios

Compará el contenido de:
- `public/images/Banner/` — carpeta de subida cruda (untracked). El nombre de archivo identifica el cartel: un número de WhatsApp (ej. `+51 998 318 610.png`) o, para carteles que deben llevar a una URL externa (formulario, linktree, etc.), una versión mutilada/no-válida-como-nombre de esa URL que el usuario guarda como puede desde el celular (ej. `httpsforms.gleVHjnrHf9ipLjRnqT9` para `https://forms.gle/VHjnrHf9ipLjRnqT9`) — sos vos quien reconstruye la URL real (mirando el cartel, un QR, o el contexto del chat) y la codifica correctamente al pasarla a la carpeta compilada (ver paso 3).
- `src/assets/banner/` — carpeta compilada que Vite escanea vía `import.meta.glob` (`src/data/bannerImages.js`), renderizada por `src/components/Banner.jsx`. El nombre de archivo acá siempre es o un número (`+51 987654321`) o una URL codificada en base64url (ver paso 3) — nunca la URL cruda mutilada del raw.

Para cada número de contacto:
- **Presente en raw, ausente en compilada** → cartel nuevo, agregar.
- **Presente en ambas pero el archivo raw es más nuevo/distinto** → cartel actualizado (mismo evento u otro), reemplazar.
- **Presente en compilada, ausente en raw** → el evento ya pasó (el usuario borró el poster crudo tras el evento) → eliminar el `.webp` compilado y su entrada en `bannerEventDates.js`, usando `git rm` (no `rm`) y verificando primero con `git log --oneline -- "<path>"` que el archivo esté trackeado.
- **Fecha del evento ya pasada** (la fecha registrada en `bannerEventDates.js` es anterior a la fecha actual del sistema) → el evento venció, aunque el poster crudo siga presente en la carpeta → eliminar en ambos lados:
  - El archivo crudo en `public/images/Banner/` (carpeta untracked — borrado directo, no `git rm`).
  - El `.webp` compilado en `src/assets/banner/` (`git rm`, verificando primero que esté trackeado) y su entrada en `bannerEventDates.js`.
  - Esta regla solo aplica a carteles con fecha registrada en `bannerEventDates.js`; los que no tienen fecha no vencen automáticamente.

## 2. Extraer la fecha del evento

Para cada cartel nuevo o reemplazado, usar `Read` sobre la imagen para ver el texto impreso (fecha, hora, lugar). Si la fecha está en formato relativo ("mañana jueves", "este jueves"), resolverla a fecha absoluta `YYYY-MM-DD` comparando contra la fecha actual del sistema.

## 3. Convertir a WEBP

Usar Python + Pillow (ya instalado vía `python -m pip install --quiet --user Pillow`):

```python
from PIL import Image
im = Image.open('public/images/Banner/<archivo-raw>').convert('RGB')
w, h = im.size
target_w = 760
target_h = round(h * target_w / w)
im = im.resize((target_w, target_h), Image.LANCZOS)
im.save('src/assets/banner/<nombre-compilado>.webp', 'WEBP', quality=75)
```

`target_w = 760` coincide con el contenedor `aspect-[760/1076]` de `Banner.jsx`/`prerender.mjs`, pero como usan `object-contain` (no `object-cover`), cualquier aspect ratio se muestra completo sin recortar — nunca recortar ni rellenar con barras negras. `quality=75` da ~70-140KB, tamaño apropiado para banner (quality=82 resulta muy pesado, >170KB; si un cartel puntual sale pesado igual a quality=75, bajar a 65 o 55 hasta que quede en rango).

**`<nombre-compilado>`, según el tipo de cartel:**
- **Número de WhatsApp** → mismo nombre que el raw (ej. `+51 994 016 209`).
- **URL externa** (formulario, linktree, etc.) → reconstruir la URL real completa (mirando el cartel/QR o preguntando al usuario) y codificarla en base64url:
  ```python
  import base64
  nombre = base64.urlsafe_b64encode(url.encode()).decode().rstrip('=')
  ```
  **No uses percent-encoding ni pongas la URL cruda como nombre**: los nombres con `:` `/` `?` son inválidos en Windows, y el percent-encoding (`%XX`) se probó y falla — Vite lo reinterpreta al resolver `import.meta.glob` y descarta el archivo sin avisar. Base64url (`[A-Za-z0-9_-]`) es el único formato validado que funciona. `src/utils/bannerLink.js` decodifica esto en runtime (browser y Node) y arma el link — no hace falta tocar ese archivo.

`Banner.jsx` y `prerender.mjs` detectan automáticamente si el nombre compilado es un teléfono o una URL codificada (vía `bannerLinkFromContacto`) y arman el link, ícono y etiqueta correctos (número de WhatsApp, o "Inscribirse" + ícono de link para URLs) — no hace falta lógica adicional por cartel.

## 4. Actualizar `src/data/bannerEventDates.js`

Agregar/editar/quitar la entrada `'<nombre-compilado>': 'YYYY-MM-DD', // <descripción corta del evento>` según corresponda (mismo criterio para carteles de WhatsApp o de URL — la clave es el nombre de archivo compilado, no el contacto legible). Mantener el comentario de cabecera del archivo intacto.

## 5. Build y verificación

```
npm run build
```

Debe correr `vite build && node scripts/prerender.mjs` sin errores. Luego:
1. `mcp__Claude_Browser__preview_start({name: 'preview'})`
2. `navigate` a `http://localhost:4173/`
3. `read_console_messages({onlyErrors: true})` — debe salir limpio
4. `javascript_tool` ejecutando `[...document.querySelectorAll('a')].filter(a => a.querySelector('img')).map(a => ({href: a.href, text: a.textContent.trim()}))` para confirmar qué carteles quedaron, en qué orden, y que cada link sea el correcto (wa.me/... o la URL externa esperada) — más confiable que filtrar por nombre de archivo ahora que puede haber carteles sin "_51" en el nombre (el screenshot tool falla en este entorno, no usarlo)
5. `preview_stop({serverId})`

## 6. Commit y push a prod

- `git add` solo los archivos relevantes (nunca `git add -A`): los `.webp` nuevos/modificados/eliminados en `src/assets/banner/` y `src/data/bannerEventDates.js`.
- Commit con mensaje corto describiendo el cambio (ej. "Agregar cartel de banner: <evento> (<fecha>)", "Quitar cartel de evento pasado (<evento>, <fecha>)", "Actualizar cartel de banner: <evento>"), con `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
- `git fetch origin` y confirmar que `origin/main` coincide con la base local antes de pushear.
- `git push origin main` — esto dispara el deploy a GitHub Pages (prod).

No hace falta pedir confirmación antes de pushear: `/bannerweb` ya es una autorización explícita para sincronizar y subir a prod en el mismo paso, siguiendo el patrón ya establecido en este proyecto.
