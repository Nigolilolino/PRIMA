///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
    
  
    export class EnemyMelee extends Enemy {
      
    
      constructor(_name: string, _x: number, _y: number) {
        super(_name);
        this.addComponent(new fudge.ComponentTransform());
  
        for (let sprite of EnemyMelee.sprites) {
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
        this.walkingTimeMax = 100;
        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, this.update);
      }
  
      public static generateSprites(_txtImage: fudge.TextureImage): void {
        EnemyMelee.sprites = [];
        let sprite: Sprite = new Sprite(ACTION.WALK);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(14, 74, 88, 59), 9, fudge.Vector2.ZERO(), 45, fudge.ORIGIN2D.BOTTOMCENTER);
        EnemyMelee.sprites.push(sprite);
      
        sprite = new Sprite(ACTION.IDLE);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(17, 3, 86, 59), 4, fudge.Vector2.ZERO(), 45, fudge.ORIGIN2D.BOTTOMCENTER);
        EnemyMelee.sprites.push(sprite);

        sprite = new Sprite(ACTION.HIT);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(14, 137, 94, 85), 8, fudge.Vector2.ZERO(), 45, fudge.ORIGIN2D.BOTTOMCENTER);
        EnemyMelee.sprites.push(sprite);

        // sprite = new Sprite(ACTION.DIE);
        // sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(20, 210, 71, 67), 5, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        // EnemyMelee.sprites.push(sprite);
      }

      public creatHitbox(): Hitbox {
        let hitbox: Hitbox = new Hitbox(this, "EnemyHitbox");
        hitbox.cmpTransform.local.scaleX(0.9);
        hitbox.cmpTransform.local.scaleY(0.5);
        this.hitbox = hitbox;
        return hitbox;
      }

      public show(_action: ACTION): void {
        for (let child of this.getChildren()) {
          child.activate(child.name == _action);
        }
      }
  
      public act(_action: ACTION, _direction: String = this.directionGlobal): void {
        let fightMode: boolean = this.checkDistanceToPlayer();
        if (fightMode == true) {
          if (this.frameCounter > 4 && this.frameCounter < 12) {
            this.frameCounter = this.frameCounter + 1;
            _action = ACTION.HIT;
          } else {
            _action = ACTION.IDLE;
            this.frameCounter = this.frameCounter + 1;
          }
        }
        let direction: number = (_direction == "right" ? 1 : -1);
        this.cmpTransform.local.rotation = fudge.Vector3.Y(90 - 90 * direction);
        switch (_action) {
          case ACTION.IDLE:
            if (this.frameCounter > 35) {
              this.frameCounter = 0;
            }
            this.speed.x = 0;
            break;
          case ACTION.WALK:
            this.speed.x = EnemyMelee.speedMax.x; // * direction;
            if (this.currentWalkingTime < this.walkingTimeMax) {
              if (direction == 1) {
                this.currentWalkingTime = this.currentWalkingTime + 1;
              } else {
                this.currentWalkingTime = this.currentWalkingTime + 1;
              }
            } else { 
              if (direction == 1) {
                this.currentWalkingTime = 0;
                direction = -1;
              } else {
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
            this.speed.x = EnemyMelee.speedMax.x + 1;
            break;
        }
        this.show(_action);
      }

      public receiveHit(): void {
        super.receiveHit();
    }

      protected deleteThis(): void {
        super.deleteThis();
      }
  
      protected update = (_event: fudge.Eventƒ): void => {
        this.broadcastEvent(new CustomEvent("showNext"));
        let timeFrame: number = fudge.Loop.timeFrameGame / 1000;
        this.speed.y += Enemy.gravity.y * timeFrame;
        let distance: fudge.Vector3 = fudge.Vector3.SCALE(this.speed, timeFrame);
        this.cmpTransform.local.translate(distance);

        if (this.directionGlobal == "right") {
          this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.1, this.mtxWorld.translation.y + 0.6, 0);
        } else if (this.directionGlobal == "left") {
          this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.1, this.mtxWorld.translation.y + 0.6, 0);
        }
        this.checkGroundCollision();
      }

      protected checkDistanceToPlayer(): boolean {
        if (this.getParent() != null) {
          let level: fudge.Node = this.getParent();
          let game: fudge.Node = level.getParent();
          let children: fudge.Node[] = game.getChildrenByName("Hare");

          let positionOfEnemy: number = this.cmpTransform.local.translation.x;
          let positionOfPlayer: number = children[0].cmpTransform.local.translation.x;
          let distance: number = positionOfEnemy - positionOfPlayer;
          if (distance > -1 && distance < 1) {
            if (distance > 0) {
              this.directionGlobal = "left";
            } else {
              this.directionGlobal = "right";
            }
            return true;
          }
        }
        return false;
      }

  
      protected checkGroundCollision(): void {
        super.checkGroundCollision();
      }

    }
  }