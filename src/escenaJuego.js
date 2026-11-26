// =============================================================
//  ESCENA DEL JUEGO
//  Una "escena" en Phaser es una pantalla del juego.
//  - create(): se ejecuta una vez, al empezar. Aquí armamos todo.
//  - update(): se ejecuta ~60 veces por segundo. Aquí va la lógica
//    que cambia constantemente (moverse, disparar, perseguir).
// =============================================================
class EscenaJuego extends Phaser.Scene {
  constructor() {
    super('juego');
  }

  create() {
    crearTexturas(this);

    const { ancho, alto } = AJUSTES;
    this.terminado = false;
    this.vida = AJUSTES.vidaJugador;
    this.invulnerableHasta = 0;
    this.proximoDisparo = 0;

    // --- La sala: un rectángulo con borde. Nadie puede salir de ahí.
    const margen = 30;
    const arriba = 90; // dejamos espacio arriba para la barra de vida
    this.sala = new Phaser.Geom.Rectangle(margen, arriba, ancho - margen * 2, alto - arriba - margen);
    this.add.rectangle(this.sala.centerX, this.sala.centerY, this.sala.width, this.sala.height, 0x24364a)
      .setStrokeStyle(4, 0x7d93ab);
    this.dibujarPiso();
    this.physics.world.setBounds(this.sala.x, this.sala.y, this.sala.width, this.sala.height);

    // --- El jugador
    this.jugador = this.physics.add.sprite(ancho / 2, this.sala.bottom - 80, 'arquero');
    this.jugador.setCollideWorldBounds(true);
    this.jugador.body.setCircle(20);
    this.jugador.rotation = -Math.PI / 2; // empieza mirando hacia arriba

    // --- Grupos: los enemigos y las flechas se manejan en grupo
    this.enemigos = this.physics.add.group();
    this.flechas = this.physics.add.group();
    this.crearEnemigos(AJUSTES.cantidadEnemigos);

    // --- Choques
    this.physics.add.collider(this.enemigos, this.enemigos); // no se enciman
    this.physics.add.overlap(this.flechas, this.enemigos, this.flechaGolpea, null, this);
    this.physics.add.overlap(this.jugador, this.enemigos, this.jugadorGolpeado, null, this);

    // --- Controles: teclado (WASD o flechas) y joystick táctil
    this.teclas = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
    this.joystick = new Joystick(this);

    // --- Interfaz: barra de vida y contador de enemigos
    this.crearInterfaz();
  }

  update(tiempo) {
    if (this.terminado) return;

    this.moverJugador();
    this.moverEnemigos();
    this.intentarDisparar(tiempo);
    this.limpiarFlechas();
  }

  // -----------------------------------------------------------
  //  Movimiento
  // -----------------------------------------------------------
  moverJugador() {
    const t = this.teclas;
    const direccion = new Phaser.Math.Vector2(0, 0);

    // Teclado
    if (t.A.isDown || t.LEFT.isDown) direccion.x -= 1;
    if (t.D.isDown || t.RIGHT.isDown) direccion.x += 1;
    if (t.W.isDown || t.UP.isDown) direccion.y -= 1;
    if (t.S.isDown || t.DOWN.isDown) direccion.y += 1;

    // Si no se usa el teclado, usamos el joystick
    if (direccion.length() === 0) direccion.copy(this.joystick.vector);

    // normalize() hace que en diagonal no vaya más rápido
    direccion.normalize().scale(AJUSTES.velocidadJugador);
    this.jugador.setVelocity(direccion.x, direccion.y);

    this.seEstaMoviendo = direccion.length() > 0;
    if (this.seEstaMoviendo) this.jugador.rotation = direccion.angle();
  }

  moverEnemigos() {
    this.enemigos.getChildren().forEach((enemigo) => {
      if (!enemigo.body.enable) return; // está muriendo
      this.physics.moveToObject(enemigo, this.jugador, AJUSTES.velocidadEnemigo);
    });
  }

  // -----------------------------------------------------------
  //  Disparo automático: solo cuando el jugador está quieto
  // -----------------------------------------------------------
  intentarDisparar(tiempo) {
    if (this.seEstaMoviendo || tiempo < this.proximoDisparo) return;

    const vivos = this.enemigos.getChildren().filter((e) => e.body.enable);
    if (vivos.length === 0) return;

    // Buscamos al enemigo más cercano
    const objetivo = this.physics.closest(this.jugador, vivos);
    const angulo = Phaser.Math.Angle.Between(this.jugador.x, this.jugador.y, objetivo.x, objetivo.y);

    this.jugador.rotation = angulo;
    this.dispararFlecha(angulo);
    this.proximoDisparo = tiempo + AJUSTES.cadenciaMs;
  }

  dispararFlecha(angulo) {
    // La flecha sale un poco adelante del arquero
    const x = this.jugador.x + Math.cos(angulo) * 24;
    const y = this.jugador.y + Math.sin(angulo) * 24;
    const flecha = this.flechas.create(x, y, 'flecha');
    flecha.rotation = angulo;
    this.physics.velocityFromRotation(angulo, AJUSTES.velocidadFlecha, flecha.body.velocity);
  }

  limpiarFlechas() {
    // Borramos las flechas que se salen de la sala para no gastar memoria
    this.flechas.getChildren().slice().forEach((flecha) => {
      if (!this.sala.contains(flecha.x, flecha.y)) flecha.destroy();
    });
  }

  // -----------------------------------------------------------
  //  Enemigos
  // -----------------------------------------------------------
  crearEnemigos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      // Aparecen en la mitad de arriba, lejos del jugador
      const x = Phaser.Math.Between(this.sala.left + 40, this.sala.right - 40);
      const y = Phaser.Math.Between(this.sala.top + 40, this.sala.centerY - 40);
      const enemigo = this.enemigos.create(x, y, 'enemigo');
      enemigo.setCollideWorldBounds(true);
      enemigo.body.setCircle(18);
      enemigo.setData('vida', AJUSTES.vidaEnemigo);

      // Pequeña animación de aparición
      enemigo.setScale(0);
      this.tweens.add({ targets: enemigo, scale: 1, duration: 300, delay: i * 80 });
    }
  }

  flechaGolpea(flecha, enemigo) {
    flecha.destroy();
    if (!enemigo.body.enable) return;

    const vida = enemigo.getData('vida') - AJUSTES.danoFlecha;
    enemigo.setData('vida', vida);

    // Destello blanco al recibir el golpe
    enemigo.setTintFill(0xffffff);
    this.time.delayedCall(70, () => enemigo.active && enemigo.clearTint());

    if (vida <= 0) this.matarEnemigo(enemigo);
  }

  matarEnemigo(enemigo) {
    enemigo.body.enable = false; // ya no choca ni recibe flechas
    this.tweens.add({
      targets: enemigo,
      scale: 0,
      angle: 180,
      duration: 200,
      onComplete: () => {
        enemigo.destroy();
        this.actualizarInterfaz();
        if (this.enemigos.countActive() === 0) this.ganar();
      },
    });
  }

  // -----------------------------------------------------------
  //  Daño al jugador
  // -----------------------------------------------------------
  jugadorGolpeado(jugador, enemigo) {
    if (this.terminado || !enemigo.body.enable) return;
    if (this.time.now < this.invulnerableHasta) return;

    this.vida -= 1;
    this.invulnerableHasta = this.time.now + AJUSTES.invulnerableMs;
    this.actualizarInterfaz();
    this.cameras.main.shake(120, 0.01);

    // Parpadeo mientras es invulnerable
    this.tweens.add({
      targets: jugador,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: Math.floor(AJUSTES.invulnerableMs / 200) - 1,
      onComplete: () => jugador.setAlpha(1),
    });

    // Empujamos al enemigo hacia atrás para que no pegue de nuevo enseguida
    const angulo = Phaser.Math.Angle.Between(jugador.x, jugador.y, enemigo.x, enemigo.y);
    enemigo.x += Math.cos(angulo) * 40;
    enemigo.y += Math.sin(angulo) * 40;

    if (this.vida <= 0) this.perder();
  }

  // -----------------------------------------------------------
  //  Interfaz
  // -----------------------------------------------------------
  crearInterfaz() {
    const anchoBarra = 220;
    this.add.text(30, 28, 'VIDA', { fontFamily: 'Arial', fontSize: '18px', color: '#cfd8e3', fontStyle: 'bold' });
    this.add.rectangle(90, 38, anchoBarra, 18, 0x3a1f1f).setOrigin(0, 0.5);
    this.barraVida = this.add.rectangle(90, 38, anchoBarra, 18, 0x5cd65c).setOrigin(0, 0.5);
    this.anchoBarra = anchoBarra;

    this.textoEnemigos = this.add.text(AJUSTES.ancho - 30, 28, '', {
      fontFamily: 'Arial', fontSize: '18px', color: '#cfd8e3', fontStyle: 'bold',
    }).setOrigin(1, 0);

    this.add.text(AJUSTES.ancho / 2, 66, 'Muévete para esquivar · Quédate quieto para disparar', {
      fontFamily: 'Arial', fontSize: '14px', color: '#7d93ab',
    }).setOrigin(0.5);

    this.actualizarInterfaz();
  }

  actualizarInterfaz() {
    const proporcion = Math.max(this.vida, 0) / AJUSTES.vidaJugador;
    this.barraVida.width = this.anchoBarra * proporcion;
    this.barraVida.fillColor = proporcion > 0.4 ? 0x5cd65c : 0xe0a030;
    this.textoEnemigos.setText(`Enemigos: ${this.enemigos.countActive()}`);
  }

  dibujarPiso() {
    // Unas baldosas sutiles para que se note el movimiento
    const g = this.add.graphics();
    g.lineStyle(1, 0x2d4259, 1);
    for (let x = this.sala.left + 60; x < this.sala.right; x += 60) g.lineBetween(x, this.sala.top, x, this.sala.bottom);
    for (let y = this.sala.top + 60; y < this.sala.bottom; y += 60) g.lineBetween(this.sala.left, y, this.sala.right, y);
  }

  // -----------------------------------------------------------
  //  Fin de la partida
  // -----------------------------------------------------------
  ganar() {
    if (this.terminado) return;
    this.mostrarFin('¡Sala despejada!', '#5cd65c');
  }

  perder() {
    this.mostrarFin('Perdiste', '#e05555');
  }

  mostrarFin(titulo, color) {
    this.terminado = true;
    this.physics.pause();
    this.jugador.setVelocity(0, 0);

    const { ancho, alto } = AJUSTES;
    this.add.rectangle(ancho / 2, alto / 2, ancho, alto, 0x000000, 0.6).setDepth(200);
    this.add.text(ancho / 2, alto / 2 - 30, titulo, {
      fontFamily: 'Arial', fontSize: '52px', color, fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(201);
    const subtitulo = this.add.text(ancho / 2, alto / 2 + 40, 'Toca la pantalla o presiona Enter para jugar otra vez', {
      fontFamily: 'Arial', fontSize: '18px', color: '#ffffff', align: 'center', wordWrap: { width: ancho - 80 },
    }).setOrigin(0.5).setDepth(201).setAlpha(0);

    // Esperamos un momento para que no se reinicie por un toque accidental
    this.time.delayedCall(600, () => {
      subtitulo.setAlpha(1);
      const reiniciar = () => this.scene.restart();
      this.input.once('pointerdown', reiniciar);
      this.input.keyboard.once('keydown-ENTER', reiniciar);
      this.input.keyboard.once('keydown-SPACE', reiniciar);
    });
  }
}
