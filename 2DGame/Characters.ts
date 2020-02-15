///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
    
    export enum ACTION {
      IDLE = "Idle",
      WALK = "Walk",
      JUMP = "Jump",
      MID_AIR = "MidAir",
      HIT = "Hit",
      DIE = "Die",
      GETTING_DAMAGE = "GettingDamage"
  
    }
    export enum DIRECTION {
      LEFT, RIGHT
    }
  
    export abstract class Characters extends fudge.Node {
      protected action: ACTION;
      protected static sprites: Sprite[];
      protected static speedMax: fudge.Vector2 = new fudge.Vector2(1.5, 5);
      protected static gravity: fudge.Vector2 = fudge.Vector2.Y(-3.5);
      protected directionGlobal: String = "right";
      protected frameCounter: number = 0;
      public healthpoints: number;
      protected hitbox: Hitbox;
      protected speed: fudge.Vector3 = fudge.Vector3.ZERO();
    
      constructor(_name: string) {
        super(_name);

      }

      public show(_action: ACTION): void {
        for (let child of this.getChildren()) {
          child.activate(child.name == _action);
        }
      }

      public receiveHit(): void {
        this.healthpoints = this.healthpoints - 1;
        if (this.healthpoints <= 0 && this.name != "Knight") {
          this.frameCounter = 0;
          this.deleteThis();
        } else if (this.healthpoints <= 0 && this.name == "Knight") {
          this.endGame();
        }
      }

      protected deleteThis(): void {
        let parent: fudge.Node = this.getParent();
        parent.removeChild(this.hitbox);
        parent.removeChild(this);
      }

      protected checkGroundCollision(_shorteningPointLeft: number, _shorteningPointRight: number): void {


        for (let floor of level.getChildren()) {
  
          if (floor.name != "Floor") {
            continue;
          }
  
          let rect: fudge.Rectangle = (<Floor>floor).getRectWorld();
          let pointLeft: fudge.Vector2;
          let pointRight: fudge.Vector2;
          let hitLeft: boolean;
          let hitRight: boolean;
  
          if (this.directionGlobal == "right") {
            if (this.action == ACTION.WALK) {
              pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
              pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
              hitLeft = rect.isInside(pointLeft);
              hitRight = rect.isInside(pointRight);
            } else {
              pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x - _shorteningPointLeft, this.cmpTransform.local.translation.y);
              pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x - _shorteningPointRight, this.cmpTransform.local.translation.y);
              hitLeft = rect.isInside(pointLeft);
              hitRight = rect.isInside(pointRight);
            }
  
          } else if (this.directionGlobal == "left") {
            if (this.action == ACTION.WALK) {
              pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
              pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
              hitLeft = rect.isInside(pointLeft);
              hitRight = rect.isInside(pointRight);
            } else {
              pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x + 0.4, this.cmpTransform.local.translation.y);
              pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
              hitLeft = rect.isInside(pointLeft);
              hitRight = rect.isInside(pointRight);
            }
          }
  
          if (hitRight || hitLeft) {
            let translation: fudge.Vector3 = this.cmpTransform.local.translation;
            translation.y = rect.y;
            if (translation.y - 0.4 > this.cmpTransform.local.translation.y) {
              if (this.directionGlobal == "left") {
                translation.x = this.cmpTransform.local.translation.x + 0.1;
                translation.y = this.cmpTransform.local.translation.y;
              } else {
                translation.x = this.cmpTransform.local.translation.x - 0.1;
                translation.y = this.cmpTransform.local.translation.y;
              }
  
            }
            this.cmpTransform.local.translation = translation;
            this.speed.y = 0;
          }
  
        }
      }

      private endGame(): void {
        fudge.Loop.stop();
        let deathScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("deathScreen");
        deathScreen.style.visibility = "visible";
      }

    }
  }