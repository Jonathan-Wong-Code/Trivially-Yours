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

  //If no player create new player.
  await state.game.startNewGame(category,difficulty);

  if(!state.player){
    state.player = state.game.addPlayer(playerName);
  } 

  setupView.clearGameArea();
  state.question = state.game.getQuestion();
  gameView.renderGame(state.player,state.question, state.game.opponents[state.game.level]);
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

//Select New Game
document.querySelector(".login-new").addEventListener("click", () =>{
  setupView.clearGameArea();
  setupView.renderNewGame();
});

//Continue Game
document.querySelector(".login-continue").addEventListener("click", () =>{
  setupView.renderPlayerList(state.game.playerList);
});

//Event delegation for game area
document.querySelector(".game").addEventListener("click", (e)=>{ 
    e.preventDefault();

    //Start New Game Login
    if(e.target.matches(".setup-new-submit")){    
      startNewGameControl();
    }

    //Continue Game Login
    if(e.target.matches(".setup-continue-submit")){  
      startContinueGameControl(e);
    }

    //Select player to continue with
    if(e.target.matches(".setup-continue-choose-player")){
     const player = e.target.closest(".setup-continue-choose-player");
     const id = player.dataset.playerid;
     state.player = state.game.findPlayer(id);
     setupView.clearGameArea();
     setupView.renderContinueGame(state.player);
    }

    //Player picks an answer
    if(e.target.matches(".answer-btn")){
      const button = e.target.closest(".answer-btn");
      const answer = button.dataset.answer;
      const result = state.game.guessAnswer(answer, state.question);
      //update game score
      if(result){
        state.player.guessRight();

        //update coins
      } else {
        state.player.guessWrong();
        const playerLifePerc = parseInt(state.player.lives,10)/10 * 100;
        document.querySelector('.level-player-lives', '::before').style.width = `${playerLifePerc}%`
        if(playerLifePerc < 66 && playerLifePerc > 33){
          document.querySelector('.level-player-lives', '::before').style.backgroundColor='yellow';
        } else if( playerLifePerc < 33){
          document.querySelector('.level-player-lives', '::before').style.backgroundColor='red';
        }
        //Render life change
      }
     
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
