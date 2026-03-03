const blessings = [ "天氣冷但你的床特別暖。", "手機沒電時剛好有插座。", "USB 插第一下就對。", "滑倒時沒人看到。", "隨機播放到想聽的音樂。", "想出門時天氣剛好轉晴。", "通勤路上一路綠燈。", "搭車都有位子。", "摩托車永遠有好車位停。", "下班時間永遠準點。", "提案一次過。", "公車司機願意多等你三秒。", "點外送永遠沒漏單。", "吃薯條永遠是脆的那包。", "買鹽酥雞永遠多送一塊。", "喜歡的人主動問你在幹嘛。" ];

let appData = { wish1: "", wish2: "", wishCustom: "", currentIdx: 0 };
let holdTimer = null;
const HOLD_TIME = 3000;

window.onload = () => {
    const candleArea = document.getElementById('candle-target');
    const marquee = document.getElementById('marquee-container');
    const touchZone = document.getElementById('touch-zone');

    // 長按邏輯
    const startHold = (e) => {
        if (!document.getElementById('stage-init').classList.contains('active')) return;
        e.preventDefault();
        candleArea.classList.add('charging');
        marquee.classList.add('active'); 
        holdTimer = setTimeout(triggerExplosion, HOLD_TIME);
    };

    const endHold = () => {
        clearTimeout(holdTimer);
        holdTimer = null;
        candleArea.classList.remove('charging');
        marquee.classList.remove('active'); 
    };

    candleArea.addEventListener('touchstart', startHold, { passive: false });
    candleArea.addEventListener('touchend', endHold);

    // 螢幕滑動切換籤紙
    let touchStartX = 0;
    touchZone.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    touchZone.addEventListener('touchend', (e) => {
        let touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) moveSlide(1);  // 向左滑，下一張
        if (touchEndX - touchStartX > 50) moveSlide(-1); // 向右滑，前一張
    }, { passive: true });
};

function triggerExplosion() {
    const offImg = document.getElementById('img-off');
    const onImg = document.getElementById('img-on');
    
    offImg.classList.add('hidden-img'); // 隱藏沒點燃的
    onImg.classList.remove('hidden-img'); // 顯示點燃的
    onImg.classList.add('explosion-effect'); // 執行 100%->0% 並放大的動畫
    
    // 等動畫結束後跳轉
    setTimeout(() => {
        document.getElementById('stage-init').classList.add('hidden');
        document.getElementById('stage-init').classList.remove('active');
        document.getElementById('stage-main').classList.remove('hidden');
        generateSlips();
    }, 1000);
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
        { cl: 'red',   text: appData.wishCustom || "點擊按鈕許願" }
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
    document.getElementById('slips-slider').style.transform = `translateX(-${appData.currentIdx * 320}px)`;
    
    const wishBtn = document.getElementById('wish-btn-container');
    // 如果在第三張 (紅色籤)，顯示許願按鈕
    if (appData.currentIdx === 2) wishBtn.classList.remove('hidden-element');
    else wishBtn.classList.add('hidden-element');
}

function formatText(text) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        result += text[i];
        if ((i + 1) % 12 === 0) result += "\n";
    }
    return result;
}

function showInputOverlay() { document.getElementById('input-overlay').classList.remove('hidden'); }

function confirmCustomWish() {
    const val = document.getElementById('custom-wish').value.trim();
    if (val) {
        appData.wishCustom = val;
        document.getElementById('input-overlay').classList.add('hidden');
        generateSlips(); // 重新生成，更新紅色籤文字
    }
}

function downloadShot() {
    const zone = document.getElementById('download-zone');
    html2canvas(zone, { scale: 3 }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const preview = document.createElement('div');
        preview.style = "position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;";
        preview.innerHTML = `<img src="${imgData}" style="max-width:100%; max-height:70vh; border-radius:10px;"><p style="color:white; margin-top:15px;">☝️ 長按圖片儲存</p><button onclick="document.body.removeChild(this.parentElement)" style="margin-top:15px; padding:12px 35px; border-radius:20px; border:none; background:#fff; font-weight:bold;">返回</button>`;
        document.body.appendChild(preview);
    });
}

function goToFinish() { 
    document.getElementById('stage-main').classList.add('hidden'); 
    document.getElementById('stage-finish').classList.remove('hidden'); 
}

function resetAll() { location.reload(); }
