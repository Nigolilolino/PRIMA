///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    export import fudge = FudgeCore;
  
    //window.addEventListener("load", test);
    window.addEventListener("load", initializeScreens);
  
    interface KeyPressed {
      [code: string]: boolean;
    }
    let keysPressed: KeyPressed = {};
  
    export let game: fudge.Node;
    export let level: fudge.Node;
    let hare: Hare;
    let healthbar: Healthpoints[] = [];
    let enemyranged: EnemyRanged;
    let enemyMelee: EnemyMelee;
  
    function initializeScreens(){
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
    }

    function restartGame(){
      location.reload();
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
      //let crc2: CanvasRenderingContext2D = canvas.getContext("2d");
      let images: any = document.querySelectorAll("img");

      let txtHare: fudge.TextureImage = new fudge.TextureImage();
      txtHare.image = images[0];
      Hare.generateSprites(txtHare);

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
      Flora.generateSprites(txtflora);
  
      fudge.RenderManager.initialize(true, false);
      game = new fudge.Node("Game");
      hare = new Hare("Hare");
      level = createLevel();
      game.appendChild(level);
      //game.appendChild(hare);
    
  
      let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();
      cmpCamera.pivot.translateZ(6);
      cmpCamera.pivot.translateY(1.5);
      //cmpCamera.pivot.lookAt(fudge.Vector3.ZERO());
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
        cmpCamera.pivot.translation = new fudge.Vector3(hare.mtxWorld.translation.x, cmpCamera.pivot.translation.y, cmpCamera.pivot.translation.z);
        for (let i: number = 0; i < healthbar.length; i++) {
          healthbar[i].cmpTransform.local.translation = new fudge.Vector3(hare.mtxWorld.translation.x + 2 + i / 10 + 0.2, 3, 0);
        }
        //crc2.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
        //crc2.strokeRect(-1, canvas.height / 2, canvas.width + 2, canvas.height);
      }
    }
  
    function handleKeyboard(_event: KeyboardEvent): void {
      keysPressed[_event.code] = (_event.type == "keydown");
      if (_event.code == fudge.KEYBOARD_CODE.W && _event.type == "keydown")
        hare.act(ACTION.JUMP);
    }
  
    function processInput(): void {

      if (keysPressed[fudge.KEYBOARD_CODE.A]) {
        hare.act(ACTION.WALK, DIRECTION.LEFT);
        return;
      }
      if (keysPressed[fudge.KEYBOARD_CODE.D]) {
        hare.act(ACTION.WALK, DIRECTION.RIGHT);
        return;
      }
      if (keysPressed[fudge.KEYBOARD_CODE.H]) {
        hare.act(ACTION.HIT);
        return;
      }
      hare.act(ACTION.IDLE);
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

      createFloor(level, TYPE.GRASS);

      // enemyranged = new EnemyRanged("Stoner", 12, 1);
      // level.appendChild(enemyranged);
      // level.appendChild(enemyranged.creatHitbox());

      enemyMelee = new EnemyMelee("StonerMelee", 3, 1);
      level.appendChild(enemyMelee);
      level.appendChild(enemyMelee.creatHitbox());

      enemyMelee = new EnemyMelee("StonerMelee", 10, 1);
      level.appendChild(enemyMelee);
      level.appendChild(enemyMelee.creatHitbox());

      enemyMelee = new EnemyMelee("StonerMelee", 19, 1);
      level.appendChild(enemyMelee);
      level.appendChild(enemyMelee.creatHitbox());

      let item: Items = new Items("Potion", 1, 1.5);
      level.appendChild(item);
      level.appendChild( item.creatHitbox());

      item = new Items("Potion", 5, 1.5);
      level.appendChild(item);
      level.appendChild( item.creatHitbox());

      for (let i: number = 0; i < hare.healthpoints - 1; i++) {
        let healthpoint: Healthpoints = new Healthpoints("Player Healthpoint 1");
        level.appendChild(healthpoint);
        healthpoint.act(STATUS.FULL);
        healthbar.push(healthpoint);
      }
      level.appendChild( hare.createHitboxWeapon());
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
      createTree(17, level);
      createTree(19, level);
      createTree(21, level);
      createTree(23, level);
      createTree(25, level);

      game.appendChild(hare);

      return level;
    }

    function createFloor (_level: FudgeCore.Node, _type: TYPE.GRASS): void {
      let distance: number = 2.9;

      for (let i: number = 0; i < 20; i++) {
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

    function createHill(_x: number, _level: FudgeCore.Node): void {

      let floor: Floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(_x);
      floor.cmpTransform.local.translateY(0.2);
      _level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(_x + .4);
      floor.cmpTransform.local.translateY(0.2);
      _level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(_x + 0.8);
      floor.cmpTransform.local.translateY(0.2);
      _level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(_x + 1.2);
      floor.cmpTransform.local.translateY(0.2);
      _level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(_x + 1.6);
      floor.cmpTransform.local.translateY(0.2);
      _level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(_x + 0.4);
      floor.cmpTransform.local.translateY(0.5);
      _level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(_x + 0.8);
      floor.cmpTransform.local.translateY(0.5);
      _level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(_x + 1.2);
      floor.cmpTransform.local.translateY(0.5);
      _level.appendChild(floor);
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
      let tree: Flora = new Flora(ENVI_TYPE.LEAVES, _x + 0.1, 3.3);
      tree.cmpTransform.local.scaleX(0.9);
      tree.cmpTransform.local.scaleY(0.9);
      tree.cmpTransform.local.rotateZ(-10);
      _level.appendChild(tree);

      tree = new Flora(ENVI_TYPE.TREE_ROOT, _x, 0);
      tree.cmpTransform.local.scaleX(0.6);
      tree.cmpTransform.local.scaleY(0.6);
      _level.appendChild(tree);

      tree = new Flora(ENVI_TYPE.TREE_TRUNK, _x, 0.67);
      tree.cmpTransform.local.scaleX(0.6);
      tree.cmpTransform.local.scaleY(0.6);
      _level.appendChild(tree);

      tree = new Flora(ENVI_TYPE.TREE_TRUNK, _x, 1.4);
      tree.cmpTransform.local.scaleX(0.6);
      tree.cmpTransform.local.scaleY(0.6);
      _level.appendChild(tree);

      tree = new Flora(ENVI_TYPE.TREE_TRUNK, _x, 2.15);
      tree.cmpTransform.local.scaleX(0.6);
      tree.cmpTransform.local.scaleY(0.6);
      _level.appendChild(tree);

      tree = new Flora(ENVI_TYPE.TREE_CROWN, _x, 2.75);
      tree.cmpTransform.local.scaleX(0.6);
      tree.cmpTransform.local.scaleY(0.6);
      _level.appendChild(tree);
    }
  }