
let mainMap, lineName, companyName, legend;
let coLtdDainippon, coLtdTaiwan, coLtdMeiji, coLtdEnsuiko, coLtdShinko;
let railsDainipponSugarCompany = [], railsTaiwanSugarCompany = [], railsMeijiSugarCompany = [];
let railsEnsuikoSugarCompany = [], railsShinkoSugarCompany = [];

const companySources = [sugarRailsDainippon, sugarRailsTaiwan, sugarRailsMeiji, sugarRailsEnsuiko, sugarRailsShinko];
const companyDatas = [coLtdDainippon, coLtdTaiwan, coLtdMeiji, coLtdEnsuiko, coLtdShinko];
const railDatas = [railsDainipponSugarCompany, railsTaiwanSugarCompany, railsMeijiSugarCompany, railsEnsuikoSugarCompany, railsShinkoSugarCompany];

window.onload = function(){
    initVariables();
    initCompanyValues();
    setLegend();
    initMainMap();
    drawLinesOfEachCompany();
    setEventListeners();
}

function initVariables(){
    lineName = document.querySelector('.line-name');
    companyName = document.querySelector('.company-name');
    legend = document.querySelector('.legend');
}

function initCompanyValues(){
    for (let i = 0; i < companySources.length; i++){
        companyDatas[i] = companySources[i].features;
        companyDatas[i].forEach(x => railDatas[i].push(x.geometry.coordinates.map(y => y.slice(0, 2).reverse())));
    }
}

function setLegend(){
    companySources.forEach(company => {
        let tr = document.createElement('tr');
        let colourTd = document.createElement('td');
        let nameTd = document.createElement('td');

        colourTd.innerHTML = `<i class="fas fa-circle" style="color: ${company.colour};"></i>`;
        nameTd.innerHTML = company.name;

        tr.append(colourTd);
        tr.append(nameTd);
        legend.querySelector('tbody').append(tr);
    })
}

function initMainMap(){
    mainMap = L.map('map', {
        center: [23.6, 120.5],
        zoom: 8,
        opacity: 0.5
    });
    
    let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 19 })
    mainMap.addLayer(osm);
}

function drawLinesOfEachCompany(){
    const colours = companySources.map(company => company.colour);

    for(let i = 0; i < railDatas.length; i++){
        drawLines(companyDatas[i], colours[i]);
    }
}

function drawLines(coData, colour){
    for (let i = 0; i < coData.length; i++){
        let rails = coData[i].geometry.coordinates.map(y => y.slice(0, 2).reverse());
        let polyline = L.polyline(rails, {color: colour, clickable: true});
        let nameOfLine = coData[i].properties.Name;

        polyline.bindPopup(`<strong>${nameOfLine.replace('）', '製糖株式會社）')}</strong>`);
        polyline.addEventListener('click', function(){
            lineName.innerHTML = nameOfLine.split('（')[0];
            companyName.innerHTML = nameOfLine.split('（')[1].split('）')[0] + '製糖株式會社';
        })
        polyline.addTo(mainMap);
    }
}

function setEventListeners(){
    document.querySelectorAll('path').forEach(path => {
        path.addEventListener('mouseenter', (e) => {e.target.classList.add('mouseover');})
        path.addEventListener('mouseleave', (e) => {e.target.classList.remove('mouseover');})
    })
}