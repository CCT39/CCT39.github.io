const initMin = 1;
const initMax = 100;

let min = initMin;
let max = initMax;
let answer = getRandomIntInclusive(initMin, initMax);

let inputText = document.querySelector('#guess-number');

let inputsNum = document.querySelectorAll('.num');
inputsNum.forEach(x => x.addEventListener('click', function(){
    inputText.value += x.innerHTML;
}));

let enter = document.querySelector('.enter');
enter.addEventListener('click', function(){
    checkBound(inputText.value);
});

let upperBound = document.querySelector('.upper-bound');
let lowerBound = document.querySelector('.lower-bound');
let btnsAndInputs = document.querySelectorAll('.inputs');
let winWindow = document.querySelector('.victory');
let winMsg = document.querySelector('.victory-msg');

function checkBound(num){
    let guess = parseInt(num, 10);

    if (isNaN(guess)){
        alert('請輸入數字！');
    } else if( guess < min || guess > max){
        alert('請輸入範圍內的數字！');
    } else if (guess == answer){
        winMsg.innerHTML = `<p>你贏了！答案是 ${answer} </p>`;
        winWindow.style.display = 'flex';
        setDisabled(true);
        setMax(guess);
        setMin(guess);
    } else {
        if (guess > answer){
            setMax(guess);
        } else if (guess < answer){
            setMin(guess);
        }
    }
    inputText.value = '';
}

let btnReturn = document.querySelectorAll('.return');
btnReturn.forEach(x => x.addEventListener('click', function(){
    initialize();
}))

function initialize(){
    inputText.value = '';
    winMsg.innerHTML = '';
    winWindow.style.display = 'none';
    setMin(initMin);
    setMax(initMax);
    answer = getRandomIntInclusive(initMin, initMax);
    setDisabled(false);
}

function setMax(num){
    if (num != max){
        max = num;
        upperBound.innerHTML = num;
    }
}

function setMin(num){
    if (num != min){
        min = num;
        lowerBound.innerHTML = num;
    }
}

function getRandomIntInclusive(minimum, maximum){
    minimum = Math.ceil(minimum);
    maximum = Math.floor(maximum);
    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

function setDisabled(bool){
    btnsAndInputs.forEach(x => x.disabled = bool);
}

/* <裝飾性物件區> */

let introForm = document.querySelector('.intro');
let bgc = document.querySelector('body')
function getStart(){
    introForm.style.display = 'none';
    bgc.style.backgroundColor = 'transparent';
}

/* </裝飾性物件區> */

