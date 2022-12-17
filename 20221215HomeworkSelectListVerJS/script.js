let hamburger = document.querySelector('.HB');
let mainNav = document.querySelector('.main-nav');
let HBLines = document.querySelectorAll('.HB > span');
let subNavs = document.querySelectorAll('.sub-nav');
let arrows = document.querySelectorAll('.arrow');

hamburger.addEventListener('click', function(){
    mainNav.classList.toggle('main-nav-active');
    hamburger.classList.toggle('HB-active');
    
    HBLines.forEach(x => x.classList.toggle('span-HB-active'));
});

for (let i = 0; i < arrows.length; i++){
    arrows[i].addEventListener('click', function(){
        arrows[i].classList.toggle('arrow-active');
        subNavs[i].classList.toggle('sub-nav-active');
    });
}