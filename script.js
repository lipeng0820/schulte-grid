const grid = document.getElementById("grid");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const confirmNameButton = document.getElementById("confirmName");
// const playerNameInput = document.getElementById("playerName");
// 修改为固定的玩家名称
const playerNameInput = { value: "Player" }; // 默认名称为Player
const difficultySelect = document.getElementById("difficulty");
let startTime, endTime, timerInterval, currentNumber, bestRecords = [];
let gameActive = true;  // 新增一个标志，用来表示游戏是否进行中

document.addEventListener("DOMContentLoaded", function() {
    renderPlaceholderGrid(); // 渲染占位棋盘
    loadBestRecords();
    startButton.disabled = false; // 页面加载完毕后，激活开始按钮
    restoreDifficultySelection(); // 恢复用户之前的难度选择

    document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
        radio.addEventListener('change', function() {
            localStorage.setItem('selectedDifficulty', this.value);  // 保存用户选择的难度到 localStorage
        });
    });
});

function restoreDifficultySelection() {
    const savedDifficulty = localStorage.getItem('selectedDifficulty');
    if (savedDifficulty) {
        const radios = document.querySelectorAll('input[name="difficulty"]');
        radios.forEach(radio => {
            if (radio.value === savedDifficulty) {
                radio.checked = true;  // 设置为选中
            }
        });
    }
}

function renderPlaceholderGrid() {
    grid.innerHTML = "";
    for (let i = 0; i < 25; i++) { // 创建25个灰色方格
        const cell = document.createElement("div");
        cell.classList.add("grid-cell", "placeholder");
        grid.appendChild(cell);
    }
}

function generateGrid() {
    grid.innerHTML = "";
    const numbers = Array.from({length: 25}, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];  // 洗牌算法，用于打乱数字顺序
    }
    numbers.forEach(number => {
        const cell = document.createElement("div");
        cell.classList.remove("placeholder");  // 移除占位类，确保数字方格没有灰色背景
        cell.classList.add("grid-cell");
        cell.textContent = number;
        cell.addEventListener("click", handleClick);
        grid.appendChild(cell);
    });
    currentNumber = 1;
}

function handleClick(event) {
    if (!gameActive) return;  // 如果游戏不活跃，不处理点击事件
    const clickedNumber = parseInt(event.target.textContent);
    if (event.target.style.opacity === "0") return;  // 如果方块已经是不可见的，直接返回，不处理事件

    if (clickedNumber === currentNumber) {
        event.target.style.opacity = 0;
        currentNumber++;
        if (currentNumber > 25) {
            endTime = new Date();
            clearInterval(timerInterval);
            timerDisplay.style.color = "red";
            disableAllCells();
            const totalTime = ((endTime - startTime) / 1000).toFixed(2);
            triggerConfetti();
            setTimeout(function() {
                if (totalTime <= parseFloat(difficultySelect.value)) {
                    alert(`完成游戏！用时：${totalTime}秒`);
                    updateBestRecords(playerNameInput.value, totalTime, difficultySelect.options[difficultySelect.selectedIndex].text);
                } else {
                    alert(`时间超过限制，成绩不计入纪录`);
                }
                resetButtonState();  // 重置按钮状态
                renderPlaceholderGrid(); // 游戏成功完成后重新渲染占位棋盘
            }, 100);
        }
    } else {
        gameOver("哦豁～慌撒子嘛！再来一盘！"); // 游戏失败，更改按钮状态，并提供错误点击的反馈
    }
}

function updateTimer() {
    if (!gameActive) return;  // 如果游戏已经结束，直接返回，防止多余的弹窗

    const timeElapsed = (new Date() - startTime) / 1000;
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const timeRemaining = parseFloat(selectedDifficulty) - timeElapsed;

    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        gameOver("时间到!成绩不计入纪录"); // 合并消息并调用 gameOver
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
    gameActive = true;  // 每次开始游戏时重置游戏为活跃状态
    resetButtonState();  // 重置按钮状态
    generateGrid(); // 生成棋盘
    startTime = new Date();
    timerDisplay.textContent = "00:00.00";
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

// 当游戏失败或时间到时
function gameOver(reason) {
    if (!gameActive) return;  // 防止重复调用 gameOver

    alert(reason);  // 确保传入的 reason 有效
    gameActive = false;
    endGame();
    startButton.textContent = "重新挑战";
    startButton.style.backgroundColor = "orange";
}

// 游戏成功后重置按钮状态
function resetButtonState() {
    startButton.textContent = "开始挑战";
    startButton.style.backgroundColor = "#0099ff"; // 海蓝色
}

function endGame() {
    clearInterval(timerInterval);
    timerDisplay.textContent = "00:00.00";
    timerDisplay.style.color = "black";
    renderPlaceholderGrid();  // 游戏结束后重新渲染占位棋盘
    disableAllCells();        // 禁用所有方格的点击事件
}
