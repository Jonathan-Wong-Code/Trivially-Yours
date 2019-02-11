
export const renderLogin = () =>{
  const markup = `
    <section class="login">
      <div class="login-buttons">
        <button class="login-new" data-login='new'>New Game</button>
        <button class="login-continue" data-login='continue'>Continue</button>
      </div>
    </section>
  `;

  document.querySelector(".game").insertAdjacentHTML("beforeend", markup);
};

const createPlayer = (player) =>`
  <li class="setup-continue-player">
    <p class="setup-continue-player-name">${player.name}</p>
    <p class="setup-continue-player-score">${player.totalScore}</p>
    <button class="setup-continue-choose-player" data-playerid = ${player.id}> Continue </button>
  </li>
`;

export const renderPlayerList = (players) =>{
  const markup = `
    <section class="setup-choose-player">
      <h2>Choose a player to continue</h2>
      <ul class="setup-continue-players">
        ${players.map(player => createPlayer(player)).join('')}
      </ul>
      
    </section>
    `;
  document.querySelector(".game").insertAdjacentHTML("beforeend", markup);
}

export const renderContinueGame = (player) =>{
  const markup = `
  <section class="setup-continue">
    <form action="" class="setup-continue-form"> 
      <h2 class="setup-continue-heading">Welcome back ${player.name}!</h2>
      <label class="visuallyhidden" for="setup-continue-difficulty">
        Difficulty
      </label>
      <select name="difficulty" id="setup-continue-difficulty" class="setup-continue-difficulty">
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>  

      <label for="setup-categories" class="visuallyhidden">
        Category
      </label>
      <select name="categories" id="setup-categories" class="setup-continue-categories">
        <option value="9">General Knowledge</option>
        <option value="15">Video Games</option>
        <option value="11">Film</option>
        <option value="21">Sports</option>
        <option value="18">Computers</option>
        <option value="14">Television</option>
      </select>
      <button class="setup-continue-submit">Start Game!</button>
    </form>
  </section>
  `;

  document.querySelector(".game").insertAdjacentHTML("beforeend", markup);
}

export const renderNewGame = () =>{
  const markup = `
  <setion class="setup-new">
    <form action="" class="setup-new-form">
      <label class="visuallyhidden" for="setup-name">
        Name
      </label>
      <input type="text" class="setup-new-name" name="name" id="setup-new-name">

      <label class="visuallyhidden" for="setup-new-difficulty">
        Difficulty
      </label>
      <select name="difficulty" id="setup-new-difficulty" class="setup-new-difficulty">
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>  

      <label for="setup-categories" class="visuallyhidden">
        Category
      </label>
      <select name="categories" id="setup-categories" class="setup-new-categories">
        <option value="9">General Knowledge</option>
        <option value="15">Video Games</option>
        <option value="11">Film</option>
        <option value="21">Sports</option>
        <option value="18">Computers</option>
        <option value="14">Television</option>
      </select>
      <button type="submit" class="setup-new-submit">Start Game!</button>
    </form>
  </section>
  `
  document.querySelector(".game").insertAdjacentHTML("beforeend", markup);
}

export const clearGameArea = () =>{
  document.querySelector(".game").innerHTML = '';
}  