# Airsoft Perú · Biblioteca

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

Genera la carpeta `dist/` lista para deployar.

- **Vercel**: importa el repo, framework preset "Vite" (auto-detectado). No requiere configuración adicional.
- **Netlify**: ya incluye `netlify.toml` con `npm run build` y `dist` como carpeta publicada.

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
  App.jsx                      Filtrado por categoría + búsqueda global
```

## Agregar una 10ma categoría (para el futuro)

1. Agrega el arreglo correspondiente en `public/data/airsoft.json`.
2. Agrega una entrada en `categoryConfig` (`src/data/categoryConfig.js`) con su
   `label`, `emoji` y función `normalize()` que mapee los campos del JSON al
   esquema común. El resto de la UI (tabs, grid, cards, búsqueda) se actualiza solo.
