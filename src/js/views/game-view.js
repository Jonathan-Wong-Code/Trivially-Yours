const createAnswer = (answer, index) =>`
    <li>
      <button class="level-question-answer-one answer-btn" data-answer='${answer}'>
        ${index+1}. ${answer}
      </button>
    </li>
`

export const renderGame = (player, question, opponent) =>{
  const markup = `
  <section class="level">
    <div class="level-player-side">
      <div class="level-player-img">
        <img src="images/dug.jpg" alt="Dug the dog!">
      </div>       
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
        <p class="level-opponent-lives">Lives ${opponent.life}/3</p>
        <p class="level-opponent-name">${opponent.name}</p>
    </div>       
  </section>
  `

  document.querySelector(".game").insertAdjacentHTML("beforeend", markup);
}