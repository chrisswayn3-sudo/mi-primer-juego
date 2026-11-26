// =============================================================
//  JOYSTICK TÁCTIL
//  Tocas en cualquier parte de la pantalla y aparece un joystick
//  justo donde pusiste el dedo. Arrastras para moverte y al
//  soltar el arquero se detiene (y empieza a disparar).
//  También funciona con el mouse en la PC.
// =============================================================
class Joystick {
  constructor(escena, radio = 70) {
    this.radio = radio;
    this.vector = new Phaser.Math.Vector2(0, 0); // dirección: x e y entre -1 y 1
    this.punteroId = null;                         // qué dedo lo está usando

    // Dibujos: la base (círculo grande) y la palanca (círculo chico)
    this.base = escena.add.circle(0, 0, radio, 0xffffff, 0.12)
      .setStrokeStyle(3, 0xffffff, 0.35).setDepth(100).setVisible(false);
    this.palanca = escena.add.circle(0, 0, radio * 0.45, 0xffffff, 0.45)
      .setDepth(101).setVisible(false);

    escena.input.on('pointerdown', (p) => this.alTocar(p));
    escena.input.on('pointermove', (p) => this.alMover(p));
    escena.input.on('pointerup', (p) => this.alSoltar(p));
    escena.input.on('pointerupoutside', (p) => this.alSoltar(p));
  }

  get activo() {
    return this.punteroId !== null;
  }

  alTocar(p) {
    if (this.activo) return; // ya hay un dedo usándolo
    this.punteroId = p.id;
    this.base.setPosition(p.x, p.y).setVisible(true);
    this.palanca.setPosition(p.x, p.y).setVisible(true);
    this.vector.set(0, 0);
  }

  alMover(p) {
    if (p.id !== this.punteroId) return;
    const dx = p.x - this.base.x;
    const dy = p.y - this.base.y;
    const distancia = Math.min(Math.hypot(dx, dy), this.radio);
    const angulo = Math.atan2(dy, dx);

    this.palanca.setPosition(
      this.base.x + Math.cos(angulo) * distancia,
      this.base.y + Math.sin(angulo) * distancia
    );

    // Una "zona muerta" pequeña para que no se mueva por accidente
    if (distancia < this.radio * 0.2) {
      this.vector.set(0, 0);
    } else {
      this.vector.set(Math.cos(angulo), Math.sin(angulo));
    }
  }

  alSoltar(p) {
    if (p.id !== this.punteroId) return;
    this.punteroId = null;
    this.vector.set(0, 0);
    this.base.setVisible(false);
    this.palanca.setVisible(false);
  }
}
