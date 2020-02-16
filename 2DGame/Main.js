"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    L16_ScrollerCollide.fudge = FudgeCore;
    window.addEventListener("load", initialization);
    let keysPressed = {};
    let knight;
    let healthbar = [];
    let enemyranged;
    let enemyMelee;
    let jsonData;
    function initialization() {
        loadFilesWithResponse();
        let startBtn = document.getElementById("gameStartBtn");
        startBtn.addEventListener("click", startGame);
        let menuetBtn = document.getElementById("menueBtn");
        menuetBtn.addEventListener("click", displayMenue);
        let menueExitBtn = document.getElementById("menueExitBtn");
        menueExitBtn.addEventListener("click", closeMenue);
        let restartBtn = document.getElementsByClassName("restartBtn");
        for (let i = 0; i < restartBtn.length; i++) {
            restartBtn[i].addEventListener("click", restartGame);
        }
        let volumeSlider = document.getElementById("musicVolume");
        volumeSlider.addEventListener("click", changeVolume);
        let showControlsBtns = document.getElementsByClassName("showControlsBtn");
        for (let i = 0; i < showControlsBtns.length; i++) {
            showControlsBtns[i].addEventListener("click", displayControls);
        }
        let hideControlsBtn = document.getElementById("controlsExitBtn");
        hideControlsBtn.addEventListener("click", closeControlsScreen);
    }
    async function loadFilesWithResponse() {
        let response = await fetch("gameInfo.json");
        let offer = await response.text();
        jsonData = JSON.parse(offer);
    }
    function restartGame() {
        location.reload();
    }
    function startGame() {
        let titleScreen = document.getElementById("startscreen");
        titleScreen.style.visibility = "hidden";
        L16_ScrollerCollide.Sound.init();
        L16_ScrollerCollide.Sound.play("Theme");
        let canvas = document.querySelector("canvas");
        let images = document.querySelectorAll("img");
        loadTextures(images);
        L16_ScrollerCollide.fudge.RenderManager.initialize(true, false);
        L16_ScrollerCollide.game = new L16_ScrollerCollide.fudge.Node("Game");
        knight = new L16_ScrollerCollide.Knight("Knight");
        L16_ScrollerCollide.level = createLevel();
        L16_ScrollerCollide.game.appendChild(L16_ScrollerCollide.level);
        console.log(L16_ScrollerCollide.game);
        let cmpCamera = new L16_ScrollerCollide.fudge.ComponentCamera();
        cmpCamera.pivot.translateZ(6);
        cmpCamera.pivot.translateY(1.5);
        cmpCamera.pivot.translateX(2);
        cmpCamera.backgroundColor = L16_ScrollerCollide.fudge.Color.CSS("aliceblue");
        let viewport = new L16_ScrollerCollide.fudge.Viewport();
        viewport.initialize("Viewport", L16_ScrollerCollide.game, cmpCamera, canvas);
        viewport.draw();
        document.addEventListener("keydown", handleJump);
        document.addEventListener("keyup", handleJump);
        L16_ScrollerCollide.fudge.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        L16_ScrollerCollide.fudge.Loop.start(L16_ScrollerCollide.fudge.LOOP_MODE.TIME_REAL, 10);
        function update(_event) {
            processInput();
            activateAnimations();
            viewport.draw();
            if (knight.cmpTransform.local.translation.x >= 18) {
                cmpCamera.pivot.translation = new L16_ScrollerCollide.fudge.Vector3(cmpCamera.pivot.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
            }
            else if (knight.cmpTransform.local.translation.x <= 2) {
                cmpCamera.pivot.translation = new L16_ScrollerCollide.fudge.Vector3(cmpCamera.pivot.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
            }
            else {
                cmpCamera.pivot.translation = new L16_ScrollerCollide.fudge.Vector3(knight.mtxWorld.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
            }
            for (let i = 0; i < healthbar.length; i++) {
                healthbar[i].cmpTransform.local.translation = new L16_ScrollerCollide.fudge.Vector3(cmpCamera.pivot.translation.x + 2 + i / 10 + 0.2, 3, 0);
            }
        }
    }
    function handleJump(_event) {
        keysPressed[_event.code] = (_event.type == "keydown");
        if (_event.code == L16_ScrollerCollide.fudge.KEYBOARD_CODE.W && _event.type == "keydown")
            knight.act(L16_ScrollerCollide.ACTION.JUMP);
    }
    function processInput() {
        if (keysPressed[L16_ScrollerCollide.fudge.KEYBOARD_CODE.A]) {
            knight.act(L16_ScrollerCollide.ACTION.WALK, L16_ScrollerCollide.DIRECTION.LEFT);
            return;
        }
        if (keysPressed[L16_ScrollerCollide.fudge.KEYBOARD_CODE.D]) {
            knight.act(L16_ScrollerCollide.ACTION.WALK, L16_ScrollerCollide.DIRECTION.RIGHT);
            return;
        }
        if (keysPressed[L16_ScrollerCollide.fudge.KEYBOARD_CODE.H]) {
            knight.act(L16_ScrollerCollide.ACTION.HIT);
            return;
        }
        knight.act(L16_ScrollerCollide.ACTION.IDLE);
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
        for (let i = 0; i < jsonData[0].level1.levelObjects.length; i++) {
            let object = jsonData[0].level1.levelObjects[i];
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
                case "Enemy":
                    if (object.type == "Ranged") {
                        enemyranged = new L16_ScrollerCollide.EnemyRanged("Stoner", object.posX, object.posy);
                        level.appendChild(enemyranged);
                        level.appendChild(enemyranged.creatHitbox(0.4, 0.6));
                    }
                    else if (object.type == "Melee") {
                        enemyMelee = new L16_ScrollerCollide.EnemyMelee("StonerMelee", object.posX, object.posy);
                        level.appendChild(enemyMelee);
                        level.appendChild(enemyMelee.creatHitbox(0.9, 0.5));
                    }
                    break;
                case "Background":
                    if (object.type == "Landscape") {
                        createBackground(level, object.amount);
                    }
                    else if (object.type == "Sky") {
                        createSky(level, object.amount);
                    }
                    break;
                default:
                    console.log("Item");
            }
        }
        let floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.DIRT);
        floor.cmpTransform.local.translateX(-1.5);
        floor.cmpTransform.local.translateY(0);
        floor.cmpTransform.local.scaleX(1);
        floor.cmpTransform.local.scaleY(0.5);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.DIRT);
        floor.cmpTransform.local.translateX(-2.4);
        floor.cmpTransform.local.translateY(2);
        floor.cmpTransform.local.scaleX(2);
        floor.cmpTransform.local.scaleY(2);
        level.appendChild(floor);
        floor = new L16_ScrollerCollide.Floor(L16_ScrollerCollide.TYPE.DIRT);
        floor.cmpTransform.local.translateX(22.3);
        floor.cmpTransform.local.translateY(2);
        floor.cmpTransform.local.scaleX(2);
        floor.cmpTransform.local.scaleY(2);
        level.appendChild(floor);
        initializeKnight(level);
        return level;
    }
    function initializeKnight(_level) {
        for (let i = 0; i < knight.healthpoints - 1; i++) {
            let healthpoint = new L16_ScrollerCollide.Healthpoints("Player Healthpoint 1");
            L16_ScrollerCollide.game.appendChild(healthpoint);
            healthpoint.act(L16_ScrollerCollide.STATUS.FULL);
            healthbar.push(healthpoint);
        }
        knight.healthbar = healthbar;
        L16_ScrollerCollide.game.appendChild(knight.createHitboxWeapon());
        L16_ScrollerCollide.game.appendChild(knight.creatHitbox());
        L16_ScrollerCollide.game.appendChild(knight);
    }
    function createSky(_level, _amount) {
        let x = -4.55;
        for (let i = 0; i < _amount; i++) {
            let sky = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.SKY, x, 4, -5);
            _level.appendChild(sky);
            x = x + 12.8;
        }
    }
    function createBackground(_level, _amount) {
        let x = -6.5;
        for (let i = 0; i < _amount; i++) {
            let background = new L16_ScrollerCollide.Flora(L16_ScrollerCollide.ENVI_TYPE.BACKGROUND, x, 0.7, -3);
            _level.appendChild(background);
            x = x + 8.25;
        }
    }
    function createFloor(_level, _type) {
        let distance = 2.9;
        for (let i = 0; i < 8; i++) {
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
    function closeControlsScreen() {
        let controlsScreen = document.getElementById("controllsScreen");
        controlsScreen.style.visibility = "hidden";
    }
    function displayControls() {
        let controlsScreen = document.getElementById("controllsScreen");
        controlsScreen.style.visibility = "visible";
    }
    function displayMenue() {
        let menueScreen = document.getElementById("menue");
        menueScreen.style.visibility = "visible";
        L16_ScrollerCollide.fudge.Loop.stop();
    }
    function closeMenue() {
        let menueScreen = document.getElementById("menue");
        menueScreen.style.visibility = "hidden";
        L16_ScrollerCollide.fudge.Loop.start(L16_ScrollerCollide.fudge.LOOP_MODE.TIME_REAL, 10);
    }
    function changeVolume() {
        let volumeSlider = document.getElementById("musicVolume");
        let value = parseInt(volumeSlider.value);
        L16_ScrollerCollide.Sound.vol = value / 100;
        L16_ScrollerCollide.Sound.play("Theme");
    }
    function loadTextures(_images) {
        let txtHare1 = new L16_ScrollerCollide.fudge.TextureImage();
        txtHare1.image = _images[0];
        let txtHare2 = new L16_ScrollerCollide.fudge.TextureImage();
        txtHare2.image = _images[9];
        let txtKnightArray = [txtHare1, txtHare2];
        L16_ScrollerCollide.Knight.generateSprites(txtKnightArray);
        let imgEnemyRange = _images[1];
        let txtEnemyRange = new L16_ScrollerCollide.fudge.TextureImage();
        txtEnemyRange.image = imgEnemyRange;
        L16_ScrollerCollide.EnemyRanged.generateSprites(txtEnemyRange);
        L16_ScrollerCollide.Stone.generateSprites(txtEnemyRange);
        let imgEnemyMelee = _images[6];
        let txtEnemyMelee = new L16_ScrollerCollide.fudge.TextureImage();
        txtEnemyMelee.image = imgEnemyMelee;
        L16_ScrollerCollide.EnemyMelee.generateSprites(txtEnemyMelee);
        let imgItem = _images[2];
        let txtItems = new L16_ScrollerCollide.fudge.TextureImage();
        txtItems.image = imgItem;
        L16_ScrollerCollide.Items.generateSprites(txtItems);
        L16_ScrollerCollide.Healthpoints.generateSprites(txtItems);
        let txtEnvironment = new L16_ScrollerCollide.fudge.TextureImage();
        let imgEnvironment = _images[3];
        txtEnvironment.image = imgEnvironment;
        let txtWood = new L16_ScrollerCollide.fudge.TextureImage();
        let imgWood = _images[5];
        txtWood.image = imgWood;
        let txtEnvrironmentArray = [txtEnvironment, txtWood];
        L16_ScrollerCollide.Floor.generateSprites(txtEnvrironmentArray);
        let txtflora = new L16_ScrollerCollide.fudge.TextureImage();
        let imgflora = _images[4];
        txtflora.image = imgflora;
        let txtBackground = new L16_ScrollerCollide.fudge.TextureImage();
        let imgBackground = _images[7];
        txtBackground.image = imgBackground;
        let txtSky = new L16_ScrollerCollide.fudge.TextureImage();
        let imgSky = _images[8];
        txtSky.image = imgSky;
        let txtFloraArray = [txtflora, txtBackground, txtSky];
        L16_ScrollerCollide.Flora.generateSprites(txtFloraArray);
    }
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Main.js.map