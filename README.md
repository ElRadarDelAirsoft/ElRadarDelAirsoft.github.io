# El Radar del Airsoft

Directorio web de la comunidad de airsoft en Perú: canchas, tiendas, grupos de WhatsApp,
eventos, importadores, mercado de pulgas, workshops, jugadores y equipos.

Sin backend, sin login. Todo el contenido vive en un único archivo JSON estático.

## Stack

- React 18 + Vite
- Tailwind CSS (mobile-first, dark mode por clase)
- Sin librerías de íconos externas (SVGs propios en `src/components/Icons.jsx`)

## Cómo editar el contenido

**Edita únicamente [`public/data/airsoft.json`](public/data/airsoft.json).** Es el único
archivo que necesitas tocar para agregar, modificar o quitar canchas, tiendas, eventos, etc.

- No cambies los nombres de las claves (`nombre`, `whatsapp`, `direccion`...), solo los valores.
- Si un campo no aplica, déjalo como `""` (no lo borres).
- Para agregar una entrada nueva: copia un objeto existente dentro del arreglo de su
  categoría, pégalo debajo y cambia los valores (usa un `id` que no se repita en esa categoría).
- Los números de teléfono/WhatsApp deben incluir el `+51` para que los links `wa.me` y `tel:`
  funcionen bien.
- Las imágenes van en `public/images/<categoria>/archivo.jpg` y se referencian como
  `/images/<categoria>/archivo.jpg`. Si dejas `"imagen": ""`, la card muestra un ícono en su lugar.

## Desarrollo local

Requiere [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Build / Deploy

```bash
npm run build
```

Corre `vite build` y después `scripts/prerender.mjs`, que genera páginas HTML estáticas
indexables (una por campo, tienda, ciudad y post de blog — con su propio title/meta/OG/
JSON-LD) más `sitemap.xml`, `robots.txt` y `llms.txt`, todo dentro de `dist/`.

- **Vercel**: importa el repo, framework preset "Vite" (auto-detectado). No requiere configuración adicional.
- **Netlify**: ya incluye `netlify.toml` con `npm run build` y `dist` como carpeta publicada.
- **Antes de deployar a producción**: actualiza `SITE_URL` en `scripts/prerender.mjs` (y las
  urls hardcodeadas en `index.html`) con el dominio real — hoy apunta a un placeholder
  (`https://elradardelairsoft.pe`).

### SEO / GEO

- Cada cancha con `departamento` no vacío y cada tienda con `ciudad` no vacía generan su
  propia página en `/campos/<departamento>/<nombre>/` o `/tiendas/<ciudad>/<nombre>/`
  (más una landing por departamento/ciudad). Si dejas esos campos vacíos, la entrada sigue
  apareciendo en el directorio normal, solo no genera página propia.
- El blog vive en `src/data/blogPosts.js` (array plano, sin Markdown). Cada post genera
  `/blog/<slug>/`. Formato pensado para que un LLM te pueda citar: respuesta directa de
  2-3 líneas al inicio, headings en formato pregunta.
- Las páginas de detalle son HTML estático sin React (no se hidratan) — la home (`/`) sigue
  siendo la SPA interactiva de siempre.
- `public/404.png` (la ilustración del topo) se usa en `dist/404.html`, generada también por
  `scripts/prerender.mjs`. Netlify y Vercel sirven automáticamente un `404.html` en la raíz
  del build como página de error — no requiere configuración extra. Pesa ~2MB; si la
  reemplazas, conviene comprimirla primero.

## Estructura del proyecto

```
public/
  data/airsoft.json        <- ÚNICO archivo de contenido a editar
  images/<categoria>/      <- imágenes referenciadas desde el JSON
src/
  components/
    Header.jsx              Buscador + logo + dark mode toggle
    Footer.jsx               Contacto admin + última actualización
    CategoryTabs.jsx         Tabs de las 9 categorías + "Ver todo"
    CategoryGrid.jsx         Grid responsivo (agrupa por categoría)
    Card.jsx                 Card genérica reusada por las 9 categorías
    ContactBadge.jsx         Badge clicable (teléfono/email/web/dirección→maps)
    SocialIcons.jsx           Fila de íconos RRSS clicables
    DarkModeToggle.jsx
    SearchBar.jsx
    Icons.jsx                 Íconos SVG propios (sin dependencias)
  data/
    categoryConfig.js         Mapea cada categoría del JSON a un esquema común
                               que consume <Card />. Si agregas una 10ma categoría,
                               este es el único lugar de código que necesitas tocar.
  hooks/
    useAirsoftData.js         Carga /data/airsoft.json vía fetch
  utils/
    whatsapp.js                Helpers para construir links wa.me / Google Maps
    slug.js                    slugify() — usado por Card.jsx y scripts/prerender.mjs
  App.jsx                      Filtrado por categoría + búsqueda global
scripts/
  prerender.mjs                Genera las páginas estáticas SEO/GEO + sitemap/robots/llms.txt
```

## Agregar una 10ma categoría (para el futuro)

1. Agrega el arreglo correspondiente en `public/data/airsoft.json`.
2. Agrega una entrada en `categoryConfig` (`src/data/categoryConfig.js`) con su
   `label`, `emoji` y función `normalize()` que mapee los campos del JSON al
   esquema común. El resto de la UI (tabs, grid, cards, búsqueda) se actualiza solo.
