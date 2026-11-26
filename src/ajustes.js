// =============================================================
//  AJUSTES DEL JUEGO
//  Cambia estos números para que el juego se sienta distinto.
//  Es la forma más fácil de empezar a experimentar.
// =============================================================
const AJUSTES = {
  // Tamaño del "lienzo" del juego (formato vertical, como en el celular).
  // Phaser lo escala solo para que quepa en cualquier pantalla.
  ancho: 540,
  alto: 960,

  // Jugador
  velocidadJugador: 230,   // píxeles por segundo
  vidaJugador: 5,          // golpes que aguanta
  invulnerableMs: 900,     // tiempo sin recibir daño después de un golpe

  // Disparo
  cadenciaMs: 450,         // milisegundos entre flecha y flecha
  velocidadFlecha: 650,
  danoFlecha: 1,

  // Enemigos
  cantidadEnemigos: 6,
  velocidadEnemigo: 95,
  vidaEnemigo: 4,
};
