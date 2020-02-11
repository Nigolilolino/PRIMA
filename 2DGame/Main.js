"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    L16_ScrollerCollide.fudge = FudgeCore;
    window.addEventListener("load", test);
    let keysPressed = {};
    let hare;
    let healthbar = [];
    //let enemy2: Enemy;
    let enemy;
    let item;
    //let healthpoints: Healthpoints;
    function test() {
        let canvas = document.querySelector("canvas");
        //let crc2: CanvasRenderingContext2D = canvas.getContext("2d");
        let images = document.querySelectorAll("img");
        let txtHare = new L16_ScrollerCollide.fudge.TextureImage();
        txtHare.image = images[0];
        L16_ScrollerCollide.Hare.generateSprites(txtHare);
        let imgEnemy = images[1];
        let txtEnemy = new L16_ScrollerCollide.fudge.TextureImage();
        txtEnemy.image = imgEnemy;
        L16_ScrollerCollide.Enemy.generateSprites(txtEnemy);
        L16_ScrollerCollide.Stone.generateSprites(txtEnemy);
        let imgItem = images[2];
        let txtItems = new L16_ScrollerCollide.fudge.TextureImage();
        txtItems.image = imgItem;
        L16_ScrollerCollide.Items.generateSprites(txtItems);
        L16_ScrollerCollide.Healthpoints.generateSprites(txtItems);
        let txtEnvironment = new L16_ScrollerCollide.fudge.TextureImage();
        let imgEnvironment = images[3];
        txtEnvironment.image = imgEnvironment;
        L16_ScrollerCollide.Floor.generateSprites(txtEnvironment);
        let txtflora = new L16_ScrollerCollide.fudge.TextureImage();
        let imgflora = images[4];
        txtflora.image = imgflora;
        L16_ScrollerCollide.Flora.generateSprites(txtflora);
        L16_ScrollerCollide.fudge.RenderManager.initialize(true, false);
        L16_ScrollerCollide.game = new L16_ScrollerCollide.fudge.Node("Game");
        hare = new L16_ScrollerCollide.Hare("Hare");
        L16_ScrollerCollide.level = createLevel();
        L16_ScrollerCollide.game.appendChild(L16_ScrollerCollide.level);
        //game.appendChild(hare);
        let cmpCamera = new L16_ScrollerCollide.fudge.ComponentCamera();
        cmpCamera.pivot.translateZ(6);
        cmpCamera.pivot.translateY(1.5);
        //cmpCamera.pivot.lookAt(fudge.Vector3.ZERO());
        cmpCamera.backgroundColor = L16_ScrollerCollide.fudge.Color.CSS("aliceblue");
        let viewport = new L16_ScrollerCollide.fudge.Viewport();
        viewport.initialize("Viewport", L16_ScrollerCollide.game, cmpCamera, canvas);
        viewport.draw();
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);
        L16_ScrollerCollide.fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        L16_ScrollerCollide.fudge.Loop.start(L16_ScrollerCollide.fudge.LOOP_MODE.TIME_GAME, 15);
        function update(_event) {
            processInput();
            activateAnimations();
            viewport.draw();
            cmpCamera.pivot.translation = new L16_ScrollerCollide.fudge.Vector3(hare.mtxWorld.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
            for (let i = 0; i < healthbar.length; i++) {
                healthbar[i].cmpTransform.local.translation = new L16_ScrollerCollide.fudge.Vector3(hare.mtxWorld.translation.x + 2 + i / 10 + 0.2, 3, 0);
            }
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
        if (keysPressed[L16_ScrollerCollide.fudge.KEYBOARD_CODE.H]) {
            hare.act(L16_ScrollerCollide.ACTION.HIT);
            return;
        }
        hare.act(L16_ScrollerCollide.ACTION.IDLE);
    }
    function activateAnimations() {
        //enemy1.act(ACTION.WALK);
        item.act(L16_ScrollerCollide.ACTION.IDLE);
        let stoner = L16_ScrollerCollide.level.getChildrenByName("Stoner");
        for (let i = 0; i < stoner.length; i++) {
            stoner[i].act(L16_ScrollerCollide.ACTION.WALK);
        }
        let stones = L16_ScrollerCollide.level.getChildrenByName("Stone");
        for (let i = 0; i < stones.length; i++) {
            stones[i].act(L16_ScrollerCollide.ACTION.IDLE);
        }
    }
    function createLevel() {
        let level = new L16_ScrollerCollide.fudge.Node("Level");
        let floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleX(3);
        floor.cmpTransform.local.scaleY(2);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(2);
        floor.cmpTransform.local.scaleX(3);
        floor.cmpTransform.local.translateX(2.4);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(2);
        floor.cmpTransform.local.scaleX(3);
        floor.cmpTransform.local.translateX(5.3);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.DIRT);
        floor.cmpTransform.local.scaleY(1);
        floor.cmpTransform.local.scaleX(1);
        floor.cmpTransform.local.translateX(-2);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.DIRT);
        floor.cmpTransform.local.scaleY(1);
        floor.cmpTransform.local.scaleX(1);
        floor.cmpTransform.local.translateX(-2);
        floor.cmpTransform.local.translateY(0.9);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.DIRT);
        floor.cmpTransform.local.scaleY(1);
        floor.cmpTransform.local.scaleX(1);
        floor.cmpTransform.local.translateX(-2);
        floor.cmpTransform.local.translateY(1.8);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.DIRT);
        floor.cmpTransform.local.scaleY(1);
        floor.cmpTransform.local.scaleX(1);
        floor.cmpTransform.local.translateX(-2);
        floor.cmpTransform.local.translateY(2.7);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.DIRT);
        floor.cmpTransform.local.scaleY(1);
        floor.cmpTransform.local.scaleX(1);
        floor.cmpTransform.local.translateX(-2);
        floor.cmpTransform.local.translateY(3.6);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(2);
        floor.cmpTransform.local.scaleX(3);
        floor.cmpTransform.local.translateX(8.1);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(2);
        floor.cmpTransform.local.scaleX(3);
        floor.cmpTransform.local.translateX(10.5);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(2);
        floor.cmpTransform.local.scaleX(3);
        floor.cmpTransform.local.translateX(13.4);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(2);
        floor.cmpTransform.local.scaleX(3);
        floor.cmpTransform.local.translateX(16.3);
        level.appendChild(floor);
        //Hügel
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(2.5);
        floor.cmpTransform.local.translateY(0.2);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(2.9);
        floor.cmpTransform.local.translateY(0.2);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(3.3);
        floor.cmpTransform.local.translateY(0.2);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(3.7);
        floor.cmpTransform.local.translateY(0.2);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(4.1);
        floor.cmpTransform.local.translateY(0.2);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(2.9);
        floor.cmpTransform.local.translateY(0.5);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(3.3);
        floor.cmpTransform.local.translateY(0.5);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(3.7);
        floor.cmpTransform.local.translateY(0.5);
        level.appendChild(floor);
        //......................................
        //Enemies and Items
        // enemy = new Enemy("Stoner", 1.5, 1);
        // level.appendChild(enemy);
        // level.appendChild( enemy.creatHitbox());
        enemy = new L16_ScrollerCollide.Enemy("Stoner", 5, 1);
        level.appendChild(enemy);
        level.appendChild(enemy.creatHitbox());
        item = new L16_ScrollerCollide.Items("Potion", 6, 1);
        level.appendChild(item);
        level.appendChild(item.creatHitbox());
        level.appendChild(hare.createHitboxWeapon());
        for (let i = 0; i < hare.healthpoints - 1; i++) {
            let healthpoint = new L16_ScrollerCollide.Healthpoints("Player Healthpoint 1");
            level.appendChild(healthpoint);
            healthpoint.act(L16_ScrollerCollide.STATUS.FULL);
            healthbar.push(healthpoint);
        }
        level.appendChild(hare.creatHitbox());
        hare.healthbar = healthbar;
        //Flora
        let flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.LEAVES, 1.1, 3.3);
        flora.cmpTransform.local.scaleX(0.9);
        flora.cmpTransform.local.scaleY(0.9);
        flora.cmpTransform.local.rotateZ(-10);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_ROOT, 1, 0);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 1, 0.67);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 1, 1.4);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 1, 2.15);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_CROWN, 1, 2.75);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        //...
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.LEAVES, 4.1, 3.3);
        flora.cmpTransform.local.scaleX(0.9);
        flora.cmpTransform.local.scaleY(0.9);
        flora.cmpTransform.local.rotateZ(-10);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_ROOT, 4, 0);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 4, 0.67);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 4, 1.4);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 4, 2.15);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_CROWN, 4, 2.75);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        //...
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.LEAVES, 7.1, 3.3);
        flora.cmpTransform.local.scaleX(0.9);
        flora.cmpTransform.local.scaleY(0.9);
        flora.cmpTransform.local.rotateZ(-10);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_ROOT, 7, 0);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 7, 0.67);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 7, 1.4);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 7, 2.15);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_CROWN, 7, 2.75);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        //...
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.LEAVES, 10.1, 3.3);
        flora.cmpTransform.local.scaleX(0.9);
        flora.cmpTransform.local.scaleY(0.9);
        flora.cmpTransform.local.rotateZ(-10);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_ROOT, 10, 0);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 10, 0.67);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 10, 1.4);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, 10, 2.15);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        flora = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_CROWN, 10, 2.75);
        flora.cmpTransform.local.scaleX(0.6);
        flora.cmpTransform.local.scaleY(0.6);
        level.appendChild(flora);
        L16_ScrollerCollide.game.appendChild(hare);
        return level;
    }
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Main.js.map