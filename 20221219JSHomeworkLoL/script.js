

let heroArray = [];
let container;
let btnCreateHeroArray, btnListHero, btnTableHero;
let champions;

window.onload = function () {
    container =  document.querySelector("#container");
    btnCreateHeroArray = document.getElementById("createhero");
    btnListHero = document.getElementById("listhero");
    btnTableHero = document.getElementById("tablehero");
    result = document.getElementById('result');

    btnCreateHeroArray.addEventListener("click", function () {
        //alert("從DOM建立英雄人物陣列資料後清除container");
        
        alert("從DOM建立英雄人物陣列資料成功！");
        
        //1.從DOM建立英雄人物資料
        champions = container.querySelectorAll('.col-xl-3');
        
        champions.forEach((champion, index) => {
            let championIDs = champion.querySelector('.card');
            let imgSources = championIDs.querySelector('.headshot').querySelector('img');

            let cardBody = championIDs.querySelector('.card-body');
            
            let cardTitle = cardBody.querySelector('.card-title');
            let cardText = cardBody.querySelector('.card-text');
            // let cardTags = cardBody.querySelectorAll('.badge');
            // let tagsArr = [];
            // cardTags.forEach(tag => {tagsArr.push(tag.innerHTML)});

            heroArray.push({
                index: index,
                enName: championIDs.id,
                zhName: cardTitle.innerHTML.split('-')[1].trim(),
                text: cardText.innerHTML,
                url: imgSources.src,
                // tags: cardTags
            })
        });

        //2.清除container
        document.querySelector("#container").innerHTML = "";
    });

    btnListHero.addEventListener("click", function () {
        if(heroArray.length==0){
            alert("請先建立陣列資料");
            return;
        }
        //alert("以文字迭代英雄人物資料！");
        heroArray.forEach(x => {
            let texts = document.createElement('p');
            texts.innerHTML = `index: ${x.index}, id: ${x.enName}, title:${x.zhName}, text: ${x.text}, url: ${x.url}`;
            result.append(texts);
        })
        
    });

    let hddd = [];

    btnTableHero.addEventListener("click", function(){
        if(heroArray.length==0){
            alert("請先建立陣列資料");
            return;
        }
        
        alert("以表格呈現英雄人物資料！");
        let table = document.createElement('table');
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        
        table.setAttribute('class', 'table table-bordered table-striped table-dark');
        
        let titleArray = []
        Object.keys(heroArray[0]).forEach(x => titleArray.push(x));
        let theadTR = document.createElement('tr');
        titleArray.forEach(title => {
            let th = document.createElement('th');
            th.innerHTML = title;
            theadTR.append(th);
        })
        tbody.append(theadTR);

        heroArray.forEach(hero => {
            
            let tbodyTR = document.createElement('tr');

            hddd = Array.from(hero);
            console.log(hero);

            let heroDatas = Object.keys(hero).map(key => hero[key]);
            heroDatas.forEach(data => {
                let td = document.createElement('td');
                td.innerHTML = data;
                tbodyTR.append(td);
            })
            tbody.append(tbodyTR);
        })
        table.append(tbody);
        result.append(table);

        // 路徑、索引、中文名、英文名、描述、標籤

    });
}
