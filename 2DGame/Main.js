"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    L16_ScrollerCollide.fudge = FudgeCore;
    window.addEventListener("load", test);
    let keysPressed = {};
    let hare;
    let enemy2;
    let enemy1;
    let item;
    function test() {
        let canvas = document.querySelector("canvas");
        let crc2 = canvas.getContext("2d");
        let img = document.querySelector("img");
        let txtHare = new L16_ScrollerCollide.fudge.TextureImage();
        txtHare.image = img;
        let images = document.querySelectorAll("img");
        let imgEnemy = images[1];
        let txtEnemy = new L16_ScrollerCollide.fudge.TextureImage();
        let imgItem = images[2];
        let txtItems = new L16_ScrollerCollide.fudge.TextureImage();
        txtEnemy.image = imgEnemy;
        txtItems.image = imgItem;
        L16_ScrollerCollide.Hare.generateSprites(txtHare);
        L16_ScrollerCollide.Enemy.generateSprites(txtEnemy);
        L16_ScrollerCollide.Items.generateSprites(txtItems);
        L16_ScrollerCollide.fudge.RenderManager.initialize(true, false);
        L16_ScrollerCollide.game = new L16_ScrollerCollide.fudge.Node("Game");
        hare = new L16_ScrollerCollide.Hare("Hare");
        enemy1 = new L16_ScrollerCollide.Enemy("Stoner1", 1.5, 1);
        enemy2 = new L16_ScrollerCollide.Enemy("Stoner2", 5, 1);
        item = new L16_ScrollerCollide.Items("Life Potion", 6, 1);
        L16_ScrollerCollide.level = createLevel();
        L16_ScrollerCollide.game.appendChild(L16_ScrollerCollide.level);
        L16_ScrollerCollide.game.appendChild(hare);
        L16_ScrollerCollide.game.appendChild(enemy1);
        L16_ScrollerCollide.game.appendChild(enemy2);
        L16_ScrollerCollide.game.appendChild(item);
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
        if (_event.code == L16_ScrollerCollide.fudge.KEYBOARD_CODE.ARROW_UP && _event.type == "keydown")
            enemy1.act(L16_ScrollerCollide.ACTION.JUMP);
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
        if (keysPressed[L16_ScrollerCollide.fudge.KEYBOARD_CODE.H]) {
            hare.act(L16_ScrollerCollide.ACTION.HIT);
            return;
        }
        if (keysPressed[L16_ScrollerCollide.fudge.KEYBOARD_CODE.ARROW_RIGHT]) {
            enemy1.act(L16_ScrollerCollide.ACTION.WALK, L16_ScrollerCollide.DIRECTION.RIGHT);
            return;
        }
        if (keysPressed[L16_ScrollerCollide.fudge.KEYBOARD_CODE.ARROW_LEFT]) {
            enemy1.act(L16_ScrollerCollide.ACTION.WALK, L16_ScrollerCollide.DIRECTION.LEFT);
            return;
        }
        hare.act(L16_ScrollerCollide.ACTION.IDLE);
        enemy1.act(L16_ScrollerCollide.ACTION.IDLE);
        enemy2.act(L16_ScrollerCollide.ACTION.IDLE);
        item.act(L16_ScrollerCollide.ACTION.IDLE);
    }
    function createLevel() {
        let level = new L16_ScrollerCollide.fudge.Node("Level");
        level.appendChild(hare.creatHitbox());
        level.appendChild(enemy1.creatHitbox());
        level.appendChild(enemy2.creatHitbox());
        level.appendChild(item.creatHitbox());
        let floor = new L16_ScrollerCollide.Floor();
        floor.cmpTransform.local.scaleX(3);
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
        floor.cmpTransform.local.scaleX(4);
        floor.cmpTransform.local.translateX(5.5);
        level.appendChild(floor);
        // let hitbox = new Hitbox();
        // hitbox.cmpTransform.local.translateX(2);
        // hitbox.cmpTransform.local.translateY(1.35);
        // hitbox.cmpTransform.local.scaleX(0.5);
        // hitbox.cmpTransform.local.scaleY(1.1);
        // level.appendChild(hitbox);
        return level;
    }
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Main.js.map