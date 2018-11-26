const {
    menuAudio,
    highscoreHeader,
} = {
    menuAudio: document.getElementById('menuAudio'),
    highscoreHeader: document.getElementById('highscoreHeader'),
};


function menuOpen() {
    let config = JSON.parse(localStorage.getItem('config'));
    if (!config) {
        config = {
            musicMenu: true,
            musicGame: true,
            snakeBodyColor: 'white',
            snakeHeadColor: 'green',
            sizeOfWindow: "0",
            difficultyLevel: "1",
        };
        localStorage.setItem('config', JSON.stringify(config));
    }
    if (config.musicMenu) {
        menuAudio.currentTime = 0;
        menuAudio.play();
    }

    const highscore = JSON.parse(localStorage.getItem('highscore'));
    highscoreHeader.innerText = highscore ? `Current Highscore: ${highscore}`: `Current Highscore: 0`
}

menuOpen();