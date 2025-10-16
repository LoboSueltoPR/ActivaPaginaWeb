# Estructura del proyecto

```
ActivaPaginaWeb/
├─ index.html
├─ quienes-somos.html
├─ proyectos/
│  ├─ index.html
│  ├─ activa-45.html
│  ├─ activa-barrio.html
│  ├─ club-espectadores.html
│  ├─ festival-word.html
│  ├─ foro.html
│  └─ videoclips.html
└─ assets/
   ├─ css/
   │  └─ styles.css
   ├─ js/
   │  └─ main.js
   └─ img/
      ├─ activa/        (fotos institucionales: grupo.jpg, equipo.jpg, organigrama.png)
      ├─ blog/          (portadas para notas y artículos)
      ├─ coberturas/    (galerías estilo masonry de eventos)
      ├─ ediciones/     (imágenes para "Ediciones anteriores")
      ├─ logos/         (variantes del logo: logo.svg, logo-alt.png)
      ├─ noticias/      (slides del hero principal: 01.jpg, 02.jpg, 03.jpg, ...)
      ├─ proyectos/     (covers de cada proyecto destacado en el home)
      ├─ redes/         (iconos de redes sociales: instagram.png, youtube.png, spotify.png)
      └─ videoclips/    (thumbnails y fotos de apoyo para esta sección)
```

## Dónde reemplazar imágenes
- **Carrusel principal**: `assets/img/noticias/01.jpg`, `02.jpg`, `03.jpg`.
- **Bloque Activá (foto grupal)**: `assets/img/activa/grupo.jpg`.
- **Tarjetas de proyectos**: `assets/img/proyectos/*.jpg`.
- **Organigrama**: `assets/img/activa/organigrama.png`.
- **Coberturas (masonry)**: sumar o reemplazar imágenes en `assets/img/coberturas/`.
- **Videoclips**: usar las piezas en `assets/img/videoclips/` como fondos o covers.
- **Redes sociales**: iconos disponibles en `assets/img/redes/`.

## Contenido y secciones
El sitio incluye accesos directos a:
- Quiénes somos · Organigrama · Historia · Pilares fundamentales.
- Proyectos (Activá 45’, Activá tu barrio, Proyecto de alfabetización, Club de espectadores, Festival de rap - Word, Ediciones anteriores, Activá videoclips, Foro de debate joven).
- Ediciones (1era / 2da / 3ra).
- Blog → Substack.
- Coberturas.

> El botón **“Ver más”** del bloque Activá lleva a la sección “Quiénes somos”. Ajustá los enlaces según las páginas internas que tengas publicadas.
