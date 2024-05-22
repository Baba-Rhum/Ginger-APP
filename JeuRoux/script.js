class Canvas {
    constructor() {
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.tuyaux = [];
        this.clouds = [];
        this.tuyauxGap = 500;
        this.score = 0;
        this.highscore = localStorage.getItem("highscore") ? localStorage.getItem("highscore") : 0;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    randrange(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    createPlayer() {
        this.player = new Player(this.ctx, this.canvas, 50, 50, 60, "orange");
    }

    showScore() {
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Score : " + Math.floor(this.score/60), 10, 50);
        this.ctx.fillText("Highscore : " + Math.floor(this.highscore/60), 10, 100);
    }

    generateDecor() {
        for (let i = 0; i < 5000; i += this.tuyauxGap) {
            let gap = this.randrange(this.player.radius, this.player.radius * 8);
            let heightUp = 0 + gap;
            let heightDown = this.canvas.height / 2 - gap;
            this.tuyaux.push(new Tuyau(this.ctx, this.canvas, this.canvas.width + i, 0, 200, heightDown, "green", true));
            this.tuyaux.push(new Tuyau(this.ctx, this.canvas, this.canvas.width + i, this.canvas.height - heightUp, 200, this.canvas.height, "green", false));
        }
    }

    generateDecorProcedure() {
        let i = this.tuyauxGap;
        let gap = this.randrange(this.player.radius, this.player.radius * 8);
        let heightUp = 0 + gap;
        let heightDown = this.canvas.height / 2 - gap;
        this.tuyaux.push(new Tuyau(this.ctx, this.canvas, this.tuyaux[this.tuyaux.length - 1].x + i, 0, 200, heightDown, "green", true));
        this.tuyaux.push(new Tuyau(this.ctx, this.canvas, this.tuyaux[this.tuyaux.length - 2].x + i, this.canvas.height - heightUp, 200, this.canvas.height, "green", false));
    }

    generateCloud() {
        if (this.randrange(0, 100) === 1) {
            this.clouds.push(new Element(this.ctx, this.canvas, this.canvas.width, this.randrange(0, this.canvas.height), 150, 100, "orange"));
        }
    }

    update() {
        this.ctx.fillStyle = "orange";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (const cloud of this.clouds) {
            cloud.move();
            cloud.draw();
        }
        for (const element of this.tuyaux) {
            element.move();
            element.draw();
        }
        if (this.tuyaux[0].x < 0 - this.tuyaux[0].width) {
            this.tuyaux.shift();
            this.tuyaux.shift();
            this.generateDecorProcedure();
        }
        this.player.move();
        this.player.draw();
        this.generateCloud();
        this.collisions();
        this.showScore();
    }

    collisions() {
        for (const tuyau of this.tuyaux) {
            if (this.player.x + this.player.radius > tuyau.x && this.player.x - this.player.radius < tuyau.x + tuyau.width) {
                if (this.player.y + this.player.radius > tuyau.y && this.player.y - this.player.radius < tuyau.y + tuyau.height) {
                    this.player.isDead = true;
                }
            }
        }
    }

}


class Game {
    constructor() {
        this.canvas = new Canvas();
    }

    start() {
        this.canvas.createPlayer();
        this.canvas.generateDecor();
        this.loop();
    }

    loop() {
        this.canvas.clear();
        this.canvas.update();
        if (this.canvas.player.isDead) {
            this.GameOver();
        }
        this.canvas.score += 1;
        requestAnimationFrame(this.loop.bind(this));
    }

    score() {

    }

    GameOver() {
        if (this.canvas.score > this.canvas.highscore) {
            localStorage.setItem("highscore", this.canvas.score);
        }
        this.canvas = new Canvas();
        this.canvas.createPlayer();
        this.canvas.generateDecor();

    }

}

class Player {
    constructor(ctx, canvas, x, y, radius, color) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.x = this.canvas.x ? this.canvas.x : 0 + this.canvas.width / 2 - 600;
        this.y = this.canvas.y ? this.canvas.y : 0 + this.canvas.height / 2 - 200;
        this.speed = 8;
        this.xSpeed = this.speed;
        this.ySpeed = this.speed;
        this.radius = radius;
        this.color = color;
        this.isJump = false;
        this.isDead = false;
        this.jumpHeight = 100;
        this.yAtStart;
        this.img = new Image();
        this.img.src = "Images/Ron_weasley_down.png";
    }
    draw() {
        this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
    move() {
        window.addEventListener('keypress', (event) => {
            if (event.key === " ") {
                this.startJump();
            }
        });

        window.addEventListener('click', () => {
            this.startJump();
        } );

        if (this.isJump === false) {
            this.y += this.xSpeed;
        } else {
            this.jump();
        }
        if (this.y > this.canvas.height - this.radius) {
            this.isDead = true;
        }
    }

    startJump() {
        if (this.isJump === false) {
            this.img.src = "Images/Ron_weasley_up.png";
            this.yAtStart = this.y - this.jumpHeight;
            this.isJump = true;
        } else {
            this.yAtStart = this.y - this.jumpHeight;
        }
    }

    jump() {
        if (this.y > this.yAtStart) {
            this.y -= this.ySpeed;
        } else {
            this.ySpeed = this.speed;
            this.isJump = false;
            this.img.src = "Images/Ron_weasley_down.png";
        }

    }

}

class Element {
    constructor(ctx, canvas, x, y, width, height, color) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.img = new Image();
        this.img.src = "Images/nuage.png";
    }

    draw() {
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    move() {
        this.x -= 10;
    }
}

class Tuyau extends Element {
    constructor(ctx, canvas, x, y, width, height, color, reverse) {
        super(ctx, canvas, x, y, width, height, color);
        this.reverse = reverse;
        this.speed = 10;
    }

    draw() {
        // Couleur du tuyau
        this.ctx.fillStyle = this.color;

        // Dessine le tube vertical
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        // Dessine le bord du tube
        if (this.reverse) {
            this.ctx.fillRect(this.x - 25, this.height - 100, this.width + 50, 100);
        } else {
            this.ctx.fillRect(this.x - 25, this.y - 100, this.width + 50, 100);
        }
    }

    move() {
        this.x -= this.speed;
    }
}


const game = new Game();
game.start();
