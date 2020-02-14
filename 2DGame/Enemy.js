"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    class Enemy extends L16_ScrollerCollide.Characters {
        constructor(_name) {
            super(_name);
            this.currentWalkingTime = 0;
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                let timeFrame = fudge.Loop.timeFrameGame / 1000;
                this.speed.y += Enemy.gravity.y * timeFrame;
                let distance = fudge.Vector3.SCALE(this.speed, timeFrame);
                this.cmpTransform.local.translate(distance);
                if (this.directionGlobal == "right") {
                    this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y + 0.6, 0);
                }
                else if (this.directionGlobal == "left") {
                    this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x, this.mtxWorld.translation.y + 0.6, 0);
                }
                this.checkGroundCollision();
            };
        }
    }
    L16_ScrollerCollide.Enemy = Enemy;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Enemy.js.map