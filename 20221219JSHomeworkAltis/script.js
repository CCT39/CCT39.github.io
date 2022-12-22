let carImagesGrey = [], carImagesBlack = [], carImagesDeepGrey = [];
let carImagesSilver = [], carImagesRed = [], carImagesWhite = [];
let carImages = [];
let mainImg, prevBtn, postBtn, radios, viaLocal, viaInternet, interval, preLoadImgs;
let currentColour, presentImgIndex;

window.onload = function (){
    getElements();
    generateCarImages();
    setEventListeners();
    initCarPics();
    changeColour();
}

function initCarPics(){
    preLoadImgs = document.createElement('div');
    preLoadCarPics();
    preLoadImgs.setAttribute('class', 'hidden');
    container.append(preLoadImgs);
}

function getElements(){
    container = document.querySelector('.container');
    mainImg = document.getElementById('main-img');
    prevBtn = document.querySelector('.prev');
    postBtn = document.querySelector('.post');
    radios = document.querySelectorAll('[type="radio"]');
    viaLocal = document.getElementById('red');
    viaInternet = document.getElementById('grey');
}

function generateCarImages(){
    presentImgIndex = 0;
    currentColour = 4;
    carImages = [carImagesGrey, carImagesBlack, carImagesDeepGrey, carImagesSilver, carImagesRed, carImagesWhite];
    const beginningIndex = 18;
    
    for (let i = beginningIndex; i <= 23; i++){
        for (let j = 1; j < 61; j++){
            carImages[i - beginningIndex].push(`./AltisImg/360EXT_1_${i}_${j}.png`);
        }
    }
}

function setEventListeners(){
    prevBtn.addEventListener('click', function(){changeImgs(-1);});
    postBtn.addEventListener('click', function(){changeImgs(1);});
    prevBtn.addEventListener('mousedown', function(){interval = window.setInterval(changeImgs, 100, -1);})
    postBtn.addEventListener('mousedown', function(){interval = window.setInterval(changeImgs, 100, 1);})
    prevBtn.addEventListener('mouseup', function(){clearInterval(interval);})
    postBtn.addEventListener('mouseup', function(){clearInterval(interval);})
    radios.forEach((radio, index) => {
        radio.addEventListener('change', function(){
            currentColour = index;
            changeColour();
            preLoadCarPics();
        });
    });
}

function preLoadCarPics(){
    carImages[currentColour].forEach(img => { preLoadAPic(img); })
}

function preLoadAPic(url){
    let pic = document.createElement('img');
    pic.src = url;
    preLoadImgs.append(pic);
}

function changeColour(){
    mainImg.src = carImages[currentColour][presentImgIndex];
}

function changeImgs(num){
    let imgArray = carImages[currentColour];    

    let int = parseInt(num, 10);
    presentImgIndex += int;
    if (presentImgIndex < 0) {
        presentImgIndex += imgArray.length;
    } else if (presentImgIndex >= imgArray.length){
        presentImgIndex -= imgArray.length;
    } 
    mainImg.src = imgArray[presentImgIndex];
}