import axios from 'axios';
import Player from './player';
export default class Game{
  constructor(){
    this.questions = [];
    this.playerList = [];
    this.score = 0;
    this.level = 1;
    this.win = false;
  };

  async startNewGame(category, difficulty){
    this.questions = [];

    const response = await axios.get(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}`);

    const data = response.data.results;
    data.forEach((question =>{
      this.questions.push({
        question : question.question,
        correctAnswer : question.correct_answer,
        incorrectAnswers : question.incorrect_answers,
      });
    }));

    this.score = 0;
    this.level = 1;
    this.win = false;
    console.log(this.questions);
  }

  addPlayer(name, totalScore = 0, ){
    const newPlayer = new Player(name, totalScore);
    this.playerList.push(newPlayer);
    this.savePlayerData();
    return newPlayer;
  }

  nextLevel(){
    this.level += 1;
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

  savePlayerData(){
    localStorage.setItem("players", JSON.stringify(this.playerList));
  }

  loadPlayerData(){
    const storage = JSON.parse(localStorage.getItem('players'));
    if(storage){
      this.playerList = storage;
    }
  }
}