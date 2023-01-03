let btnIPhone, btnIPad, btnMac, currentSelectedProduct, btnColours, btnStorages;
let productArr = [], currentProductDataArr = [];
let currentColour = [], currentStorage = [], currentNetwork = [], currentSize = [];
let btnIPadNetworks, btnMacSizes, size13, size14, size16, btnsOfSize13, btnsOfSize14, btnsOfSize16;

const iPadPic = './imgs/hero__ecv967jz1y82_large.jpg';
const iPhonePic = './imgs/iphone_14_hero__ceub5xriecgi_large.jpg';
const macPic = './imgs/macbook_pro_13__e3r46kd69eoi_large.jpg';
const hidden = 'd-none';

window.onload = () => {
    getElements();
    generateProductArray();
    preloadProductImgs();
    setEventListeners();
}

function getElements(){
    btnIPhone = document.getElementById('iphone');
    btnIPad = document.getElementById('ipad');
    btnMac = document.getElementById('mac');
    mainImg = document.getElementById('main-img');
    displayedPrice = document.getElementById('price');
    btnProducts = document.querySelectorAll('.btn-products');
    productInfo = document.getElementById('product-info');

    btnColours = document.querySelectorAll('.colour .btn');
    btnStorages = document.querySelectorAll('.storage .btn');
    btnIPadNetworks = document.getElementById('col-ipad').querySelectorAll('.network .btn');

    let colMac = document.getElementById('col-mac');
    btnMacSizes = colMac.querySelectorAll('.size .btn');
    size13 = colMac.querySelector('.size-13');
    btnsOfSize13 = size13.querySelectorAll('.btn');
    size14 = colMac.querySelector('.size-14');
    btnsOfSize14 = size14.querySelectorAll('.btn');
    size16 = colMac.querySelector('.size-16');
    btnsOfSize16 = size16.querySelectorAll('.btn');
}

function setEventListeners(){
    btnProducts.forEach(x => x.addEventListener('click', (e) => {
        clearFilters();
        let targetItem = e.target;
        currentProductDataArr = getDataByProductName(targetItem.innerHTML);
        changePicAndToggleBtnArea(targetItem.id);
    }))
    btnColours.forEach(x => x.addEventListener('click', (e) => { onColourChosen(e); }))
    btnStorages.forEach(x => x.addEventListener('click', (e) => { onStorageChosen(e); }))
    btnIPadNetworks.forEach(x => x.addEventListener('click', (e) => { 
        let thisNetwork = getTargetData(e);
        currentNetwork = currentStorage.filter(x => x.network == thisNetwork);
        displayPrice(currentNetwork);
    }))
    btnMacSizes.forEach(x => x.addEventListener('click', (e) => {
        let thisSize = getTargetData(e);
        toggleSizeBtns(thisSize);
        currentSize = currentColour.filter(x => x.size == thisSize);
        mainImg.src = currentSize[0].img;
        displayedPrice.innerHTML = '';
    }))
    btnsOfSize13.forEach(x => x.addEventListener('click', (e) => { onStorageChosen(e); }))
    btnsOfSize14.forEach(x => x.addEventListener('click', (e) => {
        let thisCPU = getTargetData(e).replace('core', '核心');
        let currentCPU = currentSize.filter(x => x.CPU == thisCPU);
        displayPrice(currentCPU);
    }))
    btnsOfSize16.forEach(x => x.addEventListener('click', (e) => {
        let level = getTargetData(e);
        let thisGPU, thisStorage;
        
        if (level == 'basic'){ thisGPU = '16核心'; thisStorage = '512GB'; }
        else if (level == 'medium'){ thisGPU = '16核心'; thisStorage = '1TB'; }
        else if (level == 'luxury'){ thisGPU = '32核心'; thisStorage = '1TB'; }

        let currentLevel = currentSize.filter(x => x.GPU == thisGPU && x.storage == thisStorage);
        displayPrice(currentLevel);
    }))
}

function toggleSizeBtns(thisSize){
    if (!(size13.classList.contains(hidden) && size14.classList.contains(hidden) && size16.classList.contains(hidden))){
        let areaArr = [size13, size14, size16];
        areaArr.forEach(x => x.classList.remove(hidden));
        areaArr.forEach(x => x.classList.add(hidden));
    }

    if (thisSize == '13'){ size13.classList.toggle(hidden); }
    else if (thisSize == '14'){ size14.classList.toggle(hidden); }
    else if (thisSize == '16'){ size16.classList.toggle(hidden); }
}

function onStorageChosen(e){
    let thisStorage = getTargetData(e);
    let thisProduct = getTargetProduct(e);
    currentStorage = currentColour.filter(x => x.storage == thisStorage);

    if (thisProduct == 'mac' && currentStorage.length > 1){
        currentStorage = currentStorage.filter(x => x.size == currentSize[0].size);
    } else if (thisProduct == 'ipad'){
        let col = `col-${thisProduct}`;
        document.getElementById(col).querySelector('.network').classList.remove(hidden);
    }

    displayPrice(currentStorage);
}

function onColourChosen(e){
    let thisColour = getTargetData(e);
    currentColour = currentProductDataArr.filter(x => x.colour == thisColour);
    mainImg.src = currentColour[0].img;

    changeImgAboutSizes();
    showAreasAfterChooseColour(e);
}

function changeImgAboutSizes(){
    if (currentSize.length > 0){
        currentSize = currentColour.filter(x => x.size == currentSize[0].size);
        mainImg.src = currentSize[0].img;
    }
}

function showAreasAfterChooseColour(e){
    let product = getTargetProduct(e);

    if (product == 'iphone' || product == 'ipad'){ 
        let col = `col-${product}`
        document.getElementById(col).querySelector('.storage').classList.remove(hidden);
    } else if (product == 'mac'){
        document.getElementById('col-mac').querySelector('.size').classList.remove(hidden);
    }
}

function clearFilters(){
    currentColour = [];
    currentStorage = [];
    currentNetwork = [];
    currentSize = [];
    displayedPrice.innerHTML = '';
    productInfo.innerHTML = '';
    document.querySelectorAll('.q').forEach(x => x.classList.add(hidden));
}

function getTargetProduct(e){
    return e.target.id.split('_')[0];
}

function getTargetData(e){
    return e.target.id.split('_')[1];
}

function getDataByProductName(productName){
    return productArr.filter(x => x.product == productName)[0].data;
}

function preloadProductImgs(){
    let divHidden = document.createElement('div');
    divHidden.classList.add(hidden);
    divHidden.classList.add('hidden');

    productArr.forEach(x => {
        x.data.forEach(y => {
            let pic = document.createElement('img');
            pic.src = y.img;
            divHidden.append(pic);
        });
    })
    document.querySelector('body').append(divHidden);
}

function displayPrice(arrThatContainsOnlyAThing){
    if (arrThatContainsOnlyAThing.length != 1){ return; }

    currentSelectedProduct = arrThatContainsOnlyAThing[0];

    const numberComma = (num) => {
        // \B： 吻合非文字邊界 e.g. /\B../會選到noonday的oo；/y\B./會選到yesterday的ye
        // negative lookbehind (?<!)
        // x(?=y)： 找到後面是y的x e.g. /Jack(?=Sprat)/ 找到後面接著Sprat的Jack
        // x(?!y)： 找到後面不是y的x e.g. /\d+(?!\.)/會找到後面沒小數點的數字，如3.14中的14
        let comma = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g
        return num.toString().replace(comma, ',')
    }

    const displayProductInfo = () => {
        productInfo.innerHTML = '';
        let keys = Object.keys(currentSelectedProduct);

        keys.forEach(key => {
            let item = currentSelectedProduct[key];
            if (key == 'price'){ item = `NT$ ${numberComma(item)}`; }
            else if (key == 'size'){ item = `${item}吋`; }

            productInfo.innerHTML += `<br><b>${key}</b>: ${item}`;
        });
    }

    displayProductInfo();
    displayedPrice.innerHTML = numberComma(currentSelectedProduct.price);
}

function changePicAndToggleBtnArea(btnId){
    const btnArr = document.querySelectorAll('[id^="col-"]>.colour>.btn-group');
    btnArr.forEach(x => x.classList.remove(hidden));
    btnArr.forEach(x => x.classList.add(hidden));

    // let col = `col-${btnId}`;
    if (btnId == 'iphone'){
        mainImg.src = iPhonePic;
        btnArr[0].classList.remove(hidden);
    } else if (btnId == 'ipad'){
        mainImg.src = iPadPic;
        btnArr[1].classList.remove(hidden);
    } else if (btnId == 'mac'){
        mainImg.src = macPic;
        btnArr[2].classList.remove(hidden);
    }
}

function generateProductArray(){
    const btnProducts = [btnIPhone, btnIPad, btnMac];
    btnProducts.forEach(btn => {
        productArr.push({product: btn.innerHTML, data: []});
    })

    productArr.forEach(item => {
        generateIPhone(item);
        generateIPad(item);
        generateMac(item);
    })
}
function generateIPhone(item){
    if (item.product != btnIPhone.innerHTML){ return; }

    const objIPhone14 = {
        storage: ['128GB', '256GB', '512GB'],
        colour: ['blue', 'purple', 'midnight', 'starlight', 'product-red']
    };

    objIPhone14.colour.forEach(x => {
        const UrlIPhone14 = `./imgs/iphone-14-finish-select-202209-6-1inch-${x}.jpg`;
        objIPhone14.storage.forEach(y => {
            let cost = 27900;
            if (y == '256GB'){ cost += 3500; }
            else if (y == '512GB'){ cost += 10500; }

            item.data.push(
                { colour: x, storage: y, price: cost, img: UrlIPhone14 }
            );
        })
    })
}
function generateIPad(item){
    if (item.product != btnIPad.innerHTML){ return; } 

    const objIPad = {
        storage: ['64GB', '256GB'],
        network: ['only-Wi-Fi', 'with-Mobile'],
        colour: ['space-gray', 'pink', 'purple', 'starlight']
    }

    objIPad.colour.forEach(x => {
        const UrlIPadMini = `./imgs/ipad-mini-finish-select-gallery-202211-${x}.jpg`;

        objIPad.storage.forEach(y => {
            let cost = 16900;
            if (y == '256GB'){ cost += 5000;}

            objIPad.network.forEach(z => {
                if (z == 'with-Mobile'){ cost += 5000; }
            
                item.data.push(
                    { colour: x, storage: y, network: z, price: cost, img: UrlIPadMini }
                );
            })
        })
    })
}
function generateMac(item){
    if (item.product != btnMac.innerHTML){ return; }

    let thisSize, thisColour, thisCPU, thisGPU, thisMemory, thisStorage, thisPrice, thisUrl;

    const pushMac = () => {
        item.data.push(
            { 
                size: thisSize, 
                colour: thisColour, 
                CPU: thisCPU, 
                GPU: thisGPU, 
                memory: thisMemory, 
                storage: thisStorage, 
                price: thisPrice,
                img: thisUrl
            }
        );
    }
    
    const objMac = {
        size: ['13', '14', '16'],
        colour: ['spacegray', 'silver']
    }

    
    //let UrlMacBookPro = `./imgs/mbp${size}-${colour}-select-${num}_GEO_TW.jpg`;

    objMac.size.forEach(x => {
        thisSize = x;
        
        objMac.colour.forEach(y => {
            thisColour = y;
            let inch = x, date;
            
            if (x == '13'){
                thisCPU = '8核心';
                thisGPU = '10核心';
                thisMemory = '8GB';
                inch = '';
                date = '202206';
                thisUrl = `./imgs/mbp${inch}-${y}-select-${date}_GEO_TW.jpg`;

                let Storages = ['256GB', '512GB'];
                thisPrice = 39900;

                Storages.forEach(storage => {
                    thisStorage = storage;
                    
                    if (storage == '512GB'){ thisPrice += 6000; }

                    pushMac();
                })
            } else if (x == '14'){
                thisMemory = '16GB';
                date = '202110';
                thisUrl = `./imgs/mbp${inch}-${y}-select-${date}_GEO_TW.jpg`;

                let CPUs = ['8核心', '10核心'];

                CPUs.forEach(cpu => {
                    thisCPU = cpu;
                    thisPrice = 59900;

                    if (cpu == '8核心'){
                        thisGPU = '14核心';
                        thisStorage = '512GB';
                    } else if (cpu == '10核心'){
                        thisPrice += 15000
                        thisGPU = '16核心';
                        thisStorage = '1TB';
                    }

                    pushMac();
                })
            } else if (x == '16'){
                thisCPU = '10核心';
                date = '202110';
                thisUrl = `./imgs/mbp${inch}-${y}-select-${date}_GEO_TW.jpg`;

                let storages = ['512GB', '1TB']; 
                let GPUs = ['16核心', '32核心'];


                storages.forEach(storage => {
                    thisStorage = storage;

                    GPUs.forEach(gpu => {
                        thisGPU = gpu;
                        thisPrice = 74900;

                        if (thisStorage == '512GB'){
                            if (thisGPU == '16核心'){
                                thisMemory = '16GB'; 
                            } else if (thisGPU == '32核心'){
                                return;
                            }
                        } else if (thisStorage == '1TB'){
                            thisPrice += 6000;

                            if (thisGPU == '16核心'){ 
                                thisMemory = '16GB'; 
                            } else if (thisGPU == '32核心'){ 
                                thisMemory = '32GB'; 
                                thisPrice += 24000;
                            }
                        }
                        pushMac();
                    })
                })
            }
        })
    })
}
