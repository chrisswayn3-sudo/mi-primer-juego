// =============================================================
//  TEXTURAS (los "dibujos" del juego)
//  Por ahora dibujamos figuras simples con código, así no
//  necesitamos imágenes. Más adelante se pueden cambiar por
//  dibujos de verdad sin tocar el resto del juego.
// =============================================================
function crearTexturas(escena) {
  // Si ya existen (por ejemplo al reiniciar), no las volvemos a crear
  if (escena.textures.exists('arquero')) return;

  const g = escena.make.graphics({ x: 0, y: 0 }, false);

  // Arquero: círculo verde con un "ojo" que indica hacia dónde mira
  g.fillStyle(0x3fa34d);
  g.fillCircle(20, 20, 20);
  g.fillStyle(0x2b7a37);
  g.fillCircle(20, 20, 13);
  g.fillStyle(0xffffff);
  g.fillCircle(31, 20, 6);
  g.fillStyle(0x111111);
  g.fillCircle(33, 20, 3);
  g.generateTexture('arquero', 40, 40);
  g.clear();

  // Enemigo: círculo rojo con dos ojos enojados
  g.fillStyle(0xd64545);
  g.fillCircle(18, 18, 18);
  g.fillStyle(0xffffff);
  g.fillCircle(11, 14, 5);
  g.fillCircle(25, 14, 5);
  g.fillStyle(0x111111);
  g.fillCircle(11, 15, 2.5);
  g.fillCircle(25, 15, 2.5);
  g.generateTexture('enemigo', 36, 36);
  g.clear();

  // Flecha: palito con punta (apunta hacia la derecha)
  g.fillStyle(0xe8d3a2);
  g.fillRect(0, 2, 18, 2);
  g.fillStyle(0xffffff);
  g.fillTriangle(18, 0, 24, 3, 18, 6);
  g.fillStyle(0x6fb3e0);
  g.fillRect(0, 0, 4, 6);
  g.generateTexture('flecha', 24, 6);

  g.destroy();
}
