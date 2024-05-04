const grid = document.getElementById("grid");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const confirmNameButton = document.getElementById("confirmName");
// const playerNameInput = document.getElementById("playerName");
// 修改为固定的玩家名称
const playerNameInput = { value: "Player" }; // 默认名称为Player
const difficultySelect = document.getElementById("difficulty");
let startTime, endTime, timerInterval, currentNumber, bestRecords = [];

document.addEventListener("DOMContentLoaded", function() {
    loadBestRecords();
    // 页面加载完毕后，不需要玩家确认名称，直接激活开始按钮
    startButton.disabled = false;
});

function generateGrid() {
    grid.innerHTML = "";
    const numbers = Array.from({length: 25}, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    numbers.forEach(number => {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.textContent = number;
        cell.addEventListener("click", handleClick);
        grid.appendChild(cell);
    });
    currentNumber = 1;
}

function handleClick(event) {
    const clickedNumber = parseInt(event.target.textContent);
    if (clickedNumber === currentNumber) {
        event.target.style.opacity = 0;
        currentNumber++;
        if (currentNumber > 25) {
            endTime = new Date();
            clearInterval(timerInterval);
            timerDisplay.style.color = "red";
            disableAllCells();  // 禁用所有方格的点击事件
            const totalTime = ((endTime - startTime) / 1000).toFixed(2);
            
            triggerConfetti();  // 立即触发散花效果

            // 确保散花效果开始展示后，再显示游戏完成的弹窗
            setTimeout(function() {
                if (totalTime <= parseFloat(difficultySelect.value)) {
                    alert(`完成游戏！用时：${totalTime}秒`);  // 显示弹窗
                    updateBestRecords(playerNameInput.value, totalTime, difficultySelect.options[difficultySelect.selectedIndex].text);
                } else {
                    alert(`时间超过限制，成绩不计入纪录`);
                }
            }, 100); // 延迟100ms或者更多，根据需要调整
        }
    } else {
        clearInterval(timerInterval);
        alert("哦豁～慌撒子嘛！再来一盘！");
        timerDisplay.textContent = "00:00.00";
        timerDisplay.style.color = "black";
    }
}

function updateTimer() {
    const timeElapsed = (new Date() - startTime) / 1000;
    const timeRemaining = parseFloat(difficultySelect.value) - timeElapsed;
    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        alert("时间到！");
        timerDisplay.textContent = "00:00.00";
        timerDisplay.style.color = "red";
        alert("时间超过限制，成绩不计入纪录");
    } else {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = Math.floor(timeRemaining % 60);
        const hundredths = Math.floor((timeRemaining % 1) * 100);
        timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
    }
}

// confirmNameButton.addEventListener("click", () => {
//     if (playerNameInput.value) {
//         alert(`欢迎，${playerNameInput.value}！`);
//         startButton.disabled = false;
//     } else {
//         alert("请输入玩家姓名！");
//     }
// });

startButton.addEventListener("click", () => {
    generateGrid(); // 生成棋盘
    startTime = new Date();
    timerDisplay.textContent = "00:00.00s";
    timerDisplay.style.color = "black";
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 10);

    // 新增代码：滚动到棋盘区域
    const gridArea = document.getElementById('grid');
    gridArea.scrollIntoView({
        behavior: 'smooth',  // 平滑滚动
        block: 'center'      // 棋盘居中
    });
});

function updateBestRecords(playerName, time, difficulty) {
    const newRecord = { playerName, time, difficulty };
    bestRecords.push(newRecord);
    bestRecords.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    bestRecords = bestRecords.slice(0, 5);
    updateBestRecordsList();
}

function loadBestRecords() {
    const storedRecords = localStorage.getItem("bestRecords");
    if (storedRecords) {
        bestRecords = JSON.parse(storedRecords);
        updateBestRecordsList();
    }
}

function saveBestRecords() {
    localStorage.setItem("bestRecords", JSON.stringify(bestRecords));
}

function updateBestRecordsList() {
    const recordsList = document.getElementById("bestRecords");
    recordsList.innerHTML = "";
    bestRecords.forEach(record => {
        const listItem = document.createElement("li");
        listItem.textContent = `${record.playerName}: ${record.time}秒 (${record.difficulty})`;
        recordsList.appendChild(listItem);
    });
}

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
    bestRecords = [];
    saveBestRecords();
    updateBestRecordsList();
});

function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 120,
        startVelocity: 30,
        decay: 0.95,
        scalar: 1.2,
        origin: { y: 0.7 },
        colors: ['#ff7eb9', '#a685e2', '#fed8b1', '#88e1f2', '#ff9a00', '#fff740', '#23bd73'],  // 七彩颜色配置
        shapes: ['circle', 'square'],
        ticks: 300,
        zIndex: 1000
    });
}

function disableAllCells() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}