let carImagesViaInternet = [], carImagesViaLocal = [];
let mainImg, prevBtn, postBtn, btns, viaLocal, viaInternet, interval;
let isViaInternet = false;
let presentImgIndex = 0;

window.onload = function (){
    getElements();
    generateCarImages();
    setEventListeners();
    mainImg.src = carImagesViaLocal[presentImgIndex];
}

function getElements(){
    mainImg = document.getElementById('main-img');
    prevBtn = document.querySelector('.prev');
    postBtn = document.querySelector('.post');
    btns = document.querySelectorAll('.btn');
    viaLocal = document.getElementById('local');
    viaInternet = document.getElementById('internet');
}

function generateCarImages(){
    for(let i = 1; i < 61; i++){
        carImagesViaInternet.push(`https://hotaicdn.azureedge.net/toyotaweb/360EXT_1_18_${i}.png`);
        carImagesViaLocal.push(`./AltisImg/AltisRed/360EXT_1_22_${i}.png`);
    }
}

function setEventListeners(){
    prevBtn.addEventListener('click', function(){changeImgs(-1);});
    postBtn.addEventListener('click', function(){changeImgs(1);});
    prevBtn.addEventListener('mousedown', function(){interval = window.setInterval(changeImgs, 100, -1);})
    postBtn.addEventListener('mousedown', function(){interval = window.setInterval(changeImgs, 100, 1);})
    prevBtn.addEventListener('mouseup', function(){clearInterval(interval);})
    postBtn.addEventListener('mouseup', function(){clearInterval(interval);})
    viaLocal.addEventListener('change', function(){
        isViaInternet = false;
        changeColour();
    })
    viaInternet.addEventListener('change', function(){
        isViaInternet = true;
        changeColour();
    })
}

function changeColour(){
    if (isViaInternet){
        mainImg.src = carImagesViaInternet[presentImgIndex];
    } else {
        mainImg.src = carImagesViaLocal[presentImgIndex];
    }
}

function changeImgs(num){
    let imgArray = carImagesViaLocal;
    if (isViaInternet){
        imgArray = carImagesViaInternet;
    }
    
    let int = parseInt(num, 10);
    presentImgIndex += int;
    if (presentImgIndex < 0) {
        presentImgIndex += imgArray.length;
    } else if (presentImgIndex >= imgArray.length){
        presentImgIndex -= imgArray.length;
    } 
    mainImg.src = imgArray[presentImgIndex];
}