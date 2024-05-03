const grid = document.getElementById("grid");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const confirmNameButton = document.getElementById("confirmName");
const playerNameInput = document.getElementById("playerName");
const difficultySelect = document.getElementById("difficulty");
let timeRemaining, timerInterval, currentNumber;

// 生成随机数字表格
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
}

// 点击数字处理
function handleClick(event) {
    const clickedNumber = parseInt(event.target.textContent);
    if (clickedNumber === currentNumber) {
        event.target.style.visibility = "hidden";
        currentNumber++;
        if (currentNumber === 26) {
            clearInterval(timerInterval);
            timerDisplay.style.color = "red";
            // 将成绩提交到数据库 (此处仅为示例)
            console.log("游戏结束！", playerNameInput.value, "用时:", timerDisplay.textContent); 
        }
    }
}

// 更新计时器
function updateTimer() {
    timeRemaining -= 0.01;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = Math.floor(timeRemaining % 60);
    const hundredths = Math.floor((timeRemaining % 1) * 100);
    timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        alert("时间到！");
    } 
}

// 开始游戏
function startGame() {
    currentNumber = 1;
    generateGrid();
    timeRemaining = parseInt(difficultySelect.value);
    timerDisplay.textContent = "00:00.00";
    timerDisplay.style.color = "black";
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 10);
}

// 确认玩家姓名
confirmNameButton.addEventListener("click", () => {
    if (playerNameInput.value) {
        alert(`欢迎，${playerNameInput.value}！`);
        startButton.disabled = false;
    } else {
        alert("请输入玩家姓名！");
    }
});

// 开始按钮事件
startButton.addEventListener("click", startGame);

// 初始化
startButton.disabled = true;