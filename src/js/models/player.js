import uuid from 'uuid';

export default class Player{
  constructor(name, totalScore = 0){
    this.name = name;
    this.totalScore = totalScore;
    this.lives = 10;
    this.coins = 10;
    this.id = uuid();
  }

  answerWrong(){ 
    this.lives -=1; 
  }

  buyLives(){
    this.lives += 1;
    this.coins -= 5;
  }

  tallyScore(gameScore, difficulty){
    this.totalScore += gameScore;
    if(difficulty === 'easy'){
      this.totalScore += 5;
    } else if (difficulty === 'medium'){
      this.totalScore += 10;
    } else {
      this.totalScore += 20;
    }
  }
}