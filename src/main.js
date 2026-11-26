// =============================================================
//  PUNTO DE ARRANQUE
//  Aquí le decimos a Phaser cómo crear el juego.
// =============================================================
const configuracion = {
  type: Phaser.AUTO,           // usa WebGL si se puede, si no Canvas
  parent: 'juego',             // el <div id="juego"> de index.html
  backgroundColor: '#0f1720',
  scale: {
    mode: Phaser.Scale.FIT,    // se ajusta a la pantalla sin deformarse
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: AJUSTES.ancho,
    height: AJUSTES.alto,
  },
  physics: {
    default: 'arcade',         // física sencilla: velocidad y choques
    arcade: { debug: false },  // pon true para ver las cajas de choque
  },
  scene: [EscenaJuego],
};

// Lo guardamos en window.game para poder revisarlo desde la consola del navegador (F12)
window.game = new Phaser.Game(configuracion);
