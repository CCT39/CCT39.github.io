let carImages = [];
let mainImg, prevBtn, postBtn, btns;
let presentImgIndex = 0;

window.onload = function (){
    mainImg = document.getElementById('main-img');
    prevBtn = document.querySelector('.prev');
    postBtn = document.querySelector('.post');
    btns = document.querySelectorAll('.btn');
    generateCarImages();
    mainImg.src = carImages[presentImgIndex];
    
    prevBtn.addEventListener('click', function(){changeImgs(-1);});
    postBtn.addEventListener('click', function(){changeImgs(1);});
}


function generateCarImages(){
    for(let i = 1; i < 61; i++){
        carImages.push(`https://hotaicdn.azureedge.net/toyotaweb/360EXT_1_18_${i}.png`)
    }

    console.log(carImages);
}

function changeImgs(num){
    
    let int = num;
    if(isNaN(num)){
        int = parseInt(num, 10);
    }

    presentImgIndex += int;
    while (presentImgIndex < 0) {
        presentImgIndex += carImages.length;
    }
    if (presentImgIndex >= carImages.length){
        presentImgIndex %= carImages.length
    } 
    mainImg.src = carImages[presentImgIndex];
}