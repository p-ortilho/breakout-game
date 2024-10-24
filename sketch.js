class Bola {
  // Construtor da bola
  constructor(bolaX, bolaY, bolaRaio) {
    this.bolaX = bolaX;
    this.bolaY = bolaY;
    this.bolaRaio = bolaRaio;
    this.velocidadeX = 3;
    this.velocidadeY = 3;
  }

  // Método para criar a bola
  criarBola() {
    fill("#FEEC37");
    circle(this.bolaX, this.bolaY, this.bolaRaio * 2);
  }

  // Método para atualizar a posição da bola
  atualizar() {
    this.bolaX += this.velocidadeX;
    this.bolaY += this.velocidadeY;

    // Verifica colisão com as bordas do canvas e inverte a direção da bola
    if (this.bolaX - this.bolaRaio < 0 || this.bolaX + this.bolaRaio > width) {
      this.velocidadeX *= -1;
    }
    if (this.bolaY - this.bolaRaio < 0) {
      this.velocidadeY *= -1;
    }

    // Verifica colisão com a parte inferior do canvas
    if (this.bolaY + this.bolaRaio > height) {
      reiniciarJogo();
    }
  }

  // Método para verificar colisão com o jogador
  verificarColisao(jogadorX, jogadorY, jogadorLargura, jogadorAltura) {
    if (this.bolaY + this.bolaRaio >= jogadorY && this.bolaY - this.bolaRaio <= jogadorY + jogadorAltura) {
      if (this.bolaX + this.bolaRaio >= jogadorX && this.bolaX - this.bolaRaio <= jogadorX + jogadorLargura) {
        this.velocidadeY *= -1; // Inverte a direção da bola no eixo Y
        // Ajusta a posição da bola para evitar múltiplas colisões consecutivas
        this.bolaY = jogadorY - this.bolaRaio;
      }
    }
  }

  // Método para verificar colisão com os retângulos
  verificarColisaoRetangulos(retangulos) {
    for (let i = retangulos.length - 1; i >= 0; i--) {
      let ret = retangulos[i];
      if (this.bolaY - this.bolaRaio <= ret.y + ret.altura && this.bolaY + this.bolaRaio >= ret.y) {
        if (this.bolaX + this.bolaRaio >= ret.x && this.bolaX - this.bolaRaio <= ret.x + ret.largura) {
          this.velocidadeY *= -1; // Inverte a direção da bola no eixo Y
          retangulos.splice(i, 1); // Remove o retângulo da lista
          pontos++;
        }
      }
    }
  }
}

class Retangulo {
  // Construtor do retângulo
  constructor(x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
  }

  // Método para desenhar o retângulo
  desenhar() {
    fill("#FF5733");
    rect(this.x, this.y, this.largura, this.altura);
  }
}

// Variaveis bola
let bola;

// Variaveis jogador
let jogadorX;
let jogadorY;
const jogadorLargura = 120;
const jogadorAltura = 25;

// Lista de retângulos
let listaRetangulos = [];

// Variável para o contador de pontos
let pontos = 0;

function setup() {
  createCanvas(1024, 900);
  reiniciarJogo();
}

function draw() {
  background(color("#7AB2D3")); // Background

  noStroke(); // Remove a borda
  fill("#FF9D3D"); // Cor do retângulo

  // Atualiza a posição do jogador com base nas teclas pressionadas
  if (keyIsDown(LEFT_ARROW)) {
    jogadorX -= 5;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    jogadorX += 5;
  }

  // Limita o jogador dentro do canvas a 10px de distancia da borda
  jogadorX = constrain(jogadorX, 0, width - jogadorLargura);

  // Desenha o retângulo do jogador
  rect(jogadorX, jogadorY, jogadorLargura, jogadorAltura);

  // Atualiza e desenha a bola
  bola.atualizar();
  bola.verificarColisao(jogadorX, jogadorY, jogadorLargura, jogadorAltura);
  bola.verificarColisaoRetangulos(listaRetangulos);
  bola.criarBola();

  // Desenha os retângulos
  for (let ret of listaRetangulos) {
    ret.desenhar();
  }

  // Desenha o contador de pontos
  fill("#ffffff");
  textSize(32);
  textAlign(RIGHT, TOP);
  textStyle(BOLD)
  text(`Pontos: ${pontos}`, width - 10, 10);
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  jogadorX = (width / 2) - (jogadorLargura / 2); // Inicializa a posição X do jogador
  jogadorY = (height - jogadorAltura) - 20; // Inicializa a posição Y do jogador

  // Posição inicial da bola
  let inicioBolaX = width / 2;
  let inicioBolaY = (height / 2) + 90;

  bola = new Bola(inicioBolaX, inicioBolaY, 10);

  // Reinicializa os retângulos
  listaRetangulos = [];
  let numRetangulos = 10;
  let numLinhas = 6;
  let espacamento = 20;
  let larguraRetangulo = (width - (numRetangulos + 1) * espacamento) / numRetangulos;
  let alturaRetangulo = 30;

  for (let linha = 0; linha < numLinhas; linha++) {
    for (let i = 0; i < numRetangulos; i++) {
      let x = espacamento + i * (larguraRetangulo + espacamento);
      let y = espacamento + linha * (alturaRetangulo + espacamento);
      listaRetangulos.push(new Retangulo(x, y, larguraRetangulo, alturaRetangulo));
    }
  }

  // Reinicializa o contador de pontos
  pontos = 0;
}