///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
  
    export enum ACTION {
      IDLE = "Idle",
      WALK = "Walk",
      JUMP = "Jump",
      HIT = "Hit" ,
      DIE = "Die"

    }
    export enum DIRECTION {
      LEFT, RIGHT
    }
  
    export class Hare extends fudge.Node {
      private static sprites: Sprite[];
      private static speedMax: fudge.Vector2 = new fudge.Vector2(1.5, 5); // units per second
      private static gravity: fudge.Vector2 = fudge.Vector2.Y(-4);
      public directionGlobal: String = "right";
      private frameCounter: number = 0;
      public hitboxes: Hitbox[] = [];
      public healthbar: Healthpoints[] = [];
      private action: ACTION;
      // private time: fudge.Time = new fudge.Time();
      public speed: fudge.Vector3 = fudge.Vector3.ZERO();
      public healthpoints: number  = 11;
  
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
        this.creatHitbox();
     
        //this.show(ACTION.HIT);
        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, this.update);
      }
  
      public static generateSprites(_txtImage: fudge.TextureImage): void {
        Hare.sprites = [];
        let sprite: Sprite = new Sprite(ACTION.WALK);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 0, 77, 52), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        for (let i = 0; i < sprite.frames.length; i++) {
          sprite.frames[i].pivot.translateX(0.3);
        }
        Hare.sprites.push(sprite);
      
        sprite = new Sprite(ACTION.IDLE);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 64, 77, 55), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        Hare.sprites.push(sprite);

        sprite = new Sprite(ACTION.HIT);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 130, 76, 65), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        Hare.sprites.push(sprite);
      }

      public creatHitbox(): Hitbox {

        let hitbox: Hitbox = new Hitbox(this, "PlayerHitbox");
        hitbox.cmpTransform.local.scaleX(0.4);
        hitbox.cmpTransform.local.scaleY(0.8);
        this.hitboxes.push(hitbox);
        return this.hitboxes[0];
      }

      public createHitboxWeapon(): Hitbox {
        let hitboxWeapon: Hitbox = new Hitbox(this, "WeaponHitbox");
        hitboxWeapon.cmpTransform.local.scaleX(0.05);
        hitboxWeapon.cmpTransform.local.scaleY(0.05);
        this.hitboxes.push(hitboxWeapon);
        return this.hitboxes[1];
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
            this.action = _action;
            this.speed.x = 0;
            this.frameCounter = 0;
            break;
          case ACTION.WALK:
            this.action = _action;
            let direction: number = (_direction == DIRECTION.RIGHT ? 1 : -1);
            this.speed.x = Hare.speedMax.x; // * direction;
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
            this.action = _action;
            if (this.speed.y != 0) {
              this.frameCounter = 0;
              break;
            } else {
              this.speed.y = 3;
              this.frameCounter = 0;
              break;
            }
            
          case ACTION.HIT:
            this.action = _action;
            this.speed.x = 0;
            if(this.frameCounter > 6) {
              this.frameCounter = 0;
            }
            this.frameCounter = this.frameCounter + 1;
            break;
        }
        this.show(_action);
      }

      private updateHealthbar(){
        if(this.healthpoints == 11){
          return;
        }
        let lifeDifference: number = 10 - this.healthpoints;
        for(let i =  0; i < this.healthbar.length; i++){
          if(i < lifeDifference){
            this.healthbar[i].act(STATUS.EMPTY);
          }else{
            this.healthbar[i].act(STATUS.FULL);
          }
        }
      }
  
      private update = (_event: fudge.Eventƒ): void => {
        this.broadcastEvent(new CustomEvent("showNext"));
  
        let timeFrame: number = fudge.Loop.timeFrameGame / 1000;
        this.speed.y += Hare.gravity.y * timeFrame;
        let distance: fudge.Vector3 = fudge.Vector3.SCALE(this.speed, timeFrame);

        if (this.directionGlobal == "right") {
          if (this.action == ACTION.WALK) {
            this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.15, this.mtxWorld.translation.y + 0.8, 0);
            this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.45, this.mtxWorld.translation.y + 0.35, 0);
          } else {
            this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.2, this.mtxWorld.translation.y + 0.8, 0);
            this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.45, this.mtxWorld.translation.y + 0.35, 0);
          }
        } else if (this.directionGlobal == "left") {
          if (this.action == ACTION.WALK) {
            this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.15, this.mtxWorld.translation.y + 0.8, 0);
            this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.45, this.mtxWorld.translation.y + 0.35, 0);
          } else {
            this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.2, this.mtxWorld.translation.y + 0.8, 0);
            this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.45, this.mtxWorld.translation.y + 0.35, 0);
          }
        }
        this.cmpTransform.local.translate(distance);

        let colider: string = this.hitboxes[0].checkCollision();
        
        if (colider == "Hit") {
          this.healthpoints = this.healthpoints - 1;
          this.updateHealthbar();
          if (this.healthpoints <= 0) {
            this.deleteThis();
          }
          if (this.directionGlobal == "right") {
            this.cmpTransform.local.translateX(-0.5);
          } else {
            this.cmpTransform.local.translateX(+0.5);
          }
        } else if (colider == "Collected") {
          if (this.healthpoints + 2 > 10) {
            this.healthpoints = 10;
          } else {
            this.healthpoints = this.healthpoints + 2;
          }
          this.updateHealthbar();
        }

        let values: (string|fudge.Node)[] = this.hitboxes[1].checkCollisionWeapon();
        if (values) {
          if (this.frameCounter == 6 || values[0] == "Hit" && this.frameCounter == 7) {
            let enemyHitbox: Hitbox = <Hitbox>values[1];
            let enemy: Enemy = <Enemy> enemyHitbox.master;
            if (this.directionGlobal == "right") {
              enemy.cmpTransform.local.translateX(+0.5);
              enemy.receiveHit();
            } else {
              enemy.cmpTransform.local.translateX(-0.5);
              enemy.receiveHit();
            }
           
          }
        }

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