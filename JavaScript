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

let appData = { wish1: "", wish2: "", wishCustom: "" };

function startAnimation() {
    document.getElementById('stage-init').classList.add('hidden');
    document.getElementById('stage-interact').classList.remove('hidden');
    setTimeout(() => { document.querySelector('.candle-split-wrapper').classList.add('open'); }, 100);
    setTimeout(() => { generateSlips('slips-container'); }, 1200);
    setTimeout(() => { document.getElementById('input-overlay').classList.remove('hidden'); }, 2500);
}

function generateSlips(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    let shuffled = [...blessings].sort(() => 0.5 - Math.random());
    appData.wish1 = shuffled[0];
    appData.wish2 = shuffled[1];

    const config = [
        { class: 'green', text: appData.wish1 },
        { class: 'white', text: appData.wish2 },
        { class: 'red',   text: appData.wishCustom || "（留白給自己）" }
    ];

    config.forEach(item => {
        const slip = document.createElement('div');
        slip.className = `slip ${item.class}`;
        const span = document.createElement('span');
        span.className = "vertical-text";
        span.innerText = item.text;
        slip.appendChild(span);
        container.appendChild(slip);
    });
}

function confirmCustomWish() {
    const val = document.getElementById('custom-wish').value;
    appData.wishCustom = val || "心想事成";
    document.getElementById('input-overlay').classList.add('hidden');
    
    setTimeout(() => {
        document.getElementById('stage-interact').classList.add('hidden');
        document.getElementById('stage-summary').classList.remove('hidden');
        generateSlips('final-slips');
    }, 500);
}

function downloadShot() {
    html2canvas(document.getElementById('download-zone'), { backgroundColor: '#1a1a1a' }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'LuckyCandle.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function wishing() {
    document.getElementById('final-slips').classList.add('fly-away');
    setTimeout(() => {
        document.getElementById('stage-summary').classList.add('hidden');
        document.getElementById('stage-finish').classList.remove('hidden');
    }, 1200);
}

function resetAll() { location.reload(); }
