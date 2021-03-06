"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    class Items extends fudge.Node {
        constructor(_name, _x, _y) {
            super(_name);
            this.speed = fudge.Vector3.ZERO();
            this.counter = 0;
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
                this.counter += 1;
                this.hitbox.cmpTransform.local.translation = new fudge.Vector3(this.mtxWorld.translation.x - 0.01, this.mtxWorld.translation.y + 0.3, -1);
                if (this.counter < 20) {
                    this.cmpTransform.local.translateY(0.005);
                }
                else if (this.counter >= 20 && this.counter < 40) {
                    this.cmpTransform.local.translateY(-0.005);
                }
                else {
                    this.counter = 0;
                }
                this.checkGroundCollision();
            };
            this.addComponent(new fudge.ComponentTransform());
            for (let sprite of Items.sprites) {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => { _event.currentTarget.showFrameNext(); }, true);
                this.appendChild(nodeSprite);
            }
            this.cmpTransform.local.translation = new fudge.Vector3(_x, _y, -1);
            this.creatHitbox();
            this.show(L16_ScrollerCollide.ACTION.HIT);
            fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            Items.sprites = [];
            let sprite = new L16_ScrollerCollide.Sprite(L16_ScrollerCollide.ACTION.IDLE);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(0, 0, 30, 34), 1, fudge.Vector2.ZERO(), 90, fudge.ORIGIN2D.BOTTOMCENTER);
            Items.sprites.push(sprite);
        }
        creatHitbox() {
            let hitbox = new L16_ScrollerCollide.Hitbox(this, "ItemHitbox");
            hitbox.cmpTransform.local.scaleX(0.2);
            hitbox.cmpTransform.local.scaleY(0.3);
            this.hitbox = hitbox;
            return hitbox;
        }
        show(_action) {
            if (_action == L16_ScrollerCollide.ACTION.JUMP)
                return;
            for (let child of this.getChildren()) {
                child.activate(child.name == _action);
            }
        }
        act(_action, _direction) {
            switch (_action) {
                case L16_ScrollerCollide.ACTION.IDLE:
                    this.speed.x = 0;
                    break;
            }
            this.show(_action);
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
                pointLeft = new fudge.Vector2(this.cmpTransform.local.translation.x - 0.40, this.cmpTransform.local.translation.y);
                pointRight = new fudge.Vector2(this.cmpTransform.local.translation.x, this.cmpTransform.local.translation.y);
                hitLeft = rect.isInside(pointLeft);
                hitRight = rect.isInside(pointRight);
                if (hitRight || hitLeft) {
                    let translation = this.cmpTransform.local.translation;
                    translation.y = rect.y;
                    this.cmpTransform.local.translation = translation;
                    this.speed.y = 0;
                }
            }
        }
    }
    L16_ScrollerCollide.Items = Items;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Items.js.map