"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    L16_ScrollerCollide.fudge = FudgeCore;
    window.addEventListener("load", test);
    let keysPressed = {};
    let hare;
    function test() {
        let canvas = document.querySelector("canvas");
        let crc2 = canvas.getContext("2d");
        let img = document.querySelector("img");
        let txtHare = new L16_ScrollerCollide.fudge.TextureImage();
        txtHare.image = img;
        L16_ScrollerCollide.Hare.generateSprites(txtHare);
        L16_ScrollerCollide.fudge.RenderManager.initialize(true, false);
        L16_ScrollerCollide.game = new L16_ScrollerCollide.fudge.Node("Game");
        hare = new L16_ScrollerCollide.Hare("Hare");
        L16_ScrollerCollide.level = createLevel();
        L16_ScrollerCollide.game.appendChild(L16_ScrollerCollide.level);
        L16_ScrollerCollide.game.appendChild(hare);
        let cmpCamera = new L16_ScrollerCollide.fudge.ComponentCamera();
        cmpCamera.pivot.translateZ(5);
        cmpCamera.pivot.lookAt(L16_ScrollerCollide.fudge.Vector3.ZERO());
        cmpCamera.backgroundColor = L16_ScrollerCollide.fudge.Color.CSS("aliceblue");
        let viewport = new L16_ScrollerCollide.fudge.Viewport();
        viewport.initialize("Viewport", L16_ScrollerCollide.game, cmpCamera, canvas);
        viewport.draw();
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);
        L16_ScrollerCollide.fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        L16_ScrollerCollide.fudge.Loop.start(L16_ScrollerCollide.fudge.LOOP_MODE.TIME_GAME, 10);
        function update(_event) {
            processInput();
            //fudge.Debug.log(hare.cmpTransform.local.translation.toVector2());
            viewport.draw();
            cmpCamera.pivot.translation = new L16_ScrollerCollide.fudge.Vector3(hare.mtxWorld.translation.x, hare.mtxWorld.translation.y, cmpCamera.pivot.translation.z);
            //crc2.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
            //crc2.strokeRect(-1, canvas.height / 2, canvas.width + 2, canvas.height);
        }
    }
    function handleKeyboard(_event) {
        keysPressed[_event.code] = (_event.type == "keydown");
        if (_event.code == L16_ScrollerCollide.fudge.KEYBOARD_CODE.W && _event.type == "keydown")
            hare.act(L16_ScrollerCollide.ACTION.JUMP);
    }
    function processInput() {
        if (keysPressed[L16_ScrollerCollide.fudge.KEYBOARD_CODE.A]) {
            hare.act(L16_ScrollerCollide.ACTION.WALK, L16_ScrollerCollide.DIRECTION.LEFT);
            return;
        }
        if (keysPressed[L16_ScrollerCollide.fudge.KEYBOARD_CODE.D]) {
            hare.act(L16_ScrollerCollide.ACTION.WALK, L16_ScrollerCollide.DIRECTION.RIGHT);
            return;
        }
        hare.act(L16_ScrollerCollide.ACTION.IDLE);
    }
    function createLevel() {
        let level = new L16_ScrollerCollide.fudge.Node("Level");
        let floor = new L16_ScrollerCollide.Floor();
        floor.cmpTransform.local.scaleY(1);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor();
        floor.cmpTransform.local.scaleY(1);
        floor.cmpTransform.local.scaleX(2);
        floor.cmpTransform.local.translateY(0.2);
        floor.cmpTransform.local.translateX(1.5);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor();
        floor.cmpTransform.local.scaleY(1);
        floor.cmpTransform.local.scaleX(2);
        floor.cmpTransform.local.translateX(5.5);
        level.appendChild(floor);
        return level;
    }
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Main.js.map