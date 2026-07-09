# Imágenes

Guarda aquí las imágenes que uses en `public/data/airsoft.json`, organizadas por categoría:

```
public/images/
  canchas/
  tiendas/
  eventos/
  mercado_pulgas/
  jugadores/
  equipos/
```

Luego referencia la ruta en el JSON como `/images/<categoria>/archivo.jpg`.

Recomendaciones para que la web cargue rápido:
- Usa `.jpg`/`.webp` comprimidos, idealmente menores a 200KB.
- Tamaño sugerido: 800x450px (las cards tienen una altura fija de imagen).
- Si un ítem no tiene imagen, deja el campo `"imagen": ""` — la card mostrará automáticamente un ícono de la categoría en su lugar.
