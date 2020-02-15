"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    class EnemyMelee extends L16_ScrollerCollide.Enemy {
        constructor(_name, _x, _y) {
            super(_name);
            this.addComponent(new fudge.ComponentTransform());
            for (let sprite of EnemyMelee.sprites) {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => { _event.currentTarget.showFrameNext(); }, true);
                this.appendChild(nodeSprite);
            }
            this.cmpTransform.local.translation = new fudge.Vector3(_x, _y, 0);
            this.cmpTransform.local.scale(new fudge.Vector3(0.6, 0.6, 0));
            this.walkingTimeMax = 70;
            this.healthpoints = 10;
        }
        static generateSprites(_txtImage) {
            EnemyMelee.sprites = [];
            let sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.WALK);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(14, 74, 88, 59), 9, fudge.Vector2.ZERO(), 45, fudge.ORIGIN2D.BOTTOMCENTER);
            EnemyMelee.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.IDLE);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(17, 3, 86, 59), 4, fudge.Vector2.ZERO(), 45, fudge.ORIGIN2D.BOTTOMCENTER);
            EnemyMelee.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.HIT);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(14, 137, 94, 85), 8, fudge.Vector2.ZERO(), 45, fudge.ORIGIN2D.BOTTOMCENTER);
            EnemyMelee.sprites.push(sprite);
        }
        act(_action, _direction = this.directionGlobal) {
            let fightMode = this.checkDistanceToPlayer();
            if (fightMode == true) {
                if (this.frameCounter > 4 && this.frameCounter < 12) {
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
                    if (this.frameCounter > 35) {
                        this.frameCounter = 0;
                    }
                    this.speed.x = 0;
                    break;
                case L16_ScrollerCollide.ACTION.WALK:
                    this.speed.x = EnemyMelee.speedMax.x; // * direction;
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
                    L16_ScrollerCollide.Sound.play("HurtMonsterBig");
                    this.speed.x = EnemyMelee.speedMax.x + 1;
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
                if (distanceX > -1 && distanceX < 1 && distanceY > -1) {
                    if (distanceX > 0) {
                        this.directionGlobal = "left";
                    }
                    else {
                        this.directionGlobal = "right";
                    }
                    return true;
                }
            }
            return false;
        }
    }
    L16_ScrollerCollide.EnemyMelee = EnemyMelee;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=EnemyMelee.js.map