///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
  import fudge = FudgeCore;

  export class Knight extends Characters {
    public hitboxes: Hitbox[] = [];
    public healthbar: Healthpoints[] = [];

    constructor(_name: string = "Knight") {
      super(_name);
      this.addComponent(new fudge.ComponentTransform());

      for (let sprite of Knight.sprites) {
        let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
        nodeSprite.activate(false);

        nodeSprite.addEventListener(
          "showNext",
          (_event: Event) => { (<NodeSprite>_event.currentTarget).showFrameNext(); },
          true
        );

        this.appendChild(nodeSprite);
      }
      this.healthpoints = 11;
      this.creatHitbox();
      fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, this.update);
    }

    public static generateSprites(_txtImage: fudge.TextureImage[]): void {
      Knight.sprites = [];
      let sprite: Sprite = new Sprite(ACTION.WALK);
      sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(0, 0, 77, 52), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
      for (let i = 0; i < sprite.frames.length; i++) {
        sprite.frames[i].pivot.translateX(0.3);
      }
      Knight.sprites.push(sprite);

      sprite = new Sprite(ACTION.IDLE);
      sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(0, 64, 77, 55), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
      Knight.sprites.push(sprite);

      sprite = new Sprite(ACTION.HIT);
      sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(0, 130, 76, 65), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
      Knight.sprites.push(sprite);

      sprite = new Sprite(ACTION.DIE);
      sprite.generateByGrid(_txtImage[1], fudge.Rectangle.GET(15, 8, 84, 60), 7, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
      Knight.sprites.push(sprite);

      sprite = new Sprite(ACTION.JUMP);
      sprite.generateByGrid(_txtImage[1], fudge.Rectangle.GET(20, 109, 66, 58), 7, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
      Knight.sprites.push(sprite);

      sprite = new Sprite(ACTION.MID_AIR);
      sprite.generateByGrid(_txtImage[1], fudge.Rectangle.GET(284, 109, 66, 58), 1, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
      Knight.sprites.push(sprite);

      sprite = new Sprite(ACTION.GETTING_DAMAGE);
      sprite.generateByGrid(_txtImage[1], fudge.Rectangle.GET(19, 193, 72, 66), 7, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
      Knight.sprites.push(sprite);
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
      hitboxWeapon.cmpTransform.local.scaleY(0.2);
      this.hitboxes.push(hitboxWeapon);
      return this.hitboxes[1];
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
          this.speed.x = Knight.speedMax.x;
          this.cmpTransform.local.rotation = fudge.Vector3.Y(90 - 90 * direction);
          if (direction == 1) {
            this.directionGlobal = "right";
            this.frameCounter = 0;
          } else if (direction == -1) {
            this.directionGlobal = "left";
            this.frameCounter = 0;
          }
          if (this.speed.y == 0)
          Sound.play("WalkOnGrass");
          break;
        case ACTION.JUMP:
          this.action = _action;
          if (this.speed.y != 0) {
            this.frameCounter = 0;
            break;
          } else {
            this.speed.y = 3;
            this.frameCounter += 1;
            break;
          }

        case ACTION.HIT:
          Sound.play("Sword");
          this.action = _action;
          this.speed.x = 0;
          if (this.frameCounter > 6) {
            this.frameCounter = 0;
          }
          this.frameCounter = this.frameCounter + 1;
          break;
      }
      this.show(_action);
    }

    protected update = (_event: fudge.Eventƒ): void => {
      this.broadcastEvent(new CustomEvent("showNext"));

      let timeFrame: number = fudge.Loop.timeFrameGame / 1000;
      this.speed.y += Knight.gravity.y * timeFrame;
      let distance: fudge.Vector3 = fudge.Vector3.SCALE(this.speed, timeFrame);
      this.cmpTransform.local.translate(distance);

      if (this.directionGlobal == "right") {
        if (this.action == ACTION.WALK || this.action == ACTION.JUMP && this.speed.x != 0) {
          this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.15, this.mtxWorld.translation.y + 0.8, 0);
          this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.45, this.mtxWorld.translation.y + 0.35, 0);
        } else {
          this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.2, this.mtxWorld.translation.y + 0.8, 0);
          this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.45, this.mtxWorld.translation.y + 0.5, 0);
        }
      } else if (this.directionGlobal == "left") {
        if (this.action == ACTION.WALK || this.action == ACTION.JUMP && this.speed.x != 0) {
          this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.15, this.mtxWorld.translation.y + 0.8, 0);
          this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.45, this.mtxWorld.translation.y + 0.35, 0);
        } else {
          this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.2, this.mtxWorld.translation.y + 0.8, 0);
          this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.45, this.mtxWorld.translation.y + 0.35, 0);
        }
      }

      this.checkForInteractions();
      this.checkGroundCollision(0.4, 0);
    }

    private updateHealthbar(): void {
      if (this.healthpoints == 11) {
        return;
      }
      let lifeDifference: number = 10 - this.healthpoints;
      for (let i: number = 0; i < this.healthbar.length; i++) {
        if (i < lifeDifference) {
          this.healthbar[i].act(STATUS.EMPTY);
        } else {
          this.healthbar[i].act(STATUS.FULL);
        }
      }
    }

    private checkForInteractions(): void {
      let colider: string = this.hitboxes[0].checkCollision();

      if (colider == "Hit") {
        if (this.healthpoints != 11)
        Sound.play("HitHuman");
        this.receiveHit(this.directionGlobal);
        this.updateHealthbar();
      } else if (colider == "Collected") {
        Sound.play("Slurp");
        if (this.healthpoints + 2 > 10) {
          this.healthpoints = 10;
        } else {
          this.healthpoints = this.healthpoints + 2;
        }
        this.updateHealthbar();
      }

      let combatValues: (string | fudge.Node)[] = this.hitboxes[1].checkCollisionWeapon();
      if (combatValues) {
        if (this.frameCounter == 6 || combatValues[0] == "Hit" && this.frameCounter == 7) {
          let enemyHitbox: Hitbox = <Hitbox>combatValues[1];
          let enemy: Enemy = <Enemy>enemyHitbox.master;
          enemy.receiveHit(this.directionGlobal);
          Sound.play("HittingStone");
          Sound.play("HurtMonsterSmall");
          
        }
      }
    }

  }
}