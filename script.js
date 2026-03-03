/**
 * 燭籤 Lucky Candle | 孤芳小隊 最終穩定版
 */

// 1. 隨機祝福語資料庫
const blessings = [
    "天氣冷但你的床特別暖。", "手機沒電時剛好有插座。", "USB 插第一下就對。",
    "滑倒時沒人看到。", "隨機播放到想聽的音樂。", "想出門時天氣剛好轉晴。",
    "通勤路上一路綠燈。", "搭車都有位子。", "摩托車永遠有好車位停。",
    "下班時間永遠準點。", "提案一次過。", "公車司機願意多等你三秒。",
    "點外送永遠沒漏單。", "吃薯條永遠是脆的那包。", "買鹽酥雞永遠多送一塊。",
    "喜歡的人記得你講過的廢話。", "喜歡的人來按我限動讚。", "他居然記得你的生日。",
    "貓咪今天對你特別友善。", "遇到的貓貓都可以擼。", "鍋貼皮酥內嫩，沒有焦。",
    "洗衣服時襪子永遠成雙。", "透明膠帶每次都找得到頭。", "你放在口袋的衛生紙沒有被洗爛。",
    "吃東西掉下去的那一口剛好掉在包裝紙上。", "湯圓都不會破。", "公共廁所剛好剩下最後一張紙。",
    "你今天穿什麼都好看。", "忘帶雨傘時都不會下雨。", "GOSHARE帽子都不會臭。",
    "沒錢的日子，口袋裡摸到忘記的五百塊。", "喜歡的人主動問你在幹嘛。"
];

// 2. 狀態管理
let appData = {
    wish1: "",
    wish2: "",
    wishCustom: "",
    currentIdx: 0
};

/**
 * 啟動動畫與切換舞台
 */
function startAnimation() {
    document.getElementById('stage-init').classList.add('hidden');
    document.getElementById('stage-main').classList.remove('hidden');
    generateSlips();
    moveSlide(0); // 初始化位置
}

/**
 * 生成三張打火機籤詩
 */
function generateSlips() {
    const slider = document.getElementById('slips-slider');
    slider.innerHTML = "";
    
    // 隨機選取前兩張願望
    if (!appData.wish1) {
        let shuffled = [...blessings].sort(() => 0.5 - Math.random());
        appData.wish1 = shuffled[0];
        appData.wish2 = shuffled[1];
    }

    const config = [
        { cl: 'green', text: appData.wish1 },
        { cl: 'white', text: appData.wish2 },
        { cl: 'red',   text: appData.wishCustom || "點擊按鈕許願" }
    ];

    config.forEach(item => {
        const div = document.createElement('div');
        div.className = `slip ${item.cl}`;
        // 使用絕對定位的垂直文字
        div.innerHTML = `<span class="vertical-text">${item.text}</span>`;
        slider.appendChild(div);
    });
}

/**
 * 輪播控制：位移需對準 CSS 的 300px
 */
function moveSlide(dir) {
    appData.currentIdx = (appData.currentIdx + dir + 3) % 3;
    const slider = document.getElementById('slips-slider');
    slider.style.transform = `translateX(-${appData.currentIdx * 300}px)`;

    // 只有在紅色籤詩 (索引 2) 顯示許願按鈕
    const btn = document.getElementById('btn-wish-trigger');
    if (appData.currentIdx === 2) {
        btn.classList.remove('hidden-element');
    } else {
        btn.classList.add('hidden-element');
    }
}

/**
 * 顯示/隱藏許願彈窗
 */
function showInputOverlay() {
    document.getElementById('input-overlay').classList.remove('hidden');
}

/**
 * 確認自定義願望
 */
function confirmCustomWish() {
    const val = document.getElementById('custom-wish').value;
    appData.wishCustom = val.trim() || "平安順遂";
    document.getElementById('input-overlay').classList.add('hidden');
    generateSlips(); // 重新渲染文字
    appData.currentIdx = 2; // 強制停留再紅色
    moveSlide(0);
}

/**
 * 儲存圖片功能 (手機端加強版)
 */
function downloadShot() {
    const zone = document.getElementById('download-zone');
    const originalBtn = event.currentTarget;
    const originalText = originalBtn.innerText;
    
    originalBtn.innerText = "製作中...";

    html2canvas(zone, {
        backgroundColor: null,
        scale: 3, // 高清
        useCORS: true, // 支援跨域圖片
        logging: false
    }).then(canvas => {
        const imageData = canvas.toDataURL("image/png");

        // 建立預覽層，解決手機瀏覽器無法直接下載的問題
        const previewOverlay = document.createElement('div');
        previewOverlay.id = "preview-overlay";
        previewOverlay.style = "position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:999; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px;";
        
        previewOverlay.innerHTML = `
            <div style="text-align:center;">
                <img src="${imageData}" style="max-width:100%; max-height:70vh; border-radius:10px; box-shadow:0 0 20px rgba(0,0,0,0.5);">
                <p style="color:white; margin-top:15px; font-family:sans-serif;">☝️ 長按圖片即可儲存至相簿</p>
                <button onclick="document.body.removeChild(this.parentElement.parentElement)" 
                        style="margin-top:15px; padding:10px 30px; border-radius:20px; border:none; background:#fff; color:#333; font-weight:bold;">
                    返回網頁
                </button>
            </div>
        `;
        
        document.body.appendChild(previewOverlay);
        originalBtn.innerText = originalText;
    }).catch(err => {
        alert("截圖發生錯誤，請嘗試使用手機內建截圖");
        originalBtn.innerText = originalText;
    });
}

/**
 * 流程控制：前往結束畫面
 */
function goToFinish() {
    document.getElementById('stage-main').classList.add('hidden');
    document.getElementById('stage-finish').classList.remove('hidden');
}

/**
 * 重新啟動
 */
function resetAll() {
    location.reload();
}
