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
    })(ACTION = L16_ScrollerCollide.ACTION || (L16_ScrollerCollide.ACTION = {}));
    let DIRECTION;
    (function (DIRECTION) {
        DIRECTION[DIRECTION["LEFT"] = 0] = "LEFT";
        DIRECTION[DIRECTION["RIGHT"] = 1] = "RIGHT";
    })(DIRECTION = L16_ScrollerCollide.DIRECTION || (L16_ScrollerCollide.DIRECTION = {}));
    class Hare extends fudge.Node {
        constructor(_name = "Hare") {
            super(_name);
            this.directionGlobal = "right";
            // private action: ACTION;
            // private time: fudge.Time = new fudge.Time();
            this.speed = fudge.Vector3.ZERO();
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = fudge.Loop.timeFrameGame / 1000;
                this.speed.y += Hare.gravity.y * timeFrame;
                let distance = fudge.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
                this.checkCollision();
            };
            this.addComponent(new fudge.ComponentTransform());
            for (let sprite of Hare.sprites) {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => { _event.currentTarget.showFrameNext(); }, true);
                this.appendChild(nodeSprite);
            }
            this.show(ACTION.IDLE);
            fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            Hare.sprites = [];
            let sprite = new L16_ScrollerCollide.Sprite(ACTION.WALK);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 0, 77, 53), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Hare.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(ACTION.IDLE);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 64, 77, 56), 6, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Hare.sprites.push(sprite);
        }
        show(_action) {
            if (_action == ACTION.JUMP)
                return;
            for (let child of this.getChildren())
                child.activate(child.name == _action);
            // this.action = _action;
        }
        act(_action, _direction) {
            switch (_action) {
                case ACTION.IDLE:
                    this.speed.x = 0;
                    break;
                case ACTION.WALK:
                    let direction = (_direction == DIRECTION.RIGHT ? 1 : -1);
                    this.speed.x = Hare.speedMax.x; // * direction;
                    this.cmpTransform.local.rotation = fudge.Vector3.Y(90 - 90 * direction);
                    if (direction == 1) {
                        this.directionGlobal = "right";
                    }
                    else if (direction == -1) {
                        this.directionGlobal = "left";
                    }
                    //console.log(this.speed.y);
                    break;
                case ACTION.JUMP:
                    if (this.speed.y != 0) {
                        break;
                    }
                    else {
                        this.speed.y = 3;
                        break;
                    }
            }
            this.show(_action);
        }
        checkCollision() {
            for (let floor of L16_ScrollerCollide.level.getChildren()) {
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
                    this.cmpTransform.local.translation = translation;
                    this.speed.y = 0;
                }
            }
        }
    }
    Hare.speedMax = new fudge.Vector2(1.5, 5); // units per second
    Hare.gravity = fudge.Vector2.Y(-4);
    L16_ScrollerCollide.Hare = Hare;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Hare.js.map