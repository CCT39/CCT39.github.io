let mainMap, legend, legendTbody, showLineName, showCompanyName;
let showThisYear, showThisYearInModal, thisYear, yearSelector, spinner;
let companySources = [], dataArr = [], yearNamesArr = [];

const initYear = 1910;
const mikuColour = '#39c5bb';

const generateCompanyObj = (data) => {
    let tempName = data.name.split('_');
    
    const thisCompany = companyArr.find(x => x.company == tempName[1]);
    return {
        type: tempName[0],
        id: tempName[1],
        year: tempName[2],
        name: thisCompany.zhName,
        colour: thisCompany.colour,
        lines: data.features.map(x => ({
            lineName: x.properties.Name.split('（')[0],
            geometry: x.geometry.coordinates.map(y => y.slice(0, 2).reverse())
        }))
    }
}
const generatePeriodYears = (begin, end) => {
    let temp = [];
    for (let i = begin; i < end + 1; i += 5){
        temp.push(i);
    }
    return temp;
};
const getVarientYear = (yr) => {
    if (yr >= 1868 && yr < 1912){ return `明治${yr - 1867}年`; }
    if (yr >= 1912 && yr < 1926){ return `大正${yr - 1911}年，民國${yr - 1911}年`; }
    if (yr >= 1926 && yr <= 1945){ return `昭和${yr - 1925}年，民國${yr - 1911}年`; }
    if (yr > 1945){ return `民國${yr - 1911}年`; }
}
const companyArr = [
    { company: 'Gov', zhName: '臺鐵', colour: 'black', dataPeriods: generatePeriodYears(1910, 1980) },
    { company: 'TSC', zhName: '臺灣糖業股份有限公司', colour: mikuColour, dataPeriods: generatePeriodYears(1950, 1980) },
    { company: 'Dainippon', zhName: '大日本製糖株式會社', colour: 'red', dataPeriods: generatePeriodYears(1910, 1945) },
    { company: 'Taiwan', zhName: '臺灣製糖株式會社', colour: 'blue', dataPeriods: generatePeriodYears(1910, 1945) },
    { company: 'Meiji', zhName: '明治製糖株式會社', colour: 'chocolate', dataPeriods: generatePeriodYears(1910, 1945) },
    { company: 'Ensuiko', zhName: '鹽水港製糖株式會社', colour: 'green', dataPeriods: generatePeriodYears(1910, 1945) },
    { company: 'Shinko', zhName: '新興製糖株式會社', colour: 'purple', dataPeriods: generatePeriodYears(1910, 1940) },
    { company: 'Niitaka', zhName: '新高製糖株式會社', colour: 'cyan', dataPeriods: generatePeriodYears(1915, 1930) },
    { company: 'Teikoku', zhName: '帝國製糖株式會社', colour: 'orange', dataPeriods: generatePeriodYears(1920, 1935) },
    { company: 'Toyo', zhName: '東洋製糖株式會社', colour: 'darkred', dataPeriods: generatePeriodYears(1915, 1925) },
    { company: 'Rinhongen', zhName: '林本源製糖株式會社', colour: 'lightgreen', dataPeriods: generatePeriodYears(1910, 1925) },
    { company: 'Taito', zhName: '臺東製糖株式會社', colour: 'darkgoldenrod', dataPeriods: [1920] }
]

window.onload = function(){
    let prmsArr = [];
    companyArr.forEach(co => {
        co.dataPeriods.forEach(yr => {
            const f = fetch(`https://raw.githubusercontent.com/CCT39/CCT39.github.io/main/20230110JSHomeworkMap/json/line_${co.company}_${yr}.geojson`);
            prmsArr.push(f);
        })
    })

    Promise.all(prmsArr)
        .then(resp => {
            return Promise.all(resp.map(x => x.json()));
        })
        .then(result => {
            return result.map(x => generateCompanyObj(x));
        })
        .then(result => {
            initVariables(result);
            initMainMap();
            initYearSelector();
            setThisYear(initYear);
        })
        .catch(ex => console.log(ex))
}

function initVariables(sourceData){
    showLineName = document.querySelector('.line-name');
    showCompanyName = document.querySelector('.company-name');
    showThisYear = document.getElementById('this-year');
    yearSelector = document.getElementById('select-year');
    legend = document.querySelector('.legend');
    legendTbody = legend.querySelector('tbody');
    showThisYearInModal = document.querySelector('.this-year-in-modal');
    spinner = document.getElementById('spinner');

    companySources = sourceData;
    yearNamesArr = Object.keys(sourceData.groupBy('year'));
    spinner.classList.remove('d-flex');
    spinner.classList.add('d-none');
}

function initYearSelector(){
    yearNamesArr.forEach(year => {
        let option = document.createElement('option');
        option.setAttribute('value', year);
        option.innerHTML = year + '年';

        yearSelector.append(option);
    })
    
    yearSelector.addEventListener('change', (e) => {
        yearSelector.disabled = true;
        setThisYear(e.target.value);
        setTimeout(() => {yearSelector.disabled = false;}, 762);
    })
}

function setThisYear(theYear){
    showThisYear.innerHTML = theYear;
    showThisYearInModal.innerHTML = `${theYear}年（${getVarientYear(theYear)}）`;

    let thisYearArray = companySources.filter(x => x.year == theYear);
    setLegend(thisYearArray);
    drawLinesOfEachCompany(thisYearArray);
    setEventListenersOfPaths();
}

function setLegend(thisYearArr){
    legendTbody.innerHTML = '';
    thisYearArr.forEach(company => {
        let tr = document.createElement('tr');
        let colourTd = document.createElement('td');
        let nameTd = document.createElement('td');
        
        let coId = company.name;
        if (company.id == 'Gov'){ 
            let fullName = '臺灣鐵路管理局';
            if (parseInt(company.year) <= 1945){ fullName = '臺灣總督府鐵道部' }

            coId += `（${fullName}）`;
        }

        colourTd.innerHTML = `<i class="fas fa-circle" style="color: ${company.colour};"></i>`;
        nameTd.innerHTML = coId;

        tr.append(colourTd);
        tr.append(nameTd);
        legendTbody.append(tr);
    })
}

function initMainMap(){
    mainMap = L.map('map', {
        center: [23.6, 120.5],
        zoom: 8
    });
    
    let osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let osm = new L.TileLayer(osmUrl, { minZoom: 8, maxZoom: 19 })
    mainMap.addLayer(osm);
}

function drawLinesOfEachCompany(thisYearArr){
    let pathLayer = document.querySelector('svg>g');
    if( pathLayer != null ){ pathLayer.innerHTML = ''; }
    
    for(let i = 0; i < thisYearArr.length; i++){
        drawLines(thisYearArr[i]);
    }
}

function drawLines(coData){
    const lines = coData.lines;
    const colour = coData.colour;
    const coName = coData.name;

    let lineWeight = 5;
    if (coData.id == 'Gov'){ lineWeight = 2; }

    for (let i = 0; i < lines.length; i++){
        const nameOfLine = lines[i].lineName;
        const rails = lines[i].geometry;
        const polyline = L.polyline(rails, {
            color: colour, 
            clickable: true,
            weight: lineWeight
        });

        polyline.bindPopup(`<i class="fas fa-circle" style="color: ${colour};"></i> <strong>${nameOfLine}（${coName}）</strong>`);
        polyline.addEventListener('click', function(){
            showLineName.innerHTML = nameOfLine;
            showCompanyName.innerHTML = `<span style="color: ${colour};">${coName}<span>`;
        })
        polyline.addTo(mainMap);
    }
}

function setEventListenersOfPaths(){
    document.querySelectorAll('path').forEach(path => {
        path.addEventListener('mouseenter', (e) => {e.target.classList.add('mouseover');})
        path.addEventListener('mouseleave', (e) => {e.target.classList.remove('mouseover');})
    })
}

Array.prototype.groupBy = function(prop){
    return this.reduce(function(groups, item){
        const val = item[prop];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups
    }, {})
}