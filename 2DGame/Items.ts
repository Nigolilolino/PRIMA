///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
  
    export class Items extends fudge.Node {

        public hitbox: Hitbox;
        public type: string;
        public speed: fudge.Vector3 = fudge.Vector3.ZERO();
        private static gravity: fudge.Vector2 = fudge.Vector2.Y(-4);
        private static sprites: Sprite[];
  
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
        this.cmpTransform.local.translation = new fudge.Vector3(_x, _y, 0);
        //this.cmpTransform.local.scale(new fudge.Vector3(0.6, 0.6, 0));
        this.creatHitbox();
        this.show(ACTION.HIT);
        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, this.update);
      }
  
      public static generateSprites(_txtImage: fudge.TextureImage): void {
        Items.sprites = [];
        let sprite: Sprite = new Sprite(ACTION.WALK);

        sprite = new Sprite(ACTION.IDLE);
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
        for (let child of this.getChildren()){
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
  
        let timeFrame: number = fudge.Loop.timeFrameGame / 1000;
        this.speed.y += Items.gravity.y * timeFrame;
        let distance: fudge.Vector3 = fudge.Vector3.SCALE(this.speed, timeFrame);
        this.cmpTransform.local.translate(distance);
        this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.01, this.mtxWorld.translation.y + 0.3, 0);
        this.cmpTransform.local.rotateY(10);
        
        if(this.hitbox.checkCollision()){
          fudge.Debug.log("Colected");
        }
        this.checkGroundCollision();
      }
  
      private checkGroundCollision(): void {


        for (let floor of level.getChildren()) {

          if(floor.name == "PlayerHitbox" || floor.name == "EnemyHitbox"){
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