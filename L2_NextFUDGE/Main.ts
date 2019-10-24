///<reference types="../FUDGE/Build/FudgeCore.js"/>
namespace L2_NextFUDGE {

    interface KeyPress{
        [code: string]: boolean;
    }


    import fudge = FudgeCore;

    window.addEventListener("load", handleLoad);

    export let viewport: fudge.Viewport;

    let pressedKeys: KeyPress = {};
    let ball: fudge.Node = new fudge.Node("Ball");
    let paddleLeft: fudge.Node = new fudge.Node("PaddleLeft");
    let paddleRight: fudge.Node = new fudge.Node("PaddleRight");

    function handleLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        fudge.RenderManager.initialize();
        fudge.Debug.log(canvas);

        let pong: fudge.Node = createPong();

        let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();
        cmpCamera.pivot.translateZ(42);
        
        paddleRight.cmpTransform.local.translateX(20);
        paddleLeft.cmpTransform.local.translateX(-20);
        
    
        (<fudge.ComponentMesh> paddleLeft.getComponent(fudge.ComponentMesh)).pivot.scaleY(4);
        (<fudge.ComponentMesh> paddleRight.getComponent(fudge.ComponentMesh)).pivot.scaleY(4);

        viewport = new fudge.Viewport();
        viewport.initialize("Viewport", pong, cmpCamera, canvas);
        fudge.Debug.log(viewport);

        document.addEventListener("keydown", handleKeyDown);

        viewport.draw();

        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, update);
        fudge.Loop.start();

        document.addEventListener('keydown', function (event) {

            console.log(event.code);
            pressedKeys[event.code] = true;
            console.log(pressedKeys);
        
        }, false);

        document.addEventListener('keyup', function (event) {

            console.log(event.code);
            pressedKeys[event.code] = false;
            console.log(pressedKeys);
        
        }, false);
    }

    function update(_event: Event): void {

        if(pressedKeys[fudge.KEYBOARD_CODE.ARROW_UP]){
            paddleRight.cmpTransform.local.translate(new fudge.Vector3(0, 0.3, 0));
        }
        if(pressedKeys[fudge.KEYBOARD_CODE.ARROW_DOWN]){
            paddleRight.cmpTransform.local.translate(new fudge.Vector3(0, -0.3, 0));
        }
        if(pressedKeys[fudge.KEYBOARD_CODE.W]){
            paddleLeft.cmpTransform.local.translate(new fudge.Vector3(0, 0.3, 0));
        }
        if(pressedKeys[fudge.KEYBOARD_CODE.S]){
            paddleLeft.cmpTransform.local.translate(new fudge.Vector3(0, -0.3, 0));
        }

        fudge.RenderManager.update();
        viewport.draw();
    }

    function createPong(): fudge.Node {

        let pong: fudge.Node = new fudge.Node("Pong");
        let meshQuad: fudge.MeshQuad = new fudge.MeshQuad();
        let mtrSolidWhite: fudge.Material = new fudge.Material("SolidWhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1,1,1,1)));

        ball.addComponent(new fudge.ComponentMesh(meshQuad));
        paddleLeft.addComponent(new fudge.ComponentMesh(meshQuad));
        paddleRight.addComponent(new fudge.ComponentMesh(meshQuad));
        
        ball.addComponent(new fudge.ComponentMaterial(mtrSolidWhite));
        paddleLeft.addComponent(new fudge.ComponentMaterial(mtrSolidWhite));
        paddleRight.addComponent(new fudge.ComponentMaterial(mtrSolidWhite));

        // Component for the Node to Transform in the World 
        ball.addComponent(new fudge.ComponentTransform);
        paddleLeft.addComponent(new fudge.ComponentTransform);
        paddleRight.addComponent(new fudge.ComponentTransform);

        pong.appendChild(ball);
        pong.appendChild(paddleLeft);
        pong.appendChild(paddleRight);

        return pong;
    }

    function handleKeyDown(_event: KeyboardEvent): void {
        // switch (_event.code) {
        //     case fudge.KEYBOARD_CODE.ARROW_UP:
        //         paddleRight.cmpTransform.local.translate(new fudge.Vector3(0, 0.3, 0));
        //         break;
        //     case fudge.KEYBOARD_CODE.ARROW_DOWN:
        //         paddleRight.cmpTransform.local.translate(new fudge.Vector3(0, -0.3, 0));
        //         break;
        //     case fudge.KEYBOARD_CODE.W:
        //             paddleLeft.cmpTransform.local.translate(new fudge.Vector3(0, 0.3, 0));
        //             break;
        //     case fudge.KEYBOARD_CODE.S:
        //             paddleLeft.cmpTransform.local.translate(new fudge.Vector3(0, -0.3, 0));
        //             break;
        // }
        
    }
}