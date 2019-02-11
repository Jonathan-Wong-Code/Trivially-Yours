
const renderLevel = (player, question, opponent) =>{
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
          <li>
            <button class="level-question-answer-one answer-btn" data-answer='0'>
              1. Answer A
            </button>
          </li>
          
          <li>
            <button class="level-question-answer-two answer-btn" data-answer='1'>
              2. Answer B
            </button>
          </li>

          <li>
            <button class="level-question-answer-three answer-btn" data-answer='2'>
              3. Answer C
            </button>
          </li>

          <li>
            <button class="level-question-answer-four answer-btn" data-answer='3'>
              4. Answer D
            </button>
          </li>
      </ul>
    </div>

    <div class="level-opponent-side">
        <div class="level-opponent-img">
          <img src="images/dug.jpg" alt="Dug the dog!">
        </div>
        <p class="level-opponent-lives">Lives 3/3</p>
        <p class="level-opponent-name">Jenny</p>
    </div>       
  </section>
  `
}