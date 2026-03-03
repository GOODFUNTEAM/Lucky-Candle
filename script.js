const blessings = [ "天氣冷但你的床特別暖。", "手機沒電時剛好有插座。", "USB 插第一下就對。", "滑倒時沒人看到。", "隨機播放到想聽的音樂。", "想出門時天氣剛好轉晴。", "通勤路上一路綠燈。", "搭車都有位子。", "摩托車永遠有好車位停。", "下班時間永遠準點。", "提案一次過。", "公車司機願意多等你三秒。", "點外送永遠沒漏單。", "吃薯條永遠是脆的那包。", "買鹽酥雞永遠多送一塊。", "喜歡的人主動問你在幹嘛。" ];

let appData = { wish1: "", wish2: "", wishCustom: "", currentIdx: 0 };
let holdTimer = null;
const HOLD_TIME = 5000;

window.onload = () => {
    const candleArea = document.getElementById('candle-target');
    const hint = document.getElementById('touch-hint');

    // 禁止系統預設選單
    candleArea.oncontextmenu = (e) => { e.preventDefault(); return false; };

    const startHold = (e) => {
        // 確保只在初始階段觸發
        if (!document.getElementById('stage-init').classList.contains('active')) return;
        
        e.preventDefault();
        candleArea.classList.add('charging');
        hint.innerText = "願望凝聚中...";
        
        clearTimeout(holdTimer);
        holdTimer = setTimeout(startAnimation, HOLD_TIME);
    };

    const endHold = () => {
        clearTimeout(holdTimer);
        candleArea.classList.remove('charging');
        if (document.getElementById('stage-init').classList.contains('active')) {
            hint.innerText = "按住蠟燭五秒，凝聚願望";
        }
    };

    // 觸控與滑鼠事件綁定 cite: script.js
    candleArea.addEventListener('touchstart', startHold, { passive: false });
    candleArea.addEventListener('touchend', endHold);
    candleArea.addEventListener('mousedown', startHold);
    candleArea.addEventListener('mouseup', endHold);
    candleArea.addEventListener('mouseleave', endHold);
};

function startAnimation() {
    const stageInit = document.getElementById('stage-init');
    stageInit.classList.remove('active');
    stageInit.classList.add('hidden');
    
    document.getElementById('stage-main').classList.remove('hidden');
    generateSlips();
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
        div.innerHTML = `<span class="vertical-text">${item.text}</span>`;
        slider.appendChild(div);
    });
    moveSlide(0);
}

function moveSlide(dir) {
    appData.currentIdx = (appData.currentIdx + dir + 3) % 3;
    document.getElementById('slips-slider').style.transform = `translateX(-${appData.currentIdx * 300}px)`;
    const btn = document.getElementById('btn-wish-trigger');
    if (appData.currentIdx === 2) btn.classList.remove('hidden-element');
    else btn.classList.add('hidden-element');
}

function showInputOverlay() { document.getElementById('input-overlay').classList.remove('hidden'); }

function confirmCustomWish() {
    appData.wishCustom = document.getElementById('custom-wish').value.trim() || "平安順遂";
    document.getElementById('input-overlay').classList.add('hidden');
    generateSlips();
}

function downloadShot() {
    const zone = document.getElementById('download-zone');
    html2canvas(zone, { backgroundColor: null, scale: 3, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const preview = document.createElement('div');
        preview.style = "position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;";
        preview.innerHTML = `<img src="${imgData}" style="max-width:100%; max-height:70vh; border-radius:10px;"><p style="color:white; margin-top:15px; font-family:sans-serif;">☝️ 長按圖片儲存至相簿</p><button onclick="document.body.removeChild(this.parentElement)" style="margin-top:15px; padding:10px 30px; border-radius:20px; border:none; background:#fff;">返回</button>`;
        document.body.appendChild(preview);
    });
}

function goToFinish() {
    document.getElementById('stage-main').classList.add('hidden');
    document.getElementById('stage-finish').classList.remove('hidden');
}

function resetAll() { location.reload(); }
