const createAnswer = (answer, index) =>`
    <li>
      <button class="level-question-answer-one answer-btn" data-answer='${answer}'>
        ${index+1}. ${answer}
      </button>
    </li>
`;

export const renderGame = (player, question, opponent, score = 0) =>{
  const markup = `
  <h2 class="game-score">Score:${score} </h2>
  <section class="level">
    <div class="level-player-side">
      <div class="level-player-img">
        <img src="images/dug.jpg" alt="Dug the dog!">
      </div>      
      <span class="level-player-life-bar"></span>
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
          <img src="images/dug.jpg" alt="Dug the dog!">
        </div>
        <span class="level-opponent-life-bar"></span>
        <p class="level-opponent-lives">Lives ${opponent.life}/3</p>
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

const updatePlayerLifeBar = (playerLifePerc) =>{
  document.querySelector(".level-player-life-bar").style.width = `${playerLifePerc}%`
  if(playerLifePerc <= 66 && playerLifePerc >= 33){
     document.querySelector(".level-player-life-bar").style.backgroundColor='yellow';
  } else if( playerLifePerc < 33){
     document.querySelector(".level-player-life-bar").style.backgroundColor='red';
  }
}

const updatePlayerLives = (currentLives) =>{
  document.querySelector(".level-player-lives").textContent =`Lives: ${currentLives}/10`;
}

export const updateGameStats = (playerLifePerc, score, currentLives) =>{
  updatePlayerLifeBar(playerLifePerc);
  updatePlayerLives(currentLives);
  updateGameScore(score);
}