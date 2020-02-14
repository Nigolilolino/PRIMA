"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    let ACTION;
    (function (ACTION) {
        ACTION["IDLE"] = "Idle";
        ACTION["WALK"] = "Walk";
        ACTION["JUMP"] = "Jump";
        ACTION["HIT"] = "Hit";
        ACTION["DIE"] = "Die";
    })(ACTION = L16_ScrollerCollide.ACTION || (L16_ScrollerCollide.ACTION = {}));
    let DIRECTION;
    (function (DIRECTION) {
        DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
        DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    })(DIRECTION = L16_ScrollerCollide.DIRECTION || (L16_ScrollerCollide.DIRECTION = {}));
    class Knight extends fudge.Node {
        constructor(_name = "Knight") {
            super(_name);
            this.directionGlobal = "right";
            this.frameCounter = 0;
            this.hitboxes = [];
            this.healthbar = [];
            // private time: fudge.Time = new fudge.Time();
            this.speed = fudge.Vector3.ZERO();
            this.healthpoints = 11;
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = fudge.Loop.timeFrameGame / 1000;
                this.speed.y += Knight.gravity.y * timeFrame;
                let distance = fudge.Vector3.SCALE(this.speed, timeFrame);
                if (this.directionGlobal == "right") {
                    if (this.action == ACTION.WALK || this.action == ACTION.JUMP && this.speed.x != 0) {
                        this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.15, this.mtxWorld.translation.y + 0.8, 0);
                        this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.45, this.mtxWorld.translation.y + 0.35, 0);
                    }
                    else {
                        this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.2, this.mtxWorld.translation.y + 0.8, 0);
                        this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.45, this.mtxWorld.translation.y + 0.35, 0);
                    }
                }
                else if (this.directionGlobal == "left") {
                    if (this.action == ACTION.WALK || this.action == ACTION.JUMP && this.speed.x != 0) {
                        this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.15, this.mtxWorld.translation.y + 0.8, 0);
                        this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.45, this.mtxWorld.translation.y + 0.35, 0);
                    }
                    else {
                        this.hitboxes[0].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x + 0.2, this.mtxWorld.translation.y + 0.8, 0);
                        this.hitboxes[1].cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.45, this.mtxWorld.translation.y + 0.35, 0);
                    }
                }
                this.cmpTransform.local.translate(distance);
                let colider = this.hitboxes[0].checkCollision();
                if (colider == "Hit") {
                    this.healthpoints = this.healthpoints - 1;
                    this.updateHealthbar();
                    if (this.directionGlobal == "right") {
                        this.cmpTransform.local.translateX(-0.5);
                    }
                    else {
                        this.cmpTransform.local.translateX(+0.5);
                    }
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
                if (this.healthpoints <= 0 || this.cmpTransform.local.translation.y < -1) {
                    fudge.Loop.stop();
                    this.die();
                }
                let values = this.hitboxes[1].checkCollisionWeapon();
                if (values) {
                    if (this.frameCounter == 6 || values[0] == "Hit" && this.frameCounter == 7) {
                        let enemyHitbox = values[1];
                        let enemy = enemyHitbox.master;
                        if (this.directionGlobal == "right") {
                            enemy.cmpTransform.local.translateX(+0.5);
                            enemy.receiveHit();
                        }
                        else {
                            enemy.cmpTransform.local.translateX(-0.5);
                            enemy.receiveHit();
                        }
                    }
                }
                this.checkGroundCollision();
            };
            this.addComponent(new fudge.ComponentTransform());
            for (let sprite of Knight.sprites) {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => { _event.currentTarget.showFrameNext(); }, true);
                this.appendChild(nodeSprite);
            }
            this.creatHitbox();
            fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            Knight.sprites = [];
            let sprite = new L16_ScrollerCollide.Sprite(ACTION.WALK);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 0, 77, 52), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            for (let i = 0; i < sprite.frames.length; i++) {
                sprite.frames[i].pivot.translateX(0.3);
            }
            Knight.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(ACTION.IDLE);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 64, 77, 55), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Knight.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(ACTION.HIT);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 130, 76, 65), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
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
            hitboxWeapon.cmpTransform.local.scaleY(0.1);
            this.hitboxes.push(hitboxWeapon);
            return this.hitboxes[1];
        }
        show(_action) {
            if (_action == ACTION.JUMP)
                return;
            for (let child of this.getChildren()) {
                child.activate(child.name == _action);
            }
        }
        act(_action, _direction) {
            switch (_action) {
                case ACTION.IDLE:
                    this.action = _action;
                    this.speed.x = 0;
                    this.frameCounter = 0;
                    break;
                case ACTION.WALK:
                    this.action = _action;
                    let direction = (_direction == DIRECTION.RIGHT ? 1 : -1);
                    this.speed.x = Knight.speedMax.x; // * direction;
                    this.cmpTransform.local.rotation = fudge.Vector3.Y(90 - 90 * direction);
                    if (direction == 1) {
                        this.directionGlobal = "right";
                        this.frameCounter = 0;
                    }
                    else if (direction == -1) {
                        this.directionGlobal = "left";
                        this.frameCounter = 0;
                    }
                    break;
                case ACTION.JUMP:
                    this.action = _action;
                    if (this.speed.y != 0) {
                        this.frameCounter = 0;
                        break;
                    }
                    else {
                        this.speed.y = 3;
                        this.frameCounter = 0;
                        break;
                    }
                case ACTION.HIT:
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
        die() {
            let deathScreen = document.getElementById("deathScreen");
            deathScreen.style.visibility = "visible";
        }
        checkGroundCollision() {
            for (let floor of L16_ScrollerCollide.level.getChildren()) {
                if (floor.name != "Floor") {
                    continue;
                }
                let rect = floor.getRectWorld();
                let pointLeft;
                let pointRight;
                let hitLeft;
                let hitRight;
                if (this.directionGlobal == "right") {
                    if (this.action == ACTION.WALK) {
                        pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
                        pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
                        hitLeft = rect.isInside(pointLeft);
                        hitRight = rect.isInside(pointRight);
                    }
                    else {
                        pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x - 0.40, this.cmpTransform.local.translation.y);
                        pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
                        hitLeft = rect.isInside(pointLeft);
                        hitRight = rect.isInside(pointRight);
                    }
                }
                else if (this.directionGlobal == "left") {
                    if (this.action == ACTION.WALK) {
                        pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
                        pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
                        hitLeft = rect.isInside(pointLeft);
                        hitRight = rect.isInside(pointRight);
                    }
                    else {
                        pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x + 0.4, this.cmpTransform.local.translation.y);
                        pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
                        hitLeft = rect.isInside(pointLeft);
                        hitRight = rect.isInside(pointRight);
                    }
                }
                if (hitRight || hitLeft) {
                    let translation = this.cmpTransform.local.translation;
                    translation.y = rect.y;
                    if (translation.y - 0.4 > this.cmpTransform.local.translation.y) {
                        translation.x = this.cmpTransform.local.translation.x + 0.1;
                        translation.y = this.cmpTransform.local.translation.y;
                    }
                    this.cmpTransform.local.translation = translation;
                    this.speed.y = 0;
                }
            }
        }
    }
    Knight.speedMax = new fudge.Vector2(1.5, 5); // units per second
    Knight.gravity = fudge.Vector2.Y(-3.4);
    L16_ScrollerCollide.Knight = Knight;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Knight.js.map