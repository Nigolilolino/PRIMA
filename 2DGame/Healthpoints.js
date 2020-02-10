"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    let STATUS;
    (function (STATUS) {
        STATUS["FULL"] = "Full";
        STATUS["EMPTY"] = "Empty";
    })(STATUS = L16_ScrollerCollide.STATUS || (L16_ScrollerCollide.STATUS = {}));
    class Healthpoints extends fudge.Node {
        constructor(_name) {
            super(_name);
            this.update = (_event) => {
                this.broadcastEvent(new CustomEvent("showNext"));
            };
            this.addComponent(new fudge.ComponentTransform());
            for (let sprite of Healthpoints.sprites) {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite(sprite.name, sprite);
                nodeSprite.activate(false);
                nodeSprite.addEventListener("showNext", (_event) => { _event.currentTarget.showFrameNext(); }, true);
                this.appendChild(nodeSprite);
            }
            fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        static generateSprites(_txtImage) {
            Healthpoints.sprites = [];
            let sprite = new L16_ScrollerCollide.Sprite(STATUS.EMPTY);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(32, 0, 35, 34), 1, fudge.Vector2.ZERO(), 120, fudge.ORIGIN2D.BOTTOMCENTER);
            Healthpoints.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite(STATUS.FULL);
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(110, 0, 35, 34), 1, fudge.Vector2.ZERO(), 120, fudge.ORIGIN2D.BOTTOMCENTER);
            Healthpoints.sprites.push(sprite);
        }
        show(_status) {
            for (let child of this.getChildren()) {
                child.activate(child.name == _status);
            }
        }
        act(_status) {
            this.show(_status);
        }
    }
    L16_ScrollerCollide.Healthpoints = Healthpoints;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Healthpoints.js.map