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
        ACTION["MID_AIR"] = "MidAir";
        ACTION["HIT"] = "Hit";
        ACTION["DIE"] = "Die";
        ACTION["GETTING_DAMAGE"] = "GettingDamage";
    })(ACTION = L16_ScrollerCollide.ACTION || (L16_ScrollerCollide.ACTION = {}));
    let DIRECTION;
    (function (DIRECTION) {
        DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
        DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    })(DIRECTION = L16_ScrollerCollide.DIRECTION || (L16_ScrollerCollide.DIRECTION = {}));
    class Characters extends fudge.Node {
        constructor(_name) {
            super(_name);
            this.directionGlobal = "right";
            this.frameCounter = 0;
            this.speed = fudge.Vector3.ZERO();
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = fudge.Loop.timeFrameGame / 1000;
                this.speed.y += L16_ScrollerCollide.Enemy.gravity.y * timeFrame;
                let distance = fudge.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
                if (this.directionGlobal == "right") {
                    this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y + 0.6, 0);
                }
                else if (this.directionGlobal == "left") {
                    this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y + 0.6, 0);
                }
                this.checkGroundCollision(0, 0);
            };
        }
        show(_action) {
            for (let child of this.getChildren()) {
                child.activate(child.name == _action);
            }
        }
        receiveHit(_direction) {
            this.healthpoints = this.healthpoints - 1;
            if (_direction == "right") {
                if (this.name == "Knight") {
                    this.cmpTransform.local.translateX(-0.5);
                }
                else {
                    this.cmpTransform.local.translateX(+0.5);
                }
            }
            else {
                if (this.name == "Knight") {
                    this.cmpTransform.local.translateX(+0.5);
                }
                else {
                    this.cmpTransform.local.translateX(-0.5);
                }
            }
            if (this.healthpoints <= 0 && this.name != "Knight") {
                this.frameCounter = 0;
                this.deleteThis();
            }
            else if (this.healthpoints <= 0 && this.name == "Knight") {
                this.endGame();
            }
        }
        deleteThis() {
            fudge.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            let parent = this.getParent();
            parent.removeChild(this.hitbox);
            parent.removeChild(this);
        }
        checkGroundCollision(_shorteningPointLeft, _shorteningPointRight) {
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
                        pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x - _shorteningPointLeft, this.cmpTransform.local.translation.y);
                        pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x - _shorteningPointRight, this.cmpTransform.local.translation.y);
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
                        if (this.directionGlobal == "left") {
                            translation.x = this.cmpTransform.local.translation.x + 0.1;
                            translation.y = this.cmpTransform.local.translation.y;
                        }
                        else {
                            translation.x = this.cmpTransform.local.translation.x - 0.1;
                            translation.y = this.cmpTransform.local.translation.y;
                        }
                    }
                    this.cmpTransform.local.translation = translation;
                    this.speed.y = 0;
                }
            }
        }
        endGame() {
            fudge.Loop.stop();
            let deathScreen = document.getElementById("deathScreen");
            deathScreen.style.visibility = "visible";
        }
    }
    Characters.speedMax = new fudge.Vector2(1.5, 5);
    Characters.gravity = fudge.Vector2.Y(-3.5);
    L16_ScrollerCollide.Characters = Characters;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Characters.js.map