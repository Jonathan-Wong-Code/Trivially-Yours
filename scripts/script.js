const game = {
     questions : [],
     totalQuestions : 0,
     correctAnswers : 0,
     currentQuestionNumber : 0,
     win : false,

    async startNewGame(category, difficulty,numQuestions){
      this.questions = [];   
      const response = await axios.get(`https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}`);
       
      const data = response.data.results;
      
      data.forEach((question =>{
        this.questions.push({
          question : question.question,
          correctAnswer : question.correct_answer,
          incorrectAnswers : question.incorrect_answers,
          allAnswers : [question.correct_answer, ...question.incorrect_answers]
        });
      }));

      this.shuffleAnswers();
      this.correctAnswers = 0 
     
    },

  //https://medium.com/@fyoiza/how-to-randomize-an-array-in-javascript-8505942e452 
  //Shuffle Algorthim
    shuffleAnswers(){
      this.questions.forEach((question) =>{
        let shuffledAnswers = [];
  
        while(question.allAnswers.length !== 0){
          let randomIndex = Math.floor(Math.random()*question.allAnswers.length);
          shuffledAnswers.push(question.allAnswers[randomIndex]);
          question.allAnswers.splice(randomIndex,1);
        };
  
        question.allAnswers= shuffledAnswers;
      });  
    
    },

    getQuestion(){  
      const randomNum = Math.floor(Math.random() * this.questions.length);
      const returnedQuestion = this.questions[randomNum];

      this.questions.splice(randomNum, 1);  
      this.currentQuestionNumber +=1;
     
      return returnedQuestion;
    },

    guessAnswer(playerGuess, question){
      console.log(question);
      //If the player guess index = the correct answer index question is right!
      if(playerGuess === question.correctAnswer){
        this.correctAnswers +=1;
        console.log("win")
        return true;
      } else{      
        console.log("lose")
        return false;
      }
    },
  }

  $(function() {
    const state = {};
    const gameArea = $(".game-area");
  
    const setupGameControl = async () =>{
      const playerName = $(".setup-name").val();
      const difficulty = $(".setup-difficulty").val();
      const category = $(".setup-categories").val();
      const numQuestions = $(".setup-number-questions").val(); 
     
      await game.startNewGame(category,difficulty, numQuestions);
     
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

    // $(".setup-form-new").on("submit", (e)=>{
    //   e.preventDefault();
    //   setupGameControl(e);
    // });

    
    gameArea.on("click", (e) =>{
      e.preventDefault();
      console.log(e.target);
      if(e.target.matches(".answer-btn")){
        const button = e.target.closest(".answer-btn");
        const answer = button.dataset.answer;
        const result = game.guessAnswer(answer, state.question);

        updateScore(game.correctAnswers);

        $(".answer-btn").attr("disabled", "true");
        
        if(result){
          $(`[data-answer='${answer}']`).css("background-color", "green");
        } else {
          $(`[data-answer='${state.question.correctAnswer}']`).css("background-color", "green");

          $(`[data-answer='${answer}']`).css("background-color", "red");
        }

        const buttonNext =  $(".question-next");
        if(game.questions.length === 0){
          renderGameOverText();
          buttonNext.text("View score!");
        }

        buttonNext.toggleClass("hidden");
        
        //Next question button clicked
        buttonNext.on("click", () =>{
          buttonNext.toggleClass("hidden");
          
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
      }//End e.target.matches("answer-btn")  

      if(e.target.matches(".play-again-button")){
        console.log('play');
        renderSetup();
      }
   
      if(e.target.matches(".setup-button")){
        console.log('button');
        setupGameControl()
      }
    });//End event delegation

    //******** View Logic ********//

    //*RENDER GAME **//
    const createAnswer = (answer, index) =>`
      <li>
        <button class="level-question-answer-one answer-btn" data-answer='${answer}'>
          ${index+1}. ${answer}
        </button>
      </li>
    `;

    const renderGame = (question, playerName, totalQuestionNum, currentQuestionNum) =>{
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

    //**RENDER QUESTION **//
    const renderNewQuestion = (question) =>{
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
  
    const updateScore = (correctAnswers) =>{
      $(".question-correct-answers").text(`Correct Answers:${correctAnswers}`);
    }

    const updateQuestionNumber = (currentQuestionNum,totalQuestionNum) =>{
      $(".question-count").text(`Question ${currentQuestionNum}/${totalQuestionNum}`);
    }

    const renderGameOverText = () =>{
      $(".question-count").text(`Game Over!`);
    }

    //**RENDERS PLAY AGAIN **//
    const renderPlayAgain = (correctAnswers, totalQuestions, correctAnswersPerc) =>{
    let imagePath, altText, scoreMessage;

    if(correctAnswersPerc === 100) {
      imagePath = "images/mexican-adam.jpg"
      altText = "A picture of a young white male with a mexican hat";
      scoreMessage = "Wow you got a perfect score!";
    } else if (correctAnswersPerc < 100 && correctAnswersPerc >=50) {
      imagePath = "images/smiley.jpg";
      altText = "A smiley face emoji";
      scoreMessage = "Nice job! You got over half of them right!"
    } else {
      imagePath = "images/sad.jpg";
      altText = "A sad face emoji";
      scoreMessage = "Sadface. Less than half right!"
    }

    const markup = `
        <section class="play-again">
          <h2 class="play-again-heading">Game Over!</h2>
          <p class="play-again-stats">You got ${correctAnswers} out of ${totalQuestions}</p>
          <div class="play-again-img-box">
            <img src=${imagePath} alt=${altText} class="play-again-img">
          </div>
          <p class="play-again-message">${scoreMessage} </p>
          <button class="play-again-button"> Play Again </button>
        </section>
      `;
      gameArea.html(markup)  
    }

    //*RENDERS NEW GAME SCREEN*//

    const renderSetup = () =>{
      const markup = `
        <section class="setup-new">
          <div class="wrapper">
            <form action="" class="setup-form-new">
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

              <label for="setup-new-difficulty" class="setup-label">
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
              <button class="setup-button">Start Game!</button>
            </form>
          </div>
        </section>
        `;

        gameArea.html(markup);
      }    
  });
  

