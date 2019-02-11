import Game from "./models/game";
import "normalize.css/normalize.css";
import "./../styles/styles.scss";
import * as setupView from './views/setup-view';
import elements from "./elements";

const state = {};

window.addEventListener("load", () =>{
  state.game = new Game();
  state.game.loadPlayerData();
});
// const playerLife = document.querySelector('.level-player-lives', '::before').style.width = '50%';

//Initializes a new game
const startNewGameControl = (e) => {
  const playerName = document.querySelector(".setup-new-name").value;
  const difficulty = document.querySelector(".setup-new-difficulty").value;
  const category = document.querySelector(".setup-new-categories").value;
  //If no player create new player.
  state.game.startNewGame(category,difficulty);
  if(!state.player){
    state.player = state.game.addPlayer(playerName);
  } 
  setupView.clearGameArea();
  //Prepare UI
  //Render Game
  console.log(state.game.questions);
  console.log(state.player);
}

//Continues a game
const startContinueGameControl = (e) => {
  const difficulty = document.querySelector(".setup-continue-difficulty").value;
  const category = document.querySelector(".setup-continue-categories").value;
  state.game.startNewGame(category,difficulty);

  setupView.clearGameArea();
  //Prepare UI
  //Render
  console.log(state.game.questions);
  console.log(state.player);
}

//Select New Game
document.querySelector(".login-new").addEventListener("click", () =>{
  setupView.clearGameArea();
  setupView.renderNewGame();
});

//Continue Game
document.querySelector(".login-continue").addEventListener("click", () =>{
  setupView.clearGameArea();
  setupView.renderPlayerList(state.game.playerList);
});

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




//Event delegation for game area
document.querySelector(".game").addEventListener("click", (e)=>{ 
    e.preventDefault();

    //Start New Game Login
    if(e.target.matches(".setup-new-submit")){
      startNewGameControl(e);
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
     console.log(state.player);
     setupView.clearGameArea();
     setupView.renderContinueGame(state.player);
    }
});