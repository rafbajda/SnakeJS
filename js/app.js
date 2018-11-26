const button = document.getElementById("play");
const score = document.getElementById("score");
const canvas = document.getElementById("draw-board");

let size = 500;
let headColor = "green";
let bodyColor = "white";
let speed = 1000;
let playMusic = false;
let snakeSong1 = document.getElementById("myAudio"); 
let snakeSong2 = document.getElementById("myAudio2");

const ctx = canvas.getContext("2d");

var state = {
    gameover: true,
    direction: 2,
    snake: [
        { x: 10, y: 10, direction: 2 },
        { x: 10, y: 20, direction: 2 },
        { x: 10, y: 30, direction: 2 }
    ],
    food: { x: 0, y: 0 },
    score: 0
};

function drawSnakePart(ctx, x, y, head = false) {
    ctx.fillStyle = head ? headColor : bodyColor;
    ctx.fillRect(x, y, 10, 10);
}

function drawFood(ctx, x, y) {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x + 5, y + 5, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function drawBackground() {
    ctx.fillStyle = "tan";
    ctx.fillRect(0, 0, size, size);
}

function drawSnake() {
    for (let i = state.snake.length - 1; i >= 0; --i) {
        drawSnakePart(ctx, state.snake[i].x, state.snake[i].y, i === 0);
    }
}

function mod(m, val) {
    while (val < 0) {
        val += m;
    }
    return val % m;
}

function addPart() {
    let tail = state.snake[state.snake.length - 1];
    let direction = tail.direction;
    let x = tail.x;
    let y = tail.y;

    switch (direction) {
        // DOWN
        case 1:
            y = mod(size, y - 10);
            break;
        // UP
        case -1:
            y = mod(size, y + 10);
            break;
        // LEFT
        case -2:
            x = mod(size, x + 10);
            break;
        // RIGHT
        case 2:
            x = mod(size, x - 10);
            break;
    }
    state.snake.push({ x, y, direction });
}

function eatFood() {
    //   Head position
    let x = state.snake[0].x;
    let y = state.snake[0].y;
    //   Tail Position
    let fx = state.food.x;
    let fy = state.food.y;
    // if head and food are at same position
    if (x == fx && y == fy) {
        //     increase score
        state.score++;
        //     change score text
        score.innerHTML = "Score: " + state.score;
        //     Add a snake part
        addPart();
        //     Generate a new Food
        generateFood();
    }
}

function moveSnake() {
    //    NEW HEAD Coordinates
    let x = state.snake[0].x;
    let y = state.snake[0].y;
    // Snake Direction
    switch (state.direction) {
        //DOWN - Move 1 box down
        case 1:
            y = mod(size, y + 10);
            break;
        //UP - Move 1 box up
        case -1:
            y = mod(size, y - 10);
            break;
        //LEFT - Move 1 box left
        case -2:
            x = mod(size, x - 10);
            break;
        //RIGHT - Move 1 box right
        case 2:
            x = mod(size, x + 10);
            break;
    }
    const newSnake = [{ x, y, direction: state.direction }];
    const snakeLength = state.snake.length;
    for (let i = 1; i < snakeLength; ++i) {
        newSnake.push({ ...state.snake[i - 1] });
    }
    state.snake = newSnake;
}

function checkGameOver() {
    const head = state.snake[0];
    return state.snake.some(
        (part, i) => i !== 0 && head.x === part.x && head.y === part.y
    );
}

function generateFood() {
    let x = Math.floor(Math.random() * size / 10) * 10;
    let y = Math.floor(Math.random() * size / 10) * 10;
    while (state.snake.some(part => part.x === x && part.y === y)) {
        x = Math.floor(Math.random() * size / 10) * 10;
        y = Math.floor(Math.random() * size / 10) * 10;
    }
    state.food = { x, y };
}

var start = 0;
function draw(timestamp) {
    start++;
    if (timestamp - start > speed / 10) {
        if (checkGameOver()) {
            state.gameover = true;
            snakeSong1.pause();
            snakeSong1.currentTime=0;
            snakeSong2.pause();
            snakeSong2.currentTime=0;
            const currentHighscore = JSON.parse(localStorage.getItem('highscore'));
            if (!currentHighscore || state.score > currentHighscore) {
                localStorage.setItem('highscore', JSON.stringify(state.score));
                alert('Amazing! You have highscore!')
            }
            return;
        }
        if(state.score > 10 && playMusic){
            snakeSong1.pause();
            snakeSong1.currentTime=0;
            snakeSong2.play();
        }
        moveSnake();
        drawBackground();
        drawFood(ctx, state.food.x, state.food.y);
        drawSnake();
        eatFood();
        start = timestamp;
    }
    if (!state.gameover) window.requestAnimationFrame(draw);
}

document.addEventListener("keydown", event => {
    event.preventDefault();
    let direction = 0;
    switch (event.key) {
        case "s":case"ArrowDown":
            direction = 1;
            break;
        case "w":case "ArrowUp":
            direction = -1;
            break;
        case "a":case "ArrowLeft":
            direction = -2;
            break;
        case "d":case "ArrowRight":
            direction = 2;
            break;
    }
    if (
        //     if direction is changed
        direction &&
        //     if snake direction and current direction are same
        state.direction === state.snake[0].direction &&
        //     and the directions are not oposite to current direction i.e LEFT and RIGHT or UP and DOWN
        state.direction !== -direction
    ) {
        //     Change the direction
        state.direction = direction;
    }
});

function loadData() {
    if (localStorage.getItem('config')) {
        let config = JSON.parse(localStorage.getItem('config'));
        console.log("Initial data: ",config.musicGame);
        console.log("Initial data: ",config.sizeOfWindow);

        playMusic = config.musicGame;
        headColor = config.snakeHeadColor;
        bodyColor = config.snakeBodyColor;
        switch(parseInt(config.sizeOfWindow)){
            case 0:
            size=300;
            break;
            case 1:
            size=400;
            break;
            case 2:
            size=500;
            break;
            case 3:
            size=600;
            break;
            case 4:
            size=700;
            break;
        }
        canvas.width = size; // in pixels
        canvas.height = size; // in pixels
        switch(parseInt(config.difficultyLevel)){
            case 1:
            speed=5000;
            break;
            case 2:
            speed=3000;
            break;
            case 3:
            speed=1000;
            break;
            case 4:
            speed=600;
            break;
            case 5:
            speed=100;
            break;
        }
    }
    else{
        console.log("No data loaded");
    }
}
play.onclick = function () {

    if (state.gameover) {
        state = {
            gameover: false,
            direction: 2,
            snake: [
                { x: 10, y: 10, direction: 2 },
                { x: 10, y: 20, direction: 2 },
                { x: 10, y: 30, direction: 2 }
            ],
            food: { x: 0, y: 0 },
            score: 0
        };
        loadData();

        if(playMusic)
            snakeSong1.play();
        score.innerHTML = "Score: " + 0;
        generateFood();
        window.requestAnimationFrame(draw);
    }
};