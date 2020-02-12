"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    let ENVI_TYPE;
    (function (ENVI_TYPE) {
        ENVI_TYPE["TREE_TRUNK"] = "TreeTrunk";
        ENVI_TYPE["TREE_CROWN"] = "TreeCrown";
        ENVI_TYPE["TREE_ROOT"] = "TreeRoot";
        ENVI_TYPE["LEAVES"] = "Leaves";
        ENVI_TYPE["BACKGROUND"] = "Background";
        ENVI_TYPE["SKY"] = "Sky";
    })(ENVI_TYPE = L16_ScrollerCollide.ENVI_TYPE || (L16_ScrollerCollide.ENVI_TYPE = {}));
    class Flora extends fudge.Node {
        constructor(_type, _x, _y, _z) {
            super("Flora");
            if (_type == "TreeTrunk") {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite("TreeTrunk", Flora.sprites[0]);
                nodeSprite.activate(true);
                this.appendChild(nodeSprite);
            }
            else if (_type == "TreeRoot") {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite("TreeRoot", Flora.sprites[1]);
                nodeSprite.activate(true);
                this.appendChild(nodeSprite);
            }
            else if (_type == "TreeCrown") {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite("TreeCrown", Flora.sprites[2]);
                nodeSprite.activate(true);
                this.appendChild(nodeSprite);
            }
            else if (_type == "Leaves") {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite("Leaves", Flora.sprites[3]);
                nodeSprite.activate(true);
                this.appendChild(nodeSprite);
            }
            else if (_type == "Background") {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite("Background", Flora.sprites[4]);
                nodeSprite.activate(true);
                this.appendChild(nodeSprite);
            }
            else if (_type == "Sky") {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite("Sky", Flora.sprites[5]);
                nodeSprite.activate(true);
                this.appendChild(nodeSprite);
            }
            this.addComponent(new fudge.ComponentTransform());
            this.cmpTransform.local.translation = new fudge.Vector3(_x, _y, _z);
            //this.addComponent(new fudge.ComponentMaterial(Flora.material));
            let cmpMesh = new fudge.ComponentMesh(Flora.mesh);
            //cmpMesh.pivot.translateY(-0.5);
            cmpMesh.pivot = Flora.pivot;
            this.addComponent(cmpMesh);
        }
        static generateSprites(_txtImage) {
            Flora.sprites = [];
            let sprite = new L16_ScrollerCollide.Sprite("TreeTrunk");
            sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(0, 53, 260, 260), 1, fudge.Vector2.ZERO(), 200, fudge.ORIGIN2D.CENTER);
            Flora.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite("TreeRoot");
            sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(760, 390, 495, 213), 1, fudge.Vector2.ZERO(), 200, fudge.ORIGIN2D.CENTER);
            Flora.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite("TreeCrown");
            sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(758, 117, 500, 150), 1, fudge.Vector2.ZERO(), 200, fudge.ORIGIN2D.CENTER);
            Flora.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite("Leaves");
            sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(290, 5, 440, 307), 1, fudge.Vector2.ZERO(), 200, fudge.ORIGIN2D.CENTER);
            Flora.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite("Background");
            sprite.generateByGrid(_txtImage[1], fudge.Rectangle.GET(0, 1, 1280, 640), 1, fudge.Vector2.ZERO(), 150, fudge.ORIGIN2D.CENTER);
            Flora.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite("Sky");
            sprite.generateByGrid(_txtImage[2], fudge.Rectangle.GET(0, 20, 1280, 720), 1, fudge.Vector2.ZERO(), 100, fudge.ORIGIN2D.CENTER);
            Flora.sprites.push(sprite);
        }
        show() {
            for (let child of this.getChildren())
                child.activate(child.name == "Flora");
        }
        getRectWorld() {
            let rect = fudge.Rectangle.GET(0, 0, 100, 100);
            let topleft = new fudge.Vector3(-0.5, 0.5, 0);
            let bottomright = new fudge.Vector3(0.5, -0.5, 0);
            //let pivot: fudge.Matrix4x4 = this.getComponent(fudge.ComponentMesh).pivot;
            let mtxResult = fudge.Matrix4x4.MULTIPLICATION(this.mtxWorld, Flora.pivot);
            topleft.transform(mtxResult, true);
            bottomright.transform(mtxResult, true);
            let size = new fudge.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
            rect.position = topleft.toVector2();
            rect.size = size;
            return rect;
        }
    }
    Flora.mesh = new fudge.MeshSprite();
    Flora.material = new fudge.Material("Flora", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("red", 0.5)));
    Flora.pivot = fudge.Matrix4x4.TRANSLATION(fudge.Vector3.Y(-0.5));
    L16_ScrollerCollide.Flora = Flora;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Flora.js.map