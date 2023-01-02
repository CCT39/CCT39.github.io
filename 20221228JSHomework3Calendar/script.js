
const currentFullDate = new Date();
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// date = new Date();
// date 取得完整時間 e.g. Sat Dec 31 2022 15:47:03 GMT+0800 (台北標準時間)
// date.getDay() 取得星期（0-6，週日 = 0）
// date.getFullYear() 取得4位數字西元年
// date.getMonth() 取得月份（0-11）
// date.getDate() 取得日（1-31）
let currentYear, currentMonth, currentDate, currentWeekday, venividivici;
let tbody, allTds, displayYear, displayMonth, btnPrev, btnPost, btnAddAndSave, btnCloseAndSave;
let scheduleContent, scheduleItems, deleteScheduleItem;
let windowForSchedule, btnAddSchedule, windowAddSchedule, titleScheduleList, closeScheduleList;
let trArr = [], currDayOfMonthArr = [], allSchedulesOfTheDay = [];

window.onload = () => {
    getElements();
    initVariables();
    setEventListeners();
    initTable();
}
function getElements(){
    tbody = document.querySelector('tbody');
    allTds = document.querySelectorAll('td');
    displayYear = document.getElementById('year');
    displayMonth = document.getElementById('month');
    btnPrev = document.getElementById('prev');
    btnPost = document.getElementById('post');
    windowForSchedule = document.getElementById('window-for-schedules');
    windowAddSchedule = document.getElementById('add-schedule');
    btnAddSchedule = windowForSchedule.querySelector('[data-bs-target="#add-schedule"]');
    closeScheduleList = windowForSchedule.querySelectorAll('[data-bs-dismiss="modal"]');
    scheduleContent = windowForSchedule.querySelector('.modal-body>ul');
    titleScheduleList = document.getElementById('schedule-list');
    btnAddAndSave = document.getElementById('add-and-save');
    btnCloseAndSave = document.getElementById('close-and-save');
    closeAddWindowBtns = windowAddSchedule.querySelectorAll('[data-bs-dismiss="modal"]');
}
function initVariables(){
    currentYear = currentFullDate.getFullYear();
    currentMonth = currentFullDate.getMonth();
    currentDate = currentFullDate.getDate();
    currentWeekday = currentFullDate.getDay();
}
function setEventListeners(){
    btnPrev.addEventListener('click', () => { moveMonth(false); })
    btnPost.addEventListener('click', () => { moveMonth(true); })
    allTds.forEach(td => { td.addEventListener('click', () => {
        let dataDate = td.dataset.date;
        let ymdArr = dataDate.split('-');
        let titleText = `西元${ymdArr[0]}年${parseInt(ymdArr[1]) + 1}月${ymdArr[2]}日的行程`;

        if (dataDate.includes('BC')){ 
            titleText = `西元前${ymdArr[0].replace('BC', '')}年${parseInt(ymdArr[1]) + 1}月${ymdArr[2]}日的行程`;
        }

        titleScheduleList.innerHTML = titleText;
        btnCloseAndSave.setAttribute('data-key', dataDate);
        btnAddSchedule.id = dataDate;
        showScheduleList(dataDate);
    })})
    closeScheduleList.forEach(x => x.addEventListener('click', () => { 
        const timeout = setTimeout(() => { 
            btnCloseAndSave.removeAttribute('data-key');
            btnAddSchedule.removeAttribute('id');
            scheduleContent.innerHTML = '';
        }, 476);
    }))
    btnAddSchedule.addEventListener('click', () => {
        let thisDate = btnAddSchedule.id;
        btnAddAndSave.setAttribute('data-key', thisDate);
    })
    closeAddWindowBtns.forEach(x => x.addEventListener('click', () => {
        const timeout = setTimeout(() => { btnAddAndSave.removeAttribute('data-key'); }, 476);
    }))
    btnAddAndSave.addEventListener('click', () => {
        let inputs = windowAddSchedule.querySelectorAll('input');
        let thisKey = btnAddAndSave.dataset.key;
        
        let obj = {
            date: thisKey,
            title: inputs[0].value,
            since: inputs[1].value,
            until: inputs[2].value,
            content: inputs[3].value
        };

        gonnaSetIntoLS(obj);
    })
    btnCloseAndSave.addEventListener('click', () => {
        let arr = allSchedulesOfTheDay.filter(item => item.date != 'deleted');
        let key = btnCloseAndSave.dataset.key;

        sendToLS(arr, key);
    })
}
function showScheduleList(key){
    let dataArr = JSON.parse(localStorage.getItem(key));
    scheduleContent.innerHTML = '';
    allSchedulesOfTheDay = dataArr;
    if (dataArr == null){ return; }

    let i = 0;
    dataArr.forEach(schedule => {
        let li = document.createElement('li');
        let item = document.createElement('div');
        li.innerHTML += `<i class="fa-regular fa-circle-xmark text-secondary" data-no="${i}" data-del="${key}"></i>`;
        i++;

        let string = '';
        string += `<h3>${schedule.since}：${schedule.title}</h3>`;
        string += `<p>預計結束時間：${schedule.until}</p>`;
        string += `<p>行程內容：${schedule.content}</p>`;

        item.classList.add('schedule-item');
        item.innerHTML = string;
        li.dataset.key = key;
        li.append(item);
        scheduleContent.append(li);
    })
    setDynamicElements();
}
function setDynamicElements(){
    scheduleItems = windowForSchedule.querySelectorAll('.schedule-item');
    deleteScheduleItem = windowForSchedule.querySelectorAll('.fa-circle-xmark');
    
    // scheduleItems.forEach(x => x.addEventListener('click', () => {
    //     alert('hello');
    // }))
    deleteScheduleItem.forEach(x => x.addEventListener('click', () => {
        dataArr = allSchedulesOfTheDay;
        dataArr[x.dataset.no].date = 'deleted';
        allSchedulesOfTheDay = dataArr;
        x.parentNode.remove();
    }))
}
function initTable(){
    document.querySelectorAll('.spqr').forEach(x => { x.innerHTML = x.innerHTML.replaceAll('u', 'v').replaceAll('ae', 'ӕ').replaceAll('j', 'i').replaceAll('w', 'v'); })
    checkLeapYear();
    setThisMonth();
    venividivici = false;
}
function gonnaSetIntoLS(obj){
    let schedulesArr = [];
    if (localStorage.getItem(obj.date) != null){
        schedulesArr = JSON.parse(localStorage.getItem(obj.date));
    } 
    schedulesArr.push(obj);
    sendToLS(schedulesArr, obj.date);
}
function sendToLS(arr, key){
    let targetCell = document.querySelector(`[data-date="${key}"]`);
    targetCell.querySelectorAll('p+p').forEach(x => x.remove());

    if(arr.length == 0){ 
        localStorage.removeItem(key); 
        return; 
    }

    localStorage.setItem(key, JSON.stringify(arr));
    writeTextOnCell(targetCell, key);
}

function moveMonth(isForward){
    let step = 1;
    if (isForward == false){ step = -1; }

    currentMonth += step;
    checkMonthOverflow();
    setThisMonth();
}

function checkMonthOverflow(){
    if (currentMonth >= 0 && currentMonth <= 11){ return; }

    let yearCarry = 1;
    if (currentMonth < 0){ yearCarry = -1; }

    currentMonth = currentMonth - (12 * yearCarry); 
    currentYear += yearCarry;

    checkLeapYear();
}

function checkLeapYear(){
    currDayOfMonthArr = daysOfMonth;

    let beginningDate = new Date(currentYear, 01, 01);
    let endingDate = new Date(currentYear, 12, 31);
    if (beginningDate.getDay() != endingDate.getDay()){ currDayOfMonthArr[1] = 29; } 
    else { currDayOfMonthArr[1] = 28; }
}
function writeTextOnCell(targetCell, key){
    if (localStorage.getItem(key) != null){
        let dataArr = JSON.parse(localStorage.getItem(key));
        dataArr.forEach(x => {
            targetCell.innerHTML += `<p class="my-0"><small>${x.since} ${x.title}</small></p>`;
        })
    }
}

function setThisMonth(){

    const clearThisMonth = () => {
        allTds.forEach(x => { 
            x.removeAttribute('data-date');
            x.removeAttribute('data-bs-toggle');
            x.removeAttribute('data-bs-target');
            x.classList.remove('disabled-cell'); 
            x.classList.remove('occupied');
            x.innerHTML = '';
        })
    }
    const showTextsOnCells = () => {
        let firstDay = new Date(currentYear, currentMonth, 01);
        let monthIn2Digits = currentMonth.toString().padStart(2, '0');
        let yearIn4Digits = currentYear.toString().padStart(4, '0');
        if(currentYear < 1){ yearIn4Digits = 'BC' + Math.abs(currentYear - 1).toString().padStart(4, '0'); }

        for(let i = 0; i < currDayOfMonthArr[currentMonth]; i++){
            let index = firstDay.getDay() + i;
            let targetCell = allTds[index];
            let dateIn2Digits = (i + 1).toString().padStart(2, '0');
            let key = `${yearIn4Digits}-${monthIn2Digits}-${dateIn2Digits}`;

            targetCell.innerHTML = `<p class="text-center fw-bold mb-1">${dateIn2Digits}</p>`;
            targetCell.setAttribute('data-date', key);

            writeTextOnCell(targetCell, key);
        }
    }
    const setAttributesOfCells = () => {
        allTds.forEach(x => {
            if (x.dataset.date == null){ x.classList.add('disabled-cell'); }
            else{
                x.setAttribute("data-bs-toggle", "modal");
                x.setAttribute("data-bs-target", "#window-for-schedules");
            }
        });
    }
    const displayYearAndMonthOnTitle = () => {
        let thisYear = 'C.E. ' + currentYear;
        if (currentYear < 1){ 
            thisYear = 'B.C.E. ' + Math.abs(currentYear - 1); 
            if (venividivici == false){
                let caesar = document.querySelector('.caesar');
                caesar.querySelector('img').classList.remove('d-none');
                caesar.classList.add('veni');
                venividivici = true;
            }
        }
        displayYear.innerHTML = thisYear;
        displayMonth.innerHTML = months[currentMonth];
    }

    clearThisMonth();
    showTextsOnCells();
    setAttributesOfCells();
    displayYearAndMonthOnTitle();
}