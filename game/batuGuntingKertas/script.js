const pilihan = ["batu", "gunting", "kertas"];
const path = "img/";

const elePilih = document.querySelector('.pilih');
const eleHasil = document.querySelector('.hasil');
const skor = document.querySelectorAll('#skor span');
const boxKamu = document.querySelectorAll("div.boxHasil")[0]
const boxMusuh = document.querySelectorAll("div.boxHasil")[1]

const textHasil = document.querySelector('.hasil h1')

function pilih() {
    const random = Math.floor(Math.random() * pilihan.length);
    const dipilih = pilihan[random]
    return dipilih
}

function cekMenang(user, bot) {
    hasil = ""
    if (user == "batu") {
        if (bot == "gunting") {
            hasil = "menang"
        } else if (bot == "kertas") {
            hasil = "kalah"
        } else {
            hasil = "seri"
        }
    } else if (user == "gunting") {
        if (bot == "kertas") {
            hasil = "menang"
        } else if (bot == "batu") {
            hasil = "kalah"
        } else {
            hasil = "seri"
        }
    } else if (user == "kertas") {
        if (bot == "batu") {
            hasil = "menang"
        } else if (bot == "gunting") {
            hasil = "kalah"
        } else {
            hasil = "seri"
        }
    }
    if (hasil == "menang") {
        skor[0].innerHTML = parseInt(skor[0].innerHTML) + 1
        return "menang"
    } else if (hasil == "kalah") {
        skor[2].innerHTML = parseInt(skor[2].innerHTML) + 1
        return "kalah"
    } else {
        skor[1].innerHTML = parseInt(skor[1].innerHTML) + 1
        return "seri"
    }
}

function akuPilih(apa) {
    elePilih.classList.remove('aktif')
    const musuhPilih = pilih()
    boxMusuh.querySelector('img').src = path + musuhPilih + '.png';
    boxMusuh.querySelector("span").textContent = musuhPilih
    boxKamu.querySelector("span").textContent = apa
    boxKamu.querySelector('img').src = path + apa + '.png';
    textHasil.innerHTML = cekMenang(apa, musuhPilih);
    eleHasil.classList.add('aktif')
}

function ulang() {
    elePilih.classList.add('aktif')
    eleHasil.classList.remove('aktif')
}
