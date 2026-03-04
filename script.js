// --- [請填寫此處] Google 表單設定 ---
const GOOGLE_FORM_ID = "這裡請填入你的表單長ID"; 
const WISH_ENTRY_ID = "entry.1237601643"; // 這是你剛才找到的 ID

// --- 祝福語庫 ---
const blessings = [ "天氣冷但你的床特別暖。", "手機沒電時剛好有插座。", "USB 插第一下就對。", "滑倒時沒人看到。", "隨機播放到想聽的音樂。", "想出門時天氣剛好轉晴。", "通勤路上一路綠燈。", "搭車都有位子。", "摩托車永遠有好車位停。", "下班時間永遠準點。", "提案一次過。", "公車司機願意多等你三秒。", "點外送永遠沒漏單。", "吃薯條永遠是脆的那包。", "買鹽酥雞永遠多送一塊。", "喜歡的人主動問你在幹嘛。" ];

let appData = { wish1: "", wish2: "", wishCustom: "", currentIdx: 0 };
let holdTimer = null;
const HOLD_TIME = 3000;

window.onload = () => {
    const candleArea = document.getElementById('candle-target');
    const touchZone = document.getElementById('touch-zone');
    const marquee = document.getElementById('marquee-container');

    const startHold = (e) => {
        if (!document.getElementById('stage-init').classList.contains('active')) return;
        e.preventDefault();
        candleArea.classList.add('charging');
        marquee.classList.add('active'); 
        document.getElementById('touch-hint').innerText = "願望凝聚中...";
        holdTimer = setTimeout(triggerExplosion, HOLD_TIME);
    };

    const endHold = () => {
        clearTimeout(holdTimer);
        holdTimer = null;
        candleArea.classList.remove('charging');
        marquee.classList.remove('active'); 
        if (document.getElementById('stage-init').classList.contains('active')) {
            document.getElementById('touch-hint').innerText = "按住蠟燭三秒，凝聚願望";
        }
    };

    candleArea.addEventListener('touchstart', startHold, { passive: false });
    candleArea.addEventListener('touchend', endHold);
    candleArea.addEventListener('mousedown', startHold);
    candleArea.addEventListener('mouseup', endHold);

    let touchStartX = 0;
    touchZone.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    touchZone.addEventListener('touchend', (e) => {
        let touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) moveSlide(1);
        else if (touchEndX - touchStartX > 50) moveSlide(-1);
    }, { passive: true });
};

function formatText(text) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        result += text[i];
        if ((i + 1) % 12 === 0) result += "\n";
    }
    return result;
}

function triggerExplosion() {
    document.getElementById('img-off').classList.add('hidden-img');
    const imgOn = document.getElementById('img-on');
    imgOn.classList.remove('hidden-img');
    imgOn.classList.add('explosion-effect');
    
    setTimeout(() => {
        document.getElementById('stage-init').classList.add('hidden');
        document.getElementById('stage-init').classList.remove('active');
        document.getElementById('stage-main').classList.remove('hidden');
        generateSlips();
    }, 800);
}

function generateSlips() {
    const slider = document.getElementById('slips-slider');
    slider.innerHTML = "";
    if (!appData.wish1) {
        let shuffled = [...blessings].sort(() => 0.5 - Math.random());
        appData.wish1 = shuffled[0]; appData.wish2 = shuffled[1];
    }
    const config = [
        { cl: 'green', text: appData.wish1 },
        { cl: 'white', text: appData.wish2 },
        { cl: 'red',   text: appData.wishCustom || "點擊下方按鈕許願" }
    ];
    config.forEach(item => {
        const div = document.createElement('div');
        div.className = `slip ${item.cl}`;
        div.innerHTML = `<span class="vertical-text">${formatText(item.text)}</span>`;
        slider.appendChild(div);
    });
    moveSlide(0);
}

function moveSlide(dir) {
    appData.currentIdx = (appData.currentIdx + dir + 3) % 3;
    document.getElementById('slips-slider').style.transform = `translateX(-${appData.currentIdx * 300}px)`;
    
    const wishBtn = document.getElementById('wish-btn-container');
    if (appData.currentIdx === 2) {
        wishBtn.style.display = "block";
    } else {
        wishBtn.style.display = "none";
    }
}

function downloadShot() {
    const zone = document.getElementById('download-zone');
    html2canvas(zone, { scale: 3, backgroundColor: "#ffffff", useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const preview = document.createElement('div');
        preview.style = "position:fixed; inset:0; background:rgba(0,0,0,0.95); z-index:999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;";
        preview.innerHTML = `
            <img src="${imgData}" style="max-width:100%; max-height:75vh; border-radius:10px; border: 4px solid white;">
            <p style="color:white; margin-top:15px; font-weight:bold;">☝️ 長按圖片儲存至相簿</p>
            <button onclick="document.body.removeChild(this.parentElement)" style="margin-top:15px; padding:12px 40px; border-radius:25px; border:none; background:#fff; font-family:'JinXuan'; font-weight:bold;">返回</button>
        `;
        document.body.appendChild(preview);
    });
}

function showInputOverlay() { document.getElementById('input-overlay').classList.remove('hidden'); }

function confirmCustomWish() {
    const val = document.getElementById('custom-wish').value.trim();
    if (val) {
        appData.wishCustom = val;
        document.getElementById('input-overlay').classList.add('hidden');
        generateSlips();
    }
}

// --- 修正後的願望收集邏輯 ---
function goToFinish() { 
    const finalWish = appData.wishCustom || "未填寫願望";
    const formUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
    
    const params = new URLSearchParams();
    params.append(WISH_ENTRY_ID, finalWish);

    // 背景靜默傳送
    fetch(formUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
    }).catch(e => console.log("Silent error:", e));

    // 直接跳轉畫面
    document.getElementById('stage-main').classList.add('hidden'); 
    document.getElementById('stage-finish').classList.remove('hidden'); 
}

function resetAll() { location.reload(); }
