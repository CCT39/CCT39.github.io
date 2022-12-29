let introForm, questionMsg, btnClose, body, background, btns, qContents, styleSheet;
let numOfTimes, maxOfTimes, sumOfTimes;
let datas = [];

const maxWidthOfTimeSpendingBar = '220px';

window.onload = function(){
    getElements();
    createPersonalizedStyleSheet();
    initVariables();
    setEventListeners();
    createHomeworkDatas();
}
function getElements(){
    introForm = document.querySelector('.question');
    background = document.querySelector('.question-background');
    questionMsg = document.querySelector('#msg');
    btnClose = document.querySelector('.close');
    body = document.querySelector('body');
    btns = document.querySelectorAll('.btn:not(.close)');
    qContents = document.querySelectorAll('.q-content');
    items = document.querySelectorAll('.item');
    numOfTimes = document.querySelectorAll('.time-cost>strong');
}
function createPersonalizedStyleSheet(){
    styleSheet = document.createElement('style');
    styleSheet.setAttribute('id', 'css');
    document.head.append(styleSheet);
}
function initVariables(){
    let timeArray = [];
    numOfTimes.forEach(x => timeArray.push(x.innerHTML));

    // 'sumOfTimes' is not be used yet, but... just in case.
    maxOfTimes = timeArray.reduce(function(a, b) {return Math.max(a, b);}, -Infinity);
    sumOfTimes = timeArray.reduce(function(a, b) {return parseInt(a) + parseInt(b);}, 0);
}
function setEventListeners(){
    btnClose.addEventListener('click', function(){
        setWindowAndBackAndScroll('none', 'none', 'scroll');
        questionMsg.innerHTML = '';
    })
    btns.forEach(x => { x.addEventListener('click', focusWindow.bind(this, x.id)); });
}
function createHomeworkDatas(){
    items.forEach(item => {datas.push({
        id: item.id,
        date: item.querySelector('h3').innerHTML,
        homeworkList: setHomeworkLists(item),
        qContent: setquestionContents(item),
    })})
    let json = JSON.stringify(datas);
    console.log(json);
}
function setHomeworkLists(item){
    let homeworks = [];

    let hws = [];
    let times = [];

    item.querySelectorAll('.HW').forEach(hw => {
        hws.push(hw.innerHTML);
    });
    item.querySelectorAll('.time-cost>strong').forEach(time => { times.push(time.innerHTML); });
    let length = hws.length;
    if (hws.length > times.length){
        length = times.length;
    }
    for(let i = 0; i < length; i++){
        homeworks.push({
            title: hws[i], 
            timeCosts: times[i]
        });
    };

    setTimeSpendingBars(item, times);
    return homeworks;
}
function setquestionContents(item){
    let questionContent = item.querySelector('.q-content').innerHTML;
    if (questionContent == ''){
        questionContent = '無內容';
    }
    return questionContent;
}
function setTimeSpendingBars(item, times){
    for (let i = 0; i < times.length; i++){
        let btn = `#${item.id} .HW:nth-of-type(${i + 1})`
        styleSheet.innerHTML += `${btn}::before{content: '花費時間：${times[i]}小時';}`
        styleSheet.innerHTML += `${btn}::after{width: calc(${maxWidthOfTimeSpendingBar} * ${times[i]} / ${maxOfTimes});}`;
    }
}

function focusWindow(date){
    setWindowAndBackAndScroll('flex', 'block', 'hidden');
    datas.forEach(data => {
        if ('q-' + data.id == date){
            questionMsg.innerHTML = data.qContent;
        }
    })
}
function setWindowAndBackAndScroll(windowStyle, backStyle, scroll){
    introForm.style.display = windowStyle;
    background.style.display = backStyle;
    body.style.overflowY = scroll;
}