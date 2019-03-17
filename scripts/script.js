//**** DATA LOGIC *****//
  const game = {
    questions : [],
    totalQuestions : 0,
    correctAnswers : 0,
    currentQuestionNumber : 0,

    async startNewGame(category, difficulty, numQuestions) {
      this.resetStats();

      try { 
        const response = await $.ajax({
          url: "https://opentdb.com/api.php",
          method: "GET",
          dataType: "json",
          data: {
            amount : numQuestions,
            category,
            difficulty,
            type: "multiple"
          }
        });
        const data = response.results;
        
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

    guessAnswer(playerGuess, answerIndex) {
      playerGuess = parseInt(playerGuess, 10);

      if (playerGuess === answerIndex) {
        this.correctAnswers += 1;
        return true;
      } else {      
        return false;
      }
    },
  }

  $(function() {
    const gameArea = $(".game-area");
    
    //******* CONTROLLER LOGIC *******//
    //Click on start game logic.
    const setupGameControl = async () => {
      const playerName = $(".setup-name").val();
      const difficulty = $(".setup-difficulty").val();
      const category = $(".setup-categories").val();
      const numQuestions = $(".setup-number-questions").val(); 
      
      if(playerName) {
        try {
          await game.startNewGame(category, difficulty, numQuestions);//Initialize new game.
          game.totalQuestions = game.questions.length;    
          game.question = game.getQuestion();
          
          toggleHideHeader();
          renderGame(
            game.question, 
            playerName, 
            game.totalQuestions, 
            game.currentQuestionNumber
          );
          showMobileHeading();
        } catch(error){
          throw error;
        }
      } else {
        alert("Enter a name!");
        $(".setup-button").attr("disabled", false);
      }    
    }

    // Click on an answer logic
    const answerQuestionControl = (e) => {
      const button = e.target.closest(".question-answered");
      const answer = button.dataset.answer;
      const correctAnswerIndex = 
        game.question.allAnswers.indexOf(game.question.correctAnswer);
      const result = game.guessAnswer(answer, correctAnswerIndex);
      document.querySelectorAll(".question-answered").forEach(el => {
        el.classList.toggle("question-answered");
      })
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
        game.question = game.getQuestion();
        updateQuestionNumber(game.currentQuestionNumber, game.totalQuestions);
        renderNewQuestion(game.question);
      } else { //Game is over. Render game-over page on click.
        game.totalQuestions = parseInt(game.totalQuestions,10);
        const correctAnswerPerc = (game.correctAnswers/game.totalQuestions)*100;
        renderGameOver(game.correctAnswers, game.totalQuestions, correctAnswerPerc);
        toggleHideHeader();
      }
    }

    //***** EVENT LISTENERS ************// 
    gameArea.on("click", (e) => {
      e.preventDefault();
      
      //Click on an answer
      if(e.target.matches(".question-answered, .question-answered *")) {   
        answerQuestionControl(e);
       
        //Click on "Next Question"
        $(".question-next").on("click", () => {
          toggleQuestionNext();
          nextQuestionControl();      
        });   
      }

      //Click play again button. Render setup
      if(e.target.matches(".game-over-button")) {
        document.documentElement.scrollTop = 0;
        renderSetup();
      }
   
      //Click on start game
      if(e.target.matches(".setup-button")) {
        $(".setup-button").attr("disabled", true);
        setupGameControl();
      }
    });

    //******** VIEW LOGIC ********//
    //Creates each Answer button.
    const createAnswer = (answer, index) =>`
      <li class="question-list-item">
        <button class="question-answer-btn btn question-answered" data-answer="${index}">
          <span class="question-num">${index + 1}.</span> 
          <p class="question-answer">${answer}</p>
        </button>
      </li>
    `;

    //Renders Initial Game "board" start.
    const renderGame = (question, playerName, totalQuestionNum, currentQuestionNum) => {
      const markup = `
        <section class="question">
          <div class="wrapper question-wrapper">
            <div class="question-content">
              <h2 class="question-mobile-heading"></h2>
              <div class="question-header">
                <h2 class="question-count question-heading">Question ${currentQuestionNum}/${totalQuestionNum}</h2>
                <h2 class="question-correct-answers question-heading">Correct Answers: 0</h2>
                <p class="question-player-name question-heading">Player: ${playerName}</p>
              </div>
              
              <div class="question-box">
                <p class="question-question">${question.question}</p>
                <ul class="question-answers">
                ${question.allAnswers
                  .map((answer, index) => createAnswer(answer, index)).join("")} 
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
        <p class="question-question">${question.question}</p>
        <ul class="question-answers">
          ${question.allAnswers
           .map((answer, index) => createAnswer(answer, index)).join("")} 
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

    //* Hides Header if less than 900px */
    const toggleHideHeader = () => {
      if ($(window).width() < 900) {
        $(".header").toggleClass("hidden"); 
      }
    }

    //* Shows mobile header of questions section if less than 900x*//
    const showMobileHeading = () => {
      if ($(window).width() < 900) {
        $(".question-mobile-heading").text("Trivially Yours"); 
      }   
    }

    const updateViewScoreBtn = () => {
      $(".question-next").text("View score!");
    }

    const renderGameOverText = () => {
      $(".question-count").text("Game Over!");
    }

    //** Sets Button styles based on correct or wrong answer **//
    const setButtonAnswerStyles = (result, playerAnswer, correctAnswer) => {
      $(".question-answer-btn").attr("disabled", true);
   
      if(result) {
        $(`[data-answer="${playerAnswer}"]`).css("background-color", "green");
      } else {
        $(`[data-answer="${correctAnswer}"]`).css("background-color", "green");
        $(`[data-answer="${playerAnswer}"]`).css("background-color", "red");
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
        <section class="game-over">
          <div class="wrapper game-over-wrapper"> 
            <div class="game-over-top">
              <h2 class="game-over-heading">Game Over!</h2>
              <p class="game-over-stats">You got ${correctAnswers} out of ${totalQuestions}</p>
            </div>
            <div class="game-over-img-box">
              <img src=${imagePath} alt=${altText} class="game-over-img">
            </div>
            <div class="game-over-bottom">
              <p class="game-over-message">${scoreMessage}</p>
              <button class="game-over-button btn"> Play Again </button>
            </div>
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
                Enter Name
              </label>
              <input type="text" class="setup-name" name="name" id="setup-name">
              
              <label for="setup-number-questions" class="setup-label">
                Number of Questions
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
