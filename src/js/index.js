import Game from "./models/game";
import "normalize.css/normalize.css";
import "./../styles/styles.scss";
import * as setupView from './views/setup-view';
import * as gameView from './views/game-view';
import elements from "./elements";

const state = {};

//Looks for existing player data and initializes game object on load.
window.addEventListener("load", () =>{
  state.game = new Game();
  state.game.loadPlayerData();
});


//Executes Initialization of a new game
const startNewGameControl = async () => {
  const playerName = document.querySelector(".setup-new-name").value;
  const difficulty = document.querySelector(".setup-new-difficulty").value;
  const category = document.querySelector(".setup-new-categories").value;

  
  await state.game.startNewGame(category,difficulty);

  //If no player create new player.
  if(!state.player){
    state.player = state.game.addPlayer(playerName);
  } 

  setupView.clearGameArea();
  state.question = state.game.getQuestion();
  state.opponent = state.game.opponents[state.game.level],
  gameView.renderGame(
    state.player,
    state.question, 
    state.opponent,
    state.game.score
  );
}

//Executes Continues a game
const startContinueGameControl = async (e) => {
  const difficulty = document.querySelector(".setup-continue-difficulty").value;
  const category = document.querySelector(".setup-continue-categories").value;
  await state.game.startNewGame(category,difficulty);

  setupView.clearGameArea();
  state.question = state.game.getQuestion();
  gameView.renderGame(state.player, state.question, state.game.opponent[state.game.level]);
}

//Select New Game off Login Screen
document.querySelector(".login-new").addEventListener("click", () =>{
  setupView.clearGameArea();
  setupView.renderNewGame();
});

//Continue Game off login Screen
document.querySelector(".login-continue").addEventListener("click", () =>{
  setupView.renderPlayerList(state.game.playerList);
});

//Event delegation for game area
document.querySelector(".game").addEventListener("click", (e)=>{ 
    e.preventDefault();

    //Start New Game AFTER SETUP
    if(e.target.matches(".setup-new-submit")){    
      startNewGameControl();
    }

    //Continue GAME AFTER SETUP
    if(e.target.matches(".setup-continue-submit")){  
      startContinueGameControl(e);
    }

    //Select player to continue with on player continue
    if(e.target.matches(".setup-continue-choose-player")){
     const player = e.target.closest(".setup-continue-choose-player");
     const id = player.dataset.playerid; 
     //Not camelcase because data attribute doesn't like capital letters. Tried with camelCase and did not work.
     state.player = state.game.findPlayer(id);
     setupView.clearGameArea();
     setupView.renderContinueGame(state.player);
    }

    //Player picks an answer
    if(e.target.matches(".answer-btn")){
      const button = e.target.closest(".answer-btn");
      const answer = button.dataset.answer;
      const result = state.game.guessAnswer(answer, state.question);
      
    
      if(result){
        state.player.guessRight();
        console.log(state.opponent);
        state.opponent.loseLife();
        //update coins
      } else {
        state.player.guessWrong(); 
      }
      const opponentLifePerc = parseInt(state.opponent.lives,10)/3 *100;
      const playerLifePerc = parseInt(state.player.lives,10)/10 * 100;

      gameView.updateGameStats(
        playerLifePerc, 
        state.game.score, 
        state.player.lives,
        opponentLifePerc,
        state.opponent.lives
      );
        
      //clear question area
      //render dialogue?
      //get a new question from game model.
      //render NEW question to question area.
     
      //Check to see if life = 0. if so end game.
      //Check to see if game is over state.game.questions.length === 0 ** level ===3;
    }
});


//******** HELPER FUNCTIONS ***//
// const playerLife = document.querySelector('.level-player-lives', '::before').style.width = '50%';

//Start a new game
// document.querySelector(".setup-form-new").addEventListener("submit", (e)=>{
//   e.preventDefault();
//   startNewGameControl(e);
// });

//Continue game
// document.querySelector(".setup-form-continue").addEventListener("submit", (e)=>{
//   e.preventDefault();
//   startContinueGameControl(e);
// });
