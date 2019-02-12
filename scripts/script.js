
const game = {
     questions : [],
     totalQuestions : 0,
     correctAnswers : 0,
     win : false,

    async startNewGame(category, difficulty,numQuestions){
      this.questions = [];   
      const response = await axios.get(`https://opentdb.com/api.php?amount=${numQuestions}&category=${category}&difficulty=${difficulty}`);
       
      const data = response.data.results;
      
      data.forEach((question =>{
        this.questions.push({
          // ...question,
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

    getQuestion(){  //check length property. 
      const randomNum = Math.floor(Math.random() * this.questions.length);
      const returnedQuestion = this.questions[randomNum];
      this.questions.splice(randomNum, 1);  
      
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

  const state = {};

  $(function() {
  
    const gameArea = $(".game-area");
    //Business Logic

    const setupGameControl = async (e) =>{
      const playerName = e.target.elements.name.value;
      const difficulty = e.target.elements.difficulty.value;
      const category = e.target.elements.categories.value;
      const numQuestions = e.target.elements.questions.value; 

      await game.startNewGame(category,difficulty, numQuestions);
      game.totalQuestions = game.questions.length;
      console.log(game.totalQuestions);
      state.question = game.getQuestion();

      // clearGameArea();
      renderGame(state.question, playerName);
      // $(".answer-btn").on("click", function(){
      //   console.log(this);
      //   clearQuestionArea();
      //   state.question = game.getQuestion();
      //   renderNewQuestion(state.question);
      //   console.log("logged");
      // });
    }
    //Event Listeners

    $(".setup-form-new").on("submit", (e)=>{
      e.preventDefault();
      setupGameControl(e);
    });

    
    $(gameArea).on("click", (e) =>{
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
        buttonNext.toggleClass("hidden");
        
        //Next question button clicked
        buttonNext.on("click", () =>{
          buttonNext.toggleClass("hidden");
          state.question = game.getQuestion();
          console.log(state.question);
          
          renderNewQuestion(state.question);
        })
      }
    });


    //******** View Logic ********//

    //*RENDER GAME **//
    const clearGameArea = () =>{
      gameArea.html("");
    }

    const renderGame = (question, playerName) =>{
      const markup = `
      <section class="question">
        <div class="wrapper">
          <div class="question-header">
            <h2 class="question-correct-answers">Correct Answers: 0</h2>
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
      `
      gameArea.html(markup);   
    }

    const createAnswer = (answer, index) =>`
      <li>
        <button class="level-question-answer-one answer-btn" data-answer='${answer}'>
          ${index+1}. ${answer}
        </button>
      </li>
    `;

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

    const clearQuestionArea = () =>{
      $(".question-box").html("");
    }

    //**RENDERS PLAY AGAIN **//
  });
  


  // newArray = [1]
  // array = [1,2,3]