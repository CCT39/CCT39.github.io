let carImagesGrey = [], carImagesRed = [];
let mainImg, prevBtn, postBtn, btns, viaLocal, viaInternet, interval, preLoadImgs;
let isGrey = false;
let presentImgIndex = 0;

window.onload = function (){
    getElements();
    generateCarImages();
    setEventListeners();
    preLoadCarPics();
    mainImg.src = carImagesRed[presentImgIndex];
}

function getElements(){
    container = document.querySelector('.container');
    mainImg = document.getElementById('main-img');
    prevBtn = document.querySelector('.prev');
    postBtn = document.querySelector('.post');
    btns = document.querySelectorAll('.btn');
    viaLocal = document.getElementById('red');
    viaInternet = document.getElementById('grey');
}

function preLoadCarPics(){
    preLoadImgs = document.createElement('div');
    carImagesGrey.forEach(img => { 
        preLoadAPic(img);
    })
    carImagesRed.forEach(img => {
        preLoadAPic(img);
    })
    // preLoadImgs.setAttribute('id', 'preload-element');
    preLoadImgs.style.display = 'none';
    container.append(preLoadImgs);
}

function preLoadAPic(url){
    let pic = document.createElement('img');
    pic.src = url;
    preLoadImgs.append(pic);
}

function generateCarImages(){
    for(let i = 1; i < 61; i++){
        carImagesGrey.push(`./AltisImg/Gray/360EXT_1_18_${i}.png`);
        carImagesRed.push(`./AltisImg/AltisRed/360EXT_1_22_${i}.png`);
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
        isGrey = false;
        changeColour();
    })
    viaInternet.addEventListener('change', function(){
        isGrey = true;
        changeColour();
    })
}

function changeColour(){
    if (isGrey){
        mainImg.src = carImagesGrey[presentImgIndex];
    } else {
        mainImg.src = carImagesRed[presentImgIndex];
    }
}

function changeImgs(num){
    let imgArray = carImagesRed;
    if (isGrey){
        imgArray = carImagesGrey;
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