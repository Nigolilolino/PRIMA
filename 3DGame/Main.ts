///<reference types="../FUDGE/Build/FudgeCore.js"/>
namespace FudgeCraft {

    import fudge = FudgeCore;

    window.addEventListener("load", handleLoad);

    export let viewport: fudge.Viewport;

    let meshCube: fudge.MeshCube = new fudge.MeshCube;
    let allbuildingMatrices: boolean[][] = [];

    initializeBuildingMatrices();

    let translationValues: number[][] = [[-1, 1], [0, 1], [1, 1],
                                        [-1, 0], [0, 0], [1, 0],
                                        [-1, -1], [0, -1], [1, -1]];

    let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();
 
    function handleLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        fudge.RenderManager.initialize();
        fudge.Debug.log(canvas);
        
        
        cmpCamera.pivot.translateZ(50);
    
        let game: fudge.Node = createGame();
        viewport = new fudge.Viewport();
        viewport.initialize("Viewport", game, cmpCamera, canvas);
        fudge.Debug.log(viewport);

        viewport.draw();

        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, update);
        fudge.Loop.start();
    }

    function update(_event: Event): void {

        //cmpCamera.pivot.translateX(0.1);
        //cmpCamera.pivot.rotateY(0.05);

        fudge.RenderManager.update();
        
        viewport.draw();
    }

    function createGame(): fudge.Node {

        let game: fudge.Node = new fudge.Node("Game");

        buildFragments(game);

        return game;
    }

    function buildFragments(_game: fudge.Node): void {

        let translationTemp: number = -20;

        for (let i: number = 0; i < allbuildingMatrices.length; i++) {

            let baseBlock: fudge.Node = new fudge.Node("Base_Block_Fragment");
            let mtrSoliColor: fudge.Material = new fudge.Material("SolidWhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1, 0, 0, 0)));
            baseBlock.addComponent(new fudge.ComponentMesh(meshCube));
            baseBlock.addComponent(new fudge.ComponentMaterial(mtrSoliColor));
            baseBlock.addComponent(new fudge.ComponentTransform);
            baseBlock.cmpTransform.local.translateX(translationTemp);

            let buildingMtrx: boolean[] = allbuildingMatrices[i];

            for (let j: number = 0; j < buildingMtrx.length; j++) {
                if (buildingMtrx[j] == true) {
                    let subBlock: fudge.Node = new fudge.Node("subBlock");
                    subBlock.addComponent(new fudge.ComponentMesh(meshCube));
                    subBlock.addComponent(new fudge.ComponentMaterial(mtrSoliColor));
                    subBlock.addComponent(new fudge.ComponentTransform);
                    subBlock.cmpTransform.local.translateX(translationValues[j][0]);
                    subBlock.cmpTransform.local.translateY(translationValues[j][1]);
                    baseBlock.appendChild(subBlock);
                    _game.appendChild(baseBlock);
                }
            }
            translationTemp = translationTemp + 5; 
        }
        
    }

    function initializeBuildingMatrices(): void {

        let buildingMtrxIBlock: boolean[] = [false, true, false, 
                                            false, false, false, 
                                            false, true, false];
        allbuildingMatrices.push(buildingMtrxIBlock);    

        let buildingMtrx2x2Block: boolean[] = [false, false, false,
                                            false, false, true,
                                            false, true, true];
        allbuildingMatrices.push(buildingMtrx2x2Block);

        let buildingMtrxTBlock: boolean[] = [true, true, true, 
                                            false, false, false, 
                                            false, true, false];
        allbuildingMatrices.push(buildingMtrxTBlock);

        let buildingMtrxLBlock: boolean[] = [false, true, false, 
                                            false, false, false, 
                                            false, true, true];
        allbuildingMatrices.push(buildingMtrxLBlock);

        let buildingMtrxReversedLBlock: boolean[] = [false, true, false, 
                                                    false, false, false, 
                                                    true, true, false];
        allbuildingMatrices.push(buildingMtrxReversedLBlock);

        let buildingMtrxZBlock: boolean[] = [true, true, false, 
                                            false, false, false, 
                                            false, true, true];
        allbuildingMatrices.push(buildingMtrxZBlock);

        let buildingMtrxReversedZBlock: boolean[] = [false, true, true, 
                                                    false, false, false, 
                                                    true, true, false];
        allbuildingMatrices.push(buildingMtrxReversedZBlock);

    }
    

}