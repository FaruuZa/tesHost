const pilihan = ["batu", "gunting", "kertas"];


const elePilih = document.querySelector('.pilih');
const eleHasil = document.querySelector('.hasil');

const boxMusuh = document.querySelector('#musuhHasil')
const boxKamu = document.querySelector('#kamuHasil')

const textHasil = document.querySelector('.hasil p')

function pilih(){
    const random = Math.floor(Math.random() * pilihan.length);
    const dipilih = pilihan[random]
    return dipilih
}

function cekMenang(user, bot){
if (user == "batu") {
    if (bot == "gunting") {
        return "menang"
    } else if(bot == "kertas"){
        return "kalah"
    }else{
        return "seri"
    }
} else if (user == "gunting") {
    if (bot == "kertas") {
        return "menang"
    } else if(bot == "batu"){
        return "kalah"
    }else{
        return "seri"
    }
}else if (user == "kertas") {
    if (bot == "batu") {
        return "menang"
    } else if(bot == "gunting"){
        return "kalah"
    }else{
        return "seri"
    }
}
}

function akuPilih(apa){
    elePilih.classList.remove('aktif')
    const musuhPilih = pilih()
    boxMusuh.src = musuhPilih+'.png';
    boxKamu.src = apa+'.png';
    textHasil.innerHTML = cekMenang(apa, musuhPilih);
    eleHasil.classList.add('aktif')
}

function ulang(){
    elePilih.classList.add('aktif')
    eleHasil.classList.remove('aktif')
}