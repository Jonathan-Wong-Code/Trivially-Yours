import axios from 'axios';
import uuid from 'uuid';
import Player from './player';
export default class Game{
  constructor(){
    this.questions = [];
    this.playerList = [];
    this.player = {};
    this.score = 0;
    this.win = false;
  };

  async startNewGame(){
    const response = await axios.get('https://opentdb.com/api.php?amount=10&category=15&difficulty=easy');
    const data = response.data.results;
    data.forEach((question =>{
      this.questions.push({
        question : question.question,
        correctAnswer : question.correct_answer,
        incorrectAnswers : question.incorrect_answers,
      });
    }));
    console.log(this.questions);
  }

  addPlayer(name, totalScore = 0, ){
    const newPlayer = new Player(name, totalScore);
    this.playerList.push(newPlayer);
    this.player = newPlayer;
    return newPlayer;
  }

  guessAnswer(playerGuess, questionNum){
    //If the player guess index = the correct answer index question is right!
    if(playerGuess === this.questions[questionNum].correctAnswer){
      this.score +=2;
      this.questions.shift();
      return true;
    } else{
      this.score -=1;
      return false;
    }
  }
}