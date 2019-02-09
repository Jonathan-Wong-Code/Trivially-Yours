import uuid from 'uuid';

export default class Player{
  constructor(name, totalScore = 0){
    this.name = name;
    this.totalScore = totalScore;
    this.lives = 10;
    this.id = uuid();
  }

  answerWrong(){ 
    this.lives -=1; 
  }

  tallyScore(gameScore){
    this.totalScore += gameScore;
  }
}