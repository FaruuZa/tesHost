const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
document.getElementById('attackButton').addEventListener('click', () => playerAction('attack'));
document.getElementById('guardButton').addEventListener('click', () => playerAction('guard'));
document.getElementById('chargeButton').addEventListener('click', () => playerAction('charge'));
document.getElementById('healButton').addEventListener('click', () => playerAction('heal'));

const canvasWidth = ctx.canvas.width = window.innerWidth * 0.8;
// Stances dan frame counts
const playerStances = { idle: [], attack: [], hit: [], dead: [], chargeStart: [], chargeIdle: [], chargeAttack: [] };
const enemyStances = { idle: [], attack: [], hit: [], dead: [], chargeStart: [], chargeIdle: [], chargeAttack: [] };

const playerFrameCounts = { idle: 38, attack: 11, hit: 8, dead: 4, chargeStart: 8, chargeIdle: 1, chargeAttack: 11 };
const enemyFrameCounts = { idle: 44, attack: 11, hit: 7, dead: 4, chargeStart: 1, chargeIdle: 14, chargeAttack: 10 };

let imagesLoaded = 0;
const totalImages = playerFrameCounts.idle + playerFrameCounts.attack + playerFrameCounts.hit + playerFrameCounts.dead +
    enemyFrameCounts.idle + enemyFrameCounts.attack + enemyFrameCounts.hit + enemyFrameCounts.dead;

// Player dan enemies
const player = {
    x: canvasWidth * 0.25, y: canvas.height / 3, width: 100, height: 100, health: 100, attack: 20,
    isTurn: true, currentFrame: 0, frameCount: 0, stance: 'idle', originalX: canvasWidth * 0.25,
    isCharging: false, isGuarding: false, chargeCooldown: 0, guardCooldown: 0, healCooldown: 0
};

const bomb = {
    x: player.x,
    y: player.y,
    width: 200,
    height: 200,
    status: 'idle',
    frameCount: 0,
    currentFrame: 0,
    stance: 'idle'
};

const bombStances = {
    idle: [],
    explosion: []
};

const bombFrameCounts = {
    idle: 10,
    explosion: 5
};


const enemies = [
    {
        x: canvasWidth * 0.75, y: canvas.height / 3, width: 100, height: 100, health: 100, attack: 10,
        isTurn: false, currentFrame: 0, frameCount: 0, stance: 'idle', originalX: canvasWidth * 0.75,
        isCharging: false, isGuarding: false, chargeCooldown: 0, guardCooldown: 0, healCooldown: 0
    },
    {
        x: canvasWidth * 0.75, y: canvas.height / 3, width: 100, height: 100, health: 100, attack: 10,
        isTurn: false, currentFrame: 0, frameCount: 0, stance: 'idle', originalX: canvasWidth * 0.75,
        isCharging: false, isGuarding: false, chargeCooldown: 0, guardCooldown: 0, healCooldown: 0
    },
    {
        x: canvasWidth * 0.75, y: canvas.height / 3, width: 100, height: 100, health: 100, attack: 10,
        isTurn: false, currentFrame: 0, frameCount: 0, stance: 'idle', originalX: canvasWidth * 0.75,
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

function loadBombImages(stance, frameCount) {
    for (let index = 1; index <= frameCount; index++) {
        const img = new Image();
        img.src = `img/bom/${stance}/${index}.png`;
        img.onload = () => {
            bombStances[stance].push(img);
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

// function activeBomb() {
//     bomb.status = 'aktif';
//     bomb.frameCount = bombFrameCounts.idle;
//     bomb.currentFrame = 0;
//     bomb.stance = 'idle';
// }

function throwBomb() {
    bomb.status = 'explosion';
    bomb.frameCount = bombFrameCounts.explosion;
    bomb.currentFrame = 0;
    bomb.stance = 'explosion';

    setTimeout(() => {
        bomb.status = 'idle';
        bomb.frameCount = bombFrameCounts.idle;
        bomb.currentFrame = 0;
        bomb.stance = 'idle';
    }, getAnimationDuration(bombFrameCounts.explosion));
}

function changeEnemyStance(newStance) {
    enemies[currentEnemyIndex].stance = newStance;
    enemies[currentEnemyIndex].frameCount = enemyFrameCounts[newStance]; // Update frameCount sesuai stance baru
    enemies[currentEnemyIndex].currentFrame = 0; // Reset currentFrame ke 0
}

function getAnimationDuration(frameCount, fps = 30) { // Ubah FPS default menjadi 30
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

// bomb.currentFrame=0
function drawBomb() {
    if (bomb.status !== 'idle') {
        ctx.globalAlpha = 0.3
        ctx.drawImage(bombStances[bomb.stance][bomb.currentFrame], bomb.x, bomb.y, bomb.width, bomb.height);
        bomb.currentFrame = (bomb.currentFrame + 1) % bomb.frameCount;
        ctx.globalAlpha = 1
    }
}
// Fungsi untuk menggambar player
// function drawPlayer() {
//     ctx.drawImage(playerStances[player.stance][player.currentFrame], player.x, player.y, player.width, player.height);
//     drawHealthBar(player.x, player.y + player.height + 10, player.width, 10, player.health, player.isCharging, player.isGuarding);
// }
function drawPlayer() {

    ctx.drawImage(playerStances[player.stance][player.currentFrame], player.x, player.y, player.width, player.height);
    if (player.stance === 'chargeIdle') {
        bomb.currentFrame = 0
        bomb.x = player.x + player.width / 2;
        bomb.y = player.y + player.height / 2;
        drawBomb();
    }
    drawHealthBar(player.x, player.y + player.height + 10, player.width, 10, player.health, player.isCharging, player.isGuarding);
}

// Fungsi untuk menangani aksi player
function playerAction(action) {
    if (player.isTurn) {
        let err = false;
        if (player.isCharging) {
            switch (action) {
                case 'attack':
                    changePlayerStance('chargeAttack');
                    playerAttack();
                    break;
                default:
                    err = true;
                    break;
            }
        } else {
            switch (action) {
                case 'attack':
                    playerAttack();
                    break;
                case 'guard':
                    if (player.guardCooldown === 0) {
                        player.isGuarding = true;
                        player.guardCooldown = 3; // Set cooldown
                        nextTurn();
                    } else {
                        err = true;
                    }
                    break;
                case 'charge':
                    if (player.chargeCooldown === 0) {
                        changePlayerStance('chargeStart');
                        setTimeout(() => {
                            changePlayerStance('chargeIdle');
                            player.width += 25;
                            player.height += 25;
                            player.y -= 25
                            player.x -= 25
                            // activeBomb()
                            player.isCharging = true;
                            player.chargeCooldown = 3; // Set cooldown
                            nextTurn();
                        }, getAnimationDuration(playerFrameCounts.chargeStart));
                    } else {
                        err = true;
                    }
                    break;
                case 'heal':
                    if (player.healCooldown === 0) {
                        const healAmount = getRandomDamage(25, 45);
                        player.health = Math.min(player.health + healAmount, 100);
                        player.healCooldown = 5; // Set cooldown
                        addDamageText(player.x + player.width / 2, player.y - 10, `+${healAmount}`); // Tampilkan teks heal
                        nextTurn();
                    } else {
                        err = true;
                    }
                    break;
            }
        }
        if (!err) {
            console.log(turn + ' - player - ' + action);
        }
    }
}
let enemyCurrentAction = null; // Menyimpan aksi yang dipilih enemy
function enemyAction() {
    if (enemies[currentEnemyIndex].isCharging) {
        return 'attack'; // Selalu attack jika sedang charge
    } else if (enemies[currentEnemyIndex].chargeCooldown > 0) {
        const actions = ['attack', 'guard'];
        return actions[Math.floor(Math.random() * actions.length)]; // Pilih aksi secara acak
    } else if (enemies[currentEnemyIndex].guardCooldown > 0) {
        const actions = ['attack', 'charge'];
        return actions[Math.floor(Math.random() * actions.length)]; // Pilih aksi secara acak
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
    switch (enemyCurrentAction) {
        case 'attack':
            enemyAttack(); // Jalankan serangan enemy
            break;
        case 'charge':
            enemies[currentEnemyIndex].isCharging = true; // Aktifkan charge
            changeEnemyStance('chargeStart');
            setTimeout(() => {
                enemies[currentEnemyIndex].width += 25;
                enemies[currentEnemyIndex].height += 25;
                enemies[currentEnemyIndex].y -= 25
                enemies[currentEnemyIndex].x -= 25
                changeEnemyStance('chargeIdle');
                nextTurn();
            }, getAnimationDuration(enemyFrameCounts.chargeStart));
            break;
        case 'guard':
            enemies[currentEnemyIndex].isGuarding = true; // Aktifkan guard
            nextTurn();
            break;
    }
    console.log(turn + ' - Enemy - ' + enemyCurrentAction);
}
// Fungsi untuk menyerang musuh
function playerAttack() {
    player.x = enemies[currentEnemyIndex].x - player.width
    if (player.isCharging) {
        bomb.x = player.x
    } else {
        changePlayerStance('attack');
    }
    setTimeout(() => {
        let damage = getRandomDamage(5, 20);
        let crit = damage == 20 ? true : false
        if (player.isCharging) {
            damage *= 2; // Damage dikalikan 2 jika sedang charge
            bomb.x = enemies[currentEnemyIndex].x - 50
            bomb.y = enemies[currentEnemyIndex].y - 50
            // player.isCharging = false; // Nonaktifkan charge setelah attack
        }
        if (enemies[currentEnemyIndex].isGuarding) {
            damage *= 0.5; // Kurangi damage jika player sedang guard
            enemies[currentEnemyIndex].isGuarding = false; // Nonaktifkan guard setelah menerima damage
        }
        enemies[currentEnemyIndex].health -= damage;
        addDamageText(enemies[currentEnemyIndex].x + enemies[currentEnemyIndex].width / 2, enemies[currentEnemyIndex].y - 10, `-${damage}`, crit); // Tampilkan teks dmg
        if (player.isCharging) {
            throwBomb();
        }
        if (enemies[currentEnemyIndex].health <= 0) {
            enemies[currentEnemyIndex].health = 0;
            changeEnemyStance('dead');
            player.x = player.originalX
            if (player.isCharging) {
                player.isCharging = false;
                player.width -= 25;
                player.height -= 25;
                player.y += 25
                player.x += 25
            }
            changePlayerStance('idle')
            nextEnemy(); // Beralih ke musuh berikutnya
        } else {
            changeEnemyStance('hit');
            setTimeout(() => {
                if (enemies[currentEnemyIndex].isCharging) {
                    changeEnemyStance('chargeIdle');
                } else {
                    changeEnemyStance('idle');
                }
                player.x = player.originalX
                if (player.isCharging) {
                    player.isCharging = false;
                    player.x = player.originalX
                    player.width -= 25;
                    player.height -= 25;
                    player.y += 25
                    player.x += 25
                }
                changePlayerStance('idle')
                setTimeout(() => {
                    if (!gameOver) nextTurn();
                }, 200)
                // nextTurn()
            }, getAnimationDuration(enemyFrameCounts.hit));
        }
    }, getAnimationDuration(playerFrameCounts.attack));
}

// Fungsi untuk giliran musuh
function enemyTurn() {
    if (!gameOver) {
        executeEnemyAction();
        showEnemyAction(enemyAction())
    }
}

// Fungsi untuk menyerang player
function enemyAttack() {
    enemies[currentEnemyIndex].x = player.x + enemies[currentEnemyIndex].width
    if (enemies[currentEnemyIndex].isCharging) {
        changeEnemyStance('chargeAttack');
    } else {
        changeEnemyStance('attack');
    }

    setTimeout(() => {
        let damage = getRandomDamage(5, 20);
        let crit = damage == 0 ? true : false
        if (enemies[currentEnemyIndex].isCharging) {
            damage *= 2; // Damage dikalikan 2 jika sedang charge
            // Nonaktifkan charge setelah attack
        }
        if (player.isGuarding) {
            damage *= 0.5; // Kurangi damage jika player sedang guard
            player.isGuarding = false; // Nonaktifkan guard setelah menerima damage
        }
        player.health -= damage;
        addDamageText(player.x + player.width / 2, player.y - 10, `-${damage}`, crit); // Tampilkan teks dmg
        if (player.health <= 0) {
            player.health = 0;
            changePlayerStance('dead'); // Ubah stance player menjadi dead
            gameOver = true; // Hentikan game
        } else {
            playerHit(); // Panggil fungsi playerHit jika player belum mati
        }
        enemies[currentEnemyIndex].x = enemies[currentEnemyIndex].originalX; // Kembali ke posisi awal
        if (enemies[currentEnemyIndex].isCharging) {
            enemies[currentEnemyIndex].isCharging = false;
            enemies[currentEnemyIndex].width -= 25;
            enemies[currentEnemyIndex].height -= 25;
            enemies[currentEnemyIndex].y += 25
            enemies[currentEnemyIndex].x += 25
        }
        changeEnemyStance('idle'); // Kembali ke stance idle
        nextTurn();
    }, getAnimationDuration(enemyFrameCounts.attack)); // Durasi animasi attack
}

function playerHit() {
    if (player.stance !== 'chargeIdle') { // Hanya ubah ke 'hit' jika tidak sedang di 'chargeIdle'
        changePlayerStance('hit');
        setTimeout(() => {
            if (player.stance !== 'chargeIdle') { // Kembalikan ke 'idle' hanya jika tidak sedang di 'chargeIdle'
                changePlayerStance('idle');
            } else {
                changePlayerStance('chargeIdle');
            }
        }, getAnimationDuration(playerFrameCounts.hit));
    }
}

// Fungsi untuk beralih ke musuh berikutnya
function nextEnemy() {
    currentEnemyIndex++;
    if (currentEnemyIndex >= enemies.length) {
        console.log("All enemies defeated! You win!");
        currentEnemyIndex--
        gameOver = true;
    } else {
        player.health = Math.min(player.health + 20, 100);
        addDamageText(player.x + player.width / 2, player.y - 10, `+20`); // Tampilkan teks heal
        nextTurn();
        nextTurn()
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

// ctx.canvas.height = window.innerHeight;
// Fungsi untuk memperbarui frame animasi
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawBomb();
    drawDamageTexts();
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
    loadImages('chargeStart', 'player', playerFrameCounts.chargeStart);
    loadImages('chargeIdle', 'player', playerFrameCounts.chargeIdle);
    loadImages('chargeAttack', 'player', playerFrameCounts.chargeAttack);

    loadImages('idle', 'enemies', enemyFrameCounts.idle);
    loadImages('attack', 'enemies', enemyFrameCounts.attack);
    loadImages('hit', 'enemies', enemyFrameCounts.hit);
    loadImages('dead', 'enemies', enemyFrameCounts.dead);
    loadImages('chargeStart', 'enemies', enemyFrameCounts.chargeStart);
    loadImages('chargeIdle', 'enemies', enemyFrameCounts.chargeIdle);
    loadImages('chargeAttack', 'enemies', enemyFrameCounts.chargeAttack);

    loadBombImages('idle', bombFrameCounts.idle);
    loadBombImages('explosion', bombFrameCounts.explosion);

    showEnemyAction(enemyAction());
    nextTurn();
}
// next Turn
turn = 0
function nextTurn() {
    if (!gameOver) {
        turn++
        if (turn % 2 == 0) {
            player.isTurn = false
            // enemies[currentEnemyIndex].isTurn = true
            // executeEnemyAction();
            enemyTurn()
        } else {
            player.isTurn = true
            enemies[currentEnemyIndex].isTurn = false
            decreaseCD()
        }
    }
}

function decreaseCD() {
    if (player.chargeCooldown > 0) {
        player.chargeCooldown--
    }
    if (player.guardCooldown > 0) {
        player.guardCooldown--
    }
    if (player.healCooldown > 0) {
        player.healCooldown--
    }
    document.getElementById('chargeButton').textContent = "Charge " + (player.chargeCooldown > 0 ? player.chargeCooldown : "");
    document.getElementById('healButton').textContent = "Heal " + (player.healCooldown > 0 ? player.healCooldown : "");
    document.getElementById('guardButton').textContent = "Guard " + (player.guardCooldown > 0 ? player.guardCooldown : "");

    enemies.forEach((enemy, index) => {
        if (enemy.chargeCooldown > 0) {
            enemy.chargeCooldown--
        }
        if (enemy.guardCooldown > 0) {
            enemy.guardCooldown--
        }
        if (enemy.healCooldown > 0) {
            enemy.healCooldown--
        }
    })

}

let damageTexts = []; // Array untuk menyimpan teks damage
function addDamageText(x, y, damage, critical = false) {
    damageTexts.push({
        x: x,
        y: y,
        damage: damage,
        critical: critical,
        time: Date.now() // Waktu saat damage ditambahkan
    });
}

function drawDamageTexts() {
    const currentTime = Date.now(); // Waktu saat ini
    ctx.font = "20px Arial"; // Ukuran dan jenis font
    ctx.fillStyle = "white"; // Warna teks
    ctx.strokeStyle = "black"; // Warna outline teks
    ctx.lineWidth = 2; // Ketebalan outline
    ctx.textAlign = "center"; // Posisi teks di tengah

    for (let i = damageTexts.length - 1; i >= 0; i--) {
        const damageText = damageTexts[i];
        const elapsedTime = currentTime - damageText.time; // Waktu yang telah berlalu

        // Hapus damage setelah 0.8 detik (800 milidetik)
        if (elapsedTime > 800) {
            damageTexts.splice(i, 1); // Hapus damage dari array
        } else {
            // Gambar teks damage
            ctx.strokeText(`${damageText.damage}`, damageText.x, damageText.y);
            ctx.fillText(`${damageText.damage}`, damageText.x, damageText.y);

            // Geser teks ke atas sedikit setiap frame
            damageText.y -= 1;
        }
    }
}

function drawDamageTexts() {
    const currentTime = Date.now(); // Waktu saat ini
    ctx.font = "20px Arial"; // Ukuran dan jenis font
    ctx.textAlign = "center"; // Posisi teks di tengah

    for (let i = damageTexts.length - 1; i >= 0; i--) {
        const damageText = damageTexts[i];
        const elapsedTime = currentTime - damageText.time; // Waktu yang telah berlalu

        // Hapus damage setelah 0.8 detik (800 milidetik)
        if (elapsedTime > 800) {
            damageTexts.splice(i, 1); // Hapus damage dari array
        } else {
            // Gambar teks damage
            if (damageText.critical) {
                ctx.fillStyle = "yellow"; // Warna teks kuning jika critical
            } else {
                ctx.fillStyle = "white"; // Warna teks putih jika tidak critical
            }
            ctx.fillText(`${damageText.damage}`, damageText.x, damageText.y);

            // Geser teks ke atas sedikit setiap frame
            damageText.y -= 1;
        }
    }
}
// Memulai game
startGame();
let fps = 30; // Ubah nilai FPS sesuai kebutuhan (misalnya 30 untuk lebih lambat)
let lastTime = 0;

function gameLoop(timestamp) {
    if (timestamp - lastTime >= 1000 / fps) { // Batasi update berdasarkan FPS
        lastTime = timestamp;
        update();
    }
    requestAnimationFrame(gameLoop);
}