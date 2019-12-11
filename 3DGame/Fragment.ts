///<reference types="../FUDGE/Build/FudgeCore.js"/>
namespace FudgeCraft {

    import fudge = FudgeCore;

    export class Cube extends fudge.Node {

        private translationValues: number[][] = [[-1, 1], [0, 1], [1, 1],
                                        [-1, 0], [0, 0], [1, 0],
                                        [-1, -1], [0, -1], [1, -1]];

        private meshCube: fudge.MeshCube;
        private baseBlock: fudge.Node;
        private mtrSoliColor: fudge.Material;

        constructor(_buildingMtrx: boolean[]) {

            super("Cube");

            // this.meshCube = new fudge.MeshCube;
            // this.baseBlock = new fudge.Node("Base_Block_Fragment");
            // this.mtrSoliColor = new fudge.Material("SolidWhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1, 0, 0, 0)));

            // this.baseBlock.addComponent(new fudge.ComponentMesh(this.meshCube));
            // this.baseBlock.addComponent(new fudge.ComponentMaterial(this.mtrSoliColor));
            // this.baseBlock.addComponent(new fudge.ComponentTransform);
            // //baseBlock.cmpTransform.local.translateX(translationTemp);

        }

    }

}