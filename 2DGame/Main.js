"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    L16_ScrollerCollide.fudge = FudgeCore;
    //window.addEventListener("load", test);
    window.addEventListener("load", initializeScreens);
    let keysPressed = {};
    let hare;
    let healthbar = [];
    let enemyranged;
    let enemyMelee;
    let jsonData;
    function initializeScreens() {
        loadFilesWithResponse();
        let startBtn = document.getElementById("gameStartBtn");
        startBtn.addEventListener("click", startGame);
        let menuetBtn = document.getElementById("menueBtn");
        menuetBtn.addEventListener("click", displayMenue);
        let menueExitBtn = document.getElementById("menueExitBtn");
        menueExitBtn.addEventListener("click", closeMenue);
        let restartBtn = document.getElementById("restartBtn");
        restartBtn.addEventListener("click", restartGame);
        let volumeSlider = document.getElementById("musicVolume");
        volumeSlider.addEventListener("click", changeVolume);
    }
    async function loadFilesWithResponse() {
        let response = await fetch("gameInfo.json");
        let offer = await response.text();
        jsonData = JSON.parse(offer);
    }
    function restartGame() {
        location.reload();
    }
    function displayMenue() {
        let menueScreen = document.getElementById("menue");
        menueScreen.style.visibility = "visible";
    }
    function closeMenue() {
        let menueScreen = document.getElementById("menue");
        menueScreen.style.visibility = "hidden";
    }
    function changeVolume() {
        let volumeSlider = document.getElementById("musicVolume");
        let value = parseInt(volumeSlider.value);
        L16_ScrollerCollide.Sound.vol = value / 100;
        L16_ScrollerCollide.Sound.play("testTrack");
    }
    function startGame() {
        let titleScreen = document.getElementById("startscreen");
        titleScreen.style.visibility = "hidden";
        L16_ScrollerCollide.Sound.init();
        //Sound.play("testTrack");
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
        let txtBackground = new L16_ScrollerCollide.fudge.TextureImage();
        let imgBackground = images[7];
        txtBackground.image = imgBackground;
        let txtSky = new L16_ScrollerCollide.fudge.TextureImage();
        let imgSky = images[8];
        txtSky.image = imgSky;
        let txtFloraArray = [txtflora, txtBackground, txtSky];
        L16_ScrollerCollide.Flora.generateSprites(txtFloraArray);
        L16_ScrollerCollide.fudge.RenderManager.initialize(true, false);
        L16_ScrollerCollide.game = new L16_ScrollerCollide.fudge.Node("Game");
        hare = new L16_ScrollerCollide.Hare("Hare");
        L16_ScrollerCollide.level = createLevel();
        L16_ScrollerCollide.game.appendChild(L16_ScrollerCollide.level);
        //game.appendChild(hare);
        let cmpCamera = new L16_ScrollerCollide.fudge.ComponentCamera();
        cmpCamera.pivot.translateZ(6);
        cmpCamera.pivot.translateY(1.5);
        cmpCamera.pivot.translateX(2);
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
            if (hare.cmpTransform.local.translation.x >= 25.5) {
                cmpCamera.pivot.translation = new L16_ScrollerCollide.fudge.Vector3(cmpCamera.pivot.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
            }
            else if (hare.cmpTransform.local.translation.x <= 2) {
                cmpCamera.pivot.translation = new L16_ScrollerCollide.fudge.Vector3(cmpCamera.pivot.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
            }
            else {
                cmpCamera.pivot.translation = new L16_ScrollerCollide.fudge.Vector3(hare.mtxWorld.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
            }
            for (let i = 0; i < healthbar.length; i++) {
                healthbar[i].cmpTransform.local.translation = new L16_ScrollerCollide.fudge.Vector3(cmpCamera.pivot.translation.x + 2 + i / 10 + 0.2, 3, 0);
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
        // enemyranged = new EnemyRanged("Stoner", 12, 1);
        // level.appendChild(enemyranged);
        // level.appendChild(enemyranged.creatHitbox());
        // enemyMelee = new EnemyMelee("StonerMelee", 3, 1);
        // level.appendChild(enemyMelee);
        // level.appendChild(enemyMelee.creatHitbox());
        // enemyMelee = new EnemyMelee("StonerMelee", 10, 1);
        // level.appendChild(enemyMelee);
        // level.appendChild(enemyMelee.creatHitbox());
        // enemyMelee = new EnemyMelee("StonerMelee", 19, 1);
        // level.appendChild(enemyMelee);
        // level.appendChild(enemyMelee.creatHitbox());
        for (let i = 0; i < jsonData[0].level1.length; i++) {
            let object = jsonData[0].level1[i];
            switch (object.objectName) {
                case "Floor":
                    createFloor(level, L16_ScrollerCollide.TYPE.GRASS);
                    break;
                case "Item":
                    let item = new L16_ScrollerCollide.Items(object.type, object.posX, object.posY);
                    level.appendChild(item);
                    level.appendChild(item.creatHitbox());
                    break;
                case "Hill":
                    if (object.type == "Big") {
                        createHillBig(object.posX, level);
                    }
                    else if (object.type == "Small") {
                        createHillSmall(object.posX, level);
                    }
                    break;
                case "Platform":
                    createPlatform(object.posX, level);
                    break;
                case "Decoration":
                    if (object.type == "Tree") {
                        createTree(object.posX, level);
                    }
                    break;
                default:
                    console.log("Item");
            }
        }
        for (let i = 0; i < hare.healthpoints - 1; i++) {
            let healthpoint = new L16_ScrollerCollide.Healthpoints("Player Healthpoint 1");
            level.appendChild(healthpoint);
            healthpoint.act(L16_ScrollerCollide.STATUS.FULL);
            healthbar.push(healthpoint);
        }
        level.appendChild(hare.createHitboxWeapon());
        level.appendChild(hare.creatHitbox());
        hare.healthbar = healthbar;
        // let item: Items = new Items("Potion", 1, 1.5);
        // level.appendChild(item);
        // level.appendChild( item.creatHitbox());
        // item = new Items("Potion", 5, 1.5);
        // level.appendChild(item);
        // level.appendChild( item.creatHitbox());
        // item = new Items("Potion", 23.5, 1.5);
        // level.appendChild(item);
        // level.appendChild( item.creatHitbox());
        // item = new Items("Potion", 40, 1.5);
        // level.appendChild(item);
        // level.appendChild( item.creatHitbox());
        // item = new Items("Potion", 46, 1.5);
        // level.appendChild(item);
        // level.appendChild( item.creatHitbox());
        // createHillSmall(2.5, level);
        // createHillBig(9, level);
        // createHillSmall(20, level);
        // createHillBig(27, level);
        // createHillBig(36, level);
        // createHillSmall(42, level);
        // createPlatform(1, level);
        // createPlatform(4.6, level);
        // createPlatform(5.2, level);
        // createPlatform(13, level);
        // createPlatform(22.85, level);
        // createPlatform(23.45, level);
        // createPlatform(24.05, level);
        // createPlatform(40, level);
        // createPlatform(46, level);
        // createPlatform(48.9, level);
        // createPlatform(49.5, level);
        // createTree(1, level);
        // createTree(3, level);
        // createTree(5, level);
        // createTree(6, level);
        // createTree(7, level);
        // createTree(11, level);
        // createTree(13, level);
        // createTree(15, level);
        // createTree(16, level);
        // createTree(19, level);
        // createTree(21, level);
        // createTree(22, level);
        // createTree(23, level);
        // createTree(24, level);
        // createTree(27, level);
        // createTree(29, level);
        // createTree(30.5, level);
        // createTree(32, level);
        // createTree(33, level);
        // createTree(35, level);
        // createTree(37.5, level);
        // createTree(39, level);
        // createTree(46, level);
        // createTree(48, level);
        // createTree(49.5, level);
        // createTree(40, level);
        // createTree(49, level);
        // createTree(51, level);
        // createTree(53, level);
        // createTree(55, level);
        createBackground(level);
        createSky(level);
        L16_ScrollerCollide.game.appendChild(hare);
        return level;
    }
    function createSky(_level) {
        let x = -4.55;
        for (let i = 0; i < 4; i++) {
            let sky = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.SKY, x, 4, -5);
            _level.appendChild(sky);
            x = x + 12.8;
        }
    }
    function createBackground(_level) {
        let x = -6.5;
        for (let i = 0; i < 5; i++) {
            let background = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.BACKGROUND, x, 0.7, -3);
            _level.appendChild(background);
            x = x + 8.25;
        }
    }
    function createFloor(_level, _type) {
        let distance = 2.9;
        for (let i = 0; i < 11; i++) {
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
    function createHillBig(_x, _level) {
        let distance = 0;
        for (let i = 0; i < 8; i++) {
            let floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
            floor.cmpTransform.local.scaleY(0.5);
            floor.cmpTransform.local.scaleX(0.5);
            floor.cmpTransform.local.translateX(_x + distance);
            floor.cmpTransform.local.translateY(0.2);
            _level.appendChild(floor);
            distance += 0.4;
        }
        distance = 0.4;
        for (let i = 0; i < 6; i++) {
            let floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
            floor.cmpTransform.local.scaleY(0.5);
            floor.cmpTransform.local.scaleX(0.5);
            floor.cmpTransform.local.translateX(_x + distance);
            floor.cmpTransform.local.translateY(0.4);
            _level.appendChild(floor);
            distance += 0.4;
        }
        distance = 0.8;
        for (let i = 0; i < 4; i++) {
            let floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
            floor.cmpTransform.local.scaleY(0.5);
            floor.cmpTransform.local.scaleX(0.5);
            floor.cmpTransform.local.translateX(_x + distance);
            floor.cmpTransform.local.translateY(0.6);
            _level.appendChild(floor);
            distance += 0.4;
        }
        distance = 1;
        for (let i = 0; i < 3; i++) {
            let floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
            floor.cmpTransform.local.scaleY(0.5);
            floor.cmpTransform.local.scaleX(0.5);
            floor.cmpTransform.local.translateX(_x + distance);
            floor.cmpTransform.local.translateY(0.8);
            _level.appendChild(floor);
            distance += 0.4;
        }
    }
    function createHillSmall(_x, _level) {
        let distance = 0;
        for (let i = 0; i < 5; i++) {
            let floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
            floor.cmpTransform.local.scaleY(0.5);
            floor.cmpTransform.local.scaleX(0.5);
            floor.cmpTransform.local.translateX(_x + distance);
            floor.cmpTransform.local.translateY(0.2);
            _level.appendChild(floor);
            distance += 0.4;
        }
        distance = 0.4;
        for (let i = 0; i < 3; i++) {
            let floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.GRASS);
            floor.cmpTransform.local.scaleY(0.5);
            floor.cmpTransform.local.scaleX(0.5);
            floor.cmpTransform.local.translateX(_x + distance);
            floor.cmpTransform.local.translateY(0.4);
            _level.appendChild(floor);
            distance += 0.4;
        }
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
        let tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.LEAVES, _x + 0.1, 3.3, -1);
        tree.cmpTransform.local.scaleX(0.9);
        tree.cmpTransform.local.scaleY(0.9);
        tree.cmpTransform.local.rotateZ(-10);
        _level.appendChild(tree);
        tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_ROOT, _x, 0, -1);
        tree.cmpTransform.local.scaleX(0.6);
        tree.cmpTransform.local.scaleY(0.6);
        _level.appendChild(tree);
        tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, _x, 0.67, -1);
        tree.cmpTransform.local.scaleX(0.6);
        tree.cmpTransform.local.scaleY(0.6);
        _level.appendChild(tree);
        tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, _x, 1.4, -1);
        tree.cmpTransform.local.scaleX(0.6);
        tree.cmpTransform.local.scaleY(0.6);
        _level.appendChild(tree);
        tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_TRUNK, _x, 2.15, -1);
        tree.cmpTransform.local.scaleX(0.6);
        tree.cmpTransform.local.scaleY(0.6);
        _level.appendChild(tree);
        tree = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.TREE_CROWN, _x, 2.75, -1);
        tree.cmpTransform.local.scaleX(0.6);
        tree.cmpTransform.local.scaleY(0.6);
        _level.appendChild(tree);
    }
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Main.js.map