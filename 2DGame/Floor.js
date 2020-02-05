"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    class Floor extends fudge.Node {
        constructor() {
            super("Floor");
            this.addComponent(new fudge.ComponentTransform());
            this.addComponent(new fudge.ComponentMaterial(Floor.material));
            let cmpMesh = new fudge.ComponentMesh(Floor.mesh);
            //cmpMesh.pivot.translateY(-0.5);
            cmpMesh.pivot = Floor.pivot;
            this.addComponent(cmpMesh);
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