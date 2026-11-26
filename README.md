# mi-primer-juego

Mi primer juego en Phaser, para PC y celular.

Eres un arquero encerrado en una sala llena de enemigos. **Muévete para esquivar** y **quédate quieto para disparar**: el arquero apunta solo al enemigo más cercano. Elimina a todos para despejar la sala.

## Controles

| Dónde | Moverse | Disparar |
|---|---|---|
| PC | WASD o flechas del teclado (o arrastrar con el mouse) | Suelta las teclas |
| Celular | Toca y arrastra en cualquier parte de la pantalla | Suelta el dedo |

## Cómo jugarlo en tu computadora

El juego es solo HTML y JavaScript, no hay que instalar nada:

1. Descarga el repositorio (botón verde **Code → Download ZIP**) y descomprímelo.
2. Abre `index.html` con doble clic en Chrome, Edge o Firefox.

Necesitas internet la primera vez, porque Phaser se carga desde un CDN.

## Cómo está organizado el código

| Archivo | Qué hace |
|---|---|
| `index.html` | La página. Carga Phaser y nuestros archivos en orden. |
| `src/ajustes.js` | **Números del juego** (velocidad, vida, enemigos…). El mejor lugar para empezar a experimentar. |
| `src/texturas.js` | Dibuja el arquero, los enemigos y las flechas con figuras simples. |
| `src/joystick.js` | El joystick táctil que aparece donde tocas. |
| `src/escenaJuego.js` | Toda la lógica: moverse, disparar, perseguir, recibir daño, ganar y perder. |
| `src/main.js` | Arranca Phaser con la configuración. |

### Ideas para experimentar

- En `src/ajustes.js` cambia `cadenciaMs` a `150` y siente la diferencia.
- Pon `cantidadEnemigos: 20`.
- En `src/main.js` cambia `debug: false` a `debug: true` para ver las "cajas de choque".

## Plan

- [x] **Paso 1:** una sala, arquero que dispara solo, enemigos, vida, ganar y perder.
- [ ] **Paso 2:** varias salas seguidas, elegir mejoras, más tipos de enemigos y un jefe.
- [ ] **Paso 3:** menú, sonidos, récord y publicarlo con un link para compartir.
