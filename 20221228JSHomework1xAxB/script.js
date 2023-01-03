let btnGetStart, btnGiveUp, btnGimmeAnswer, btnGuess, input, visits;
let textAreaOfAnsWindow, history, victory, inputAndBtns;

const maxOfHistoryListItems = 10;

window.onload = function(){
    getElements();
    setEventListeners();
    setEmptyListItems();
}

function getElements(){
    btnGetStart = document.getElementById('get-start');
    btnGiveUp = document.getElementById('give-up');
    btnGimmeAnswer = document.getElementById('gimme-answer');
    btnGuess = document.getElementById('guess');
    input = document.getElementById('input');
    textAreaOfAnsWindow = document.getElementById('watch-answer').querySelector('.modal-body');
    history = document.getElementById('history');
    victory =  document.getElementById('victory');
    inputAndBtns = [btnGetStart, btnGiveUp, btnGimmeAnswer, btnGuess, input];
}

function setEventListeners(){
    let getTheAnswer;
    
    btnGetStart.addEventListener('click', () => {
        getTheAnswer = jaameJam();
        setEmptyListItems();
        toggleDisabledOfBtns();
    })
    btnGiveUp.addEventListener('click', () => {
        textAreaOfAnsWindow.innerHTML = getTheAnswer().join('');
        toggleDisabledOfBtns();
    });
    btnGuess.addEventListener('click', () => {
        judgeInput(checkPattern(), getTheAnswer());
        input.value = '';
    })
    btnGimmeAnswer.addEventListener('click', () => {
        textAreaOfAnsWindow.innerHTML = gimmeAnswerLah(getTheAnswer());
    })
}

function setEmptyListItems(){
    for (let i = 0; i < maxOfHistoryListItems; i++){
        let li = document.createElement('li');
        setClassNames(li, 'list-group-item text-white');
        li.innerHTML = '_';
        history.append(li);
    }
    checkMaximumOfDisplayList();
}

function toggleDisabledOfBtns(){
    inputAndBtns.forEach(btn => { btn.toggleAttribute('disabled'); });
}

function checkPattern(){
    const inputNums = input.value;
    if (isNaN(inputNums)){
        alert('輸入錯誤，請輸入數字！');
        return null;
    } else if (inputNums.length != 4){
        alert('輸入錯誤，請輸入4位數字！');
        return null;
    } 
    
    return inputNums.toString().padStart(4, '0');
}

function judgeInput(inputString, answer){
    // 若輸入字串不符規格則直接結束
    if (inputString == null || inputString == undefined){
        return;
    }

    // 給定需要的值
    let countA = 0;
    let countB = 0;
    const ansArray = answer.map(x => x.toString());
    const inputValueArray = Array.from(inputString);

    // 確定A和B的數量
    if (ansArray.join('') == inputString){
        countA = 4;

        victory.querySelector('#ans').innerHTML = answer.join('');
        let victoryModal = new bootstrap.Modal(document.getElementById('victory'));
        victoryModal.show();

        toggleDisabledOfBtns();
    } else {
        for (let i = 0; i < ansArray.length; i++){
            if (inputValueArray[i] == ansArray[i]){
                countA += 1;
            } else if (inputValueArray.includes(ansArray[i])){
                countB += 1;
            }
        }
    }
    
    // 顯示到主視覺區
    const displayHistory = (countA, countB, inputString) => {
        let li = document.createElement('li');
        let badge = document.createElement('span');
        let input = document.createElement('span');

        setClassNames(li, 'list-group-item li-newest');
        setClassNames(badge, 'badge bg-secondary d-inline-block me-2');
        setClassNames(input, 'answer');

        badge.innerHTML = `${countA}A${countB}B`;
        input.innerHTML = inputString;
        history.lastElementChild.classList.replace('li-newest', 'li-has-content');

        li.append(badge);
        li.append(input);
        history.append(li);
        
        changeBgcOfBadges(badge);
        checkMaximumOfDisplayList();
    }

    displayHistory(countA, countB, inputString);
}

function checkMaximumOfDisplayList(){
    while (history.childElementCount > maxOfHistoryListItems){
        history.firstElementChild.remove();
    }
}
function setClassNames(element, stringOfClasses){
    return element.className = stringOfClasses;
}

function changeBgcOfBadges(badge){
    const replaceClass = (className) => {
        return badge.classList.replace('bg-secondary', className);
    }
    if (badge.innerHTML.indexOf('0A') != -1){
        replaceClass('bg-danger');
    } else if (badge.innerHTML.indexOf('4A') != -1){
        replaceClass('bg-success');
    } else {
        replaceClass('bg-warning');
    }
}

function gimmeAnswerLah(answer){
    visits += ('b' + 'a' + + 'k' + 'a').toLowerCase();
    const ans = answer.join('');
    if (visits.length > 33){
        visits = visits.substring(0, 39);
        return ans;
    } else if (visits.length > 27){
        return `好啦，答案是 ${ans}`;
    } else if (visits.length > 15){
        return `提示：末位數字是 ${ans.substring(3)}`;
    } else {
        return '不給你看答案';
    }
}


const jaameJam = () => {
    let ans = generateAns();
    return () => { // 想用console.log()偷看答案嗎？試試看ㄚ！
        return ans
    };
}
const generateAns = () => {
    let temp = [];
    for (let i = 0; i < 10; i++){
        temp.push(i);
    }
    temp = randomSort(randomSort(temp)).slice(0, 4);
    return temp;
}
const randomSort = (array) => {
    return array.sort(() => {return 0.5 - Math.random()});
}