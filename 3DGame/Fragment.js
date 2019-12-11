"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/>
var FudgeCraft;
///<reference types="../FUDGE/Build/FudgeCore.js"/>
(function (FudgeCraft) {
    var fudge = FudgeCore;
    class Cube extends fudge.Node {
        constructor(_buildingMtrx) {
            super("Cube");
            this.translationValues = [[-1, 1], [0, 1], [1, 1],
                [-1, 0], [0, 0], [1, 0],
                [-1, -1], [0, -1], [1, -1]];
            // this.meshCube = new fudge.MeshCube;
            // this.baseBlock = new fudge.Node("Base_Block_Fragment");
            // this.mtrSoliColor = new fudge.Material("SolidWhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1, 0, 0, 0)));
            // this.baseBlock.addComponent(new fudge.ComponentMesh(this.meshCube));
            // this.baseBlock.addComponent(new fudge.ComponentMaterial(this.mtrSoliColor));
            // this.baseBlock.addComponent(new fudge.ComponentTransform);
            // //baseBlock.cmpTransform.local.translateX(translationTemp);
        }
    }
    FudgeCraft.Cube = Cube;
})(FudgeCraft || (FudgeCraft = {}));
//# sourceMappingURL=Fragment.js.map