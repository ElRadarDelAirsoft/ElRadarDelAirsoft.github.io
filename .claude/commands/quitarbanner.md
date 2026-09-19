---
description: Muestra los carteles del banner del home numerados con miniatura y quita en prod los que elijas (partidas canceladas)
---

Quita rápido del home los carteles de partidas canceladas. Dos fases: primero mostrar la lista, después (cuando el usuario responda con números) quitar y publicar.

## Fase 1 — Mostrar la lista

1. Correr `python scripts/quitarbanner-list.py "<scratchpad>/quitarbanner.html"` (usar el directorio scratchpad de la sesión). Imprime los carteles numerados en el mismo orden del carrusel del home (fecha del evento) y, por cada uno, el `.webp` compilado y el archivo `raw` que le corresponde.
2. Mostrar el HTML con `SendUserFile` (`display: "render"`) para que el usuario vea las miniaturas numeradas.
3. Pegar también en el chat una lista corta: `N. [fecha] descripción — etiqueta`.
4. Preguntar cuáles quitar (uno o varios números, ej. "2 y 4") y **terminar el turno**. No borrar nada todavía.

## Fase 2 — Quitar los elegidos (cuando el usuario responda con números)

Elegir los números es la autorización: no hace falta pedir otra confirmación ni antes de pushear. Si la respuesta es ambigua (número fuera de rango, texto que no calza), preguntar de nuevo.

Para cada cartel elegido (usar el resultado del script; si pasó tiempo, volver a correrlo y confirmar que el número sigue apuntando al mismo cartel):

1. `git log --oneline -- "src/assets/banner/<compilado>"` para confirmar que está trackeado y `git rm` del `.webp` compilado.
2. Borrar el archivo `raw` correspondiente de `public/images/Banner/` (carpeta untracked, borrado directo). **Es obligatorio**: si el raw queda, la próxima corrida de `/bannerweb` lo vuelve a agregar como cartel nuevo. Si el script dice `raw: (no encontrado)`, seguir sin él.
3. Quitar la entrada de ese cartel en `src/data/bannerEventDates.js` y, si existe, en `src/data/bannerLinkLabels.js`.
4. Si dos carteles comparten la misma imagen raw pero solo se quita uno, el otro sigue teniendo su propio archivo raw (el script los empareja por separado) — borrar únicamente el que corresponde.

Después, igual que `/bannerweb` (pasos 5 y 6):

- `npm run build`, sin errores.
- `preview_start` → `navigate` a `http://localhost:4173/` → `read_console_messages({onlyErrors: true})` limpio → `javascript_tool` con `[...document.querySelectorAll('a')].filter(a => a.querySelector('img')).map(a => ({href: a.href, text: a.textContent.trim()}))` para confirmar que los quitados ya no están y los demás siguen → `preview_stop`.
- `git add` solo los `.webp` eliminados, `bannerEventDates.js` y `bannerLinkLabels.js` (nunca `git add -A`).
- Commit tipo "Quitar cartel cancelado: <descripción>" con `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
- `git fetch origin`, confirmar que `origin/main` coincide con la base local, `git push origin main`.
- Responder en una o dos frases: qué se quitó y cuántos carteles quedan.
