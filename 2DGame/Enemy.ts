///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
    
  
    export abstract class Enemy extends Characters {
      protected currentWalkingTime: number = 0;
      protected walkingTimeMax: number;
      protected fieldOfView: Hitbox;
    
      constructor(_name: string) {
        super(_name);

      }
      
    }
  }