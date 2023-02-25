let btnAdd, inputItem, tempListItem, ulTodoList;
let isOnlyShowUnfinished, showDisplayMode, btnToggleDisplay;

const mainKey = 'todoListDatas';
const hidden = 'd-none';

window.onload = () => {
    initElements();
    initVariables();
    setEventListeners();
    refresh();
}

function initElements(){
    btnAdd = document.getElementById('add-item');
    inputItem = document.getElementById('input-item');
    tempListItem = document.getElementById('list-item');
    ulTodoList = document.getElementById('to-do-list');
    showDisplayMode = document.getElementById('show-display-mode');
    btnToggleDisplay = document.getElementById('toggle-display');
}

function initVariables(){
    isOnlyShowUnfinished = false;
    showCurrentDisplayMode();
}

function setEventListeners(){
    btnAdd.addEventListener('click', addItem);
    btnToggleDisplay.addEventListener('click', toggleDisplayMode);
}

function toggleDisplayMode(){
    isOnlyShowUnfinished = !isOnlyShowUnfinished;
    refresh();
    showCurrentDisplayMode();
}

function showCurrentDisplayMode(){
    let status = isOnlyShowUnfinished ? '只顯示未完成的事項' : '顯示所有的待辦事項';
    let colour = isOnlyShowUnfinished ? 'var(--miku-red)' : 'var(--miku-dark)';

    showDisplayMode.innerHTML = status;
    showDisplayMode.style.color = colour;
}

function refresh(){
    const itemInLS = getItemFromLS();
    ulTodoList.innerHTML = '';
    if (itemInLS.length < 1){ return; }

    itemInLS.forEach(x => {
        if(isOnlyShowUnfinished && x.isDone){ return; }
        const key = x.id;

        const clonedItem = tempListItem.content.cloneNode(true);

        clonedItem.querySelectorAll('.btn').forEach(x => x.setAttribute('data-identity', key));

        const textInput = clonedItem.querySelector('.text-list-item');
        const checkBox = clonedItem.querySelector('.cbx-list-item');

        const btnEdit = clonedItem.querySelector('.btn-edit');
        const btnSave = clonedItem.querySelector('.btn-save');
        const btnDelete = clonedItem.querySelector('.btn-delete');

        textInput.value = x.data;
        checkBox.checked = x.isDone;

        const inputsArr = [btnSave, btnEdit, btnDelete, checkBox, textInput];
        btnEdit.addEventListener('click', () => { switchToEditMode(true, inputsArr, key); })
        btnSave.addEventListener('click', () => {
            const content = textInput.value;
            if(content.length > 500){ alert('輸入內容過長，請重新輸入'); return; }

            switchToEditMode(false, inputsArr, key);
            x.data = content;
            setItemIntoLS(itemInLS);
        })
        btnDelete.addEventListener('click', () => {
            setItemIntoLS(itemInLS.filter(y => y.id != key));
            refresh();
        })
        checkBox.addEventListener('change', () => {
            x.isDone = checkBox.checked;
            setItemIntoLS(itemInLS);
            if(isOnlyShowUnfinished){ refresh(); }
        })

        ulTodoList.append(clonedItem);
    })
}

function switchToEditMode(isToEditMode, inputArr, key){
    document.querySelectorAll(`button:not([data-identity="${key}"])`).forEach(x => x.disabled = isToEditMode);
    inputItem.disabled = isToEditMode;

    inputArr[0].classList.toggle(hidden);
    inputArr[1].classList.toggle(hidden);
    inputArr[2].disabled = isToEditMode;
    inputArr[3].disabled = isToEditMode;
    inputArr[4].disabled = !isToEditMode;
}

function addItem(){
    const content = inputItem.value;
    inputItem.value = '';

    if (content.length < 1){
        alert('請輸入內容');
        return;
    }

    setTodoItem(content);
    refresh();
}

function setTodoItem(content){
    const itemObj = packagingTodoItem(content);

    let itemInLS = getItemFromLS();
    itemInLS.push(itemObj);

    setItemIntoLS(itemInLS);
}

function packagingTodoItem(content){
    const itemKey = Date.now().toString();
    const fullDate = new Date();
    const dateString = `${fullDate.getFullYear()}-${fullDate.getMonth() + 1}-${fullDate.getDate()} ${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}:${fullDate.getMilliseconds()}`;
    
    return {
        id: itemKey,
        date: dateString,
        isDone: false,
        data: content
    };
}

function getItemFromLS(){
    let thingInLS = JSON.parse(localStorage.getItem(mainKey));
    return thingInLS == null ? [] : thingInLS;
}

function setItemIntoLS(data){
    if(!Array.isArray(data)){ return; }

    localStorage.setItem(mainKey, JSON.stringify(data));
}