///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
    
  
    export class Enemy extends fudge.Node {
      private static sprites: Sprite[];
      private static speedMax: fudge.Vector2 = new fudge.Vector2(1.5, 5); // units per second
      private static gravity: fudge.Vector2 = fudge.Vector2.Y(-4);
      private directionGlobal: String = "right";
      private walkingTimeMax = 120;
      private currentWalkingTime = 0;
      private frameCounter: number = 0;
      public healthpoints: number  = 6;
      public hitbox: Hitbox;
      public fieldOfView: Hitbox;
      public speed: fudge.Vector3 = fudge.Vector3.ZERO();
    
  
      constructor(_name: string, _x: number, _y:number) {
        super(_name);
        this.addComponent(new fudge.ComponentTransform());
  
        for (let sprite of Enemy.sprites) {
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
        this.cmpTransform.local.scale(new fudge.Vector3(0.6, 0.6, 0));
        this.creatHitbox();
        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, this.update);
      }
  
      public static generateSprites(_txtImage: fudge.TextureImage): void {
        Enemy.sprites = [];
        let sprite: Sprite = new Sprite(ACTION.WALK);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(17, 288, 74, 65), 11, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        Enemy.sprites.push(sprite);
      
        sprite = new Sprite(ACTION.IDLE);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(19, 16, 67, 66), 4, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        Enemy.sprites.push(sprite);

        sprite = new Sprite(ACTION.HIT);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(15, 87, 68, 75), 7, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        Enemy.sprites.push(sprite);
      }

      public creatHitbox(): Hitbox {
        let hitbox: Hitbox = new Hitbox(this, "EnemyHitbox");
        hitbox.cmpTransform.local.scaleX(0.4);
        hitbox.cmpTransform.local.scaleY(0.6);
        this.hitbox = hitbox;
        return hitbox;
      }

      public show(_action: ACTION): void {
        for (let child of this.getChildren()){
          child.activate(child.name == _action);
        }
      }
  
      public act(_action: ACTION, _direction:String = this.directionGlobal): void {
        let fightMode: boolean = this.checkDistanceToPlayer();
        fudge.Debug.log(this.frameCounter);
        if (fightMode == true) {
          _action = ACTION.HIT;
        }
        let direction: number = (_direction == "right" ? 1 : -1);
        this.cmpTransform.local.rotation = fudge.Vector3.Y(90 - 90 * direction);
        switch (_action) {
          case ACTION.IDLE:
            this.speed.x = 0;
            break;
          case ACTION.WALK:
            this.speed.x = Enemy.speedMax.x; // * direction;
            if (this.currentWalkingTime < this.walkingTimeMax) {
              if(direction == 1) {
                this.currentWalkingTime = this.currentWalkingTime + 1;
              }else{
                this.currentWalkingTime = this.currentWalkingTime + 1;
              }
            }else{ 
              if(direction == 1){
                this.currentWalkingTime = 0;
                direction = -1;
              }else{
                this.currentWalkingTime = 0;
                direction = 1;
              }
            }

            if (direction == 1) {
              this.directionGlobal = "right";
            } else if (direction == -1) {
              this.directionGlobal = "left";
            }
            break;
          case ACTION.JUMP:
            if (this.speed.y != 0) {
              break;
            } else {
              this.speed.y = 3;
              break;
            }
            
          case ACTION.HIT:
            this.speed.x = 0;
            if (this.frameCounter < 36) {
              this.frameCounter = this.frameCounter + 1;
            } else {
              this.frameCounter = 0;
            }
            break;
        }
        this.show(_action);
      }

      public receiveHit(): void {
        this.healthpoints = this.healthpoints - 1;
        if (this.healthpoints <= 0) {
          let parent: fudge.Node = this.getParent();
          parent.removeChild(this.hitbox);
          parent.removeChild(this);
        }
      }
  
      private update = (_event: fudge.Eventƒ): void => {
        this.broadcastEvent(new CustomEvent("showNext"));
        let timeFrame: number = fudge.Loop.timeFrameGame / 1000;
        this.speed.y += Enemy.gravity.y * timeFrame;
        let distance: fudge.Vector3 = fudge.Vector3.SCALE(this.speed, timeFrame);
        this.cmpTransform.local.translate(distance);

        // if (this.currentWalkingTime < this.walkingTimeMax) {
        //   if(this.directionGlobal == "right"){
        //     this.cmpTransform.local.translateX(0.02);
        //     this.currentWalkingTime = this.currentWalkingTime + 1;
        //   }else{
        //     this.cmpTransform.local.translateX(-0.02);
        //     this.currentWalkingTime = this.currentWalkingTime + 1;
        //   }
        // }else{
        //   if(this.directionGlobal == "right"){
        //     this.currentWalkingTime = 0;
        //     this.directionGlobal = "left";
        //   }else{
        //     this.currentWalkingTime = 0;
        //     this.directionGlobal = "right";
        //   }
        // }

        if (this.directionGlobal == "right") {
          this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y + 0.6, 0);
        } else if (this.directionGlobal == "left") {
          this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y + 0.6, 0);
        }

        this.checkGroundCollision();
      }

      private checkDistanceToPlayer(): boolean {
        if (this.getParent() != null) {
          let level: fudge.Node = this.getParent();
          let game: fudge.Node = level.getParent();
          let children: fudge.Node[] = game.getChildrenByName("Hare");

          let positionOfEnemy: number = this.cmpTransform.local.translation.x;
          let positionOfPlayer: number = children[0].cmpTransform.local.translation.x;
          let distance: number = positionOfEnemy - positionOfPlayer;
          if (distance > -4 && distance < 4) {
            if (distance > 0) {
              this.directionGlobal = "left";
              if (this.frameCounter == 5) {
                let stone: Stone = new Stone("Stone", this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y + 0.2, this.directionGlobal);
                level.appendChild(stone);
              }
            } else {
              this.directionGlobal = "right";
              if (this.frameCounter == 35) {
                let stone: Stone = new Stone("Stone", this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y + 0.2, this.directionGlobal);
                level.appendChild(stone);
              }
            }
            return true;
          }
        }
        return false;

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
            pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x - 0.1, this.cmpTransform.local.translation.y);
            pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
            hitLeft = rect.isInside(pointLeft);
            hitRight = rect.isInside(pointRight);

          } else if (this.directionGlobal == "left") {
            pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
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