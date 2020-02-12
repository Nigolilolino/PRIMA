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
    let enemyranged;
    let enemyMelee;
    let item;
    //let healthpoints: Healthpoints;
    function test() {
        let canvas = document.querySelector("canvas");
        //let crc2: CanvasRenderingContext2D = canvas.getContext("2d");
        let images = document.querySelectorAll("img");
        let txtHare = new L16_ScrollerCollide.fudge.TextureImage();
        txtHare.image = images[0];
        L16_ScrollerCollide.Hare.generateSprites(txtHare);
        let imgEnemyRange = images[1];
        let txtEnemyRange = new L16_ScrollerCollide.fudge.TextureImage();
        txtEnemyRange.image = imgEnemyRange;
        L16_ScrollerCollide.EnemyRanged.generateSprites(txtEnemyRange);
        L16_ScrollerCollide.Stone.generateSprites(txtEnemyRange);
        let imgEnemyMelee = images[6];
        let txtEnemyMelee = new L16_ScrollerCollide.fudge.TextureImage();
        txtEnemyMelee.image = imgEnemyMelee;
        L16_ScrollerCollide.EnemyMelee.generateSprites(txtEnemyMelee);
        let imgItem = images[2];
        let txtItems = new L16_ScrollerCollide.fudge.TextureImage();
        txtItems.image = imgItem;
        L16_ScrollerCollide.Items.generateSprites(txtItems);
        L16_ScrollerCollide.Healthpoints.generateSprites(txtItems);
        let txtEnvironment = new L16_ScrollerCollide.fudge.TextureImage();
        let imgEnvironment = images[3];
        txtEnvironment.image = imgEnvironment;
        let txtWood = new L16_ScrollerCollide.fudge.TextureImage();
        let imgWood = images[5];
        txtWood.image = imgWood;
        let txtEnvrironmentArray = [txtEnvironment, txtWood];
        L16_ScrollerCollide.Floor.generateSprites(txtEnvrironmentArray);
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
        let item = L16_ScrollerCollide.level.getChildrenByName("Potion");
        for (let i = 0; i < item.length; i++) {
            item[i].act(L16_ScrollerCollide.ACTION.IDLE);
        }
        let stoner = L16_ScrollerCollide.level.getChildrenByName("Stoner");
        for (let i = 0; i < stoner.length; i++) {
            stoner[i].act(L16_ScrollerCollide.ACTION.WALK);
        }
        let stonerMelee = L16_ScrollerCollide.level.getChildrenByName("StonerMelee");
        for (let i = 0; i < stonerMelee.length; i++) {
            stonerMelee[i].act(L16_ScrollerCollide.ACTION.WALK);
        }
        let stones = L16_ScrollerCollide.level.getChildrenByName("Stone");
        for (let i = 0; i < stones.length; i++) {
            stones[i].act(L16_ScrollerCollide.ACTION.IDLE);
        }
    }
    function createLevel() {
        let level = new L16_ScrollerCollide.fudge.Node("Level");
        createFloor(level, L16_ScrollerCollide.TYPE.GRASS);
        // enemyranged = new EnemyRanged("Stoner", 5, 1);
        // level.appendChild(enemyranged);
        // level.appendChild(enemyranged.creatHitbox());
        enemyMelee = new L16_ScrollerCollide.EnemyMelee("StonerMelee", 3, 1);
        level.appendChild(enemyMelee);
        level.appendChild(enemyMelee.creatHitbox());
        let item = new L16_ScrollerCollide.Items("Potion", 1, 3);
        level.appendChild(item);
        level.appendChild(item.creatHitbox());
        item = new L16_ScrollerCollide.Items("Potion", 3, 2);
        level.appendChild(item);
        level.appendChild(item.creatHitbox());
        for (let i = 0; i < hare.healthpoints - 1; i++) {
            let healthpoint = new L16_ScrollerCollide.Healthpoints("Player Healthpoint 1");
            level.appendChild(healthpoint);
            healthpoint.act(L16_ScrollerCollide.STATUS.FULL);
            healthbar.push(healthpoint);
        }
        level.appendChild(hare.createHitboxWeapon());
        level.appendChild(hare.creatHitbox());
        hare.healthbar = healthbar;
        createHill(2.5, level);
        createHill(10, level);
        createPlatform(1, level);
        createPlatform(4.6, level);
        createPlatform(5.2, level);
        createPlatform(13, level);
        createTree(1, level);
        createTree(3, level);
        createTree(5, level);
        createTree(7, level);
        createTree(9, level);
        createTree(11, level);
        createTree(13, level);
        createTree(15, level);
        L16_ScrollerCollide.game.appendChild(hare);
        return level;
    }
    function createFloor(_level, _type) {
        let distance = 2.9;
        for (let i = 0; i < 20; i++) {
            if (i == 0) {
                let floor = new L16_ScrollerCollide.Floor(_type);
                floor.cmpTransform.local.scaleX(3);
                floor.cmpTransform.local.scaleY(2);
                _level.appendChild(floor);
            }
            else {
                let floor = new L16_ScrollerCollide.Floor(_type);
                floor.cmpTransform.local.scaleY(2);
                floor.cmpTransform.local.scaleX(3);
                floor.cmpTransform.local.translateX(distance);
                _level.appendChild(floor);
                distance = distance + 2.9;
            }
        }
    }
    function createHill(_x, _level) {
        let floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x);
        floor.cmpTransform.local.translateY(0.2);
        _level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + .4);
        floor.cmpTransform.local.translateY(0.2);
        _level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + 0.8);
        floor.cmpTransform.local.translateY(0.2);
        _level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + 1.2);
        floor.cmpTransform.local.translateY(0.2);
        _level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + 1.6);
        floor.cmpTransform.local.translateY(0.2);
        _level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + 0.4);
        floor.cmpTransform.local.translateY(0.5);
        _level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + 0.8);
        floor.cmpTransform.local.translateY(0.5);
        _level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + 1.2);
        floor.cmpTransform.local.translateY(0.5);
        _level.appendChild(floor);
    }
    function createPlatform(_x, _level) {
        let platform = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.WOOD_S);
        platform.cmpTransform.local.translateY(1.5);
        platform.cmpTransform.local.translateX(_x);
        platform.cmpTransform.local.translateZ(-1);
        platform.cmpTransform.local.scaleX(0.5);
        platform.cmpTransform.local.scaleY(0.5);
        _level.appendChild(platform);
    }
    function createTree(_x, _level) {
        let tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.LEAVES, _x + 0.1, 3.3);
        tree.cmpTransform.local.scaleX(0.9);
        tree.cmpTransform.local.scaleY(0.9);
        tree.cmpTransform.local.rotateZ(-10);
        _level.appendChild(tree);
        tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_ROOT, _x, 0);
        tree.cmpTransform.local.scaleX(0.6);
        tree.cmpTransform.local.scaleY(0.6);
        _level.appendChild(tree);
        tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, _x, 0.67);
        tree.cmpTransform.local.scaleX(0.6);
        tree.cmpTransform.local.scaleY(0.6);
        _level.appendChild(tree);
        tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, _x, 1.4);
        tree.cmpTransform.local.scaleX(0.6);
        tree.cmpTransform.local.scaleY(0.6);
        _level.appendChild(tree);
        tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, _x, 2.15);
        tree.cmpTransform.local.scaleX(0.6);
        tree.cmpTransform.local.scaleY(0.6);
        _level.appendChild(tree);
        tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_CROWN, _x, 2.75);
        tree.cmpTransform.local.scaleX(0.6);
        tree.cmpTransform.local.scaleY(0.6);
        _level.appendChild(tree);
    }
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Main.js.map