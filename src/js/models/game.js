import axios from 'axios';
import Player from './player';
import Opponent from './opponent';

export default class Game{
  constructor(){
    this.questions = [];
    this.playerList = [];
    this.opponents = []
    this.score = 0;
    this.level = 0;
    this.win = false;
  };

  async startNewGame(category, difficulty){
    this.questions = [];

    const response = await axios.get(`https://opentdb.com/api.php?amount=12&category=${category}&difficulty=${difficulty}`);

    const data = response.data.results;
    data.forEach((question =>{
      this.questions.push({
        question : question.question,
        correctAnswer : question.correct_answer,
        incorrectAnswers : question.incorrect_answers,
        allAnswers : [question.correct_answer, ...question.incorrect_answers]
      });
    }));

    this.setupOpponents();
    this.shuffleAnswers();
    this.score = 0;
    this.level = 0;
    this.win = false;
  }

  //https://medium.com/@fyoiza/how-to-randomize-an-array-in-javascript-8505942e452 
  //Shuffle Algorthim
  shuffleAnswers(){
    this.questions.forEach((question) =>{
      let shuffledAnswers = [];

      while(question.allAnswers.length !== 0){
        let randomIndex = Math.floor(Math.random()*question.allAnswers.length);
        shuffledAnswers.push(question.allAnswers[randomIndex]);
        question.allAnswers.splice(randomIndex,1);
      };

      question.allAnswers= shuffledAnswers;
    });  
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

  guessAnswer(playerGuess, question){
    console.log(question);
    //If the player guess index = the correct answer index question is right!
    if(playerGuess === question.correctAnswer){
      this.score +=2;
      console.log("win")
      return true;
    } else{
      if(this.score > 0){
        this.score -=1;
      }
      console.log("lose")
      return false;
    }
  }

  findPlayer(id){
    return this.playerList.find(player => player.id === id);
  }

  getQuestion(){  //check length property.
    const randomNum = Math.floor(Math.random() * 12)+1;
    const returnedQuestion = this.questions[randomNum];
    
    this.questions.splice(randomNum, 1);

    return returnedQuestion;
  }

   setupOpponents (){   
    const jenny = new Opponent("Jenny");
    const adam = new Opponent("Adam");
    const asaf = new Opponent("Asaf");
    const brownDog = new Opponent("Brown Dog");

    this.opponents = [jenny, adam, asaf, brownDog]
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