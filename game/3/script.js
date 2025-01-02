var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var player = { x: 175, y: 550, width: 60, height: 20 };
var balls = [];
var bombs = [];
var powerUps = [];
var score = 0;
var health = 3;
var gameLoop;
var playerWidth = player.width; // Simpan lebar pemain untuk power-up
var immunity = false; // Status kekebalan
var immunityDuration = 5000; // Durasi kekebalan dalam milidetik
var widthBoostDuration = 5000; // Durasi boost dalam milidetik
var acquiredPowerUpText = ''; // Teks untuk power-up yang didapat
var powerUpTextDuration = 3000; // Durasi teks power-up dalam milidetik
var powerUpTextVisible = false; // Status visibilitas teks power-up

// Fungsi untuk memulai permainan
function startGame() {
    document.getElementById('game-over-popup').style.display = 'none';
    score = 0;
    health = 3;
    balls = [];
    bombs = [];
    powerUps = [];
    acquiredPowerUpText = ''; // Reset teks power-up
    powerUpTextVisible = false; // Reset status visibilitas teks
    gameLoop = setInterval(update, 25);
    createBall();
    createBomb();
}

// Fungsi untuk menggambar objek
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gambar pemain
    ctx.fillStyle = immunity ? 'yellow' : 'blue'; // Ganti warna saat kekebalan aktif
    ctx.fillRect(player.x, player.y, playerWidth, player.height);

    // Gambar bola
    balls.forEach(ball => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 15, 0, Math.PI * 2);
        ctx.fill();
    });

    // Gambar bom
    bombs.forEach(bomb => {
        ctx.fillStyle = 'black';
        ctx.fillRect(bomb.x, bomb.y, 20, 20);
    });

    // Gambar power-up
    powerUps.forEach(powerUp => {
        ctx.fillStyle = 'green';
        ctx.fillRect(powerUp.x, powerUp.y, 20, 20);
    });

    // Gambar skor dan kesehatan
    ctx.font = '12px Arial'
    ctx.textAlign = 'start';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 10, 20);
    ctx.fillText('Health: ' + health, 10, 40);

    // Gambar teks power-up jika terlihat
    if (powerUpTextVisible) {
        ctx.font = '24px Arial'; // Ukuran font
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(acquiredPowerUpText, canvas.width / 2, canvas.height / 2); // Teks di tengah
    }
}

// Fungsi untuk memperbarui permainan
function update() {
    draw();
    dropObjects();
    checkCollision();
}

// Fungsi untuk menjatuhkan objek
function dropObjects() {
    // Menjatuhkan bola dengan peluang yang lebih rendah
    if (Math.random() < 0.005) { // 5% kemungkinan untuk menjatuhkan bola baru
        createBall();
    }

    // Menjatuhkan bom dengan peluang yang lebih tinggi berdasarkan skor
    if (Math.random() < 0.004 + (score / 1000)) { // Meningkatkan peluang bom saat skor meningkat
        createBomb();
    }

    balls.forEach((ball, index) => {
        ball.y += 5 + Math.floor(score / 10); // Meningkatkan kecepatan jatuh bola
        if (ball.y > canvas.height) {
            balls.splice(index, 1);
            decreaseHealth()
        }
    });

    bombs.forEach((bomb, index) => {
        bomb.y += 3 + Math.floor(score / 10); // Meningkatkan kecepatan jatuh bom
        if (bomb.y > canvas.height) {
            bombs.splice(index, 1);
        }
    });

    powerUps.forEach((powerUp, index) => {
        powerUp.y += 4;
        if (powerUp.y > canvas.height) {
            powerUps.splice(index, 1);
            createPowerUp();
        }
    });
}

// Fungsi untuk memeriksa tabrakan
function checkCollision() {
    balls.forEach((ball, index) => {
        if (ball.y + 15 >= player.y && ball.x >= player.x && ball.x <= player.x + playerWidth) {
            balls.splice(index, 1);
            increaseScore();
            createBall();
        }
    });

    bombs.forEach((bomb, index) => {
        if (bomb.y + 20 >= player.y && bomb.x >= player.x && bomb.x <= player.x + playerWidth) {
            if (!immunity) {
                bombs.splice(index, 1);
                decreaseHealth();
                createBomb();
            }
        }
    });

    powerUps.forEach((powerUp, index) => {
        if (powerUp.y + 20 >= player.y && powerUp.x >= player.x && powerUp.x <= player.x + playerWidth) {
            powerUps.splice(index, 1);
            applyRandomPowerUp();
            createPowerUp();
        }
    });
}

// Fungsi untuk menerapkan efek power-up acak
function applyRandomPowerUp() {
    var randomEffect = Math.floor(Math.random() * 4); // 0-3 untuk 4 efek berbeda
    switch (randomEffect) {
        case 0:
            increasePlayerWidth(); // Menambah jangkauan
            acquiredPowerUpText = 'Lebar Pemain Meningkat!';
            break;
        case 1:
            activateImmunity(); // Mengaktifkan kekebalan
            acquiredPowerUpText = 'Kekebalan Aktif!';
            break;
        case 2:
            increaseHealth(); // Menambah HP
            acquiredPowerUpText = 'Kesehatan Meningkat!';
            break;
        // case 3:
        //     // Efek tambahan bisa ditambahkan di sini
        //     acquiredPowerUpText = 'Efek Tambahan!';
        //     break;
    }
    powerUpTextVisible = true; // Tampilkan teks power-up
    setTimeout(() => {
        powerUpTextVisible = false; // Sembunyikan teks setelah durasi
    }, powerUpTextDuration);
    if (powerUps.length < 3) { // Batasi jumlah power-up di canvas
        createPowerUp();
    }
}

// Fungsi untuk mengaktifkan kekebalan
function activateImmunity() {
    immunity = true;
    setTimeout(() => {
        immunity = false; // Nonaktifkan kekebalan setelah durasi
    }, immunityDuration);
}

// Fungsi untuk meningkatkan skor
function increaseScore() {
    score++;
    if (score % 10 === 0) {
        if (powerUps.length < 3) { // Batasi jumlah power-up di canvas
            createPowerUp();
        }
    }
}

// Fungsi untuk mengurangi nyawa
function decreaseHealth() {
    if (!immunity) {
        health--;
    }
    if (health === 0) {
        endGame();
    }
}

// Fungsi untuk meningkatkan nyawa
function increaseHealth() {
    health++;
}

// Fungsi untuk meningkatkan lebar pemain
function increasePlayerWidth() {
    playerWidth += 40;
    setTimeout(() => {
        playerWidth -= 40;
    }, widthBoostDuration);
}

// Fungsi untuk membuat bola
function createBall() {
    var ball = { x: Math.random() * (canvas.width - 30), y: 0 };
    balls.push(ball);
}

// Fungsi untuk membuat bom
function createBomb() {
    var bomb = { x: Math.random() * (canvas.width - 30), y: 0 };
    bombs.push(bomb);
}

// Fungsi untuk membuat power up
function createPowerUp() {
    var powerUp = { x: Math.random() * (canvas.width - 30), y: 0 };
    powerUps.push(powerUp);
}

// Fungsi untuk mengakhiri permainan
function endGame() {
    clearInterval(gameLoop);
    document.getElementById('game-over-score-value').innerText = score;
    document.getElementById('game-over-popup').style.display = 'flex';
}

// Fungsi untuk mengatur ulang permainan
function resetGame() {
    player.x = 175;
    playerWidth = player.width; // Reset lebar pemain
    immunity = false; // Reset status kekebalan
    startGame();
}

// Event listener untuk tombol restart
document.getElementById('restart-button').addEventListener('click', resetGame);


// Event listener untuk pergerakan pemain dengan geser
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    player.x = event.clientX - rect.left - (playerWidth / 2); // Mengatur posisi x pemain
    if (player.x < 0) player.x = 0; // Batas kiri
    if (player.x + playerWidth > canvas.width) player.x = canvas.width - playerWidth; // Batas kanan
});

canvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    player.x = touch.clientX - rect.left - (playerWidth / 2); // Mengatur posisi x pemain
    if (player.x < 0) player.x = 0; // Batas kiri
    if (player.x + playerWidth > canvas.width) player.x = canvas.width - playerWidth; // Batas kanan
    event.preventDefault(); // Mencegah scroll pada perangkat sentuh
});

// Mulai permainan saat halaman dimuat
startGame();