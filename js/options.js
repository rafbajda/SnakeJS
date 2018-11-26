const myForm = document.getElementById("myForm");
const optionsAudio = document.getElementById("optionsAudio");

function onInit() {
    if (!localStorage.getItem('config')) {
        myForm[0].checked = true;
        myForm[1].checked = true;
        myForm[2].value = "white";
        myForm[3].value = "green";
        myForm[4].value = "0";
        document.querySelector('input[name="customRadioInline"]').value = "1";
        document.querySelector(`input[id=customRadioInline1]`).checked = true;
        saveConfig();
    } else {
        const config = JSON.parse(localStorage.getItem('config'));
        console.log(myForm);
        myForm[0].checked = config.musicMenu;
        myForm[1].checked = config.musicGame;
        myForm[2].value = config.snakeBodyColor;
        myForm[3].value = config.snakeHeadColor;
        myForm[4].value = config.sizeOfWindow;
        document.querySelector('input[name="customRadioInline"]').value = config.difficultyLevel;
        document.querySelector(`input[id=customRadioInline${config.difficultyLevel}]`).checked = true;
    }
    const config = JSON.parse(localStorage.getItem('config'));
    if (config.musicMenu) {
        optionsAudio.currentTime = 0;
        optionsAudio.play();
    }
}

onInit();

function saveConfig() {
    const {
        musicMenu,
        musicGame,
        snakeBodyColor,
        snakeHeadColor,
        sizeOfWindow,
        difficultyLevel,
    } = {
        musicMenu: myForm[0].checked,
        musicGame: myForm[1].checked,
        snakeBodyColor: myForm[2].value,
        snakeHeadColor: myForm[3].value,
        sizeOfWindow: myForm[4].value,
        difficultyLevel: document.querySelector('input[name="customRadioInline"]:checked').value

    };

    localStorage.setItem('config', JSON.stringify({
        musicMenu,
        musicGame,
        snakeBodyColor,
        snakeHeadColor,
        sizeOfWindow,
        difficultyLevel,
    }));
}