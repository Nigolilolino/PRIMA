///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
  
    export enum ACTION {
      IDLE = "Idle",
      WALK = "Walk",
      JUMP = "Jump"
    }
    export enum DIRECTION {
      LEFT, RIGHT
    }
  
    export class Hare extends fudge.Node {
      private static sprites: Sprite[];
      private static speedMax: fudge.Vector2 = new fudge.Vector2(1.5, 5); // units per second
      private static gravity: fudge.Vector2 = fudge.Vector2.Y(-4);
      private directionGlobal: String = "right";
      // private action: ACTION;
      // private time: fudge.Time = new fudge.Time();
      public speed: fudge.Vector3 = fudge.Vector3.ZERO();
  
      constructor(_name: string = "Hare") {
        super(_name);
        this.addComponent(new fudge.ComponentTransform());
  
        for (let sprite of Hare.sprites) {
          let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
          nodeSprite.activate(false);
  
          nodeSprite.addEventListener(
            "showNext",
            (_event: Event) => { (<NodeSprite>_event.currentTarget).showFrameNext(); },
            true
          );
  
          this.appendChild(nodeSprite);
        }
  
        this.show(ACTION.IDLE);
        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, this.update);
      }
  
      public static generateSprites(_txtImage: fudge.TextureImage): void {
        Hare.sprites = [];
        let sprite: Sprite = new Sprite(ACTION.WALK);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 0, 77, 53), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        Hare.sprites.push(sprite);
      
        sprite = new Sprite(ACTION.IDLE);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 64, 77, 56), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        Hare.sprites.push(sprite);
      }
  
      public show(_action: ACTION): void {
        if (_action == ACTION.JUMP)
          return;
        for (let child of this.getChildren())
          child.activate(child.name == _action);
        // this.action = _action;
      }
  
      public act(_action: ACTION, _direction?: DIRECTION): void {
        switch (_action) {
          case ACTION.IDLE:
            this.speed.x = 0;
            break;
          case ACTION.WALK:
            let direction: number = (_direction == DIRECTION.RIGHT ? 1 : -1);
            this.speed.x = Hare.speedMax.x; // * direction;
            this.cmpTransform.local.rotation = fudge.Vector3.Y(90 - 90 * direction);
            if (direction == 1) {
              this.directionGlobal = "right";
            } else if (direction == -1) {
              this.directionGlobal = "left";
            }
            //console.log(this.speed.y);
            break;
          case ACTION.JUMP:
            if (this.speed.y != 0) {
              break;
            } else {
              this.speed.y = 3;
              break;
            }
        }
        this.show(_action);
      }
  
      private update = (_event: fudge.Eventƒ): void => {
        this.broadcastEvent(new CustomEvent("showNext"));
  
        let timeFrame: number = fudge.Loop.timeFrameGame / 1000;
        this.speed.y += Hare.gravity.y * timeFrame;
        let distance: fudge.Vector3 = fudge.Vector3.SCALE(this.speed, timeFrame);
        this.cmpTransform.local.translate(distance);
  
        this.checkCollision();
      }
  
      private checkCollision(): void {
        for (let floor of level.getChildren()) {
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
            this.cmpTransform.local.translation = translation;
            this.speed.y = 0;
          }

        }
      }
    }
  }