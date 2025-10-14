# Estructura del proyecto

```
activa-site/
├─ index.html
└─ assets/
   ├─ css/
   │  └─ styles.css
   ├─ js/
   │  └─ main.js
   └─ img/
      ├─ logos/            (logos de la marca; ej: logo.svg, logo-alt.png)
      ├─ noticias/         (fotos para el carrusel principal de noticias: 01.jpg, 02.jpg, 03.jpg, ...)
      ├─ activa/           (fotos institucionales: grupo.jpg, equipo.jpg, organigrama.png)
      ├─ proyectos/        (covers de cada proyecto: activa-45.jpg, activa-barrio.jpg, alfabetizacion.jpg, club-espectadores.jpg, festival-word.jpg)
      ├─ ediciones/        (imágenes de “Ediciones anteriores”: cover.jpg, etc.)
      ├─ videoclips/       (thumbnails para el carrusel secundario: 01.jpg, 02.jpg, 03.jpg)
      ├─ coberturas/       (fotos de coberturas/eventos: 01.jpg, 02.jpg, 03.jpg, 04.jpg, ...)
      └─ blog/             (imagen de portada del blog: cover.jpg)
```

## Dónde reemplazar imágenes
- **Carrusel principal**: `assets/img/noticias/01.jpg`, `02.jpg`, `03.jpg`.
- **Bloque Activá (foto grupal)**: `assets/img/activa/grupo.jpg`.
- **Tarjetas**: `assets/img/proyectos/cover.jpg`, `assets/img/coberturas/cover.jpg`, `assets/img/blog/cover.jpg`.
- **Proyectos**: cambiar las imágenes en `assets/img/proyectos/*`.
- **Organigrama**: `assets/img/activa/organigrama.png`.
- **Coberturas (masonry)**: agregar más JPGs en `assets/img/coberturas/`.
- **Videoclips (carrusel)**: `assets/img/videoclips/01.jpg`, etc.

## Contenido y categorías
El home ya incluye accesos a:
- Quiénes somos · Organigrama · Historia · Pilares fundamentales
- Proyectos (Activá 45’, Activá tu barrio, Proyecto de alfabetización, Club de espectadores, Festival de rap - Word, Ediciones anteriores, Activá videoclips, Foro de debate joven)
- Ediciones (1era/2da/3ra)
- Blog → Substack
- Coberturas

> El botón **“Ver más”** del bloque Activá te lleva a la sección “Quiénes somos”. Podés ajustar enlaces según tengas páginas internas.
