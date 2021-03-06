///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
  
    export class Items extends fudge.Node {

      private static sprites: Sprite[];
      public hitbox: Hitbox;
      public type: string;
      public speed: fudge.Vector3 = fudge.Vector3.ZERO();
      private counter: number = 0;
  
      constructor(_name: string, _x: number, _y: number) {
        super(_name);
        this.addComponent(new fudge.ComponentTransform());
  
        for (let sprite of Items.sprites) {
          let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
          nodeSprite.activate(false);
  
          nodeSprite.addEventListener(
            "showNext",
            (_event: Event) => { (<NodeSprite>_event.currentTarget).showFrameNext(); },
            true
          );
  
          this.appendChild(nodeSprite);
        }
        this.cmpTransform.local.translation = new fudge.Vector3(_x, _y, -1);
        this.creatHitbox();
        this.show(ACTION.HIT);
        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, this.update);
      }
  
      public static generateSprites(_txtImage: fudge.TextureImage): void {
        Items.sprites = [];

        let sprite: Sprite = new Sprite(ACTION.IDLE);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 0, 30, 34), 1, fudge.Vector2.ZERO(), 90, fudge.ORIGIN2D.BOTTOMCENTER);
        Items.sprites.push(sprite);
      }

      public creatHitbox(): Hitbox {

        let hitbox: Hitbox = new Hitbox(this, "ItemHitbox");
        hitbox.cmpTransform.local.scaleX(0.2);
        hitbox.cmpTransform.local.scaleY(0.3);
        this.hitbox = hitbox;
        return hitbox;
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
            break;
        }
        this.show(_action);
      }
  
      private update = (_event: fudge.Eventƒ): void => {
        this.broadcastEvent(new CustomEvent("showNext"));
        this.counter += 1;
        this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.01, this.mtxWorld.translation.y + 0.3, -1);
        
        if (this.counter < 20) {
          this.cmpTransform.local.translateY(0.005);
        } else if (this.counter >= 20 && this.counter < 40) {
          this.cmpTransform.local.translateY(-0.005);
        } else {
          this.counter = 0;
        }
        this.checkGroundCollision();
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

          pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x - 0.40, this.cmpTransform.local.translation.y);
          pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
          hitLeft = rect.isInside(pointLeft);
          hitRight = rect.isInside(pointRight);

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