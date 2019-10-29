"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/>
var PongGame;
///<reference types="../FUDGE/Build/FudgeCore.js"/>
(function (PongGame) {
    var fudge = FudgeCore;
    window.addEventListener("load", handleLoad);
    let pressedKeys = {};
    let ball = new fudge.Node("Ball");
    let paddleLeft = new fudge.Node("PaddleLeft");
    let paddleRight = new fudge.Node("PaddleRight");
    let randomeXValue = generateRandomeValue();
    let randomeYValue = generateRandomeValue();
    let scorePlayer1 = 0;
    let scorePlayer2 = 0;
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
        PongGame.viewport = new fudge.Viewport();
        PongGame.viewport.initialize("Viewport", pong, cmpCamera, canvas);
        fudge.Debug.log(PongGame.viewport);
        PongGame.viewport.draw();
        fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        fudge.Loop.start();
        document.addEventListener('keydown', function (event) {
            pressedKeys[event.code] = true;
        }, false);
        document.addEventListener('keyup', function (event) {
            pressedKeys[event.code] = false;
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
        moveBall();
        fudge.RenderManager.update();
        PongGame.viewport.draw();
    }
    function moveBall() {
        let scoreCounterPlayer1 = document.getElementById("scorePlayer1");
        let scoreCounterPlayer2 = document.getElementById("scorePlayer2");
        ball.cmpTransform.local.translate(new fudge.Vector3(randomeXValue, randomeYValue, 0));
        if (ball.cmpTransform.local.translation["data"][0] >= 21) {
            randomeXValue = randomeXValue * -1;
            scorePlayer1++;
            scoreCounterPlayer1.innerHTML = scorePlayer1.toString();
        }
        else if (ball.cmpTransform.local.translation["data"][0] <= -21) {
            randomeXValue = randomeXValue * -1;
            scorePlayer2++;
            scoreCounterPlayer2.innerHTML = scorePlayer2.toString();
        }
        else if (ball.cmpTransform.local.translation["data"][1] >= 14) {
            randomeYValue = randomeYValue * -1;
        }
        else if (ball.cmpTransform.local.translation["data"][1] <= -14) {
            randomeYValue = randomeYValue * -1;
        }
        else if (ball.cmpTransform.local.translation["data"][0] - paddleRight.cmpTransform.local.translation["data"][0] >= 0 && ball.cmpTransform.local.translation["data"][1] - paddleRight.cmpTransform.local.translation["data"][1] >= -2 && ball.cmpTransform.local.translation["data"][1] - paddleRight.cmpTransform.local.translation["data"][1] <= 2) {
            randomeXValue = randomeXValue * -1;
        }
        else if (ball.cmpTransform.local.translation["data"][0] - paddleLeft.cmpTransform.local.translation["data"][0] <= 0 && ball.cmpTransform.local.translation["data"][1] - paddleLeft.cmpTransform.local.translation["data"][1] >= -2 && ball.cmpTransform.local.translation["data"][1] - paddleLeft.cmpTransform.local.translation["data"][1] <= 2) {
            randomeXValue = randomeXValue * -1;
        }
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
    function generateRandomeValue() {
        if (Math.random() <= 0.5) {
            return Math.random() * (+0.3 - +0.05) + 0.05;
        }
        else {
            return (Math.random() * (+0.3 - +0.05) + 0.05) * -1;
        }
    }
})(PongGame || (PongGame = {}));
//# sourceMappingURL=Main.js.map