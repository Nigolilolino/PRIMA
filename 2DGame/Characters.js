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
        ACTION["DEAD"] = "Dead";
    })(ACTION = L16_ScrollerCollide.ACTION || (L16_ScrollerCollide.ACTION = {}));
    let DIRECTION;
    (function (DIRECTION) {
        DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
        DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    })(DIRECTION = L16_ScrollerCollide.DIRECTION || (L16_ScrollerCollide.DIRECTION = {}));
    class Characters extends fudge.Node {
        constructor(_name = "Characters") {
            super(_name);
            this.speed = fudge.Vector3.ZERO();
            this.directionGlobal = "right";
            this.hitboxes = [];
            this.frameCounter = 0;
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = fudge.Loop.timeFrameGame / 1000;
                this.speed.y += Characters.gravity.y * timeFrame;
                let distance = fudge.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
                this.checkGroundCollision();
            };
            this.addComponent(new fudge.ComponentTransform());
            for (let sprite of Characters.sprites) {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => { _event.currentTarget.showFrameNext(); }, true);
                this.appendChild(nodeSprite);
            }
            this.creatHitbox();
            fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            Characters.sprites = [];
        }
        creatHitbox() {
            let hitbox = new L16_ScrollerCollide.Hitbox(this, "PlayerHitbox");
            hitbox.cmpTransform.local.scaleX(0.4);
            hitbox.cmpTransform.local.scaleY(0.8);
            this.hitboxes.push(hitbox);
            return this.hitboxes[0];
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
                    this.speed.x = 0;
                    this.frameCounter = 0;
                    break;
                case ACTION.WALK:
                    let direction = (_direction == DIRECTION.RIGHT ? 1 : -1);
                    this.speed.x = Characters.speedMax.x; // * direction;
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
                    this.speed.x = 0;
                    if (this.frameCounter > 6) {
                        this.frameCounter = 0;
                    }
                    this.frameCounter = this.frameCounter + 1;
                    break;
            }
            this.show(_action);
        }
        deleteThis() {
            let parent = this.getParent();
            parent.removeChild(this);
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
                    pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x - 0.40, this.cmpTransform.local.translation.y);
                    pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
                    hitLeft = rect.isInside(pointLeft);
                    hitRight = rect.isInside(pointRight);
                }
                else if (this.directionGlobal == "left") {
                    pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x + 0.4, this.cmpTransform.local.translation.y);
                    pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
                    hitLeft = rect.isInside(pointLeft);
                    hitRight = rect.isInside(pointRight);
                }
                if (hitRight || hitLeft) {
                    let translation = this.cmpTransform.local.translation;
                    translation.y = rect.y;
                    if (translation.y - 0.3 > this.cmpTransform.local.translation.y) {
                        translation.x = this.cmpTransform.local.translation.x + 0.1;
                        translation.y = this.cmpTransform.local.translation.y;
                    }
                    this.cmpTransform.local.translation = translation;
                    this.speed.y = 0;
                }
            }
        }
    }
    Characters.speedMax = new fudge.Vector2(1.5, 5); // units per second
    Characters.gravity = fudge.Vector2.Y(-4);
    L16_ScrollerCollide.Characters = Characters;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Characters.js.map