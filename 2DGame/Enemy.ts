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

      protected update = (_event: fudge.Eventƒ): void => {
        this.broadcastEvent(new CustomEvent("showNext"));
        let timeFrame: number = fudge.Loop.timeFrameGame / 1000;
        this.speed.y += Enemy.gravity.y * timeFrame;
        let distance: fudge.Vector3 = fudge.Vector3.SCALE(this.speed, timeFrame);
        this.cmpTransform.local.translate(distance);

        if (this.directionGlobal == "right") {
          this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y + 0.6, 0);
        } else if (this.directionGlobal == "left") {
          this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y + 0.6, 0);
        }
        this.checkGroundCollision(0,0);
      }

    }
  }