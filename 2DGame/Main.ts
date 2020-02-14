///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    export import fudge = FudgeCore;
  
    //window.addEventListener("load", test);
    window.addEventListener("load", initialization);
  
    interface KeyPressed {
      [code: string]: boolean;
    }
    let keysPressed: KeyPressed = {};
  
    export let game: fudge.Node;
    export let level: fudge.Node;
    let knight: Knight;
    let healthbar: Healthpoints[] = [];
    let enemyranged: EnemyRanged;
    let enemyMelee: EnemyMelee;
    let jsonData: Object[];
  
    function initialization(): void {

      loadFilesWithResponse();
      
      let startBtn: HTMLDivElement = <HTMLDivElement>document.getElementById("gameStartBtn");
      startBtn.addEventListener("click", startGame);

      let menuetBtn: HTMLDivElement = <HTMLDivElement>document.getElementById("menueBtn");
      menuetBtn.addEventListener("click", displayMenue);

      let menueExitBtn: HTMLDivElement = <HTMLDivElement>document.getElementById("menueExitBtn");
      menueExitBtn.addEventListener("click", closeMenue);

      let restartBtn: HTMLDivElement = <HTMLDivElement>document.getElementById("restartBtn");
      restartBtn.addEventListener("click", restartGame);

      let volumeSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("musicVolume");
      volumeSlider.addEventListener("click", changeVolume);

      let showControlsBtns = document.getElementsByClassName("showControlsBtn");
      for (let i: number = 0; i < showControlsBtns.length; i++) {
        showControlsBtns[i].addEventListener("click", displayControls);
      }

      let hideControlsBtn: HTMLDivElement = <HTMLDivElement>document.getElementById("controlsExitBtn");
      hideControlsBtn.addEventListener("click", closeControlsScreen);
    }

    async function loadFilesWithResponse(): Promise<void> {
      let response: Response = await fetch("gameInfo.json");
      let offer: string = await response.text();
      jsonData = JSON.parse(offer);
  }

    function restartGame(){
      location.reload();
    }

    function closeControlsScreen(){
      let controlsScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("controllsScreen");
      controlsScreen.style.visibility = "hidden";
    }

    function displayControls(){
      let controlsScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("controllsScreen");
      controlsScreen.style.visibility = "visible";
    }

    function displayMenue(){
      let menueScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("menue");
      menueScreen.style.visibility = "visible";
    }

    function closeMenue(){
      let menueScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("menue");
      menueScreen.style.visibility = "hidden";
    }

    function changeVolume(){
      let volumeSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("musicVolume");
      let value: number = parseInt(volumeSlider.value);
      Sound.vol = value / 100;
      Sound.play("testTrack");
    }
  
    function startGame(): void {
      
      let titleScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("startscreen");
      titleScreen.style.visibility = "hidden";
      Sound.init();
      //Sound.play("testTrack");

      let canvas: HTMLCanvasElement = document.querySelector("canvas");
      let images: any = document.querySelectorAll("img");

      let txtHare: fudge.TextureImage = new fudge.TextureImage();
      txtHare.image = images[0];
      Knight.generateSprites(txtHare);

      let imgEnemyRange = images[1];
      let txtEnemyRange: fudge.TextureImage = new fudge.TextureImage();
      txtEnemyRange.image = imgEnemyRange;
      EnemyRanged.generateSprites(txtEnemyRange);
      Stone.generateSprites(txtEnemyRange);

      let imgEnemyMelee = images[6];
      let txtEnemyMelee: fudge.TextureImage = new fudge.TextureImage();
      txtEnemyMelee.image = imgEnemyMelee;
      EnemyMelee.generateSprites(txtEnemyMelee);

      let imgItem = images[2];
      let txtItems: fudge.TextureImage = new fudge.TextureImage();
      txtItems.image = imgItem;
      Items.generateSprites(txtItems);
      Healthpoints.generateSprites(txtItems);

      let txtEnvironment: fudge.TextureImage = new fudge.TextureImage();
      let imgEnvironment = images[3];
      txtEnvironment.image = imgEnvironment;
      let txtWood: fudge.TextureImage = new fudge.TextureImage();
      let imgWood = images[5];
      txtWood.image = imgWood;
      let txtEnvrironmentArray: fudge.TextureImage[] = [txtEnvironment, txtWood];
      Floor.generateSprites(txtEnvrironmentArray);

      let txtflora: fudge.TextureImage = new fudge.TextureImage();
      let imgflora = images[4];
      txtflora.image = imgflora;
      let txtBackground: fudge.TextureImage = new fudge.TextureImage();
      let imgBackground = images[7];
      txtBackground.image = imgBackground;
      let txtSky: fudge.TextureImage = new fudge.TextureImage();
      let imgSky = images[8];
      txtSky.image = imgSky;
      let txtFloraArray: fudge.TextureImage[] = [txtflora, txtBackground, txtSky];
      Flora.generateSprites(txtFloraArray);
  
      fudge.RenderManager.initialize(true, false);
      game = new fudge.Node("Game");
      knight = new Knight("Knight");
      level = createLevel();
      game.appendChild(level);
  
      let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();
      cmpCamera.pivot.translateZ(6);
      cmpCamera.pivot.translateY(1.5);
      cmpCamera.pivot.translateX(2);
      cmpCamera.backgroundColor = fudge.Color.CSS("aliceblue");
  
      let viewport: fudge.Viewport = new fudge.Viewport();
      viewport.initialize("Viewport", game, cmpCamera, canvas);
      viewport.draw();
  
      document.addEventListener("keydown", handleKeyboard);
      document.addEventListener("keyup", handleKeyboard);
  
      fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, update);
      fudge.Loop.start(fudge.LOOP_MODE.TIME_GAME, 15); 
  
      function update(_event: fudge.Eventƒ): void {
        processInput();
        activateAnimations();
        viewport.draw(); 
        if (knight.cmpTransform.local.translation.x >= 18) {
          cmpCamera.pivot.translation = new fudge.Vector3(cmpCamera.pivot.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
        } else if (knight.cmpTransform.local.translation.x <= 2){
          cmpCamera.pivot.translation = new fudge.Vector3(cmpCamera.pivot.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
        } else {
          cmpCamera.pivot.translation = new fudge.Vector3(knight.mtxWorld.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
        }
        for (let i: number = 0; i < healthbar.length; i++) {
          healthbar[i].cmpTransform.local.translation = new fudge.Vector3(cmpCamera.pivot.translation.x + 2 + i / 10 + 0.2, 3, 0);
        }
      }
    }
  
    function handleKeyboard(_event: KeyboardEvent): void {
      keysPressed[_event.code] = (_event.type == "keydown");
      if (_event.code == fudge.KEYBOARD_CODE.W && _event.type == "keydown")
        knight.act(ACTION.JUMP);
    }
  
    function processInput(): void {

      if (keysPressed[fudge.KEYBOARD_CODE.A]) {
        knight.act(ACTION.WALK, DIRECTION.LEFT);
        return;
      }
      if (keysPressed[fudge.KEYBOARD_CODE.D]) {
        knight.act(ACTION.WALK, DIRECTION.RIGHT);
        return;
      }
      if (keysPressed[fudge.KEYBOARD_CODE.H]) {
        knight.act(ACTION.HIT);
        return;
      }
      knight.act(ACTION.IDLE);
    }

    function activateAnimations(): void { 

      let item: EnemyRanged[] = <EnemyRanged[]>level.getChildrenByName("Potion");
      for (let i: number = 0; i < item.length; i++) {
        item[i].act(ACTION.IDLE);
      }

      let stoner: EnemyRanged[] = <EnemyRanged[]>level.getChildrenByName("Stoner");
      for (let i: number = 0; i < stoner.length; i++) {
        stoner[i].act(ACTION.WALK);
      }

      let stonerMelee: EnemyMelee[] = <EnemyMelee[]>level.getChildrenByName("StonerMelee");
      for (let i: number = 0; i < stonerMelee.length; i++) {
        stonerMelee[i].act(ACTION.WALK);
      }
      
      let stones: Stone[] = <Stone[]>level.getChildrenByName("Stone");

      for (let i: number = 0; i < stones.length; i++) {
        stones[i].act(ACTION.IDLE);
      }
    }
  
    function createLevel(): fudge.Node {
      let level: fudge.Node = new fudge.Node("Level"); 

      console.log(jsonData[0].level1.levelObjects);
    
      for (let i = 0; i < jsonData[0].level1.levelObjects.length; i++) {
        let object = jsonData[0].level1.levelObjects[i];
        switch (object.objectName) {
          case "Floor":
            createFloor(level, TYPE.GRASS);
            break;
          case "Item":
            let item: Items = new Items(object.type, object.posX, object.posY);
            level.appendChild(item);
            level.appendChild( item.creatHitbox());
            break;
          case "Hill":

            if (object.type == "Big") {
              createHillBig(object.posX, level);
            } else if (object.type == "Small") {
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
              enemyranged = new EnemyRanged("Stoner", object.posX, object.posy);
              level.appendChild(enemyranged);
              level.appendChild(enemyranged.creatHitbox());
            } else if (object.type == "Melee") {
              enemyMelee = new EnemyMelee("StonerMelee", object.posX, object.posy);
              level.appendChild(enemyMelee);
              level.appendChild(enemyMelee.creatHitbox());
            }
            break;  
          default:
            console.log("Item");
        }
      }

      for (let i: number = 0; i < knight.healthpoints - 1; i++) {
        let healthpoint: Healthpoints = new Healthpoints("Player Healthpoint 1");
        level.appendChild(healthpoint);
        healthpoint.act(STATUS.FULL);
        healthbar.push(healthpoint);
      }
      level.appendChild( knight.createHitboxWeapon());
      level.appendChild(knight.creatHitbox());

      knight.healthbar = healthbar;

      createBackground(level);
      createSky(level);
      
      game.appendChild(knight);

      return level;
    }

    function createSky(_level: FudgeCore.Node): void {
      let x: number = -4.55;
      for (let i: number = 0; i < 3; i++ ) {
        let sky: Flora = new Flora(ENVI_TYPE.SKY, x, 4, -5);
        _level.appendChild(sky);
        x = x + 12.8;
      }
    }

    function createBackground(_level: FudgeCore.Node): void {
      let x: number = -6.5;
      for (let i: number = 0; i < 5; i++) {
        let background: Flora = new Flora(ENVI_TYPE.BACKGROUND, x, 0.7, -3);
        _level.appendChild(background);
        x = x + 8.25;
      }
    }

    function createFloor (_level: FudgeCore.Node, _type: TYPE.GRASS): void {
      let distance: number = 2.9;

      for (let i: number = 0; i < 8; i++) {
        if (i == 0) {
          let floor: Floor = new Floor(_type);
          floor.cmpTransform.local.scaleX(3);
          floor.cmpTransform.local.scaleY(2);
          _level.appendChild(floor);
        } else {
          let floor: Floor = new Floor(_type);
          floor.cmpTransform.local.scaleY(2);
          floor.cmpTransform.local.scaleX(3);
          floor.cmpTransform.local.translateX(distance);
          _level.appendChild(floor);
          distance = distance + 2.9;
        }
      }
    }

    function createHillBig(_x: number, _level: FudgeCore.Node): void {

      let distance: number = 0;

      for (let i: number = 0; i < 8; i++) {
        let floor: Floor = new Floor(TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + distance);
        floor.cmpTransform.local.translateY(0.2);
        _level.appendChild(floor);

        distance += 0.4;
      }

      distance = 0.4;

      for (let i: number = 0; i < 6; i++) {
        let floor: Floor = new Floor(TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + distance);
        floor.cmpTransform.local.translateY(0.4);
        _level.appendChild(floor);

        distance += 0.4;
      }

      distance = 0.8;

      for (let i: number = 0; i < 4; i++) {
        let floor: Floor = new Floor(TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + distance);
        floor.cmpTransform.local.translateY(0.6);
        _level.appendChild(floor);

        distance += 0.4;
      }

      distance = 1;

      for (let i: number = 0; i < 3; i++) {
        let floor: Floor = new Floor(TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + distance);
        floor.cmpTransform.local.translateY(0.8);
        _level.appendChild(floor);

        distance += 0.4;
      }
      
    }

    function createHillSmall(_x: number, _level: FudgeCore.Node): void {

      let distance: number = 0;

      for (let i: number = 0; i < 5; i++) {
        let floor: Floor = new Floor(TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + distance);
        floor.cmpTransform.local.translateY(0.2);
        _level.appendChild(floor);

        distance += 0.4;
      }
      distance = 0.4;

      for (let i: number = 0; i < 3; i++) {
        let floor: Floor = new Floor(TYPE.GRASS);
        floor.cmpTransform.local.scaleY(0.5);
        floor.cmpTransform.local.scaleX(0.5);
        floor.cmpTransform.local.translateX(_x + distance);
        floor.cmpTransform.local.translateY(0.4);
        _level.appendChild(floor);

        distance += 0.4;
      }
    }

    function createPlatform (_x: number, _level: FudgeCore.Node): void {

      let platform: Floor = new Floor(TYPE.WOOD_S);
      platform.cmpTransform.local.translateY(1.5);
      platform.cmpTransform.local.translateX(_x);
      platform.cmpTransform.local.translateZ(-1);
      platform.cmpTransform.local.scaleX(0.5);
      platform.cmpTransform.local.scaleY(0.5);
      _level.appendChild(platform);

    }

    function createTree(_x: number, _level: FudgeCore.Node): void {
      let tree: Flora = new Flora(ENVI_TYPE.LEAVES, _x + 0.1, 3.3, -1);
      tree.cmpTransform.local.scaleX(0.9);
      tree.cmpTransform.local.scaleY(0.9);
      tree.cmpTransform.local.rotateZ(-10);
      _level.appendChild(tree);

      tree = new Flora(ENVI_TYPE.TREE_ROOT, _x, 0, -1);
      tree.cmpTransform.local.scaleX(0.6);
      tree.cmpTransform.local.scaleY(0.6);
      _level.appendChild(tree);

      tree = new Flora(ENVI_TYPE.TREE_TRUNK, _x, 0.67, -1);
      tree.cmpTransform.local.scaleX(0.6);
      tree.cmpTransform.local.scaleY(0.6);
      _level.appendChild(tree);

      tree = new Flora(ENVI_TYPE.TREE_TRUNK, _x, 1.4, -1);
      tree.cmpTransform.local.scaleX(0.6);
      tree.cmpTransform.local.scaleY(0.6);
      _level.appendChild(tree);

      tree = new Flora(ENVI_TYPE.TREE_TRUNK, _x, 2.15, -1);
      tree.cmpTransform.local.scaleX(0.6);
      tree.cmpTransform.local.scaleY(0.6);
      _level.appendChild(tree);

      tree = new Flora(ENVI_TYPE.TREE_CROWN, _x, 2.75, -1);
      tree.cmpTransform.local.scaleX(0.6);
      tree.cmpTransform.local.scaleY(0.6);
      _level.appendChild(tree);
    }
  }