const grid = document.getElementById("grid");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
const confirmNameButton = document.getElementById("confirmName");
const playerNameInput = document.getElementById("playerName");
const difficultySelect = document.getElementById("difficulty");
let startTime, endTime, timerInterval, currentNumber, bestRecords = [];

document.addEventListener("DOMContentLoaded", loadBestRecords);

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

// function handleClick(event) {
//     const clickedNumber = parseInt(event.target.textContent);
//     if (clickedNumber === currentNumber) {
//         event.target.style.opacity = 0;
//         currentNumber++;
//         if (currentNumber > 25) {
//             endTime = new Date();
//             clearInterval(timerInterval);
//             timerDisplay.style.color = "red";
//             const totalTime = ((endTime - startTime) / 1000).toFixed(2);
//             alert(`完成游戏！用时：${totalTime}秒`);
//             updateBestRecords(playerNameInput.value, totalTime, difficultySelect.options[difficultySelect.selectedIndex].text);
//         }
//     }
// }
function handleClick(event) {
    const clickedNumber = parseInt(event.target.textContent);
    if (clickedNumber === currentNumber) {
        event.target.style.opacity = 0;
        currentNumber++;
        if (currentNumber > 25) {
            endTime = new Date();
            clearInterval(timerInterval);
            timerDisplay.style.color = "red";
            const totalTime = ((endTime - startTime) / 1000).toFixed(2);
            if (totalTime <= parseFloat(difficultySelect.value)) {
                alert(`完成游戏！用时：${totalTime}秒`);
                updateBestRecords(playerNameInput.value, totalTime, difficultySelect.options[difficultySelect.selectedIndex].text);
            } else {
                alert(`时间超过限制，成绩不计入纪录`);
            }
        }
    } else {
        clearInterval(timerInterval);
        alert("哦豁～慌撒子嘛！再来一盘！");
        timerDisplay.textContent = "00:00.00";
        timerDisplay.style.color = "black";
    }
}

// function updateTimer() {
//     const timeElapsed = (new Date() - startTime) / 1000;
//     const timeRemaining = parseFloat(difficultySelect.value) - timeElapsed;
//     if (timeRemaining <= 0) {
//         clearInterval(timerInterval);
//         alert("时间到！");
//         timerDisplay.textContent = "00:00.00s";
//         timerDisplay.style.color = "red";
//     } else {
//         const minutes = Math.floor(timeRemaining / 60);
//         const seconds = Math.floor(timeRemaining % 60);
//         const hundredths = Math.floor((timeRemaining % 1) * 100);
//         timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${hundredths.toString().padStart(2, "0")}`;
//     }
// }
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

confirmNameButton.addEventListener("click", () => {
    if (playerNameInput.value) {
        alert(`欢迎，${playerNameInput.value}！`);
        startButton.disabled = false;
    } else {
        alert("请输入玩家姓名！");
    }
});

startButton.addEventListener("click", () => {
    generateGrid();
    startTime = new Date();
    timerDisplay.textContent = "00:00.00s";
    timerDisplay.style.color = "black";
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 10);
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
