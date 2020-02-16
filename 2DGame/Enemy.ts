///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
    
  
    export abstract class Enemy extends Characters {
      protected currentWalkingTime: number = 0;
      protected walkingTimeMax: number;
      protected fieldOfView: Hitbox;
    
      constructor(_name: string) {
        super(_name);
        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, this.update);
      }

      public creatHitbox(scaleX: number, scaleY: number): Hitbox {
        let hitbox: Hitbox = new Hitbox(this, "EnemyHitbox");
        hitbox.cmpTransform.local.scaleX(scaleX);
        hitbox.cmpTransform.local.scaleY(scaleY);
        this.hitbox = hitbox;
        return hitbox;
      }

    }
  }