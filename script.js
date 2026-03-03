// ...前面的 blessings 陣列保持不變 ...

function startAnimation() {
    // 切換 Stage
    document.getElementById('stage-init').classList.remove('active');
    document.getElementById('stage-init').classList.add('hidden');
    
    const interactStage = document.getElementById('stage-interact');
    interactStage.classList.remove('hidden');
    interactStage.classList.add('active');
    
    setTimeout(() => { document.querySelector('.candle-split-wrapper').classList.add('open'); }, 100);
    setTimeout(() => { generateSlips('slips-container'); }, 800);

    setTimeout(() => {
        const btn = document.getElementById('btn-trigger-input');
        btn.classList.remove('invisible');
        btn.style.opacity = "1";
        btn.style.pointerEvents = "auto";
    }, 2000);
}

function confirmCustomWish() {
    const val = document.getElementById('custom-wish').value;
    appData.wishCustom = val.trim() || "平安順遂";
    document.getElementById('input-overlay').classList.add('hidden');
    
    // 切換到下載階段
    document.getElementById('stage-interact').classList.replace('active', 'hidden');
    const summaryStage = document.getElementById('stage-summary');
    summaryStage.classList.remove('hidden');
    summaryStage.classList.add('active');
    
    generateSlips('final-slips');
}

function goToFinish() {
    document.getElementById('stage-summary').classList.replace('active', 'hidden');
    const finishStage = document.getElementById('stage-finish');
    finishStage.classList.remove('hidden');
    finishStage.classList.add('active');
}

// ...其餘 generateSlips, downloadShot 保持不變 ...
