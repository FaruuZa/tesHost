const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
document.getElementById('attackButton').addEventListener('click', () => playerAction('attack'));
document.getElementById('guardButton').addEventListener('click', () => playerAction('guard'));
document.getElementById('chargeButton').addEventListener('click', () => playerAction('charge'));
document.getElementById('healButton').addEventListener('click', () => playerAction('heal'));

// Stances dan frame counts
const playerStances = { idle: [], attack: [], hit: [], dead: [] };
const enemyStances = { idle: [], attack: [], hit: [], dead: [] };

const playerFrameCounts = { idle: 38, attack: 11, hit: 8, dead: 4 };
const enemyFrameCounts = { idle: 44, attack: 11, hit: 7, dead: 4 };

let imagesLoaded = 0;
const totalImages = playerFrameCounts.idle + playerFrameCounts.attack + playerFrameCounts.hit + playerFrameCounts.dead +
    enemyFrameCounts.idle + enemyFrameCounts.attack + enemyFrameCounts.hit + enemyFrameCounts.dead;

// Player dan enemies
const player = {
    x: 100, y: 100, width: 100, height: 100, health: 100, attack: 20,
    isTurn: true, currentFrame: 0, frameCount: 0, stance: 'idle', originalX: 100,
    isCharging: false, isGuarding: false, chargeCooldown: 0, guardCooldown: 0, healCooldown: 0
};

const enemies = [
    {
        x: 400, y: 100, width: 100, height: 100, health: 100, attack: 10,
        isTurn: false, currentFrame: 0, frameCount: 0, stance: 'idle', originalX: 400,
        isCharging: false, isGuarding: false, chargeCooldown: 0, guardCooldown: 0, healCooldown: 0
    }
];

let currentEnemyIndex = 0;
let gameOver = false;
let turn = 1; // Turn ganjil: player, turn genap: enemy

// Efek suara
const attackSound = new Audio('sounds/attack.mp3');
const hitSound = new Audio('sounds/hit.mp3');

// Fungsi untuk memuat gambar
function loadImages(stance, type, frameCount) {
    for (let index = 1; index <= frameCount; index++) {
        const img = new Image();
        img.src = `img/${type}/${stance}/${index}.png`;
        img.onload = () => {
            if (type === 'player') playerStances[stance].push(img);
            else enemyStances[stance].push(img);
            checkAllImagesLoaded();
        };
    }
}

// Fungsi untuk memeriksa apakah semua gambar telah dimuat
function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        player.frameCount = playerFrameCounts[player.stance];
        enemies[currentEnemyIndex].frameCount = enemyFrameCounts[enemies[currentEnemyIndex].stance];
        gameLoop();
    }
}
// Fungsi untuk mengganti Stance
function changePlayerStance(newStance) {
    player.stance = newStance;
    player.frameCount = playerFrameCounts[newStance]; // Update frameCount sesuai stance baru
    player.currentFrame = 0; // Reset currentFrame ke 0
}

function changeEnemyStance(newStance) {
    enemies[currentEnemyIndex].stance = newStance;
    enemies[currentEnemyIndex].frameCount = enemyFrameCounts[newStance]; // Update frameCount sesuai stance baru
    enemies[currentEnemyIndex].currentFrame = 0; // Reset currentFrame ke 0
}

function getAnimationDuration(frameCount, fps = 30) {
    return (frameCount / fps) * 1000; // Durasi dalam milidetik
}
// Fungsi untuk menggambar health bar
function drawHealthBar(x, y, width, height, health) {
    const healthWidth = (health / 100) * width;
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, height);
}

// Fungsi untuk menggambar player
function drawPlayer() {
    ctx.drawImage(playerStances[player.stance][player.currentFrame], player.x, player.y, player.width, player.height);
    drawHealthBar(player.x, player.y + player.height + 10, player.width, 10, player.health, player.isCharging, player.isGuarding);
}

// Fungsi untuk menggambar enemies
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        if (index === currentEnemyIndex) {
            const img = enemyStances[enemy.stance][enemy.currentFrame];
            if (img) {
                ctx.drawImage(img, enemy.x, enemy.y, enemy.width, enemy.height);
                drawHealthBar(enemy.x, enemy.y + enemy.height + 10, enemy.width, 10, enemy.health, enemy.isCharging, enemy.isGuarding);
            }
        }
    });
}

// Fungsi untuk memperbarui frame animasi
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    player.currentFrame = (player.currentFrame + 1) % player.frameCount;
    if (enemies[currentEnemyIndex]) {
        enemies[currentEnemyIndex].currentFrame = (enemies[currentEnemyIndex].currentFrame + 1) % enemies[currentEnemyIndex].frameCount;
    }
}

// Fungsi untuk menangani aksi player
function playerAction(action) {
    if (player.isTurn) {
        switch (action) {
            case 'attack':
                playerAttack();
                break;
            case 'guard':
                if (player.guardCooldown === 0) {
                    player.isGuarding = true;
                    player.guardCooldown = 2; // Set cooldown
                    // player.isTurn = false;
                }
                break;
            case 'charge':
                if (player.chargeCooldown === 0) {
                    player.isCharging = true;
                    player.chargeCooldown = 2; // Set cooldown
                    // player.isTurn = false;
                }
                break;
            case 'heal':
                if (player.healCooldown === 0) {
                    const healAmount = getRandomDamage(10, 15);
                    player.health = Math.min(player.health + healAmount, 100);
                    player.healCooldown = 1; // Set cooldown
                }
                break;
        }
        player.isTurn = false;
        // turn++; // Ganti turn
        executeEnemyAction();
    }
}
let enemyCurrentAction = null; // Menyimpan aksi yang dipilih enemy
function enemyAction() {
    if (enemies[currentEnemyIndex].isCharging) {
        return 'attack'; // Selalu attack jika sedang charge
    } else {
        const actions = ['attack', 'charge', 'guard'];
        return actions[Math.floor(Math.random() * actions.length)]; // Pilih aksi secara acak
    }
}
function disablePlayerButtons() {
    // console.log("disabled")
    document.getElementById('attackButton').disabled = true;
    document.getElementById('guardButton').disabled = true;
    document.getElementById('chargeButton').disabled = true;
    document.getElementById('healButton').disabled = true;
}

function enablePlayerButtons() {
    // console.log("enabled")
    document.getElementById('attackButton').disabled = false;
    document.getElementById('guardButton').disabled = false;
    document.getElementById('chargeButton').disabled = false;
    document.getElementById('healButton').disabled = false;
}
function showEnemyAction(action) {
    const actionText = document.getElementById('enemyActionText');
    actionText.textContent = `Enemy chooses: ${action}`; // Tampilkan pilihan enemy
    enemyCurrentAction = action; // Simpan pilihan enemy
    enablePlayerButtons(); // Aktifkan tombol aksi player
}
function executeEnemyAction() {
    const action = enemyAction(); // Dapatkan aksi yang dipilih
    switch (action) {
        case 'attack':
            enemyAttack();
            break;
        case 'charge':
            enemies[currentEnemyIndex].isCharging = true;
            enemies[currentEnemyIndex].chargeCooldown = 2; // Set cooldown
            // player.isTurn = true; // Ganti giliran
            break;
        case 'guard':
            enemies[currentEnemyIndex].isGuarding = true;
            enemies[currentEnemyIndex].guardCooldown = 2; // Set cooldown
            break;
    }
    turn++
    player.isTurn = true; // Ganti giliran
}
// Fungsi untuk menyerang musuh
function playerAttack() {
    changePlayerStance('attack');
    setTimeout(() => {
        let damage = getRandomDamage(5, 20);
        if (player.isCharging) {
            damage *= 2; // Damage dikalikan 2 jika sedang charge
            player.isCharging = false; // Nonaktifkan charge setelah attack
        }
        enemies[currentEnemyIndex].health -= damage;
        if (enemies[currentEnemyIndex].health <= 0) {
            enemies[currentEnemyIndex].health = 0;
            changeEnemyStance('dead');
            nextEnemy(); // Beralih ke musuh berikutnya
        } else {
            changeEnemyStance('hit');
            setTimeout(() => {
                changeEnemyStance('idle');
                player.isTurn = false;
                if (!gameOver) enemyTurn();
            }, getAnimationDuration(enemyFrameCounts.hit));
        }
    }, getAnimationDuration(playerFrameCounts.attack));
}

function drawTurnIndicator() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(turn, 170, 30)
    if (turn % 2 === 1) {
        ctx.fillText("Player's Turn", 10, 30);
    } else {
        ctx.fillText("Enemy's Turn", 10, 30);
    }
}
// Fungsi untuk giliran musuh
function enemyTurn() {
    if (!gameOver) {
        const action = enemyAction();
        console.log(action)
        if (action === 'attack') enemyAttack();
        else player.isTurn = true; // Kembali ke giliran player jika tidak menyerang
    }
}

// Fungsi untuk menyerang player
function enemyAttack() {
    changeEnemyStance('attack');
    setTimeout(() => {
        let damage = getRandomDamage(5, 20);
        if (enemies[currentEnemyIndex].isCharging) {
            damage *= 2; // Damage dikalikan 2 jika sedang charge
            enemies[currentEnemyIndex].isCharging = false; // Nonaktifkan charge setelah attack
        }
        if (player.isGuarding) {
            damage *= 0.5; // Kurangi damage jika player sedang guard
            player.isGuarding = false; // Nonaktifkan guard setelah menerima damage
        }
        player.health -= damage;
        if (player.health <= 0) {
            player.health = 0;
            changePlayerStance('dead'); // Ubah stance player menjadi dead
            gameOver = true; // Hentikan game
        } else {
            playerHit(); // Panggil fungsi playerHit jika player belum mati
        }
        enemies[currentEnemyIndex].x = enemies[currentEnemyIndex].originalX; // Kembali ke posisi awal
        changeEnemyStance('idle'); // Kembali ke stance idle
        player.isTurn = true; // Ganti giliran
    }, getAnimationDuration(enemyFrameCounts.attack)); // Durasi animasi attack
}

function playerHit() {
    changePlayerStance('hit'); // Ubah stance ke hit
    setTimeout(() => {
        changePlayerStance('idle'); // Kembalikan ke idle setelah beberapa saat
    }, getAnimationDuration(playerFrameCounts.hit)); // Durasi animasi hit
}

// Fungsi untuk beralih ke musuh berikutnya
function nextEnemy() {
    currentEnemyIndex++;
    if (currentEnemyIndex >= enemies.length) {
        console.log("All enemies defeated! You win!");
        gameOver = true;
    } else {
        player.isTurn = true;
        enemies[currentEnemyIndex].frameCount = enemyFrameCounts[enemies[currentEnemyIndex].stance];
    }
}

// Fungsi untuk mendapatkan damage secara acak
function getRandomDamage(min = 5, max = 20) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Fungsi untuk menggambar health bar
function drawHealthBar(x, y, width, height, health, isCharging, isGuarding) {
    const healthWidth = (health / 100) * width;
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, healthWidth, height);
    if (isGuarding) {
        ctx.strokeStyle = "yellow"; // Warna outline
        ctx.lineWidth = 3; // Ketebalan outline
        ctx.strokeRect(x, y, width, height); // Gambar outline
    }

    // Gambar label "2X" jika charge aktif
    if (isCharging) {
        ctx.fillStyle = "white"; // Warna teks
        ctx.font = "20px Arial"; // Ukuran dan jenis font
        ctx.fillText("2X", x + width + 10, y + height / 2); // Gambar teks "2X" di sebelah bar HP
    }
}

// Fungsi untuk menggambar player
function drawPlayer() {
    ctx.drawImage(playerStances[player.stance][player.currentFrame], player.x, player.y, player.width, player.height);
    drawHealthBar(player.x, player.y + player.height + 10, player.width, 10, player.health, player.isCharging, player.isGuarding);
}

// Fungsi untuk menggambar enemies
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        if (index === currentEnemyIndex) {
            const img = enemyStances[enemy.stance][enemy.currentFrame];
            if (img) {
                ctx.drawImage(img, enemy.x, enemy.y, enemy.width, enemy.height);
                drawHealthBar(enemy.x, enemy.y + enemy.height + 10, enemy.width, 10, enemy.health, enemy.isCharging, enemy.isGuarding);
            }
        }
    });
}

// Fungsi untuk memperbarui frame animasi
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawTurnIndicator(); // Tampilkan indikator turn
    player.currentFrame = (player.currentFrame + 1) % player.frameCount;
    if (enemies[currentEnemyIndex]) {
        enemies[currentEnemyIndex].currentFrame = (enemies[currentEnemyIndex].currentFrame + 1) % enemies[currentEnemyIndex].frameCount;
    }
}

// Fungsi untuk memulai game
function startGame() {
    loadImages('idle', 'player', playerFrameCounts.idle);
    loadImages('attack', 'player', playerFrameCounts.attack);
    loadImages('hit', 'player', playerFrameCounts.hit);
    loadImages('dead', 'player', playerFrameCounts.dead);
    loadImages('idle', 'enemies', enemyFrameCounts.idle);
    loadImages('attack', 'enemies', enemyFrameCounts.attack);
    loadImages('hit', 'enemies', enemyFrameCounts.hit);
    loadImages('dead', 'enemies', enemyFrameCounts.dead);
}

// Memulai game
startGame();
function gameLoop() {
    requestAnimationFrame(gameLoop);
    update();
}