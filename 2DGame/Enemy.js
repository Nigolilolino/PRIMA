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
            fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        creatHitbox(scaleX, scaleY) {
            let hitbox = new L16_ScrollerCollide.Hitbox(this, "EnemyHitbox");
            hitbox.cmpTransform.local.scaleX(scaleX);
            hitbox.cmpTransform.local.scaleY(scaleY);
            this.hitbox = hitbox;
            return hitbox;
        }
    }
    L16_ScrollerCollide.Enemy = Enemy;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Enemy.js.map