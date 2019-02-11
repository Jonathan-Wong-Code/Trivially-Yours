export default class Opponent{
    constructor(name, imagePath){
      this.name = name;
      this.lives = 3;
      this.defeated = false;
      this.imagePath = imagePath;
    }

    loseLife(){
      this.lives -=1;

      if(this.lives === 0) {
        this.defeated = true;
      }
    }

    getOpponetStatus(){
      return this.defeated;
    }
}