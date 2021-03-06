let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};

// BUG - click deux fois a la fin du questionaire pour passer a la scene de fin! 

let game = new Phaser.Game(config);
let backgroundImage;
let answerImage = [];
let answerText = [];
let answerNumber = 3;
let questionImage;
let playButtonImage;
let currentQuestionIndex = 0;

let score = 0;


let welcomeImage, quizText, welcomeText, menuImage, restartImage;

let quizzString; // = '{ "questions": [ { "title": "Quel célèbre dictateur dirigea l’URSS du milieu des années 1920 à 1953 ?", "answers": ["Lenine", "Staline", "Molotov"], "goodAnswerIndex" : 1 }, {"title": "Ma deuxième question", "answers": ["Réponse 0", "Réponse 1", "Réponse 2"],"goodAnswerIndex" : 0}]}';
let quizz; // = JSON.parse(quizzString);


/*
let quizz = { "questions": [ 
    { 
        "title": "Quel célèbre dictateur dirigea l’URSS du milieu des années 1920 à 1953 ?", 
        "answers": [
            "Lenine", 
            "Staline", 
            "Molotov"], 
        "goodAnswerIndex" : 1 }, 
    {
        "title": "Ma deuxième question", 
        "answers": [
            "Réponse 0", 
            "Réponse 1", 
            "Réponse 2"],
            "goodAnswerIndex" : 0}
        ]
    };
*/

function preload() {
    this.load.image('background', './assets/Sprites/background.png');
    this.load.image('labelquestion', './assets/Sprites/label1.png');
    this.load.image('labelanswer', './assets/Sprites/label2.png');
    this.load.image('play', './assets/Sprites/play.png');

    this.load.json('questions', './assets/data/MyQuestions.json');


    this.load.image('blackboard', './assets/sprites/blackboard.png');
    this.load.image('menu', './assets/sprites/menu.png');
    this.load.image('restart', './assets/sprites/restart.png')

    loadFont("FFFTusj", "./assets/Fonts/FFF_Tusj.ttf");
    loadFont("ArapeyReg", "./assets/Fonts/arapey-regular.ttf");
    loadFont("Desyrel", "./assets/Fonts/desyrel.ttf");


}

function create() {
    quizz = this.cache.json.get('questions');
    backgroundImage = this.add.image(0, 0, 'background');
    backgroundImage.setOrigin(0, 0);
    backgroundImage.setScale(0.5);

    // build HOME SCREEN
    welcomeImage = this.add.image(300, 280, 'blackboard');
    welcomeImage.setScale(0.4);
    quizText = this.add.text(130, 132, "Test De Personalité", { fontFamily: "FFFTusj", fontSize: 35, color: ' #ffffff ' });
    welcomeText = this.add.text(70, 230, "Pousser sur le bouton pour commencer le quiz.", { fontFamily: 'desyrel', fontSize: 23, color: ' #000000 ' });
    menuImage = this.add.image(300, 340, 'menu').setInteractive();
    menuImage.setScale(0.5);
    menuImage.on('pointerdown', displayGameScreen);
    // menuImage.on('pointerover', function(pointer){
    //     showText = this.add.text(300, 340, "test", { fontFamily: 'Arial', fontSize: 20, color: ' #000000 ' });
    // })
    welcomeImage.setVisible(true);
    quizText.setVisible(true);
    welcomeText.setVisible(true);
    menuImage.setVisible(true);

    // GAME OVER SCREEN
    restartImage = this.add.image(300, 340, 'restart').setInteractive();
    restartImage.setScale(0.5);
    restartImage.on('pointerdown', restartGame);
    restartImage.setVisible(false);

    // quizz questions and answers
    questionImage = this.add.image(300, 100, 'labelquestion');
    questionImage.setScale(0.7);
    questionImage.setVisible(false);
    for (let i = 0; i < quizz.questions[0].answers.length; i++) {
        answerImage[i] = this.add.image(300, 220 + i * 115, 'labelanswer').setInteractive();
        answerImage[i].on('pointerdown', () => { checkAnswer(i) });
        answerImage[i].setScale(1.7, 1.0);
        answerImage[i].setVisible(false);
    }
    questionText = this.add.text(80, 60, quizz.questions[0].title, { fontFamily: 'ArapeyReg', fontSize: 20, color: ' #ffffff ' });
    questionText.setVisible(false);
    for (let i = 0; i < quizz.questions[0].answers.length; i++) {
        answerText[i] = this.add.text(100, 190 + i * 115, quizz.questions[0].answers[i], { fontFamily: 'ArapeyReg', fontSize: 18, color: ' #000000' });
        answerText[i].setVisible(false);
    }

    playButtonImage = this.add.image(300, 530, 'play').setInteractive();
    playButtonImage.on('pointerdown', displayNextQuestion);
    playButtonImage.setScale(0.3);
    playButtonImage.setVisible(false); // playButtonImage.alpha = 0;



}

function update() { }

function checkAnswer(answerIndex) {
    if (answerIndex == 0) score++; // rep A = 1 
    //if (answerIndex == 1) score ++; // rep B = 0
    if (answerIndex == 2) score += 2;   // rep C 2 

    playButtonImage.setVisible(true);   // playButtonImage.alpha = 1;
    for (let i = 0; i < 3; i++) {
        answerImage[i].disableInteractive();
        if (i == answerIndex) answerText[i].setColor('#00ff00');

    }
}

function displayNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex > quizz.questions.length) {
        displayGameOver();
    }
    else {
        questionText.text = quizz.questions[currentQuestionIndex].title;
        for (let i = 0; i < 3; i++) {
            answerText[i].text = quizz.questions[currentQuestionIndex].answers[i];
            answerText[i].setColor("#000000");
        }
        playButtonImage.setVisible(false);
        for (let i = 0; i < 3; i++) answerImage[i].setInteractive();
    }
}

function displayGameScreen() {
    welcomeImage.setVisible(false);
    quizText.setVisible(false);
    welcomeText.setVisible(false);
    menuImage.setVisible(false);

    questionImage.setVisible(true);
    questionText.setVisible(true);

    for (let i = 0; i < quizz.questions[0].answers.length; i++) {
        answerImage[i].setVisible(true);
        answerText[i].setVisible(true);
    }
}

function displayGameOver() {
    welcomeImage.setVisible(true);
    quizText.setVisible(true);
    welcomeText.setVisible(true);
    restartImage.setVisible(true);

    if (score > 45) {
        welcomeText.text = "Votre score est de " + score + ".\nVotre score indique que vous savez très bien gérer \nvotre stress. Vous êtes très probablement perçu(e) \ncomme quelqu’un de très détendu presque toujours \ncapable de garder le sens des proportions. \nCependant, cette prédisposition tout à fait appréciable\n ne doit pas vous empêcher de vous préparer aux \nsituations stressantes qui ne manqueront pas \nde se présenter. Vous devriez arriver à gérer \nces facteurs de stress imprévus en les anticipant. \nN’oubliez pas non plus que le stress peut être positif\n puisqu’il nous pousse à réagir et à nous dépasser.";
    }
    else if (score > 31) {
        welcomeText.text = "Votre score est de " + score + ".\nVous avez un score de plus 31 points.";
    }
    else {
        welcomeText.text = "Votre score est de " + score + ".\nVous avez un score de moins de 30 points.";
    }

    playButtonImage.setVisible(false);
    questionImage.setVisible(false);
    questionText.setVisible(false);

    for (let i = 0; i < quizz.questions[0].answers.length; i++) {
        answerImage[i].setVisible(false);
        answerText[i].setVisible(false);
    }
}

function restartGame() {
    currentQuestionIndex = -1;
    displayNextQuestion();
    restartImage.setVisible(false);
    displayGameScreen();
    score = 0;
}

function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}

/*

- quizz
    - question []
        -title (string)
        -answer [] (string)
        -goodAnswerIndex (int)

Implémentation dans :
    - une Base de données
    - CSV
    - XML
    - JSON
    - YAML

XML :
    <quizz>
        <question>
            <title>la première question ?</title>
            <answer i="0"> Réponse 0</answer>
            <answer i="1"> Réponse 1</answer>
            <answer i="2"> Réponse 2</answer>
            <goodAnswerIndex>1</goodAnswerIndex>
        </question>
    </quizz>

YAML :
    quizz :
        question :
            title : "La première question"
            answer : "Réponse 0"
            goodAnswerIndexAnswerIndex : 1
        question :
            title : "La première question"
            answer : "Réponse 0"
            goodAnswerIndexAnswerIndex : 0

JSON :
    {
        "questions":[
            {
                "title": "Ma premère question",
                "answer": ["réponse 0", "Réponse 1"],
                "goodAnswerIndex" : 1
            },
            {
 */