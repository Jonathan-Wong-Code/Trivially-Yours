import Game from "./models/game";
import "normalize.css/normalize.css";
import "./../styles/styles.scss";

const state = {};



const startGameControl = (e) =>{
  state.game = new Game();
  
  const playerName = e.target.elements.name.value;
  const difficulty = e.target.elements.difficulty.value;
  const category = e.target.elements.categories.value;

  state.game.startNewGame(category,difficulty);
  state.player = state.game.addPlayer(playerName);
  console.log(state.game.questions);
  console.log(state.player);
}

document.querySelector(".setup-game-form").addEventListener("submit", (e)=>{
  e.preventDefault();
  startGameControl(e);
})