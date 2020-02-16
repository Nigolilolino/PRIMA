///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
    
  
    export class EnemyRanged extends Enemy {

      constructor(_name: string, _x: number, _y:number) {
        super(_name);
        this.addComponent(new fudge.ComponentTransform());

        for (let sprite of EnemyRanged.sprites) {
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
        this.walkingTimeMax = 20;
        this.healthpoints = 4;
      }
  
      public static generateSprites(_txtImage: fudge.TextureImage): void {
        EnemyRanged.sprites = [];
        let sprite: Sprite = new Sprite(ACTION.WALK);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(17, 288, 74, 65), 11, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        EnemyRanged.sprites.push(sprite);
      
        sprite = new Sprite(ACTION.IDLE);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(19, 16, 67, 66), 4, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        EnemyRanged.sprites.push(sprite);

        sprite = new Sprite(ACTION.HIT);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(15, 87, 68, 75), 7, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        EnemyRanged.sprites.push(sprite);

      }
  
      public act(_action: ACTION, _direction: String = this.directionGlobal): void {
        let fightMode: boolean = this.checkDistanceToPlayer();
        if (fightMode == true) {
          if (this.frameCounter > 4 && this.frameCounter < 8) {
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
            if (this.frameCounter > 41) {
              this.frameCounter = 0;
            }
            this.speed.x = 0;
            break;
          case ACTION.WALK:
            this.speed.x = EnemyRanged.speedMax.x; // * direction;
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
            if (this.speed.y == 0)
              Sound.play("WalkOnGrass");
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
            
            break;
        }
        this.show(_action);
      }
  
      protected checkDistanceToPlayer(): boolean {
        if (this.getParent() != null) {
          let level: fudge.Node = this.getParent();
          let game: fudge.Node = level.getParent();
          let children: fudge.Node[] = game.getChildrenByName("Knight");

          let positionOfEnemyX: number = this.cmpTransform.local.translation.x;
          let positionOfPlayerX: number = children[0].cmpTransform.local.translation.x;
          let positionOfEnemyY: number = this.cmpTransform.local.translation.y;
          let positionOfPlayerY: number = children[0].cmpTransform.local.translation.y;
          let distanceX: number = positionOfEnemyX - positionOfPlayerX;
          let distanceY: number = positionOfEnemyY - positionOfPlayerY;
          if (distanceX > -3 && distanceX < 3 && distanceY > -1.5) {
            if (distanceX > 0) {
              this.directionGlobal = "left";
              if (this.frameCounter == 5) {
                this.createProjectiles();
              }
            } else {
              this.directionGlobal = "right";
              if (this.frameCounter == 5) {
                this.createProjectiles();
              }
            }
            return true;
          }
        }
        return false;
      }

      private createProjectiles(): void {
        let stone: Stone = new Stone("Stone", this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y + 0.2, this.directionGlobal, level);
        level.appendChild(stone);
        level.appendChild(stone.creatHitbox());
      }

    }
  }