const currentFullDate = new Date();
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// date = new Date();
// date 取得完整時間 e.g. Sat Dec 31 2022 15:47:03 GMT+0800 (台北標準時間)
// date.getDay() 取得星期（0-6，週日 = 0）
// date.getFullYear() 取得4位數字西元年
// date.getMonth() 取得月份（0-11）
// date.getDate() 取得日（1-31）
let currentYear, currentMonth, currentDate, currentWeekday, scheduleInputs, venividivici;
let tbody, allTds, displayYear, displayMonth, btnPrev, btnPost, btnAddAndSave, btnCloseAndSave;
let scheduleContent, scheduleItems, deleteScheduleItem, addWindowTitle;
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
    btnAddSchedule = windowForSchedule.querySelector('.btn[data-bs-target="#add-schedule"]');
    closeScheduleList = windowForSchedule.querySelectorAll('[data-bs-dismiss="modal"]');
    scheduleContent = windowForSchedule.querySelector('.modal-body>ul');
    titleScheduleList = document.getElementById('schedule-list');
    btnCloseAndSave = document.getElementById('close-and-save');

    windowAddSchedule = document.getElementById('add-schedule');
    closeAddWindowBtns = windowAddSchedule.querySelectorAll('[data-bs-dismiss="modal"]');
    btnAddAndSave = document.getElementById('add-and-save');
    addWindowTitle = document.getElementById('add-new-event');
    scheduleInputs = windowAddSchedule.querySelectorAll('input');
}
function initVariables(){
    currentYear = currentFullDate.getFullYear();
    currentMonth = currentFullDate.getMonth();
    currentDate = currentFullDate.getDate(); // not be used
    currentWeekday = currentFullDate.getDay(); // not be used
    venividivici = false;
}
function setEventListeners(){
    btnPrev.addEventListener('click', moveMonth);

    btnPost.addEventListener('click', moveMonth);

    allTds.forEach(td => td.addEventListener('click', showScheduleWindow));

    closeScheduleList.forEach(x => x.addEventListener('click', clearAttributesOfBtns));

    btnAddSchedule.addEventListener('click', gonnaSetASchedule);

    closeAddWindowBtns.forEach(x => x.addEventListener('click', cancelToAddSchedule));

    btnAddAndSave.addEventListener('click', setInputValues);

    btnCloseAndSave.addEventListener('click', closeAndSaveEdits);
}
function showScheduleWindow(e){
    let dataDate = e.target.dataset.date;
    let ymdArr = dataDate.split('-');
    let titleText = `西元${ymdArr[0]}年${parseInt(ymdArr[1]) + 1}月${ymdArr[2]}日的行程`;
    if (dataDate.includes('BC')){ 
        titleText = `西元前${ymdArr[0].replace('BC', '')}年${parseInt(ymdArr[1]) + 1}月${ymdArr[2]}日的行程`;
    }

    titleScheduleList.innerHTML = titleText;
    btnCloseAndSave.setAttribute('data-key', dataDate);
    btnAddSchedule.id = dataDate;

    showScheduleList(dataDate);
}
function clearAttributesOfBtns(){
    setTimeout(() => { 
        btnCloseAndSave.removeAttribute('data-key');
        btnAddSchedule.removeAttribute('id');
        allSchedulesOfTheDay = [];
        scheduleContent.innerHTML = '';
    }, 76);
}
function gonnaSetASchedule(e){
    scheduleInputs.forEach(x => x.value = '');
    addWindowTitle.innerHTML = '新增行程';

    let thisDate = e.target.id;
    btnAddAndSave.setAttribute('data-key', thisDate);
    btnAddAndSave.setAttribute('data-edit', '');
}
function cancelToAddSchedule(){
    setTimeout(() => { 
        btnAddAndSave.removeAttribute('data-key'); 
        btnAddAndSave.removeAttribute('data-edit'); 
        allSchedulesOfTheDay = [];
    }, 76);
}
function setInputValues(e){
    let inputs = scheduleInputs;
    let thisKey = e.target.dataset.key;
    if(thisKey == null){
        thisKey = document.querySelector('li[data-key]').dataset.key;
    }

    let ttl = 'Untitled';
    let snc = inputs[1].value;
    let utl = inputs[2].value;
    let ctn = '沒有內容';
    if(inputs[0].value != ''){ ttl = inputs[0].value; }
    if(inputs[1].value.length < 1){ snc = '00:00' }
    if(inputs[2].value.length < 1){ utl = '00:00' }
    if(inputs[1].value > inputs[2].value){
        snc = inputs[2].value;
        utl = inputs[1].value;
        alert('由於起始時間比結束時間早，因此將其調換！！');
    }
    if( inputs[3].value != '' ){ ctn = inputs[3].value; }
    let obj = {
        date: thisKey,
        title: ttl,
        since: snc,
        until: utl,
        content: ctn
    };
    
    if(e.target.getAttribute('data-edit') != null && e.target.getAttribute('data-edit').length > 2){ editItem(obj); } 
    else{ gonnaSetIntoLS(obj); }
}
function closeAndSaveEdits(e){
    if (allSchedulesOfTheDay == null){ return; }

    let arr = allSchedulesOfTheDay.filter(item => item.date != 'deleted');
    let key = e.target.dataset.key;
    allSchedulesOfTheDay = [];

    sendToLS(arr, key);
}
function editItem(obj){
    if (allSchedulesOfTheDay == null){ return; }
    let index = btnAddAndSave.getAttribute('data-edit').split('-')[1];
    let newArray = allSchedulesOfTheDay.filter(x => x != allSchedulesOfTheDay[index]);
    newArray.push(obj);
    sendToLS(newArray, obj.date);
    cancelToAddSchedule();
}
function showScheduleList(key){
    let dataArr = JSON.parse(localStorage.getItem(key));
    scheduleContent.innerHTML = '';
    allSchedulesOfTheDay = dataArr;
    if (dataArr == null){ 
        allSchedulesOfTheDay = [];
        return; 
    }

    let i = 0;
    dataArr.forEach(schedule => {
        let li = document.createElement('li');
        let item = document.createElement('div');
        li.innerHTML += `<i class="fa-regular fa-circle-xmark text-secondary" data-no="${i}" data-del="${key}"></i>`;


        let string = '';
        string += `<h3>${schedule.since}：${schedule.title}</h3>`;
        string += `<p>預計結束時間：${schedule.until}</p>`;
        string += `<p>行程內容：${schedule.content}</p>`;

        item.classList.add('schedule-item');
        item.setAttribute('data-listid', i);
        item.setAttribute("data-bs-toggle", "modal");
        item.setAttribute("data-bs-target", "#add-schedule");
        item.innerHTML = string;

        i++;
        
        li.dataset.key = key;
        li.append(item);
        scheduleContent.append(li);
    })
    setDynamicElements();
}
function setDynamicElements(){
    scheduleItems = windowForSchedule.querySelectorAll('.schedule-item');
    deleteScheduleItem = windowForSchedule.querySelectorAll('.fa-circle-xmark');
    
    scheduleItems.forEach(x => x.addEventListener('click', (e) => {
        let inputs = scheduleInputs;
        let index = x.dataset.listid;
        let currentDatas = allSchedulesOfTheDay[index];
        let thiskey = e.target.parentNode.dataset.key;

        inputs[0].value = currentDatas.title;
        inputs[1].value = currentDatas.since;
        inputs[2].value = currentDatas.until;
        inputs[3].value = currentDatas.content;
        
        addWindowTitle.innerHTML = '修改行程';
        btnAddAndSave.setAttribute('data-key', thiskey);
        btnAddAndSave.setAttribute('data-edit', `ed-${index}`);
    }))
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
    arr = sortArrayBySince(arr);
    localStorage.setItem(key, JSON.stringify(arr));
    writeTextOnCell(targetCell, key);
}

function moveMonth(e){
    let step = 1;
    if (e.target.id == 'prev' || e.target.classList.contains('fa-caret-left')){ step = -1; }

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
        dataArr = sortArrayBySince(dataArr);
        dataArr.forEach(x => {
            targetCell.innerHTML += `<p class="my-0"><small>${x.since} ${x.title}</small></p>`;
        })
    }
}
function sortArrayBySince(arr){
    const removeColon = (x) => { 
        return x.replace(':', '').toString(); 
    }
    return arr.sort((a, b) => { return removeColon(a.since) - removeColon(b.since); })
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