const game = document.getElementById('game');
const basket = document.getElementById('basket');
const scoreboard = document.getElementById('scoreboard');
const gameOverText = document.getElementById('game-over');
const replayButton = document.getElementById('replay-button');

let basketX = window.innerWidth / 2;
let score = 0;
let gameRunning = true;
let fallSpeed = 2;
let bombProbability = 0.2;
let spawnInterval;

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'ArrowLeft') basketX -= window.innerWidth * 0.03;
    if (e.key === 'ArrowRight') basketX += window.innerWidth * 0.03;
    basketX = Math.max(0, Math.min(window.innerWidth - basket.offsetWidth, basketX));
    basket.style.left = `${basketX}px`;
});

function spawnFallingObject() {
    if (!gameRunning) return;
    for (let i = 0; i < 2; i++) {
    const obj = document.createElement('div');
    const isBomb = Math.random() < bombProbability;
    obj.classList.add('falling');
    obj.classList.add(isBomb ? 'bomb' : 'star');
    obj.style.left = Math.random() * (window.innerWidth - 30) + 'px';
    obj.style.top = '0px';
    game.appendChild(obj);

    let top = 0;
    const fall = setInterval(() => {
        if (!gameRunning) return clearInterval(fall);
        top += fallSpeed;
        obj.style.top = `${top}px`;

        const objRect = obj.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();

        if (
        objRect.bottom >= basketRect.top &&
        objRect.left < basketRect.right &&
        objRect.right > basketRect.left
        ) {
        clearInterval(fall);
        obj.remove();
        if (isBomb) {
            endGame();
        } else {
            score++;
            scoreboard.textContent = `Score: ${score}`;
        }
        } else if (objRect.top > window.innerHeight) {
        clearInterval(fall);
         obj.remove();
        }
    }, 16);
    }
}

function endGame() {
    gameRunning = false;
    gameOverText.style.display = 'block';
}

function startGame() {
    basketX = window.innerWidth / 2;
    basket.style.left = `${basketX}px`;
    score = 0;
    scoreboard.textContent = `Score: ${score}`;
    gameRunning = true;
    gameOverText.style.display = 'none';
    fallSpeed = 2;
    bombProbability = 0.2;

    spawnInterval = setInterval(spawnFallingObject, 1000);

    setTimeout(() => {
    fallSpeed = 4;
    bombProbability = 0.4;
    }, 15000);
}

replayButton.addEventListener('click', () => {
    document.querySelectorAll('.falling').forEach(el => el.remove());
    clearInterval(spawnInterval);
    startGame();
});

startGame();