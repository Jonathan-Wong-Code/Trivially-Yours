import uuid from 'uuid';

export default class Player{
  constructor(name, totalScore = 0){
    this.name = name;
    this.totalScore = totalScore;
    this.lives = 10;
    this.coins = 0;
    this.id = uuid();
  }

  guessWrong(){ 
    this.lives -=1; 
  }

  guessRight(){
    this.coins += 1;
  }

  buyLives(){
    this.lives += 1;
    this.coins -= 5;
  }

  tallyScore(gameScore, difficulty){
    this.totalScore += gameScore;
    if(difficulty === 'easy'){
      this.coins += 5;
      this.totalScore += 5;
    } else if (difficulty === 'medium'){
      this.coins += 10;
      this.totalScore += 10;
    } else {
      this.coins += 20;
      this.totalScore += 20;
    }
  }
}