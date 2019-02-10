import Game from "./models/game";
import "normalize.css/normalize.css";
import "./../styles/styles.scss";

const state = {};

window.addEventListener("load", () =>{
  state.game = new Game();
  state.game.loadPlayerData();
  if(state.game.playerList.length > 0) {
    //render player data
    //When player clicks on "continue" button loads player data.
    //Event delegation
  }
})
// const playerLife = document.querySelector('.level-player-lives', '::before').style.width = '50%';
const startNewGameControl = (e) => {
  const playerName = e.target.elements.name.value;
  const difficulty = e.target.elements.difficulty.value;
  const category = e.target.elements.categories.value;

  state.game.startNewGame(category,difficulty);
  if(!state.player){
    state.player = state.game.addPlayer(playerName);
  } 
  console.log(state.game.questions);
  console.log(state.player);
}

const startContinueGameControl = (e) => {
  const difficulty = e.target.elements.difficulty.value;
  const category = e.target.elements.categories.value;
  state.game.startNewGame(category,difficulty);
  console.log(state.game.questions);
  console.log(state.player);
}


document.querySelector(".setup-form-new").addEventListener("submit", (e)=>{
  e.preventDefault();
  startNewGameControl(e);
});

document.querySelector(".setup-form-continue").addEventListener("submit", (e)=>{
  e.preventDefault();
  startContinueGameControl(e);
});

document.querySelector(".game-area").addEventListener("click", (e)=>{ //Event delegation for page area

})