"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    class EnemyRanged extends L16_ScrollerCollide.Enemy {
        constructor(_name, _x, _y) {
            super(_name);
            this.addComponent(new fudge.ComponentTransform());
            for (let sprite of EnemyRanged.sprites) {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => { _event.currentTarget.showFrameNext(); }, true);
                this.appendChild(nodeSprite);
            }
            this.cmpTransform.local.translation = new fudge.Vector3(_x, _y, 0);
            this.cmpTransform.local.scale(new fudge.Vector3(0.6, 0.6, 0));
            this.walkingTimeMax = 20;
            this.healthpoints = 4;
        }
        static generateSprites(_txtImage) {
            EnemyRanged.sprites = [];
            let sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.WALK);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(17, 288, 74, 65), 11, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            EnemyRanged.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.IDLE);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(19, 16, 67, 66), 4, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            EnemyRanged.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.HIT);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(15, 87, 68, 75), 7, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
            EnemyRanged.sprites.push(sprite);
        }
        act(_action, _direction = this.directionGlobal) {
            let fightMode = this.checkDistanceToPlayer();
            if (fightMode == true) {
                if (this.frameCounter > 4 && this.frameCounter < 8) {
                    this.frameCounter = this.frameCounter + 1;
                    _action = L16_ScrollerCollide.ACTION.HIT;
                }
                else {
                    _action = L16_ScrollerCollide.ACTION.IDLE;
                    this.frameCounter = this.frameCounter + 1;
                }
            }
            let direction = (_direction == "right" ? 1 : -1);
            this.cmpTransform.local.rotation = fudge.Vector3.Y(90 - 90 * direction);
            switch (_action) {
                case L16_ScrollerCollide.ACTION.IDLE:
                    if (this.frameCounter > 41) {
                        this.frameCounter = 0;
                    }
                    this.speed.x = 0;
                    break;
                case L16_ScrollerCollide.ACTION.WALK:
                    this.speed.x = EnemyRanged.speedMax.x; // * direction;
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
                    if (this.speed.y == 0)
                        L16_ScrollerCollide.Sound.play("WalkOnGrass");
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
                    break;
            }
            this.show(_action);
        }
        checkDistanceToPlayer() {
            if (this.getParent() != null) {
                let level = this.getParent();
                let game = level.getParent();
                let children = game.getChildrenByName("Knight");
                let positionOfEnemyX = this.cmpTransform.local.translation.x;
                let positionOfPlayerX = children[0].cmpTransform.local.translation.x;
                let positionOfEnemyY = this.cmpTransform.local.translation.y;
                let positionOfPlayerY = children[0].cmpTransform.local.translation.y;
                let distanceX = positionOfEnemyX - positionOfPlayerX;
                let distanceY = positionOfEnemyY - positionOfPlayerY;
                if (distanceX > -3 && distanceX < 3 && distanceY > -1) {
                    if (distanceX > 0) {
                        this.directionGlobal = "left";
                        if (this.frameCounter == 5) {
                            this.createProjectiles();
                        }
                    }
                    else {
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
        createProjectiles() {
            let stone = new L16_ScrollerCollide.Stone("Stone", this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y + 0.2, this.directionGlobal, L16_ScrollerCollide.level);
            L16_ScrollerCollide.level.appendChild(stone);
            L16_ScrollerCollide.level.appendChild(stone.creatHitbox());
        }
    }
    L16_ScrollerCollide.EnemyRanged = EnemyRanged;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=EnemyRanged.js.map