# Gotas y Raíces

Animación 2D interactiva desarrollada con **p5.js** como Entregable 2 de la Maestría en Animación 2D.

---

## Historia

*Nubecita* flota sobre el campo y descubre a *Semillita* esperando en la tierra. Al ver que la semilla necesita agua, Nubecita se oscurece, saca su regadera y la riega hasta que un tallo emerge, crece y florece. Al final, ambas personajes celebran juntas bajo el sol.

---

## Escenas

| # | Título | Descripción |
|---|--------|-------------|
| 1 | Introducción | Nubecita entra flotando · Semillita espera en la tierra |
| 2 | El Cambio | El cielo se nubla · comienza la lluvia suave |
| 3 | El Riego | Nubecita gris riega con su regadera · el tallo emerge |
| 4 | Crecimiento Rápido | El tallo crece aceleradamente · Nubecita se alegra |
| 5 | La Floración | La flor se abre completamente · destellos de celebración |
| 6 | Felicidad | Sol brillante · mariposas · ambas personajes sonriendo |

Las escenas avanzan automáticamente cada ~6 segundos (200 frames a 30 fps).

---

## Personajes y elementos

- **Nubecita** — nube con cara animada; cambia de color (blanca → gris) y porta regadera en la Escena 3.
- **Semillita** — semilla/planta con cara; se balancea, parpadea y agita brazos.
- **El Tallo** — crece proceduralmente con hojas y flor que florecen.
- **Nubes de fondo** — 4 nubes sin cara que flotan con parallax suave.
- **Montañas de fondo** — 4 picos verdes que cubren el ancho del canvas.
- **Mariposas** — 5 mariposas de colores que aparecen en la escena final.
- **Lluvia / Destellos** — partículas procedurales de lluvia y sparkles dorados.

---

## Tecnologías

| Herramienta | Versión | Uso |
|-------------|---------|-----|
| [p5.js](https://p5js.org/) | 1.9.0 | Motor de animación y dibujo |
| HTML5 | — | Estructura de la página |
| CSS3 | — | Estilos y layout |

No requiere instalación ni bundler. p5.js se carga desde CDN.

---

## Estructura del proyecto

```
Entregable_2/
├── index.html       # Punto de entrada
├── README.md        # Este archivo
└── src/
    ├── script.js    # Toda la lógica de animación (p5.js)
    └── style.css    # Estilos de la página
```

---

## Cómo ejecutar

Abrir `index.html` en un navegador moderno. No se requiere servidor local.

> Si el navegador bloquea scripts locales, usar Live Server (VS Code) o cualquier servidor HTTP simple:
> ```bash
> python3 -m http.server 8080
> ```
> Luego abrir `http://localhost:8080`.


> O bien directamente visitando el siguiente link: `https://albertoreynaldocortesmontalvo.github.io/Entregable_2/`

---

## Controles

| Botón | Acción |
|-------|--------|
| **Siguiente →** | Avanza a la siguiente escena |
| **← Anterior** | Regresa a la escena anterior |
| **↺ Reiniciar** | Vuelve a la Escena 1 y reinicia todos los estados |

---

## Animaciones técnicas destacadas

- **Cielo gradiente** — calculado línea a línea con `lerpColor` en cada frame.
- **Transiciones entre escenas** — fade a negro con interpolación de `fadeAlpha`.
- **Tallo procedural** — altura y hojas controladas por `progress` (0–1) con `bezierVertex`.
- **Parallax de nubes** — cada nube de fondo oscila con `sin(waveOff * velocidad + fase)` distinta.
- **Parpadeo de Semillita** — ciclo de 90 frames; durante 5 frames los ojos se cierran suavemente.
- **Mariposas** — movimiento combinado de velocidad lineal + oscilación sinusoidal.
