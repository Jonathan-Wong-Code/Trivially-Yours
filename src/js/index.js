import Game from "./models/game";
import "normalize.css/normalize.css";
import "./../styles/styles.scss";
import * as setupView from './views/setup-view';
import elements from "./elements";

const state = {};

window.addEventListener("load", () =>{
  state.game = new Game();
  state.game.loadPlayerData();
  if(state.game.playerList.length > 0) {
    
  }
})
// const playerLife = document.querySelector('.level-player-lives', '::before').style.width = '50%';
const startNewGameControl = (e) => {
  const playerName = document.querySelector(".setup-new-name").value;
  const difficulty = document.querySelector(".setup-new-difficulty").value;
  const category = document.querySelector(".setup-new-categories").value;
  state.game.startNewGame(category,difficulty);
  if(!state.player){
    state.player = state.game.addPlayer(playerName);
  } 
  console.log(state.game.questions);
  console.log(state.player);
}

const startContinueGameControl = (e) => {
  const difficulty = document.querySelector(".setup-continue-difficulty").value;
  const category = document.querySelector(".setup-continue-categories").value;
  state.game.startNewGame(category,difficulty);
  console.log(state.game.questions);
  console.log(state.player);
}

//Select New Game
document.querySelector(".login-new").addEventListener("click", () =>{
  document.querySelector(".game").innerHTML = '';
  setupView.renderNewGame();
});

//Continue Game
document.querySelector(".login-continue").addEventListener("click", () =>{
  document.querySelector(".game").innerHTML = '';
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




//Event delegation for level area
document.querySelector(".game").addEventListener("click", (e)=>{ //Event delegation for page area
    e.preventDefault();
    //Start New Game Login
    if(e.target.matches(".setup-new-submit")){
      startNewGameControl(e);
    }

    //Continue Game Login
    if(e.target.matches(".setup-continue-submit")){
      startContinueGameControl(e);
    }

    if(e.target.matches(".setup-continue-choose-player")){
     const player = e.target.closest(".setup-continue-choose-player");
     const id = player.dataset.playerid;
     state.player = state.game.findPlayer(id);
     console.log(state.player);
     document.querySelector(".game").innerHTML = "";
     setupView.renderContinueGame(state.player);
    }
});