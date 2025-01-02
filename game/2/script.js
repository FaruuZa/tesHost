var gameContainer = document.getElementById('game-container');
var player = document.getElementById('player');
var scoreValue = document.getElementById('score-value');
var healthValue = document.getElementById('health-value');
var gameOverPopup = document.getElementById('game-over-popup');
var gameOverScore = document.getElementById('game-over-score-value');
var restartButton = document.getElementById('restart-button');

var playerPosition = 175;
var score = 0;
var health = 3;
var balls = [];
var bombs = [];
var powerUps = [];
var gameLoop;

// Fungsi untuk memulai permainan
function startGame() {
    gameOverPopup.style.display = 'none';
    createBall();
    createBomb();
    gameLoop = setInterval(dropObjects, 50);
}

// Fungsi untuk menggerakkan pemain
function movePlayer(event) {
    if (event.key === 'ArrowLeft') {
        gerak("kiri")
    } else if (event.key === 'ArrowRight') {
        gerak("kanan")
    }
}
const control = document.querySelectorAll('.control div')
var timer = 0
control[0].addEventListener('pointerdown', function (event) {
    timer = setInterval(function () {
        gerak("kiri")
    }, 25);
})
control[1].addEventListener('pointerdown', function (event) {
    timer = setInterval(function () {
        gerak("kanan")
    }, 25);
})
control[0].addEventListener('pointerup', function (event) {
    clearInterval(timer)
})
control[1].addEventListener('pointerup', function (event) {
    clearInterval(timer)
})
// console.log(control)
function gerak(arah) {
    if (arah === 'kiri' && playerPosition > 0) {
        playerPosition -= 5;
        player.style.left = playerPosition + 'px';
    } else if (arah === 'kanan' && playerPosition < gameContainer.offsetWidth - player.offsetWidth) {
        playerPosition += 5;
        player.style.left = playerPosition + 'px';
    }
}
// Fungsi untuk membuat bola
function createBall() {
    var ball = document.createElement('div');
    ball.className = 'ball';
    ball.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - 30)) + 'px';
    gameContainer.appendChild(ball);
    balls.push(ball);
}

// Fungsi untuk membuat bom
function createBomb() {
    var bomb = document.createElement('div');
    bomb.className = 'bomb';
    bomb.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - 30)) + 'px';
    gameContainer.appendChild(bomb);
    bombs.push(bomb);
}

// Fungsi untuk menjatuhkan objek
function dropObjects() {
    balls.forEach(function (ball, index) {
        var ballTop = ball.offsetTop;
        var ballSpeed = Math.floor(Math.random() * 10) + 2;

        if (ballTop < gameContainer.offsetHeight) {
            ball.style.top = ballTop + ballSpeed + 'px';
        } else {
            // Bola melewatkan pemain
            gameContainer.removeChild(ball);
            balls.splice(index, 1);
            createBall();
            decreaseHealth();
        }
    });

    bombs.forEach(function (bomb, index) {
        var bombTop = bomb.offsetTop;
        var bombSpeed = Math.floor(Math.random() * 5) + 2;

        if (bombTop < gameContainer.offsetHeight) {
            bomb.style.top = bombTop + bombSpeed + 'px';
        } else {
            // Bom melewatkan pemain
            gameContainer.removeChild(bomb);
            bombs.splice(index, 1);
            createBomb();
        }
    });

    checkCollision();
}

// Fungsi untuk memeriksa tabrakan
function checkCollision() {
    balls.forEach(function (ball, index) {
        var ballRect = ball.getBoundingClientRect();
        var playerRect = player.getBoundingClientRect();

        if (ballRect.bottom >= playerRect.top && ballRect.left >= playerRect.left && ballRect.right <= playerRect.right) {
            // Player berhasil menangkap bola
            gameContainer.removeChild(ball);
            balls.splice(index, 1);
            increaseScore();
        }
    });

    bombs.forEach(function (bomb, index) {
        var bombRect = bomb.getBoundingClientRect();
        var playerRect = player.getBoundingClientRect();

        if (bombRect.bottom >= playerRect.top && bombRect.left >= playerRect.left && bombRect.right <= playerRect.right) {
            // Player menyentuh bom
            gameContainer.removeChild(bomb);
            bombs.splice(index, 1);
            decreaseHealth();
        }
    });

    powerUps.forEach(function (powerUp, index) {
        var powerUpRect = powerUp.getBoundingClientRect();
        var playerRect = player.getBoundingClientRect();

        if (powerUpRect.bottom >= playerRect.top && powerUpRect.left >= playerRect.left && powerUpRect.right <= playerRect.right) {
            // Player mengambil power up
            gameContainer.removeChild(powerUp);
            powerUps.splice(index, 1);
            increaseHealth();
        }
    });
}

// Fungsi untuk meningkatkan skor
function increaseScore() {
    score++;
    scoreValue.innerText = score;

    if (score % 10 === 0) {
        createPowerUp();
    }

    if (score % 1 === 0) {
        createBall();
    }
}

// Fungsi untuk mengurangi nyawa
function decreaseHealth() {
    health--;
    healthValue.innerText = health;

    if (health === 0) {
        endGame();
    }
}

// Fungsi untuk meningkatkan nyawa
function increaseHealth() {
    health++;
    healthValue.innerText = health;
}

// Fungsi untuk membuat power up
function createPowerUp() {
    var powerUp = document.createElement('div');
    powerUp.className = 'power-up';
    powerUp.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - 30)) + 'px';
    gameContainer.appendChild(powerUp);
    powerUps.push(powerUp);
}

// Fungsi untuk mengakhiri permainan
function endGame() {
    clearInterval(gameLoop);
    gameOverScore.innerText = score;
    gameOverPopup.style.display = 'flex';
}

// Fungsi untuk mengatur ulang permainan
function resetGame() {
    player.style.left = '175px';
    playerPosition = 175;
    score = 0;
    health = 3;
    scoreValue.innerText = score;
    healthValue.innerText = health;

    balls.forEach(function (ball) {
        gameContainer.removeChild(ball);
    });
    balls = [];

    bombs.forEach(function (bomb) {
        gameContainer.removeChild(bomb);
    });
    bombs = [];

    powerUps.forEach(function (powerUp) {
        gameContainer.removeChild(powerUp);
    });
    powerUps = [];

    gameOverPopup.style.display = 'none';

    startGame();
}

// Event listener untuk tombol restart
restartButton.addEventListener('click', resetGame);

// Event listener untuk pergerakan pemain
window.addEventListener('keydown', movePlayer);

// Mulai permainan saat halaman dimuat
startGame();
