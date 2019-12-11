"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/>
var PongGameFinal;
///<reference types="../FUDGE/Build/FudgeCore.js"/>
(function (PongGameFinal) {
    var fudge = FudgeCore;
    window.addEventListener("load", handleLoad);
    // What do the viewport?
    let viewport;
    let pong = new fudge.Node("Pong");
    let ball;
    let paddleLeft;
    let paddleRight;
    let playerOneScore = 0;
    let playerTwoScore = 0;
    let ballVelocity = new fudge.Vector3(generateRandomeValue(), generateRandomeValue(), 0);
    let keysPressed = {};
    let paddleSpeedTranslation = 0.5;
    let controls;
    let mtxBall;
    let crc2;
    function handleLoad(_event) {
        const canvas = document.querySelector("canvas");
        fudge.RenderManager.initialize();
        fudge.Debug.log(canvas);
        crc2 = canvas.getContext("2d");
        let pong = createPong();
        controls = defineControls();
        mtxBall = ball.cmpTransform.local;
        let cmpCamera = new fudge.ComponentCamera();
        cmpCamera.pivot.translateZ(43);
        viewport = new fudge.Viewport();
        viewport.initialize("Viewport", pong, cmpCamera, canvas);
        fudge.Debug.log(viewport);
        document.addEventListener("keydown", hndKeydown);
        document.addEventListener("keyup", hndKeyup);
        viewport.draw();
        // FUDGE Core Game Loop and Starting the Loop
        fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        fudge.Loop.start();
    }
    function update(_event) {
        // fudge.Debug.log(keysPressed);
        processInput();
        let hit = false;
        for (let node of pong.getChildren()) {
            if (node.name == "Ball")
                continue;
            hit = detectHit(ball.cmpTransform.local.translation, node);
            if (hit) {
                processHit(node);
                break;
            }
        }
        moveBall();
        fudge.RenderManager.update();
        viewport.draw();
        crc2.strokeStyle = "white";
        crc2.lineWidth = 4;
        crc2.setLineDash([10, 10]);
        crc2.moveTo(crc2.canvas.width / 2, 0);
        crc2.lineTo(crc2.canvas.width / 2, crc2.canvas.height);
        crc2.stroke();
    }
    function detectHit(_position, _node) {
        let sclRect = _node.getComponent(fudge.ComponentMesh).pivot.scaling.copy;
        let mtxInverse = fudge.Matrix4x4.INVERSION(_node.cmpTransform.local);
        _position.transform(mtxInverse);
        let rect = new fudge.Rectangle(0, 0, sclRect.x, sclRect.y, fudge.ORIGIN2D.CENTER);
        return rect.isInside(_position.toVector2());
    }
    function processHit(_node) {
        switch (_node.name) {
            case "WallTop":
            case "WallBottom":
                ballVelocity.y *= -1;
                break;
            case "WallRight":
                scoredPoint("right");
                break;
            case "WallLeft":
                scoredPoint("left");
                break;
            case "PaddleLeft":
            case "PaddleRight":
                reflectBall(_node);
                break;
            default:
                break;
        }
    }
    function reflectBall(_paddle) {
        let normal = fudge.Vector3.X(-1);
        ballVelocity.reflect(normal);
    }
    function processInput() {
        for (let code in controls) {
            if (keysPressed[code]) {
                let control = controls[code];
                let mtxPaddle = control.paddle.cmpTransform.local;
                mtxPaddle.translation = fudge.Vector3.SUM(mtxPaddle.translation, control.translation);
                mtxPaddle.rotateZ(control.rotation);
            }
        }
    }
    function defineControls() {
        let controls = {};
        controls[fudge.KEYBOARD_CODE.ARROW_UP] = { paddle: paddleRight, translation: fudge.Vector3.Y(paddleSpeedTranslation), rotation: 0 };
        controls[fudge.KEYBOARD_CODE.ARROW_DOWN] = { paddle: paddleRight, translation: fudge.Vector3.Y(-paddleSpeedTranslation), rotation: 0 };
        controls[fudge.KEYBOARD_CODE.W] = { paddle: paddleLeft, translation: fudge.Vector3.Y(paddleSpeedTranslation), rotation: 0 };
        controls[fudge.KEYBOARD_CODE.S] = { paddle: paddleLeft, translation: fudge.Vector3.Y(-paddleSpeedTranslation), rotation: 0 };
        return controls;
    }
    function moveBall() {
        mtxBall.translate(ballVelocity);
    }
    function createPong() {
        let meshQuad = new fudge.MeshQuad();
        let mtrSolidWhite = new fudge.Material("SolidWhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1, 1, 1, 1)));
        pong.appendChild(createNode("WallLeft", meshQuad, mtrSolidWhite, new fudge.Vector2(-22, 0), new fudge.Vector2(1, 30)));
        pong.appendChild(createNode("WallRight", meshQuad, mtrSolidWhite, new fudge.Vector2(22, 0), new fudge.Vector2(1, 30)));
        pong.appendChild(createNode("WallTop", meshQuad, mtrSolidWhite, new fudge.Vector2(0, 15), new fudge.Vector2(45, 1)));
        pong.appendChild(createNode("WallBottom", meshQuad, mtrSolidWhite, new fudge.Vector2(0, -15), new fudge.Vector2(45, 1)));
        ball = createNode("Ball", meshQuad, mtrSolidWhite, fudge.Vector2.ZERO(), new fudge.Vector2(1, 1));
        paddleLeft = createNode("PaddleLeft", meshQuad, mtrSolidWhite, new fudge.Vector2(-18, 0), new fudge.Vector2(1, 4));
        paddleRight = createNode("PaddleRight", meshQuad, mtrSolidWhite, new fudge.Vector2(18, 0), new fudge.Vector2(1, 4));
        fudge.Debug.log(ball.cmpTransform.local.translation.x);
        pong.appendChild(ball);
        pong.appendChild(paddleLeft);
        pong.appendChild(paddleRight);
        return pong;
    }
    function createNode(_name, _mesh, _material, _translation, _scaling) {
        let node = new fudge.Node(_name);
        node.addComponent(new fudge.ComponentTransform);
        node.addComponent(new fudge.ComponentMaterial(_material));
        node.addComponent(new fudge.ComponentMesh(_mesh));
        node.cmpTransform.local.translate(_translation.toVector3());
        node.getComponent(fudge.ComponentMesh).pivot.scale(_scaling.toVector3());
        return node;
    }
    function hndKeyup(_event) {
        keysPressed[_event.code] = false;
    }
    function hndKeydown(_event) {
        keysPressed[_event.code] = true;
    }
    function generateRandomeValue() {
        if (Math.random() <= 0.5) {
            return Math.random() * (+0.3 - +0.01) + +0.05;
        }
        else {
            return (Math.random() * (+0.3 - +0.01) + +0.05) * -1;
        }
    }
    function scoredPoint(_side) {
        ball.cmpTransform.local["data"][12] = 0;
        ball.cmpTransform.local["data"][13] = 0;
        ballVelocity = new fudge.Vector3(generateRandomeValue(), generateRandomeValue(), 0);
        if (_side == "right") {
            playerOneScore++;
            let scoreAreaPlayerTwo = document.getElementById("ScoreAreaPlayerTwo");
            scoreAreaPlayerTwo.innerHTML = playerOneScore.toString();
        }
        else {
            playerTwoScore++;
            let scoreAreaPlayerOne = document.getElementById("ScoreAreaPlayerOne");
            scoreAreaPlayerOne.innerHTML = playerTwoScore.toString();
        }
    }
})(PongGameFinal || (PongGameFinal = {}));
//# sourceMappingURL=Main.js.map