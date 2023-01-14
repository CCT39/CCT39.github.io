const randomly = () => 0.5 - Math.random();
const orderly = (a, b) => a - b;
const getPureIndexArray = (arr) => arr.map((x, index) => index);

const maxPlayTime = 10;
const pathGeoJson = './json/TOWN_MOI_1111118_GeoJson.json';
const mikuColour = 'var(--miku-colour)';
const mikuBlack = 'var(--miku-black)';

const btnStart = document.getElementById('btn-start');
const msg = document.querySelector('.msg');
const btnOptions = document.querySelectorAll('.btn-option');
const optionContents = document.querySelectorAll('.option-content');
const modalTitle = document.getElementById('guess-model-content');
const modalMsg = document.getElementById('modal-msg');
const resultMsg = document.getElementById('result-msg');
const corrects = document.getElementById('corrects');
const wrongs = document.getElementById('wrongs');
const ctrlSpeed = document.getElementById('ctrl-speed');
const modalGuessResult = document.getElementById('guess-result');
const modalEndGame = document.getElementById('end-game');

let polygons, map, districts, currentIdx, ansIndex;
let countCorrect, countWrong, isGameOver, initialSpeed;
let remainDists = [], idxCorrect = [], idxWrong = [];

window.onload = () => {
    fetch(pathGeoJson)
        .then(resp => {
            if(resp.ok){ return resp.json(); }
            else{ throw new Error(`status :${resp.status}, statusText: ${resp.statusText}`) }
        })
        .then(result => { 
            polygons = result; 
            return result
        })
        .then(() => { 
            polygons = polygons.features.filter(x => x.properties.COUNTYNAME == '臺南市'); 
            
            initMap(polygons);
            setDistricts();
            initElements();
        })
        .catch(ex => alert(ex.message));
}

function initMap(data){
    map = document.getElementById('map');
    map = L.map('map', {
        center: [23.15, 120.35],
        zoom: 10
    })

    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let osm = new L.TileLayer(osmUrl, { minZoom: 10, maxZoom: 10 })
    map.addLayer(osm);

    map.dragging.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.scrollWheelZoom.disable();
    map.touchZoom.disable();

    L.geoJson(data).addTo(map);
}

function setDistricts(){
    districts = document.querySelectorAll('g>path');
    districts.forEach(d => {
        d.setAttribute('stroke-width', '.5');
        d.setAttribute('stroke', mikuBlack);
    })
}

function initElements(){
    document.querySelectorAll('.total-questions').forEach(x => x.innerHTML = maxPlayTime);
    document.querySelectorAll('.leaflet-right').forEach(x => {
        x.classList.remove('leaflet-right');
        x.classList.add('leaflet-left');
    })
    isGameOver = true;
    initialSpeed = 5;

    btnStart.addEventListener('click', getStart);
    modalGuessResult.addEventListener('hidden.bs.modal', reStart);
    ctrlSpeed.addEventListener('change', initSpeed);
    btnOptions.forEach(x => x.addEventListener('click', setOptions));
    btnOptions.forEach(x => x.disabled = true);
    districts.forEach(d => d.setAttribute('fill', mikuColour));
}

function getStart(){
    const setDistAttributes = (dist, bgc, strokeWidth, fillOpacity) => {
        dist.setAttribute('fill', bgc);
        dist.setAttribute('stroke-width', strokeWidth);
        dist.setAttribute('fill-opacity', fillOpacity);
    }
    if(isGameOver){
        isGameOver = false;
        districts.forEach(d => { setDistAttributes(d, mikuColour, 0.5, 0.2); });
        initValues();
    }
    btnOptions.forEach(x => x.disabled = true);
    ctrlSpeed.disabled = true;

    msg.innerHTML = '出題中……';
    btnStart.setAttribute('disabled', 'true');
    let random = Math.floor(Math.random() * remainDists.length);

    let speed = 9;
    let allSteps = random + remainDists.length * 2;
    let steps = allSteps;

    currentIdx = 0;
    const turnAround = () => {
        setDistAttributes(districts[remainDists[currentIdx]], mikuColour, 0.5, 0.2);
        currentIdx++;

        if (currentIdx >= remainDists.length){ currentIdx -= remainDists.length; }
        setDistAttributes(districts[remainDists[currentIdx]], mikuBlack, 1.5, 0.4);
        steps--;

        if (steps > 0){
            setTimeout(turnAround, speed); 
            if (steps < Math.floor(allSteps / 3)){ speed += initialSpeed; }
        }
        else{ 
            btnOptions.forEach(x => x.removeAttribute('disabled'));
            ctrlSpeed.removeAttribute('disabled');
            msg.innerHTML = 'Q：這是哪個行政區？'; 
            setQuestion(remainDists[random]); 
        }
    }

    turnAround();
}

function initValues(){
    remainDists = getPureIndexArray(polygons);
    currentIdx = 0;
    countCorrect = 0;
    countWrong = 0;
    idxCorrect = [];
    idxWrong = [];
    showCorrectsAndWrongs();
    modalGuessResult.removeAttribute('data-bs-toggle');
    modalGuessResult.removeAttribute('data-bs-target');
}

function initSpeed(e){
    initialSpeed = parseInt(e.target.value);
}

function setQuestion(ansIdx){
    remainDists = remainDists.filter(x => x != ansIdx);

    const ans = getDistName(ansIdx);
    ansIndex = ansIdx;
    let optsInIdx = remainDists
        .filter(x => x != ansIdx)
        .sort(randomly)
        .slice(0, 3);
    remainDists.sort(orderly);

    optsInIdx.push(ansIdx);

    opts = optsInIdx
        .sort(randomly)
        .sort(randomly)
        .map(idx => getDistName(idx));

    for (let i = 0; i < optionContents.length; i++){
        optionContents[i].innerHTML = opts[i];
        btnOptions[i].dataset.dist = optsInIdx[i];
    }
}

function setOptions(){
    const setModalAfterGuess = (isCorrect) => {
        if (isCorrect){
            countCorrect++;
            idxCorrect.push(ansIndex);
            districts[ansIndex].setAttribute('fill', '#66f');
            modalTitle.innerHTML = '正確！';
            modalMsg.innerHTML = `答對了！答案是<strong>${getDistName(ansIndex)}</strong>。`;
        } else {
            countWrong++;
            idxWrong.push(ansIndex);
            districts[ansIndex].setAttribute('fill', '#f66');
            modalTitle.innerHTML = '錯誤！';
            modalMsg.innerHTML = `可惜不是${event.target.innerHTML}！答案是<strong>${getDistName(ansIndex)}</strong>！`;
        }
        showCorrectsAndWrongs();
        checkPlayTimes();
    }
    const checkPlayTimes = () => {
        const totalPlayTimes = countCorrect + countWrong;

        if (totalPlayTimes >= maxPlayTime || remainDists <= 0){
            isGameOver = true;
            modalGuessResult.setAttribute('data-bs-toggle', 'modal');
            modalGuessResult.setAttribute('data-bs-target', '#end-game');

            let evaluate = '';
            const correctRate = countCorrect / totalPlayTimes;

            if (correctRate > 0.8){ evaluate = '太猛了，是個狠人！！' }
            else if (correctRate > 0.5){ evaluate = '還滿瞭解府城的嘛' }
            else if (correctRate > 0.2){ evaluate = '還行，再接再厲！' }
            else{ evaluate = '該考慮規劃一次臺南旅遊了吧' }

            msg.innerHTML = '遊戲結束';
            resultMsg.innerHTML = 
            `
                <p class="text-center">
                答對題數：<span class="fs-5 text-success">${countCorrect}</span>題<br>
                答錯題數：<span class="fs-5 text-danger">${countWrong}</span>題<br>
                正確率：<strong class="fs-5">${Math.floor(correctRate * 100)}%</strong><br>

                <strong>評價：${evaluate}</strong>
                </p>
            `;
            btnStart.removeAttribute('disabled');
        }
    }

    btnOptions.forEach(x => x.disabled = true);
    if (event.target.dataset.dist == ansIndex){ setModalAfterGuess(true); } 
    else{ setModalAfterGuess(false); }
}

function showCorrectsAndWrongs(){
    corrects.innerHTML = countCorrect;
    wrongs.innerHTML = countWrong;
}

function getDistName(index){
    return polygons[index].properties.TOWNNAME;
}

function reStart(){
    if (countCorrect + countWrong >= maxPlayTime || remainDists <= 0){ setTimeout(() => {}, 762); return; }

    setTimeout(getStart, 762);
}