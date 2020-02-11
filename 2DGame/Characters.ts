///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
  
    export enum ACTION {
      IDLE = "Idle",
      WALK = "Walk",
      JUMP = "Jump",
      HIT = "Hit",
      DIE = "Die",
      DEAD = "Dead"

    }
    export enum DIRECTION {
      LEFT, RIGHT
    }
  
    export class Characters extends fudge.Node {
      private static sprites: Sprite[];
      private static speedMax: fudge.Vector2 = new fudge.Vector2(1.5, 5); // units per second
      private static gravity: fudge.Vector2 = fudge.Vector2.Y(-4);
      public speed: fudge.Vector3 = fudge.Vector3.ZERO();
      public directionGlobal: String = "right";
      public hitboxes: Hitbox[] = [];
      private frameCounter: number = 0;
  
  
      constructor(_name: string = "Characters") {
        super(_name);
        this.addComponent(new fudge.ComponentTransform());
  
        for (let sprite of Characters.sprites) {
          let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
          nodeSprite.activate(false);
  
          nodeSprite.addEventListener(
            "showNext",
            (_event: Event) => { (<NodeSprite>_event.currentTarget).showFrameNext(); },
            true
          );
          this.appendChild(nodeSprite);
        }
        this.creatHitbox();
        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, this.update);
      }
  
      public static generateSprites(_txtImage: fudge.TextureImage): void {
        Characters.sprites = [];
      }

      public creatHitbox(): Hitbox {

        let hitbox: Hitbox = new Hitbox(this, "PlayerHitbox");
        hitbox.cmpTransform.local.scaleX(0.4);
        hitbox.cmpTransform.local.scaleY(0.8);
        this.hitboxes.push(hitbox);
        return this.hitboxes[0];
      }
  
      public show(_action: ACTION): void {
        if (_action == ACTION.JUMP)
          return;
        for (let child of this.getChildren()) {
          child.activate(child.name == _action);
        }
      }
  
      public act(_action: ACTION, _direction?: DIRECTION): void {
        switch (_action) {
          case ACTION.IDLE:
            this.speed.x = 0;
            this.frameCounter = 0;
            break;
          case ACTION.WALK:
            let direction: number = (_direction == DIRECTION.RIGHT ? 1 : -1);
            this.speed.x = Characters.speedMax.x; // * direction;
            this.cmpTransform.local.rotation = fudge.Vector3.Y(90 - 90 * direction);
            if (direction == 1) {
              this.directionGlobal = "right";
              this.frameCounter = 0;
            } else if (direction == -1) {
              this.directionGlobal = "left";
              this.frameCounter = 0;
            }
            break;
          case ACTION.JUMP:
            if (this.speed.y != 0) {
              this.frameCounter = 0;
              break;
            } else {
              this.speed.y = 3;
              this.frameCounter = 0;
              break;
            }
            
          case ACTION.HIT:
            this.speed.x = 0;
            if(this.frameCounter > 6) {
              this.frameCounter = 0;
            }
            this.frameCounter = this.frameCounter + 1;
            break;
        }
        this.show(_action);
      }
  
      private update = (_event: fudge.Eventƒ): void => {
        this.broadcastEvent(new CustomEvent("showNext"));
  
        let timeFrame: number = fudge.Loop.timeFrameGame / 1000;
        this.speed.y += Characters.gravity.y * timeFrame;
        let distance: fudge.Vector3 = fudge.Vector3.SCALE(this.speed, timeFrame);

        this.cmpTransform.local.translate(distance);

        this.checkGroundCollision();
      }

      private deleteThis(){
        let parent: fudge.Node = this.getParent();
        parent.removeChild(this);
      }
  
      private checkGroundCollision(): void {


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
            pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x - 0.40, this.cmpTransform.local.translation.y);
            pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
            hitLeft = rect.isInside(pointLeft);
            hitRight = rect.isInside(pointRight);

          } else if (this.directionGlobal == "left") {
            pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x + 0.4, this.cmpTransform.local.translation.y);
            pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
            hitLeft = rect.isInside(pointLeft);
            hitRight = rect.isInside(pointRight);
          }

          if (hitRight || hitLeft) {
            let translation: fudge.Vector3 = this.cmpTransform.local.translation;
            translation.y = rect.y;
            if (translation.y - 0.3 >  this.cmpTransform.local.translation.y) {
              translation.x = this.cmpTransform.local.translation.x + 0.1;
              translation.y = this.cmpTransform.local.translation.y;
              
            }
            this.cmpTransform.local.translation = translation;
            this.speed.y = 0;
          }

        }
      }

    }
  }