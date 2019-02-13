const game = {
     questions : [],
     totalQuestions : 0,
     correctAnswers : 0,
     currentQuestionNumber : 0,

    async startNewGame(category, difficulty,numQuestions) {

      this.resetStats();

      const response = await axios.get(`https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}`);
      const data = response.data.results;
      
      data.forEach((question => {
        this.questions.push({
          question : question.question,
          correctAnswer : question.correct_answer,
          incorrectAnswers : question.incorrect_answers,
          allAnswers : [question.correct_answer, ...question.incorrect_answers]
        });
      }));

      this.shuffleAnswers();
      
    },

    resetStats() {
      this.questions = [];   
      this.correctAnswers = 0;
      this.currentQuestionNumber =0;
    },

  //https://medium.com/@fyoiza/how-to-randomize-an-array-in-javascript-8505942e452 
  //Shuffle Algorthim
    shuffleAnswers() {
      this.questions.forEach((question) => {
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
      this.currentQuestionNumber +=1;
     
      return returnedQuestion;
    },

    guessAnswer(playerGuess, question) {
      //We have to use index instead of text value due to ' and special characters in API.
      const answerIndex = question.allAnswers.indexOf(question.correctAnswer);
      playerGuess = parseInt(playerGuess,10);
      if(playerGuess === answerIndex) {
        this.correctAnswers +=1;
        return true;
      } else {      
        return false;
      }
    },
  }

  $(function() {
    const state = {};
    const gameArea = $(".game-area");
  
    const setupGameControl = async () => {
      const playerName = $(".setup-name").val();
      const difficulty = $(".setup-difficulty").val();
      const category = $(".setup-categories").val();
      const numQuestions = $(".setup-number-questions").val(); 
     
      await game.startNewGame(category, difficulty, numQuestions);
     
      game.totalQuestions = game.questions.length;    
      state.question = game.getQuestion();
    
      renderGame(
        state.question, 
        playerName, 
        game.totalQuestions, 
        game.currentQuestionNumber
      );
      // $(".answer-btn").on("click", function(){
      //   console.log(this);
      //   clearQuestionArea();
      //   state.question = game.getQuestion();
      //   renderNewQuestion(state.question);
      //   console.log("logged");
      // });
    }
    //Event Listeners

    // $(".setup-form").on("submit", (e)=>{
    //   e.preventDefault();
    //   setupGameControl(e);
    // });  
    gameArea.on("click", (e) =>{
      e.preventDefault();

      if(e.target.matches(".answer-btn")) {
        const button = e.target.closest(".answer-btn");
        const answer = button.dataset.answer;
        const result = game.guessAnswer(answer, state.question);
        const showNextQuestionBtn =  $(".question-next");
        const correctAnswerIndex = 
          state.question.allAnswers.indexOf(state.question.correctAnswer);

        updateScore(game.correctAnswers);
        setButtonAnswerStyles(result, answer, correctAnswerIndex);
        
        if(game.questions.length === 0) {
          renderGameOverText();
          updateViewScoreBtn();
        }
        //Show next question button
        showNextQuestionBtn.toggleClass("hidden");
        
        //When we click on "Next Question"
        showNextQuestionBtn.on("click", () =>{
          showNextQuestionBtn.toggleClass("hidden");
     
          if(game.questions.length > 0) {
            state.question = game.getQuestion();
            updateQuestionNumber(game.currentQuestionNumber, game.totalQuestions);
            renderNewQuestion(state.question);
          } else {
            game.totalQuestions = parseInt(game.totalQuestions,10);
            const correctAnswerPerc = (game.correctAnswers/game.totalQuestions)*100;
            renderPlayAgain(game.correctAnswers, game.totalQuestions, correctAnswerPerc);
          }  
        });   
      }

      if(e.target.matches(".play-again-button")) {;
        renderSetup();
      }
   
      if(e.target.matches(".setup-button")) {
        setupGameControl();
      }
    });

    //******** View Logic ********//

    //Creates each Answer button from question mapping.
    const createAnswer = (answer, index) =>`
      <li>
        <button class="level-question-answer-one answer-btn" data-answer='${index}'>
          ${index+1}. ${answer}
        </button>
      </li>
    `;

    //Renders Initial Game "board" start.
    const renderGame = (question, playerName, totalQuestionNum, currentQuestionNum) => {
      const markup = `
        <section class="question">
          <div class="wrapper">
            <div class="question-header">
              <h2 class="question-count">Question ${currentQuestionNum}/${totalQuestionNum}</h2>
              <h3 class="question-correct-answers">Correct Answers: 0</h3>
              <p>Player: ${playerName}!</p>
            </div>
            
            <div class="question-box">
              <h3 class="question-question">${question.question}</h3>
              <ul class="level-question-answers">
              ${question.allAnswers
                .map((answer, index) => createAnswer(answer,index)).join('')} 
              </ul>
              <button class="question-next hidden">Next Question</button>
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
        <ul class="level-question-answers">
          ${question.allAnswers
           .map((answer, index) => createAnswer(answer,index)).join('')} 
        </ul>
        <button class="question-next hidden">Next Question</button>  
      `; 
      $(".question-box").html(markup);
    }
  
    const updateScore = (correctAnswers) => {
      $(".question-correct-answers").text(`Correct Answers:${correctAnswers}`);
    }

    const updateQuestionNumber = (currentQuestionNum,totalQuestionNum) =>{
      $(".question-count").text(`Question ${currentQuestionNum}/${totalQuestionNum}`);
    }

    const updateViewScoreBtn = () =>{
      $(".question-next").text("View score!");
    }

    const renderGameOverText = () => {
      $(".question-count").text(`Game Over!`);
    }

    //** Sets Button styles based on correct or wrong answer **//
    const setButtonAnswerStyles = (result, playerAnswer, correctAnswer) => {
      $(".answer-btn").attr("disabled", "true");
   
      if(result){
        $(`[data-answer='${playerAnswer}']`).css("background-color", "green");
      } else {
        $(`[data-answer='${correctAnswer}']`).css("background-color", "green");
        $(`[data-answer='${playerAnswer}']`).css("background-color", "red");
      }
    }

    //**RENDERS PLAY AGAIN SCREEN **//
    const renderPlayAgain = (correctAnswers, totalQuestions, correctAnswersPerc) => {
      let imagePath, altText, scoreMessage;

      if(correctAnswersPerc === 100) {
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
            <p class="play-again-message">${scoreMessage} </p>
            <button class="play-again-button"> Play Again </button>
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
  

