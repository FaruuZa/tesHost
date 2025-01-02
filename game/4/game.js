// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');
// document.getElementById('attackButton').addEventListener('click', () => playerAction('attack'));
// document.getElementById('guardButton').addEventListener('click', () => playerAction('guard'));
// document.getElementById('chargeButton').addEventListener('click', () => playerAction('charge'));
// document.getElementById('healButton').addEventListener('click', () => playerAction('heal'));

// const playerStances = {
//     idle: [],
//     attack: [],
//     hit: [],
//     dead: [] // Tambahkan stance dead
// };

// const enemyStances = {
//     idle: [],
//     attack: [],
//     hit: [],
//     dead: [] // Tambahkan stance dead
// };

// const playerFrameCounts = {
//     idle: 38, // Misalnya, stance idle memiliki 7 frame
//     attack: 11, // Stance attack memiliki 5 frame
//     hit: 8, // Stance hit memiliki 3 frame
//     dead: 4 // Tambahkan frame count untuk stance dead
// };

// const enemyFrameCounts = {
//     idle: 44,
//     attack: 11,
//     hit: 7,
//     dead: 4
// };

// let imagesLoaded = 0;
// const totalImages = playerFrameCounts.idle + playerFrameCounts.attack + playerFrameCounts.hit + playerFrameCounts.dead +
//     enemyFrameCounts.idle + enemyFrameCounts.attack + enemyFrameCounts.hit + enemyFrameCounts.dead;

// function checkAllImagesLoaded() {
//     imagesLoaded++;
//     if (imagesLoaded === totalImages) {
//         console.log("Player Stances:", playerStances);
//         console.log("Enemy Stances:", enemyStances);
//         player.frameCount = playerFrameCounts[player.stance];
//         enemies[currentEnemyIndex].frameCount = enemyFrameCounts[enemies[currentEnemyIndex].stance];
//         gameLoop(); // Mulai loop game hanya setelah semua gambar dimuat
//     }
// }

let damageTexts = []; // Array untuk menyimpan teks damage
function addDamageText(x, y, damage) {
    damageTexts.push({
        x: x,
        y: y,
        damage: damage,
        time: Date.now() // Waktu saat damage ditambahkan
    });
}
// function loadImages(stance, type, frameCount) {
//     for (let index = 1; index <= frameCount; index++) {
//         const img = new Image();
//         img.src = `img/${type}/${stance}/${index}.png`;
//         img.onload = () => {
//             if (type === 'player') {
//                 playerStances[stance].push(img);
//             } else {
//                 enemyStances[stance].push(img);
//             }
//             checkAllImagesLoaded(); // Panggil fungsi ini setiap kali gambar selesai dimuat
//         };
//     }
// }

// // Memuat gambar dengan jumlah frame yang sesuai
// loadImages('idle', 'player', playerFrameCounts.idle);
// loadImages('attack', 'player', playerFrameCounts.attack);
// loadImages('hit', 'player', playerFrameCounts.hit);
// loadImages('dead', 'player', playerFrameCounts.dead); // Memuat gambar untuk stance dead
// loadImages('idle', 'enemies', enemyFrameCounts.idle);
// loadImages('attack', 'enemies', enemyFrameCounts.attack);
// loadImages('hit', 'enemies', enemyFrameCounts.hit);
// loadImages('dead', 'enemies', enemyFrameCounts.dead); // Memuat gambar untuk stance dead

// const player = {
//     x: 100,
//     y: 100,
//     width: 100, // Lebar karakter diperbesar
//     height: 100, // Tinggi karakter diperbesar
//     health: 100,
//     attack: 20,
//     isTurn: true,
//     currentFrame: 0,
//     frameCount: 0, // Awalnya 0, akan diupdate setelah gambar dimuat
//     stance: 'idle',
//     originalX: 100
// };

// const enemies = [{
//     x: 400,
//     y: 100,
//     width: 100, // Lebar karakter diperbesar
//     height: 100, // Tinggi karakter diperbesar
//     health: 100,
//     attack: 10,
//     isTurn: false,
//     currentFrame: 0,
//     frameCount: 0, // Awalnya 0, akan diupdate setelah gambar dimuat
//     stance: 'idle',
//     originalX: 400
// }];

// let currentEnemyIndex = 0;
// let gameOver = false;

// function playerAction(action) {
//     if (player.isTurn) {
//         switch (action) {
//             case 'attack':
//                 playerAttack();
//                 break;
//             case 'guard':
//                 player.isGuarding = true; // Aktifkan guard
//                 player.isTurn = false; // Ganti giliran
//                 break;
//             case 'charge':
//                 player.isCharging = true; // Aktifkan charge
//                 player.isTurn = false; // Ganti giliran
//                 break;
//             case 'heal':
//                 const healAmount = getRandomDamage(10, 20); // Heal random antara 10-20
//                 player.health = Math.min(player.health + healAmount, 100); // Batasi HP maksimal 100
//                 addDamageText(player.x + player.width / 2, player.y - 10, `+${healAmount}`); // Tampilkan teks heal
//                 player.isTurn = false; // Ganti giliran
//                 break;
//         }
//         executeEnemyAction(); // Jalankan aksi enemy
//     }
// }
let enemyCurrentAction = null; // Menyimpan aksi yang dipilih enemy
function enemyAction() {
    const actions = ['attack', 'charge', 'guard'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)]; // Pilih aksi secara acak
    return randomAction;
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
            console.log("serang")
            enemyAttack(); // Jalankan serangan enemy
            break;
        case 'charge':
            console.log("charge")
            enemies[currentEnemyIndex].isCharging = true; // Aktifkan charge
            player.isTurn = true; // Ganti giliran
            break;
        case 'guard':
            console.log("guard")
            enemies[currentEnemyIndex].isGuarding = true; // Aktifkan guard
            player.isTurn = true; // Ganti giliran
            break;
    }
    showEnemyAction(enemyAction())
}
function disablePlayerButtons() {
    console.log("disabled")
    document.getElementById('attackButton').disabled = true;
    document.getElementById('guardButton').disabled = true;
    document.getElementById('chargeButton').disabled = true;
    document.getElementById('healButton').disabled = true;
}

function enablePlayerButtons() {
    console.log("enabled")
    document.getElementById('attackButton').disabled = false;
    document.getElementById('guardButton').disabled = false;
    document.getElementById('chargeButton').disabled = false;
    document.getElementById('healButton').disabled = false;
}
function getAnimationDuration(frameCount, fps = 30) {
    return (frameCount / fps) * 1000; // Durasi dalam milidetik
}
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

// function drawPlayer() {
//     // Gambar karakter player
//     ctx.drawImage(playerStances[player.stance][player.currentFrame], player.x, player.y, player.width, player.height);

//     // Gambar bar HP player
//     const healthBarWidth = player.width; // Lebar bar HP sama dengan lebar karakter
//     const healthBarHeight = 10; // Tinggi bar HP
//     const healthBarX = player.x; // Posisi X bar HP
//     const healthBarY = player.y + player.height + 10; // Posisi Y bar HP (di bawah karakter)
//     drawHealthBar(healthBarX, healthBarY, healthBarWidth, healthBarHeight, player.health, 100);
// }

// function drawEnemies() {
//     enemies.forEach(enemy => {
//         // Gambar karakter enemy
//         ctx.drawImage(enemyStances[enemy.stance][enemy.currentFrame], enemy.x, enemy.y, enemy.width, enemy.height);

//         // Gambar bar HP enemy
//         const healthBarWidth = enemy.width; // Lebar bar HP sama dengan lebar karakter
//         const healthBarHeight = 10; // Tinggi bar HP
//         const healthBarX = enemy.x; // Posisi X bar HP
//         const healthBarY = enemy.y + enemy.height + 10; // Posisi Y bar HP (di bawah karakter)
//         drawHealthBar(healthBarX, healthBarY, healthBarWidth, healthBarHeight, enemy.health, 100);
//     });
// }

// function drawDamageTexts() {
//     const currentTime = Date.now(); // Waktu saat ini
//     ctx.font = "20px Arial"; // Ukuran dan jenis font
//     ctx.fillStyle = "white"; // Warna teks
//     ctx.strokeStyle = "black"; // Warna outline teks
//     ctx.lineWidth = 2; // Ketebalan outline
//     ctx.textAlign = "center"; // Posisi teks di tengah

//     for (let i = damageTexts.length - 1; i >= 0; i--) {
//         const damageText = damageTexts[i];
//         const elapsedTime = currentTime - damageText.time; // Waktu yang telah berlalu

//         // Hapus damage setelah 0.8 detik (800 milidetik)
//         if (elapsedTime > 800) {
//             damageTexts.splice(i, 1); // Hapus damage dari array
//         } else {
//             // Gambar teks damage
//             ctx.strokeText(`-${damageText.damage}`, damageText.x, damageText.y);
//             ctx.fillText(`-${damageText.damage}`, damageText.x, damageText.y);

//             // Geser teks ke atas sedikit setiap frame
//             damageText.y -= 1;
//         }
//     }
// }
function getRandomDamage(min = 5, max = 20) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// function playerAttack() {
//     if (player.isTurn) {
//         changePlayerStance('attack'); // Ubah stance menjadi attack
//         player.x += 100; // Mendekati musuh
//         setTimeout(() => {
//             let damage = getRandomDamage(); // Damage random antara 5-20
//             if (player.isCharging) {
//                 damage *= 2; // Damage dikalikan 2 jika sedang charge
//                 player.isCharging = false; // Nonaktifkan charge setelah attack
//             }
//             enemies[currentEnemyIndex].health -= damage;
//             addDamageText(enemies[currentEnemyIndex].x + enemies[currentEnemyIndex].width / 2, enemies[currentEnemyIndex].y - 10, damage); // Tampilkan damage
//             if (enemies[currentEnemyIndex].health <= 0) {
//                 enemies[currentEnemyIndex].health = 0;
//                 changeEnemyStance('dead'); // Ubah stance enemy menjadi dead
//                 gameOver = true; // Hentikan game
//             } else {
//                 changeEnemyStance('hit'); // Ubah stance enemy menjadi hit jika belum mati
//                 // Tunggu animasi hit selesai sebelum memulai enemyTurn
//                 setTimeout(() => {
//                     player.x = player.originalX; // Kembali ke posisi awal
//                     changePlayerStance('idle'); // Kembali ke stance idle
//                     changeEnemyStance('idle'); // Kembalikan stance enemy ke idle
//                     player.isTurn = false; // Ganti giliran
//                     damageTexts = []; // Hapus semua teks damage
//                     if (!gameOver) {
//                         enemyTurn(); // Panggil giliran musuh jika game belum berakhir
//                     }
//                 }, getAnimationDuration(enemyFrameCounts.hit)); // Durasi animasi hit
//             }
//         }, getAnimationDuration(playerFrameCounts.attack)); // Durasi animasi attack
//     }
// }
// function enemyTurn() {
//     if (!gameOver) {
//         disablePlayerButtons(); // Nonaktifkan tombol aksi player
//         const action = enemyAction(); // Pilih aksi enemy
//         showEnemyAction(action); // Tampilkan pilihan enemy dan tunggu player memilih aksi
//     }
// }
function enemyAttack() {
    changeEnemyStance('attack'); // Ubah stance menjadi attack
    enemies[currentEnemyIndex].x -= 100; // Mendekati pemain
    setTimeout(() => {
        let damage = getRandomDamage(); // Damage random antara 5-20
        if (enemies[currentEnemyIndex].isCharging) {
            damage *= 2; // Damage dikalikan 2 jika sedang charge
            enemies[currentEnemyIndex].isCharging = false; // Nonaktifkan charge setelah attack
        }
        if (player.isGuarding) {
            damage *= 0.5; // Kurangi damage jika player sedang guard
            player.isGuarding = false; // Nonaktifkan guard setelah menerima damage
        }
        player.health -= damage;
        addDamageText(player.x + player.width / 2, player.y - 10, damage); // Tampilkan damage
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
        damageTexts = []; // Hapus semua teks damage
    }, getAnimationDuration(enemyFrameCounts.attack)); // Durasi animasi attack
}
// function drawHealthBar(x, y, width, height, health, maxHealth) {
//     const healthWidth = (health / maxHealth) * width; // Hitung lebar bar HP berdasarkan persentase HP
//     ctx.fillStyle = "red"; // Warna latar belakang bar HP (HP yang hilang)
//     ctx.fillRect(x, y, width, height); // Gambar latar belakang bar HP
//     ctx.fillStyle = "green"; // Warna bar HP (HP yang tersisa)
//     ctx.fillRect(x, y, healthWidth, height); // Gambar bar HP

//     // Gambar outline kuning jika guard aktif
//     if (player.isGuarding) {
//         ctx.strokeStyle = "yellow"; // Warna outline
//         ctx.lineWidth = 3; // Ketebalan outline
//         ctx.strokeRect(x, y, width, height); // Gambar outline
//     }

//     // Gambar label "2X" jika charge aktif
//     if (player.isCharging) {
//         ctx.fillStyle = "white"; // Warna teks
//         ctx.font = "20px Arial"; // Ukuran dan jenis font
//         ctx.fillText("2X", x + width + 10, y + height / 2); // Gambar teks "2X" di sebelah bar HP
//     }
// }

// function update() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawPlayer();
//     drawEnemies();
//     drawDamageTexts(); // Gambar teks damage

//     // Update animation frames untuk player
//     player.currentFrame = (player.currentFrame + 1) % player.frameCount;

//     // Update animation frames untuk enemy
//     enemies[currentEnemyIndex].currentFrame = (enemies[currentEnemyIndex].currentFrame + 1) % enemies[currentEnemyIndex].frameCount;
// }

function playerHit() {
    changePlayerStance('hit'); // Ubah stance ke hit
    setTimeout(() => {
        changePlayerStance('idle'); // Kembalikan ke idle setelah beberapa saat
    }, getAnimationDuration(playerFrameCounts.hit)); // Durasi animasi hit
}

// function enemyHit() {
//     changeEnemyStance('hit'); // Ubah stance ke hit
//     setTimeout(() => {
//         changeEnemyStance('idle'); // Kembalikan ke idle setelah beberapa saat
//     }, getAnimationDuration(enemyFrameCounts.hit)); // Durasi animasi hit
// }

// // Event listener untuk tombol menyerang
// document.getElementById('attackButton').addEventListener('click', playerAttack);

// let fps = 60; // Target FPS (misalnya 30 FPS)
// let fpsInterval = 3000 / fps; // Interval waktu antara frame (dalam milidetik)
// let then = Date.now(); // Waktu terakhir frame digambar
// function startGame() {
//     enemyTurn(); // Enemy memilih aksi di awal permainan
//     // showEnemyAction();
// }
// startGame();
// function gameLoop() {
//     requestAnimationFrame(gameLoop);

//     // Hitung waktu sekarang
//     let now = Date.now();
//     let elapsed = now - then;

//     // Jika waktu yang berlalu lebih besar dari interval FPS, gambar frame berikutnya
//     if (elapsed > fpsInterval) {
//         then = now - (elapsed % fpsInterval); // Sesuaikan waktu terakhir

//         update(); // Panggil fungsi update untuk menggambar frame
//     }
// }

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
    x: 100, y: 100, width: 100, height: 100, health: 100, attack: 20, level: 1, xp: 0,
    isTurn: true, currentFrame: 0, frameCount: 0, stance: 'idle', originalX: 100
};

const enemies = [
    { x: 400, y: 100, width: 100, height: 100, health: 100, attack: 10, isTurn: false, currentFrame: 0, frameCount: 0, stance: 'idle', originalX: 400 },
    { x: 600, y: 100, width: 100, height: 100, health: 120, attack: 15, isTurn: false, currentFrame: 0, frameCount: 0, stance: 'idle', originalX: 600 }
];

let currentEnemyIndex = 0;
let gameOver = false;

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
        img.onerror = () => {
            console.error(`Failed to load image: ${img.src}`);
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

// Fungsi untuk menambah XP dan level up
function gainXP(amount) {
    player.xp += amount;
    if (player.xp >= 100) {
        player.level++;
        player.xp = 0;
        player.health = 100;
        player.attack += 5;
        console.log(`Player leveled up to level ${player.level}!`);
    }
}

// Fungsi untuk beralih ke musuh berikutnya
function nextEnemy() {
    currentEnemyIndex++;
    if (currentEnemyIndex >= enemies.length) {
        console.log("All enemies defeated! You win!");
        gameOver = true;
    } else {
        player.isTurn = true;
        // Pastikan frameCount diupdate untuk enemy baru
        enemies[currentEnemyIndex].frameCount = enemyFrameCounts[enemies[currentEnemyIndex].stance];
    }
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
    drawHealthBar(player.x, player.y + player.height + 10, player.width, 10, player.health);
}

// Fungsi untuk menggambar enemies
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        if (index === currentEnemyIndex) { // Hanya gambar enemy yang sedang aktif
            const img = enemyStances[enemy.stance][enemy.currentFrame];
            if (img) { // Pastikan gambar ada
                ctx.drawImage(img, enemy.x, enemy.y, enemy.width, enemy.height);
                drawHealthBar(enemy.x, enemy.y + enemy.height + 10, enemy.width, 10, enemy.health);
            } else {
                console.error(`Image not loaded for enemy ${index}, stance: ${enemy.stance}, frame: ${enemy.currentFrame}`);
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
    if (enemies[currentEnemyIndex]) { // Pastikan enemy yang aktif ada
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

// Fungsi untuk menangani aksi player
function playerAction(action) {
    if (player.isTurn) {
        switch (action) {
            case 'attack':
                playerAttack();
                break;
            case 'guard':
                player.isGuarding = true;
                player.isTurn = false;
                break;
            case 'charge':
                player.isCharging = true;
                player.isTurn = false;
                break;
            case 'heal':
                const healAmount = getRandomDamage(10, 20);
                player.health = Math.min(player.health + healAmount, 100);
                player.isTurn = false;
                break;
        }
        executeEnemyAction();
    }
}

// Fungsi untuk menyerang musuh
function playerAttack() {
    changePlayerStance('attack');
    setTimeout(() => {
        let damage = getRandomDamage();
        if (player.isCharging) {
            damage *= 2;
            player.isCharging = false;
        }
        enemies[currentEnemyIndex].health -= damage;
        if (enemies[currentEnemyIndex].health <= 0) {
            enemies[currentEnemyIndex].health = 0;
            changeEnemyStance('dead');
            gainXP(50); // Menambah XP setelah mengalahkan musuh
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

// Fungsi untuk giliran musuh
function enemyTurn() {
    if (!gameOver) {
        const action = enemyAction();
        if (action === 'attack') enemyAttack();
        else player.isTurn = true; // Kembali ke giliran player jika tidak menyerang
    }
}

// Memulai game
startGame();
function gameLoop() {
    requestAnimationFrame(gameLoop);
    update();
}