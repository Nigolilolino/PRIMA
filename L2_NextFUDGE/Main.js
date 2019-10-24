"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/>
var L2_NextFUDGE;
///<reference types="../FUDGE/Build/FudgeCore.js"/>
(function (L2_NextFUDGE) {
    var fudge = FudgeCore;
    window.addEventListener("load", handleLoad);
    let pressedKeys = {};
    let ball = new fudge.Node("Ball");
    let paddleLeft = new fudge.Node("PaddleLeft");
    let paddleRight = new fudge.Node("PaddleRight");
    function handleLoad(_event) {
        const canvas = document.querySelector("canvas");
        fudge.RenderManager.initialize();
        fudge.Debug.log(canvas);
        let pong = createPong();
        let cmpCamera = new fudge.ComponentCamera();
        cmpCamera.pivot.translateZ(42);
        paddleRight.cmpTransform.local.translateX(20);
        paddleLeft.cmpTransform.local.translateX(-20);
        paddleLeft.getComponent(fudge.ComponentMesh).pivot.scaleY(4);
        paddleRight.getComponent(fudge.ComponentMesh).pivot.scaleY(4);
        L2_NextFUDGE.viewport = new fudge.Viewport();
        L2_NextFUDGE.viewport.initialize("Viewport", pong, cmpCamera, canvas);
        fudge.Debug.log(L2_NextFUDGE.viewport);
        document.addEventListener("keydown", handleKeyDown);
        L2_NextFUDGE.viewport.draw();
        fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
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
    function update(_event) {
        if (pressedKeys[fudge.KEYBOARD_CODE.ARROW_UP]) {
            paddleRight.cmpTransform.local.translate(new fudge.Vector3(0, 0.3, 0));
        }
        if (pressedKeys[fudge.KEYBOARD_CODE.ARROW_DOWN]) {
            paddleRight.cmpTransform.local.translate(new fudge.Vector3(0, -0.3, 0));
        }
        if (pressedKeys[fudge.KEYBOARD_CODE.W]) {
            paddleLeft.cmpTransform.local.translate(new fudge.Vector3(0, 0.3, 0));
        }
        if (pressedKeys[fudge.KEYBOARD_CODE.S]) {
            paddleLeft.cmpTransform.local.translate(new fudge.Vector3(0, -0.3, 0));
        }
        fudge.RenderManager.update();
        L2_NextFUDGE.viewport.draw();
    }
    function createPong() {
        let pong = new fudge.Node("Pong");
        let meshQuad = new fudge.MeshQuad();
        let mtrSolidWhite = new fudge.Material("SolidWhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1, 1, 1, 1)));
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
    function handleKeyDown(_event) {
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
})(L2_NextFUDGE || (L2_NextFUDGE = {}));
//# sourceMappingURL=Main.js.map