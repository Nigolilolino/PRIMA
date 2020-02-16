"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    class Knight extends L16_ScrollerCollide.Characters {
        constructor(_name = "Knight") {
            super(_name);
            this.hitboxes = [];
            this.healthbar = [];
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = fudge.Loop.timeFrameGame / 1000;
                this.speed.y += Knight.gravity.y * timeFrame;
                let distance = fudge.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
                if (this.directionGlobal == "right") {
                    if (this.action == L16_ScrollerCollide.ACTION.WALK || this.action == L16_ScrollerCollide.ACTION.JUMP && this.speed.x != 0) {
                        this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.15, this.mtxWorld.translation.y + 0.8, 0);
                        this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.45, this.mtxWorld.translation.y + 0.35, 0);
                    }
                    else {
                        this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.2, this.mtxWorld.translation.y + 0.8, 0);
                        this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.45, this.mtxWorld.translation.y + 0.5, 0);
                    }
                }
                else if (this.directionGlobal == "left") {
                    if (this.action == L16_ScrollerCollide.ACTION.WALK || this.action == L16_ScrollerCollide.ACTION.JUMP && this.speed.x != 0) {
                        this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.15, this.mtxWorld.translation.y + 0.8, 0);
                        this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.45, this.mtxWorld.translation.y + 0.35, 0);
                    }
                    else {
                        this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.2, this.mtxWorld.translation.y + 0.8, 0);
                        this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.45, this.mtxWorld.translation.y + 0.35, 0);
                    }
                }
                this.checkForInteractions();
                this.checkGroundCollision(0.4, 0);
            };
            this.addComponent(new fudge.ComponentTransform());
            for (let sprite of Knight.sprites) {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => { _event.currentTarget.showFrameNext(); }, true);
                this.appendChild(nodeSprite);
            }
            this.healthpoints = 11;
            this.creatHitbox();
            fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            Knight.sprites = [];
            let sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.WALK);
            sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(0, 0, 77, 52), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            for (let i = 0; i < sprite.frames.length; i++) {
                sprite.frames[i].pivot.translateX(0.3);
            }
            Knight.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.IDLE);
            sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(0, 64, 77, 55), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Knight.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.HIT);
            sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(0, 130, 76, 65), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Knight.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.DIE);
            sprite.generateByGrid(_txtImage[1], fudge.Rectangle.GET(15, 8, 84, 60), 7, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Knight.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.JUMP);
            sprite.generateByGrid(_txtImage[1], fudge.Rectangle.GET(20, 109, 66, 58), 7, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Knight.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.MID_AIR);
            sprite.generateByGrid(_txtImage[1], fudge.Rectangle.GET(284, 109, 66, 58), 1, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Knight.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.GETTING_DAMAGE);
            sprite.generateByGrid(_txtImage[1], fudge.Rectangle.GET(19, 193, 72, 66), 7, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Knight.sprites.push(sprite);
        }
        creatHitbox() {
            let hitbox = new L16_ScrollerCollide.Hitbox(this, "PlayerHitbox");
            hitbox.cmpTransform.local.scaleX(0.4);
            hitbox.cmpTransform.local.scaleY(0.8);
            this.hitboxes.push(hitbox);
            return this.hitboxes[0];
        }
        createHitboxWeapon() {
            let hitboxWeapon = new L16_ScrollerCollide.Hitbox(this, "WeaponHitbox");
            hitboxWeapon.cmpTransform.local.scaleX(0.05);
            hitboxWeapon.cmpTransform.local.scaleY(0.2);
            this.hitboxes.push(hitboxWeapon);
            return this.hitboxes[1];
        }
        act(_action, _direction) {
            switch (_action) {
                case L16_ScrollerCollide.ACTION.IDLE:
                    this.action = _action;
                    this.speed.x = 0;
                    this.frameCounter = 0;
                    break;
                case L16_ScrollerCollide.ACTION.WALK:
                    this.action = _action;
                    let direction = (_direction == L16_ScrollerCollide.DIRECTION.RIGHT ? 1 : -1);
                    this.speed.x = Knight.speedMax.x;
                    this.cmpTransform.local.rotation = fudge.Vector3.Y(90 - 90 * direction);
                    if (direction == 1) {
                        this.directionGlobal = "right";
                        this.frameCounter = 0;
                    }
                    else if (direction == -1) {
                        this.directionGlobal = "left";
                        this.frameCounter = 0;
                    }
                    if (this.speed.y == 0)
                        L16_ScrollerCollide.Sound.play("WalkOnGrass");
                    break;
                case L16_ScrollerCollide.ACTION.JUMP:
                    this.action = _action;
                    if (this.speed.y != 0) {
                        this.frameCounter = 0;
                        break;
                    }
                    else {
                        this.speed.y = 3;
                        this.frameCounter += 1;
                        break;
                    }
                case L16_ScrollerCollide.ACTION.HIT:
                    L16_ScrollerCollide.Sound.play("Sword");
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
        updateHealthbar() {
            if (this.healthpoints == 11) {
                return;
            }
            let lifeDifference = 10 - this.healthpoints;
            for (let i = 0; i < this.healthbar.length; i++) {
                if (i < lifeDifference) {
                    this.healthbar[i].act(L16_ScrollerCollide.STATUS.EMPTY);
                }
                else {
                    this.healthbar[i].act(L16_ScrollerCollide.STATUS.FULL);
                }
            }
        }
        checkForInteractions() {
            let colider = this.hitboxes[0].checkCollision();
            if (colider == "Hit") {
                if (this.healthpoints != 11)
                    L16_ScrollerCollide.Sound.play("HitHuman");
                this.receiveHit(this.directionGlobal);
                this.updateHealthbar();
            }
            else if (colider == "Collected") {
                if (this.healthpoints + 2 > 10) {
                    this.healthpoints = 10;
                }
                else {
                    this.healthpoints = this.healthpoints + 2;
                }
                this.updateHealthbar();
            }
            let combatValues = this.hitboxes[1].checkCollisionWeapon();
            if (combatValues) {
                if (this.frameCounter == 6 || combatValues[0] == "Hit" && this.frameCounter == 7) {
                    let enemyHitbox = combatValues[1];
                    let enemy = enemyHitbox.master;
                    enemy.receiveHit(this.directionGlobal);
                    L16_ScrollerCollide.Sound.play("HittingStone");
                    L16_ScrollerCollide.Sound.play("HurtMonsterSmall");
                }
            }
        }
    }
    L16_ScrollerCollide.Knight = Knight;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Knight.js.map