"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    class Enemy extends fudge.Node {
        constructor(_name, _x, _y) {
            super(_name);
            this.directionGlobal = "right";
            this.walkingTimeMax = 120;
            this.currentWalkingTime = 0;
            this.frameCounter = 0;
            this.healthpoints = 6;
            this.speed = fudge.Vector3.ZERO();
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = fudge.Loop.timeFrameGame / 1000;
                this.speed.y += Enemy.gravity.y * timeFrame;
                let distance = fudge.Vector3.SCALE(this.speed, timeFrame);
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
                }
                else if (this.directionGlobal == "left") {
                    this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y + 0.6, 0);
                }
                this.checkGroundCollision();
            };
            this.addComponent(new fudge.ComponentTransform());
            for (let sprite of Enemy.sprites) {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => { _event.currentTarget.showFrameNext(); }, true);
                this.appendChild(nodeSprite);
            }
            this.cmpTransform.local.translation = new fudge.Vector3(_x, _y, 0);
            this.cmpTransform.local.scale(new fudge.Vector3(0.6, 0.6, 0));
            this.creatHitbox();
            fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            Enemy.sprites = [];
            let sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.WALK);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(17, 288, 74, 65), 11, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Enemy.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.IDLE);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(19, 16, 67, 66), 4, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Enemy.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.HIT);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(15, 87, 68, 75), 7, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            Enemy.sprites.push(sprite);
        }
        creatHitbox() {
            let hitbox = new L16_ScrollerCollide.Hitbox(this, "EnemyHitbox");
            hitbox.cmpTransform.local.scaleX(0.4);
            hitbox.cmpTransform.local.scaleY(0.6);
            this.hitbox = hitbox;
            return hitbox;
        }
        show(_action) {
            for (let child of this.getChildren()) {
                child.activate(child.name == _action);
            }
        }
        act(_action, _direction = this.directionGlobal) {
            let fightMode = this.checkDistanceToPlayer();
            fudge.Debug.log(this.frameCounter);
            if (fightMode == true) {
                _action = L16_ScrollerCollide.ACTION.HIT;
            }
            let direction = (_direction == "right" ? 1 : -1);
            this.cmpTransform.local.rotation = fudge.Vector3.Y(90 - 90 * direction);
            switch (_action) {
                case L16_ScrollerCollide.ACTION.IDLE:
                    this.speed.x = 0;
                    break;
                case L16_ScrollerCollide.ACTION.WALK:
                    this.speed.x = Enemy.speedMax.x; // * direction;
                    if (this.currentWalkingTime < this.walkingTimeMax) {
                        if (direction == 1) {
                            this.currentWalkingTime = this.currentWalkingTime + 1;
                        }
                        else {
                            this.currentWalkingTime = this.currentWalkingTime + 1;
                        }
                    }
                    else {
                        if (direction == 1) {
                            this.currentWalkingTime = 0;
                            direction = -1;
                        }
                        else {
                            this.currentWalkingTime = 0;
                            direction = 1;
                        }
                    }
                    if (direction == 1) {
                        this.directionGlobal = "right";
                    }
                    else if (direction == -1) {
                        this.directionGlobal = "left";
                    }
                    break;
                case L16_ScrollerCollide.ACTION.JUMP:
                    if (this.speed.y != 0) {
                        break;
                    }
                    else {
                        this.speed.y = 3;
                        break;
                    }
                case L16_ScrollerCollide.ACTION.HIT:
                    this.speed.x = 0;
                    if (this.frameCounter < 36) {
                        this.frameCounter = this.frameCounter + 1;
                    }
                    else {
                        this.frameCounter = 0;
                    }
                    break;
            }
            this.show(_action);
        }
        receiveHit() {
            this.healthpoints = this.healthpoints - 1;
            if (this.healthpoints <= 0) {
                let parent = this.getParent();
                parent.removeChild(this.hitbox);
                parent.removeChild(this);
            }
        }
        checkDistanceToPlayer() {
            if (this.getParent() != null) {
                let level = this.getParent();
                let game = level.getParent();
                let children = game.getChildrenByName("Hare");
                let positionOfEnemy = this.cmpTransform.local.translation.x;
                let positionOfPlayer = children[0].cmpTransform.local.translation.x;
                let distance = positionOfEnemy - positionOfPlayer;
                if (distance > -4 && distance < 4) {
                    if (distance > 0) {
                        this.directionGlobal = "left";
                        if (this.frameCounter == 5) {
                            let stone = new L16_ScrollerCollide.Stone("Stone", this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y + 0.2, this.directionGlobal);
                            level.appendChild(stone);
                        }
                    }
                    else {
                        this.directionGlobal = "right";
                        if (this.frameCounter == 35) {
                            let stone = new L16_ScrollerCollide.Stone("Stone", this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y + 0.2, this.directionGlobal);
                            level.appendChild(stone);
                        }
                    }
                    return true;
                }
            }
            return false;
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
                    pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x - 0.1, this.cmpTransform.local.translation.y);
                    pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
                    hitLeft = rect.isInside(pointLeft);
                    hitRight = rect.isInside(pointRight);
                }
                else if (this.directionGlobal == "left") {
                    pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
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
    Enemy.speedMax = new fudge.Vector2(1.5, 5); // units per second
    Enemy.gravity = fudge.Vector2.Y(-4);
    L16_ScrollerCollide.Enemy = Enemy;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Enemy.js.map