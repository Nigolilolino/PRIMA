"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/>
var L2_NextFUDGE;
///<reference types="../FUDGE/Build/FudgeCore.js"/>
(function (L2_NextFUDGE) {
    var fudge = FudgeCore;
    window.addEventListener("load", handleLoad);
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
        addOnkedownEvent();
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
    function addOnkedownEvent() {
        document.body.onkeydown = function (e) {
            if (e.keyCode == 38) {
                paddleRight.getComponent(fudge.ComponentMesh).pivot.translateY(0.3);
                L2_NextFUDGE.viewport.draw();
            }
            else if (e.keyCode == 40) {
                paddleRight.getComponent(fudge.ComponentMesh).pivot.translateY(-0.3);
                L2_NextFUDGE.viewport.draw();
            }
            else if (e.keyCode == 87) {
                paddleLeft.getComponent(fudge.ComponentMesh).pivot.translateY(0.3);
                L2_NextFUDGE.viewport.draw();
            }
            else if (e.keyCode == 83) {
                paddleLeft.getComponent(fudge.ComponentMesh).pivot.translateY(-0.3);
                L2_NextFUDGE.viewport.draw();
            }
        };
    }
})(L2_NextFUDGE || (L2_NextFUDGE = {}));
//# sourceMappingURL=Main.js.map