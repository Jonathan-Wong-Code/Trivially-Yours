//**** DATA LOGIC *****//
const game = {
     questions : [],
     totalQuestions : 0,
     correctAnswers : 0,
     currentQuestionNumber : 0,

    async startNewGame(category, difficulty, numQuestions) {
      this.resetStats();

      try {
        // const response = await axios.get(`https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}`);

        const response = await axios.get("https://opentdb.com/api.php", {
          params : {
            amount : numQuestions,
            category,
            difficulty
          }
        });

        const data = response.data.results;
        
        data.forEach(question => {
          this.questions.push({
            question : question.question,
            correctAnswer : question.correct_answer,
            incorrectAnswers : question.incorrect_answers,
            allAnswers : [question.correct_answer, ...question.incorrect_answers]
          });
        });
      } catch (error) {
        throw error;
      }
    
      this.shuffleAnswers();  
    },

    resetStats() {
      this.questions = [];   
      this.correctAnswers = 0;
      this.currentQuestionNumber = 0;
      this.totalQuestions = 0;
    },

  //https://medium.com/@fyoiza/how-to-randomize-an-array-in-javascript-8505942e452 
  //Shuffle Algorthim
    shuffleAnswers() {
      this.questions.forEach(question => {
        let shuffledAnswers = [];
  
        while(question.allAnswers.length !== 0) {
          let randomIndex = Math.floor(Math.random()*question.allAnswers.length);
          shuffledAnswers.push(question.allAnswers[randomIndex]);
          question.allAnswers.splice(randomIndex,1);
        };
  
        question.allAnswers = shuffledAnswers;
      });  
    },

    getQuestion() {  
      const randomNum = Math.floor(Math.random() * this.questions.length);
      const returnedQuestion = this.questions[randomNum];

      this.questions.splice(randomNum, 1);  
      this.currentQuestionNumber += 1;
     
      return returnedQuestion;
    },

    guessAnswer(playerGuess, question) {
      const answerIndex = question.allAnswers.indexOf(question.correctAnswer);
      playerGuess = parseInt(playerGuess,10);
      if (playerGuess === answerIndex) {
        this.correctAnswers += 1;
        return true;
      } else {      
        return false;
      }
    },
  }

  $(function() {
    const state = {};
    const gameArea = $(".game-area");
    
    //******* CONTROLLER LOGIC *******//

    //Click on start game logic.
    const setupGameControl = async () => {
      const playerName = $(".setup-name").val();
      const difficulty = $(".setup-difficulty").val();
      const category = $(".setup-categories").val();
      const numQuestions = $(".setup-number-questions").val(); 
      
      try {
        await game.startNewGame(category, difficulty, numQuestions);//Initialize new game.
        game.totalQuestions = game.questions.length;    
        state.question = game.getQuestion();
  
        renderGame(
          state.question, 
          playerName, 
          game.totalQuestions, 
          game.currentQuestionNumber
        );
      } catch(error){
        throw error;
      }
    }

    // Click on an answer logic
    const answerQuestionControl = (e) =>{
      const button = e.target.closest(".question-answer-btn");
      const answer = button.dataset.answer;
      const result = game.guessAnswer(answer, state.question);
      const correctAnswerIndex = 
        state.question.allAnswers.indexOf(state.question.correctAnswer);

      updateScore(game.correctAnswers);
      setButtonAnswerStyles(result, answer, correctAnswerIndex);
      
      //If game over!
      if(game.questions.length === 0) {
        renderGameOverText();
        updateViewScoreBtn();
      }
     
      toggleQuestionNext();
    }

    //Click next question logic
    const nextQuestionControl = () => {
      if(game.questions.length > 0) { //If game isn't over. Display next question
        state.question = game.getQuestion();
        updateQuestionNumber(game.currentQuestionNumber, game.totalQuestions);
        renderNewQuestion(state.question);
      } else { //Game is over. Render game-over page on click.
        game.totalQuestions = parseInt(game.totalQuestions,10);
        const correctAnswerPerc = (game.correctAnswers/game.totalQuestions)*100;
        renderGameOver(game.correctAnswers, game.totalQuestions, correctAnswerPerc);
      }
    }

    //Event Listeners  
    gameArea.on("click", (e) => {
      e.preventDefault();

      //Click on an answer
      if(e.target.matches(".question-answer-btn")) {   
        answerQuestionControl(e);
       
        //When we click on "Next Question"
        $(".question-next").on("click", () =>{
          toggleQuestionNext();
          nextQuestionControl();      
        });   
      }

      //Click play again button. Render setup
      if(e.target.matches(".play-again-button")) {;
        renderSetup();
      }
   
      //Click on start game
      if(e.target.matches(".setup-button")) {
        $(".setup-button").attr("disabled", "true");
        setupGameControl();
      }
    });

    //******** VIEW LOGIC ********//

    //Creates each Answer button.
    const createAnswer = (answer, index) =>`
      <li class="question-list-item">
        <button class="question-answer-btn btn" data-answer='${index}'>
          ${index+1}. ${answer}
        </button>
      </li>
    `;

    //Renders Initial Game "board" start.
    const renderGame = (question, playerName, totalQuestionNum, currentQuestionNum) => {
      const markup = `
        <section class="question">
          <div class="wrapper">
            <div class="question-content">
              <div class="question-header">
                <h2 class="question-count question-heading">Question ${currentQuestionNum}/${totalQuestionNum}</h2>
                <h2 class="question-correct-answers question-heading">Correct Answers: 0</h2>
                <p class="question-player-name">Player: ${playerName}</p>
              </div>
              
              <div class="question-box">
                <h3 class="question-question">${question.question}</h3>
                <ul class="question-answers">
                ${question.allAnswers
                  .map((answer, index) => createAnswer(answer,index)).join('')} 
                </ul>
                <button class="question-next hidden btn">Next Question</button>
              </div>
            </div>
          </div>
        </section>
      `;
      gameArea.html(markup);   
    }

    //**Renders each new question**//
    const renderNewQuestion = (question) => {
      const markup= `
        <h3 class="question-question">${question.question}</h3>
        <ul class="question-answers">
          ${question.allAnswers
           .map((answer, index) => createAnswer(answer,index)).join('')} 
        </ul>
        <button class="question-next hidden btn">Next Question</button>  
      `; 
      $(".question-box").html(markup);
    }
  
    const updateScore = (correctAnswers) => {
      $(".question-correct-answers").text(`Correct Answers:${correctAnswers}`);
    }

    const updateQuestionNumber = (currentQuestionNum, totalQuestionNum) => {
      $(".question-count").text(`Question ${currentQuestionNum}/${totalQuestionNum}`);
    }

    const toggleQuestionNext = () => {
      $(".question-next").toggleClass("hidden");
    }

    const updateViewScoreBtn = () => {
      $(".question-next").text("View score!");
    }

    const renderGameOverText = () => {
      $(".question-count").text(`Game Over!`);
    }

    //** Sets Button styles based on correct or wrong answer **//
    const setButtonAnswerStyles = (result, playerAnswer, correctAnswer) => {
      $(".question-answer-btn").attr("disabled", "true");
   
      if(result) {
        $(`[data-answer='${playerAnswer}']`).css("background-color", "green");
      } else {
        $(`[data-answer='${correctAnswer}']`).css("background-color", "green");
        $(`[data-answer='${playerAnswer}']`).css("background-color", "red");
      }
    }

    //**Renders Game Over Screen **//
    const renderGameOver = (correctAnswers, totalQuestions, correctAnswersPerc) => {
      let imagePath, altText, scoreMessage;

      if (correctAnswersPerc === 100) {
        imagePath = "images/mexican-adam.gif";
        altText = "A picture of a young white male with a mexican hat";
        scoreMessage = "Wow you got a perfect score!";
      } else if (correctAnswersPerc < 100 && correctAnswersPerc >=50) {
        imagePath = "images/smiley.jpg";
        altText = "A smiley face emoji";
        scoreMessage = "Nice job! You got over half of them right!";
      } else {
        imagePath = "images/sad.jpg";
        altText = "A sad face emoji";
        scoreMessage = "Sadface. Less than half right!";
      }

      const markup = `
        <section class="play-again">
          <div class="play-again-top-text">
            <h2 class="play-again-heading">Game Over!</h2>
            <p class="play-again-stats">You got ${correctAnswers} out of ${totalQuestions}</p>
          </div>
          <div class="play-again-img-box">
            <img src=${imagePath} alt=${altText} class="play-again-img">
          </div>
          <div class="play-again-bottom">
            <p class="play-again-message">${scoreMessage}</p>
            <button class="play-again-button btn"> Play Again </button>
          </div>

        </section>
      `;
      gameArea.html(markup);  
    }

    //*RENDERS NEW GAME SCREEN*//

    const renderSetup = () => {
      const markup = `
        <section class="setup">
          <div class="wrapper">
            <form action="" class="setup-form">
              <label class="setup-label" for="setup-name">
                Name
              </label>
              <input type="text" class="setup-name" name="name" id="setup-name">
              
              <label for="setup-number-questions" class="setup-label">
                Choose number of questions!
              </label>
              <select name="questions" id="setup-number-questions" class="setup-number-questions">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>

              <label for="setup-difficulty" class="setup-label">
                Difficulty
              </label>
              <select name="difficulty" id="setup-difficulty" class="setup-difficulty">
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>  

              <label for="setup-categories" class="setup-label">
                Category
              </label>
              <select name="categories" id="setup-categories" class="setup-categories">
                <option value="9">General Knowledge</option>
                <option value="15">Video Games</option>
                <option value="11">Film</option>
                <option value="21">Sports</option>
                <option value="18">Computers</option>
                <option value="14">Television</option>
              </select>
              <button class="setup-button btn">Start Game!</button>
            </form>
          </div>
        </section>
      `;
      gameArea.html(markup);
    }    
  });