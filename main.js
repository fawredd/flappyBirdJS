// Get the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game dimensions
const WIDTH = 288;
const HEIGHT = 512;

// Colors
const BLACK = "#000000";
const WHITE = "#FFFFFF";

// Load game assets
const background_image = new Image();
background_image.src = "background.png";
const bird_image = new Image();
bird_image.src = "bird.png";
const pipe_image = new Image();
pipe_image.src = "pipe.png";

// Bird class
class Bird {
  constructor() {
    this.x = 50;
    this.y = canvas.height / 2;
    this.velocity = 0;
    this.gravity = 0.5;
    this.jump = -8;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
  }

  flap() {
    this.velocity = this.jump;
  }
}

// Pipe class
class Pipe {
  constructor() {
    this.x = canvas.width;
    this.width = 52;
    this.topHeight = Math.random() * 200 + 50;
    this.bottomHeight = canvas.height - this.topHeight - 100;
    this.speed = 2;
    this.highlight = false;
  }

  update() {
    this.x -= this.speed;
  }
}

// Renderer class
class Renderer {
  constructor() {
    this.birdImage = bird_image;
    this.pipeImage = pipe_image;
  }

  clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  drawBackground() {
    ctx.drawImage(background_image, 0, 0);
  }

  drawBird(bird) {
    ctx.drawImage(this.birdImage, bird.x, bird.y);
  }

  drawPipe(pipe) {
    ctx.drawImage(this.pipeImage, pipe.x, 0, pipe.width, pipe.topHeight);
    ctx.drawImage(this.pipeImage, pipe.x, canvas.height - pipe.bottomHeight, pipe.width, pipe.bottomHeight);
  }

  drawScore(score) {
    ctx.fillStyle = BLACK;
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, 10, 30);
  }

  drawGameOverMessage() {
    ctx.fillStyle = BLACK;
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Game class
class Game {
  constructor() {
    this.bird = new Bird();
    this.pipes = [];
    this.score = 0;
    this.renderer = new Renderer();
    this.frameCount = 0;
    this.running = false;
  }

  start() {
    this.running = true;
    this.pipes.push(new Pipe());
    this.frameCount = 0;
    this.loop();
  }

  loop() {
    if (!this.running) return;

    this.update();
    this.render();

    requestAnimationFrame(() => this.loop());
  }

  update() {
    this.bird.update();

    for (let i = this.pipes.length - 1; i >= 0; i--) {
      this.pipes[i].update();

      if (this.collisionCheck(this.bird, this.pipes[i])) {
        this.gameOver();
        return;
      }

      if (this.pipes[i].x === this.bird.x - this.pipes[i].width) {
        this.score++;
      }

      if (this.pipes[i].x + this.pipes[i].width < 0) {
        this.pipes.splice(i, 1);
      }
    }

    if (this.frameCount % 100 === 0) {
      this.pipes.push(new Pipe());
    }

    this.frameCount++;
  }

  render() {
    this.renderer.clear();
    this.renderer.drawBackground();
    this.renderer.drawBird(this.bird);
    this.pipes.forEach((pipe) => this.renderer.drawPipe(pipe));
    this.renderer.drawScore(this.score);
  }

  collisionCheck(bird, pipe) {
    if (
      bird.x + bird_image.width > pipe.x &&
      bird.x < pipe.x + pipe.width &&
      (bird.y < pipe.topHeight || bird.y + bird_image.height > canvas.height - pipe.bottomHeight)
    ) {
      return true;
    }
    return false;
  }

  gameOver() {
    this.running = false;
    this.renderer.drawGameOverMessage();
  }
}

// Handle key press events
document.addEventListener("keydown", function (event) {
  if (event.code === "Space"){
    game.bird.flap();
  }
});

// Create a new instance of the game and start it
const game = new Game();
game.start();
