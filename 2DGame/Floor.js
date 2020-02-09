"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    let TYPE;
    (function (TYPE) {
        TYPE["GRASS"] = "Grass";
        TYPE["DIRT"] = "Dirt";
    })(TYPE = L16_ScrollerCollide.TYPE || (L16_ScrollerCollide.TYPE = {}));
    class Floor extends fudge.Node {
        constructor(_type) {
            super("Floor");
            if (_type == "Grass") {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite("GrassFloor", Floor.sprites[0]);
                nodeSprite.activate(true);
                this.appendChild(nodeSprite);
            }
            else if (_type == "Dirt") {
                let nodeSprite = new L16_ScrollerCollide.NodeSprite("DirtFloor", Floor.sprites[1]);
                nodeSprite.activate(true);
                this.appendChild(nodeSprite);
            }
            this.addComponent(new fudge.ComponentTransform());
            //this.addComponent(new fudge.ComponentMaterial(Floor.material));
            let cmpMesh = new fudge.ComponentMesh(Floor.mesh);
            //cmpMesh.pivot.translateY(-0.5);
            cmpMesh.pivot = Floor.pivot;
            this.addComponent(cmpMesh);
        }
        static generateSprites(_txtImage) {
            Floor.sprites = [];
            let sprite = new L16_ScrollerCollide.Sprite("GrassFloor");
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(2, 24, 188, 220), 1, fudge.Vector2.ZERO(), 160, fudge.ORIGIN2D.CENTER);
            for (let i = 0; i < sprite.frames.length; i++) {
                sprite.frames[i].pivot.translateX(-0.1);
                sprite.frames[i].pivot.translateY(-0.5);
            }
            Floor.sprites.push(sprite);
            sprite = new L16_ScrollerCollide.Sprite("DirtFloor");
            sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(300, 24, 340, 300), 1, fudge.Vector2.ZERO(), 250, fudge.ORIGIN2D.CENTER);
            for (let i = 0; i < sprite.frames.length; i++) {
                sprite.frames[i].pivot.translateX(-0.17);
                sprite.frames[i].pivot.translateY(-0.6);
            }
            Floor.sprites.push(sprite);
        }
        show() {
            for (let child of this.getChildren())
                child.activate(child.name == "Floor");
        }
        getRectWorld() {
            let rect = fudge.Rectangle.GET(0, 0, 100, 100);
            let topleft = new fudge.Vector3(-0.5, 0.5, 0);
            let bottomright = new fudge.Vector3(0.5, -0.5, 0);
            //let pivot: fudge.Matrix4x4 = this.getComponent(fudge.ComponentMesh).pivot;
            let mtxResult = fudge.Matrix4x4.MULTIPLICATION(this.mtxWorld, Floor.pivot);
            topleft.transform(mtxResult, true);
            bottomright.transform(mtxResult, true);
            let size = new fudge.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
            rect.position = topleft.toVector2();
            rect.size = size;
            return rect;
        }
    }
    Floor.mesh = new fudge.MeshSprite();
    Floor.material = new fudge.Material("Floor", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("red", 0.5)));
    Floor.pivot = fudge.Matrix4x4.TRANSLATION(fudge.Vector3.Y(-0.5));
    L16_ScrollerCollide.Floor = Floor;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Floor.js.map