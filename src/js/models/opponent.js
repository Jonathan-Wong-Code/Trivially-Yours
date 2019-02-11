export default class Opponent{
    constructor(name){
      this.name = name;
      this.lives = 3;
      this.defeated = false;
    }

    loseLife(){
      this.lives > 0 ? this.lives -=1 : this.defeated = true;
    }
}