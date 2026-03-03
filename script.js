const blessings = [ "天氣冷但你的床特別暖。", "手機沒電時剛好有插座。", "USB 插第一下就對。", "滑倒時沒人看到。", "隨機播放到想聽的音樂。", "想出門時天氣剛好轉晴。", "通勤路上一路綠燈。", "搭車都有位子。", "摩托車永遠有好車位停。", "下班時間永遠準點。", "提案一次過。", "公車司機願意多等你三秒。", "點外送永遠沒漏單。", "吃薯條永遠是脆的那包。", "買鹽酥雞永遠多送一塊。", "喜歡的人來按我限動讚。", "貓咪今天對你特別友善。", "遇到的貓貓都可以擼。", "洗衣服時襪子永遠成雙。", "透明膠帶每次都找得到頭。", "你放在口袋的衛生紙沒有被洗爛。", "吃東西掉下去的那一口剛好掉在包裝紙上。", "湯圓都不會破。", "公共廁所剛好剩下最後一張紙。", "你今天穿什麼都好看。", "忘帶雨傘時都不會下雨。", "GOSHARE帽子都不會臭。", "沒錢的日子，口袋裡摸到忘記的五百塊。", "喜歡的人主動問你在幹嘛。" ];

let appData = { wish1: "", wish2: "", wishCustom: "", currentIdx: 0 };
let holdTimer = null;
const HOLD_TIME = 3000;

// 滑動偵測變數
let touchStartX = 0;
let touchEndX = 0;

window.onload = () => {
    const candleArea = document.getElementById('candle-target');
    const hint = document.getElementById('touch-hint');
    const marquee = document.getElementById('marquee-container');
    const touchZone = document.getElementById('touch-zone');

    // 1. 長按邏輯
    candleArea.oncontextmenu = (e) => { e.preventDefault(); return false; };

    const startHold = (e) => {
        if (!document.getElementById('stage-init').classList.contains('active')) return;
        e.preventDefault();
        candleArea.classList.add('charging');
        marquee.classList.add('active');
        hint.innerText = "願望凝聚中...";
        holdTimer = setTimeout(startAnimation, HOLD_TIME);
    };

    const endHold = () => {
        clearTimeout(holdTimer);
        candleArea.classList.remove('charging');
        marquee.classList.remove('active');
        if (document.getElementById('stage-init').classList.contains('active')) {
            hint.innerText = "按住蠟燭三秒，凝聚願望";
        }
    };

    candleArea.addEventListener('touchstart', startHold, { passive: false });
    candleArea.addEventListener('touchend', endHold);
    candleArea.addEventListener('mousedown', startHold);
    candleArea.addEventListener('mouseup', endHold);

    // 2. 滑動切換邏輯
    touchZone.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    touchZone.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
};

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance > 50) { // 向右滑，看前一張
        moveSlide(-1);
    } else if (swipeDistance < -50) { // 向左滑，看下一張
        moveSlide(1);
    }
}

function startAnimation() {
    document.getElementById('stage-init').classList.remove('active');
    document.getElementById('stage-init').classList.add('hidden');
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
    
    const wishBtnContainer = document.getElementById('wish-btn-container');
    const wishBtn = document.querySelector('.btn-wish-effect');

    if (appData.currentIdx === 2) {
        wishBtnContainer.classList.remove('hidden-element');
        wishBtn.classList.add('breathing-glow');
        wishBtnContainer.style.height = "auto";
        wishBtnContainer.style.opacity = "1";
    } else {
        wishBtn.classList.remove('breathing-glow');
        wishBtnContainer.style.height = "0";
        wishBtnContainer.style.opacity = "0";
        // 延遲隱藏避免動畫生硬
        setTimeout(() => {
            if (appData.currentIdx !== 2) wishBtnContainer.classList.add('hidden-element');
        }, 300);
    }
}

function showInputOverlay() { document.getElementById('input-overlay').classList.remove('hidden'); }

function confirmCustomWish() {
    const val = document.getElementById('custom-wish').value.trim();
    appData.wishCustom = val || "平安順遂";
    document.getElementById('input-overlay').classList.add('hidden');
    generateSlips();
}

function downloadShot() {
    const zone = document.getElementById('download-zone');
    html2canvas(zone, { backgroundColor: null, scale: 3, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const preview = document.createElement('div');
        preview.style = "position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;";
        preview.innerHTML = `<img src="${imgData}" style="max-width:100%; max-height:70vh; border-radius:10px;"><p style="color:white; margin-top:15px; font-family:sans-serif;">☝️ 長按圖片儲存至相簿</p><button onclick="document.body.removeChild(this.parentElement)" style="margin-top:15px; padding:10px 30px; border-radius:20px; border:none; background:#fff; color:#333; font-weight:bold; font-family:'JinXuan';">返回網頁</button>`;
        document.body.appendChild(preview);
    });
}

function goToFinish() {
    document.getElementById('stage-main').classList.add('hidden');
    document.getElementById('stage-finish').classList.remove('hidden');
}

function resetAll() { location.reload(); }
