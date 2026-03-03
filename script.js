/**
 * 燭籤 Lucky Candle - 孤芳小隊
 * 完整 JavaScript 邏輯
 */

// 1. 32 條隨機祝福語資料庫
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

// 2. 全域變數存儲狀態
let appData = {
    wish1: "",        // 隨機願望1 (綠色)
    wish2: "",        // 隨機願望2 (白色)
    wishCustom: "",   // 使用者輸入 (紅色)
    currentIdx: 0     // 當前輪播索引 (0, 1, 2)
};

/**
 * 初始化動畫：點擊大蠟燭觸發
 */
function startAnimation() {
    // 切換舞台
    document.getElementById('stage-init').classList.replace('active', 'hidden');
    document.getElementById('stage-main').classList.remove('hidden');
    document.getElementById('stage-main').classList.add('active');
    
    // 初始化隨機內容並生成標籤
    generateSlips();
    
    // 預設滑動到第一張
    moveSlide(0);
}

/**
 * 生成或重新生成三張打火機標籤
 */
function generateSlips() {
    const slider = document.getElementById('slips-slider');
    slider.innerHTML = ""; // 清空舊內容
    
    // 如果是第一次生成，隨機選取前兩條
    if (!appData.wish1) {
        let shuffled = [...blessings].sort(() => 0.5 - Math.random());
        appData.wish1 = shuffled[0];
        appData.wish2 = shuffled[1];
    }

    const config = [
        { class: 'green', text: appData.wish1 },
        { class: 'white', text: appData.wish2 },
        { class: 'red',   text: appData.wishCustom || "許下最後一個願望" }
    ];

    config.forEach(item => {
        const slip = document.createElement('div');
        slip.className = `slip ${item.class}`;
        
        const span = document.createElement('span');
        span.className = "vertical-text";
        span.innerText = item.text;
        
        slip.appendChild(span);
        slider.appendChild(slip);
    });
}

/**
 * 輪播切換邏輯
 * @param {number} dir - 滑動方向 (1 或 -1)
 */
function moveSlide(dir) {
    // 更新索引 (循環 0, 1, 2)
    appData.currentIdx = (appData.currentIdx + dir + 3) % 3;
    
    const slider = document.getElementById('slips-slider');
    // 280 是 CSS 中 .slip 的固定寬度
    const offset = appData.currentIdx * 280;
    slider.style.transform = `translateX(-${offset}px)`;

    // 邏輯控制：只有切換到第 3 張 (紅色，索引為 2) 時才顯示「許下願望」按鈕
    const wishBtn = document.getElementById('btn-wish-trigger');
    if (appData.currentIdx === 2) {
        wishBtn.classList.remove('hidden-element');
    } else {
        wishBtn.classList.add('hidden-element');
    }
}

/**
 * 顯示輸入願望的彈窗
 */
function showInputOverlay() {
    document.getElementById('input-overlay').classList.remove('hidden');
}

/**
 * 確認輸入自定義願望
 */
function confirmCustomWish() {
    const val = document.getElementById('custom-wish').value;
    if (val.trim() !== "") {
        appData.wishCustom = val.trim();
        
        // 關閉彈窗並更新畫面
        document.getElementById('input-overlay').classList.add('hidden');
        
        // 重新渲染打火機文字
        generateSlips();
        
        // 強制位置停留在第三張 (紅色)
        appData.currentIdx = 2;
        moveSlide(0);
    } else {
        alert("請輸入願望內容");
    }
}

/**
 * 下載截圖功能
 * 僅截取當前顯示在 carousel-window 中的打火機
 */
function downloadShot() {
    const zone = document.getElementById('download-zone');
    
    // 使用 html2canvas 進行高品質截圖
    html2canvas(zone, {
        backgroundColor: null, // 背景透明，保留 CSS 設定
        scale: 3,             // 3倍縮放確保金喧體文字不模糊
        useCORS: true,        // 允許跨域資源 (如果圖片在其他網址)
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        const fileName = `燭籤_第${appData.currentIdx + 1}款.png`;
        link.download = fileName;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

/**
 * 送出願望：進入最後一個結束畫面
 */
function goToFinish() {
    document.getElementById('stage-main').classList.replace('active', 'hidden');
    document.getElementById('stage-finish').classList.remove('hidden');
    document.getElementById('stage-finish').classList.add('active');
}

/**
 * 再來一次：重整頁面
 */
function resetAll() {
    location.reload();
}

// 監聽鍵盤 (可選)：支援電腦左右鍵切換
document.addEventListener('keydown', (e) => {
    if (document.getElementById('stage-main').classList.contains('active')) {
        if (e.key === 'ArrowLeft') moveSlide(-1);
        if (e.key === 'ArrowRight') moveSlide(1);
    }
});
