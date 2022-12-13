

let introForm = document.querySelector('.question');
let btns = document.querySelectorAll('.btn:not(button[disabled="true"])');
let questionMsg = document.querySelector('#msg');

function focusMain(){
    introForm.style.display = 'none';
    questionMsg.innerHTML = '';
    btns.forEach(x => x.disabled = false);
}

function focusWindow(date){
    introForm.style.display = 'flex';
    questionMsg.innerHTML = setQuestionMsg(date);
}
function setQuestionMsg(date){
    if (date == 'Nov21'){
        return '下方排圖片的區塊是強制賦予明確的高度值，再令大圖的高度值是100%。原是以此來解決圖片寬度可能超格而蓋住左右各三欄的情形；但如此可能難以適應整體高度的改變（例如將內容由三欄變成五欄，而間距維持原樣），反而是高度會超格。目前完成的畫面在固定寬高之視窗下，外觀雖然大致接近預期，但可能不靈活，難以適應版面內容的改動。<br><br>問題匯總：<br><br>問題：.item設定flex之後圖片被拉伸<br>解決方案：將h3和p預設的margin設為0，高度即恢復預期（可推測其隨著文字內容被拉伸）<br><br>問題：.item設定space-evenly之後無法拓開間隔<br>解決方案：在外層的.box設定space-evenly（因此是選取到錯誤的物件）<br><br>問題：container（整體）的寬度固定，拉動視窗時（毫不意外地）會在螢幕寬時不美觀<br>解決方案：width: 100%; 其餘寬度盡量改成比例<br><br>問題：寬度改成比例之後，小圓圖會被文字拉伸<br>解決方案：設定小圓圖的max-width和max-height<br><br>問題：小物件的title和p隔太開<br>解決方案：title的margin-bottom和p的margin-top: 0;<br>衍生的問題：由於title和p的高度本身不一致（未reset），造成文字相對於圖片略有錯位<br>解決方案：把title和p的margin都設為0，再將text（title和p的父層）的margin設auto<br>';
    }
    else if (date == 'Nov28'){
        return '整體排版依賴flex，較大程度是以個人透過電腦目視之尺寸來排版，加上有不少部分是直接將寬度或高度寫死；因此若螢幕寬度稍有不同，可能就會有比例或尺寸不符預期的情況發生。要言之，目前排版使用的方案可能較不靈活。<br>另外，由於是將整個版面切成橫向的各部分分開做，而這些部分可能有不少重複的樣式，以各自的選擇器設定樣式，因此可能有不少冗餘程式碼的問題，有待未來進一步精簡與重構。<br><br>問題：「正版」whoscall的&lt;footer&gt;文字列的標題title與列表各項的文字間距不等寬，若使用flex直接排列無法直接實現。<br>解決方案：將列表各項設為&lt;li&gt;並打包成一整個&lt;ul&gt;，令flex作用於title與&lt;ul&gt;之間，並用行高控制&lt;li&gt;各項的距離。<br><br>問題：將&lt;footer&gt;的寬度設成100%難以調整列表物件間的間距，而若非100%則又無法填滿背景顏色。<br>解決方案：將&lt;footer&gt;設背景色且寬度設為100%，並將物件另外打包成.wrap，接著對.wrap設定適合的寬度。<br><br>問題：引號的圖片本身與預期（即「正版」whoscall網頁中該圖的方向）左右顛倒。<br>解決方案：使用{ transform: rotateY(180deg); }實現水平鏡像翻轉。<br><br>問題：最上方的標題列設{ position: fixed; z-index: 1; }（老師說此處不用隨著畫面捲動，但此處還是試著做了）後，banner左上的圓弧往上移到標題列後方。<br>解決方案：設該圓弧的margin-top為標題列的高度，即80px。<br><br>（另外，其實有3個小時都在處理footer右側那4個icon的顏色和尺寸問題，以及如何經由Font Awesome引用那些icon。這些時間也算進了總時數）<br><br>';
    }
    else if (date == 'Dec05'){
        return '問題：圖文子標題highlight的部分超格（<a class="in-question" href="https://i.imgur.com/okKUyYL.jpeg">如圖</a>）<br>解決方案：h3設line-height: normal;解決（但是不清楚原因）<br><br>問題：用戶經驗分享內文highlight的部分稍微超格（<a class="in-question" href="https://i.imgur.com/Ke0uZJN.jpeg">如圖</a>）<br>解決方案：尚未解決。設定line-height無用<br><br>';
    }
    else if (date == 'Dec08'){
        return '問題集：<br><br>問題1：黑紅底色標題區的定位問題相關結構簡圖：<br>&lt;.gray /&gt;（灰色方塊）<br><br>&lt;.img&gt;（大圖區）<br>&emsp;&lt;.appeal&gt;（黑紅底色標題區）<br>&emsp;&emsp;&lt;.title /&gt;（紅底標題）<br>&emsp;&emsp;&lt;.txt /&gt;（黑底內文）<br>&emsp;&lt;/&gt;<br><br>&emsp;&lt;.explain /&gt;（說明內文）<br>&emsp;&lt;.icon-play /&gt;（播放鍵）<br>&lt;/&gt;<br><br>&emsp;思考：將內文.txt與大圖區.img切齊，預想也許標題區.appeal會隨著子層被移動而移動<br>&emsp;問題1-1：將黑底內文.txt設絕對定位，令其top為0與大圖容器切齊；而紅底標題卻留在原地，沒有隨著移動<br>&emsp;發現：黑底內文.txt該層單獨脫離空間自由移動，因此必須將絕對定位設給整個黑紅底色標題區.appeal，才能同時定位<br>&emsp;解決方案：設整個黑紅底色標題區.appeal為絕對定位。此時紅底標題上緣切齊大圖上緣，仍未達到目的<br><br>&emsp;思考：若設.appeal絕對定位，如何將.txt黑底切齊大圖？思考利用transform將.title往上移的可能性<br>&emsp;問題1-2：將.title設定transform: translate(0, -100%);使其往上平移一段相當於自身高度的距離；但原地會留出空白<br>&emsp;發現：使用translate移動.title後，仍然佔據著原先所在的空間，造成.title與.txt間留著一段相當於.title高度的距離<br>&emsp;解決方案：設定.title的position為inherit（繼承），使其可以拉著內文往上跑；如此達成高度未寫死，且內容可隨意增減，畫面仍然切齊的目的<br><br>思考：.title設定inherit實際上繼承了.appeal的絕對定位，不清楚是否算用掉1個或是2個扣打。此處假設用掉2個，只剩1個扣打<br>問題2：是否有辦法只使用1個絕對定位，便能將灰色方塊.gray、說明內文.explain和播放鍵.icon-play都移動到指定位置？<br>發現：整體寬度為960px的情況下，.explain貼齊左緣，而.gray貼齊右緣。考慮定位的方便性，嘗試將該兩物件設定相對定位<br>解決方案：.explain設相對定位，top為-10%，左或右為-160px；.gray設相對定位，top為180px，margin-left or right為auto；而icon-play使用絕對定位。綜上所述，該三物件僅使用1個絕對定位便達成目的<br><br>最終結構：<br>&lt;.gray /&gt;（相對 relative）<br><br>&lt;.img&gt;（相對 relative）<br>&emsp;&lt;.appeal&gt;（絕對 absolute）<br>&emsp;&emsp;&lt;.title /&gt;（繼承 inherit）<br>&emsp;&emsp;&lt;.txt /&gt;<br>&emsp;&lt;/&gt;<br><br>&emsp;&lt;.explain /&gt;（相對 relative）<br>&emsp;&lt;.icon-play /&gt;（絕對 absolute）<br>&lt;/&gt;';
    }

    return '無內容';
}