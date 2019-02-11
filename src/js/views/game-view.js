const createAnswer = (answer, index) =>`
    <li>
      <button class="level-question-answer-one answer-btn" data-answer='${answer}'>
        ${index+1}. ${answer}
      </button>
    </li>
`;

export const renderGame = (player, question, opponent, score) =>{
  const markup = `
  <h2 class="game-score">Score:${score} </h2>
  <section class="level">
    <div class="level-player-side">
      <div class="level-player-img">
        <img src="images/dug.jpg" alt="Dug the dog!">
      </div>      
      <span class="level-player-life-bar life-bar"></span>
      <p class="level-player-lives">Lives: ${player.lives}/10</p>
      <p class="level-player-name">${player.name}</p>
    </div>

    <div class="level-question-area">
      <p class="level-question-question"> ${question.question}</p>
      <ul class="level-question-answers">
        ${question.allAnswers.map((answer, index) => createAnswer(answer,index)).join('')}
      </ul>
    </div>

    <div class="level-opponent-side">
        <div class="level-opponent-img">
          <img src=${opponent.imagePath} alt=${opponent.name}>
        </div>
        <span class="level-opponent-life-bar life-bar"></span>
        <p class="level-opponent-lives">Lives ${opponent.lives}/3</p>
        <p class="level-opponent-name">${opponent.name}</p>
    </div>       
  </section>
  `;

  document.querySelector(".game").insertAdjacentHTML("beforeend", markup);
}

//*** UPDATE GAME UI AFTER QUESTION ANSWER **//

const updateGameScore = (score) =>{
  document.querySelector(".game-score").textContent = `Score:${score}`;
}

const updatePlayerLifeBar = (playerLifePerc) => {
  //Sets width of health to % of player lives.
  document.querySelector(".level-player-life-bar").style.width = `${playerLifePerc}%`
  if(playerLifePerc <= 66 && playerLifePerc >= 33){
     document.querySelector(".level-player-life-bar").style.backgroundColor='yellow';
  } else if( playerLifePerc < 33){
     document.querySelector(".level-player-life-bar").style.backgroundColor='red';
  }
}

const updatePlayerLives = (currentLives) => {
  document.querySelector(".level-player-lives").textContent =`Lives: ${currentLives}/10`;
}

const updateOpponentLives = (opponentLives) => {
  document.querySelector(".level-opponent-lives").textContent = `Lives: ${opponentLives} / 3`
}

const updateOpponentLifeBar = (opponentLifePerc) => {
  document.querySelector(".level-opponent-life-bar").style.width = `${opponentLifePerc}%`
  if(opponentLifePerc <= 67 && opponentLifePerc > 34){
     document.querySelector(".level-opponent-life-bar").style.backgroundColor='yellow';
  } else if( opponentLifePerc <= 34){
     document.querySelector(".level-opponent-life-bar").style.backgroundColor='red';
  }
}

export const updateGameStats = (
  playerLifePerc, 
  score,
  currentLives, 
  opponentLifePerc,
  opponentLives
 ) => {
  updatePlayerLifeBar(playerLifePerc);
  updatePlayerLives(currentLives);
  updateOpponentLives(opponentLives);
  updateOpponentLifeBar(opponentLifePerc);
  updateGameScore(score);
}

//*** RENDER NEW QUESTION ***//

export const renderNextQuestion = (question) =>{ 
  //We need this.state.question and a new getQuestion

  const markup = `
  <p class="level-question-question"> ${question.question}</p>
  <ul class="level-question-answers">
    ${question.allAnswers.map((answer, index) => createAnswer(answer,index)).join('')}
  </ul>
  `
  document.querySelector(".level-question-area").insertAdjacentHTML("beforeend", markup);
}

export const renderDialogue = (dialogue) =>{
  const markup = `<p>${dialogue}</p>`;
  document.querySelector(".level-question-area").insertAdjacentHTML("beforeend", markup);
}

export const clearQuestionArea = () => {
  document.querySelector(".level-question-area").innerHTML = '';
}