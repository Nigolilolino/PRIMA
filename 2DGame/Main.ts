///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    export import fudge = FudgeCore;
  
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

      let restartBtn: HTMLCollectionOf<Element> = document.getElementsByClassName("restartBtn");
      for (let i: number = 0; i < restartBtn.length; i++) {
        restartBtn[i].addEventListener("click", restartGame);
      }

      let volumeSliderMusic: HTMLInputElement = <HTMLInputElement>document.getElementById("musicVolume");
      volumeSliderMusic.addEventListener("click", changeVolumeMusic);

      let volumeSliderVoices: HTMLInputElement = <HTMLInputElement>document.getElementById("voicesVolume");
      volumeSliderVoices.addEventListener("click", changeVolumeVoices);

      let volumeSliderEnvironment: HTMLInputElement = <HTMLInputElement>document.getElementById("environmentVolume");
      volumeSliderEnvironment.addEventListener("click", changeVolumeEnvironment);

      let volumeSliderEffects: HTMLInputElement = <HTMLInputElement>document.getElementById("effectsVolume");
      volumeSliderEffects.addEventListener("click", changeVolumeEffects);

      let showControlsBtns: HTMLCollectionOf<Element> = document.getElementsByClassName("showControlsBtn");
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

    function restartGame(): void {
      location.reload();
    }

  
    function startGame(): void {
      
      let titleScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("startscreen");
      titleScreen.style.visibility = "hidden";
      Sound.init();
      Sound.play("Theme");
      Sound.play("Wind");

      let canvas: HTMLCanvasElement = document.querySelector("canvas");
      let images: NodeListOf<HTMLImageElement> = document.querySelectorAll("img");

      loadTextures(images);
  
      fudge.RenderManager.initialize(true, false);
      game = new fudge.Node("Game");
      knight = new Knight("Knight");
      level = createLevel();
      game.appendChild(level);
      console.log(game);
  
      let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();
      cmpCamera.pivot.translateZ(6);
      cmpCamera.pivot.translateY(1.5);
      cmpCamera.pivot.translateX(2);
      cmpCamera.backgroundColor = fudge.Color.CSS("aliceblue");
  
      let viewport: fudge.Viewport = new fudge.Viewport();
      viewport.initialize("Viewport", game, cmpCamera, canvas);
      viewport.draw();
  
      document.addEventListener("keydown", handleJump);
      document.addEventListener("keyup", handleJump);
  
      fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, update);
      fudge.Loop.start(fudge.LOOP_MODE.TIME_REAL, 10); 
  
      function update(_event: fudge.Eventƒ): void {
        processInput();
        activateAnimations();
        viewport.draw(); 
        if (knight.cmpTransform.local.translation.x >= 18) {
          cmpCamera.pivot.translation = new fudge.Vector3(cmpCamera.pivot.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
        } else if (knight.cmpTransform.local.translation.x <= 2) {
          cmpCamera.pivot.translation = new fudge.Vector3(cmpCamera.pivot.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
        } else {
          cmpCamera.pivot.translation = new fudge.Vector3(knight.mtxWorld.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
        }
        for (let i: number = 0; i < healthbar.length; i++) {
          healthbar[i].cmpTransform.local.translation = new fudge.Vector3(cmpCamera.pivot.translation.x + 2 + i / 10 + 0.2, 3, 0);
        }
      }
    }
  
    function handleJump(_event: KeyboardEvent): void {
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
    
      for (let i: number = 0; i < jsonData[0].level1.levelObjects.length; i++) {
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
              level.appendChild(enemyranged.creatHitbox(0.4 , 0.6));
            } else if (object.type == "Melee") {
              enemyMelee = new EnemyMelee("StonerMelee", object.posX, object.posy);
              level.appendChild(enemyMelee);
              level.appendChild(enemyMelee.creatHitbox(0.9, 0.5));
            }
            break;  
            case "Background":
            if (object.type == "Landscape") {
              createBackground(level, object.amount);
            } else if (object.type == "Sky") {
              createSky(level, object.amount);
            }
            break; 
          default:
            console.log("Item");
        }
      }

      let floor: Floor = new Floor(TYPE.DIRT);
      floor.cmpTransform.local.translateX(-1.5);
      floor.cmpTransform.local.translateY(0);
      floor.cmpTransform.local.scaleX(1);
      floor.cmpTransform.local.scaleY(0.5);
      level.appendChild(floor);

      floor = new Floor(TYPE.DIRT);
      floor.cmpTransform.local.translateX(-2.4);
      floor.cmpTransform.local.translateY(2);
      floor.cmpTransform.local.scaleX(2);
      floor.cmpTransform.local.scaleY(2);
      level.appendChild(floor);

      floor = new Floor(TYPE.DIRT);
      floor.cmpTransform.local.translateX(22.3);
      floor.cmpTransform.local.translateY(2);
      floor.cmpTransform.local.scaleX(2);
      floor.cmpTransform.local.scaleY(2);
      level.appendChild(floor);

      initializeKnight(level);

      return level;
    }

    function initializeKnight(_level: fudge.Node): void {
      for (let i: number = 0; i < knight.healthpoints - 1; i++) {
        let healthpoint: Healthpoints = new Healthpoints("Player Healthpoint 1");
        game.appendChild(healthpoint);
        healthpoint.act(STATUS.FULL);
        healthbar.push(healthpoint);
      }
      knight.healthbar = healthbar;
      game.appendChild(knight.createHitboxWeapon());
      game.appendChild(knight.creatHitbox());
      game.appendChild(knight);
    }

    function createSky(_level: FudgeCore.Node, _amount: number): void {
      let x: number = -4.55;
      for (let i: number = 0; i < _amount; i++ ) {
        let sky: Flora = new Flora(ENVI_TYPE.SKY, x, 4, -5);
        _level.appendChild(sky);
        x = x + 12.8;
      }
    }

    function createBackground(_level: FudgeCore.Node, _amount: number): void {
      let x: number = -6.5;
      for (let i: number = 0; i < _amount; i++) {
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

    function closeControlsScreen(): void {
      let controlsScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("controllsScreen");
      controlsScreen.style.visibility = "hidden";
    }

    function displayControls(): void {
      let controlsScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("controllsScreen");
      controlsScreen.style.visibility = "visible";
    }

    function displayMenue(): void {
      let menueScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("menue");
      menueScreen.style.visibility = "visible";
      fudge.Loop.stop();
    }

    function closeMenue(): void {
      let menueScreen: HTMLDivElement = <HTMLDivElement>document.getElementById("menue");
      menueScreen.style.visibility = "hidden";
      fudge.Loop.start(fudge.LOOP_MODE.TIME_REAL, 10); 
    }

    function changeVolumeMusic(): void {
      let volumeSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("musicVolume");
      let value: number = parseInt(volumeSlider.value);
      Sound.volMusic = value / 100;
      Sound.play("Theme");
    }

    function changeVolumeVoices(): void {
      let volumeSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("voicesVolume");
      let value: number = parseInt(volumeSlider.value);
      Sound.volVoices = value / 100;
    }

    function changeVolumeEnvironment(): void {
      let volumeSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("environmentVolume");
      let value: number = parseInt(volumeSlider.value);
      Sound.volEnvironment = value / 100;
      Sound.play("Wind");
    }

    function changeVolumeEffects(): void {
      let volumeSlider: HTMLInputElement = <HTMLInputElement>document.getElementById("effectsVolume");
      let value: number = parseInt(volumeSlider.value);
      Sound.volEffects = value / 100;
    }

    function loadTextures(_images: NodeListOf<HTMLImageElement>): void {
      let txtHare1: fudge.TextureImage = new fudge.TextureImage();
      txtHare1.image = _images[0];
      let txtHare2: fudge.TextureImage = new fudge.TextureImage();
      txtHare2.image = _images[9];
      let txtKnightArray: fudge.TextureImage[] = [txtHare1, txtHare2];
      Knight.generateSprites(txtKnightArray);

      let imgEnemyRange: HTMLImageElement = _images[1];
      let txtEnemyRange: fudge.TextureImage = new fudge.TextureImage();
      txtEnemyRange.image = imgEnemyRange;
      EnemyRanged.generateSprites(txtEnemyRange);
      Stone.generateSprites(txtEnemyRange);

      let imgEnemyMelee: HTMLImageElement = _images[6];
      let txtEnemyMelee: fudge.TextureImage = new fudge.TextureImage();
      txtEnemyMelee.image = imgEnemyMelee;
      EnemyMelee.generateSprites(txtEnemyMelee);

      let imgItem: HTMLImageElement = _images[2];
      let txtItems: fudge.TextureImage = new fudge.TextureImage();
      txtItems.image = imgItem;
      Items.generateSprites(txtItems);
      Healthpoints.generateSprites(txtItems);

      let txtEnvironment: fudge.TextureImage = new fudge.TextureImage();
      let imgEnvironment: HTMLImageElement = _images[3];
      txtEnvironment.image = imgEnvironment;
      let txtWood: fudge.TextureImage = new fudge.TextureImage();
      let imgWood: HTMLImageElement = _images[5];
      txtWood.image = imgWood;
      let txtEnvrironmentArray: fudge.TextureImage[] = [txtEnvironment, txtWood];
      Floor.generateSprites(txtEnvrironmentArray);

      let txtflora: fudge.TextureImage = new fudge.TextureImage();
      let imgflora: HTMLImageElement = _images[4];
      txtflora.image = imgflora;
      let txtBackground: fudge.TextureImage = new fudge.TextureImage();
      let imgBackground: HTMLImageElement = _images[7];
      txtBackground.image = imgBackground;
      let txtSky: fudge.TextureImage = new fudge.TextureImage();
      let imgSky: HTMLImageElement = _images[8];
      txtSky.image = imgSky;
      let txtFloraArray: fudge.TextureImage[] = [txtflora, txtBackground, txtSky];
      Flora.generateSprites(txtFloraArray);
    }

  }