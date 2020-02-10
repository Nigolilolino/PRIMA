///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    export import fudge = FudgeCore;
  
    window.addEventListener("load", test);
  
    interface KeyPressed {
      [code: string]: boolean;
    }
    let keysPressed: KeyPressed = {};
  
    export let game: fudge.Node;
    export let level: fudge.Node;
    let hare: Hare;
    let healthbar: Healthpoints[] = [];
    let enemy2: Enemy;
    let enemy1: Enemy;
    let item: Items;
    
    //let healthpoints: Healthpoints;
  
    function test(): void {
      let canvas: HTMLCanvasElement = document.querySelector("canvas");
      //let crc2: CanvasRenderingContext2D = canvas.getContext("2d");
      let images: any = document.querySelectorAll("img");

      let txtHare: fudge.TextureImage = new fudge.TextureImage();
      txtHare.image = images[0];
      Hare.generateSprites(txtHare);

      let imgEnemy = images[1];
      let txtEnemy: fudge.TextureImage = new fudge.TextureImage();
      txtEnemy.image = imgEnemy;
      Enemy.generateSprites(txtEnemy);
      Stone.generateSprites(txtEnemy);

      let imgItem = images[2];
      let txtItems: fudge.TextureImage = new fudge.TextureImage();
      txtItems.image = imgItem;
      Items.generateSprites(txtItems);
      Healthpoints.generateSprites(txtItems);

      let txtEnvironment: fudge.TextureImage = new fudge.TextureImage();
      let imgEnvironment = images[3];
      txtEnvironment.image = imgEnvironment;
      Floor.generateSprites(txtEnvironment);
  
      fudge.RenderManager.initialize(true, false);
      game = new fudge.Node("Game");
      hare = new Hare("Hare");
      level = createLevel();
      game.appendChild(level);
      game.appendChild(hare);
    
  
      let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();
      cmpCamera.pivot.translateZ(20);
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
        for(let i = 0; i < healthbar.length; i++){
          healthbar[i].cmpTransform.local.translation = new fudge.Vector3(hare.mtxWorld.translation.x + 1.5 + i/10 + 0.2, 3, 0);
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
      //enemy1.act(ACTION.WALK);
      enemy2.act(ACTION.WALK);
      item.act(ACTION.IDLE); 
      
      let stones:Stone[] = <Stone[]>level.getChildrenByName("Stone");

      for(let i = 0; i < stones.length; i++){
        stones[i].act(ACTION.IDLE);
      }
    }
  
    function createLevel(): fudge.Node {
      let level: fudge.Node = new fudge.Node("Level");

      let floor: Floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleX(3);
      floor.cmpTransform.local.scaleY(2);
      level.appendChild(floor);
  
      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(2);
      floor.cmpTransform.local.scaleX(3);
      floor.cmpTransform.local.translateX(2.4);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(2);
      floor.cmpTransform.local.scaleX(3);
      floor.cmpTransform.local.translateX(5.3);
      level.appendChild(floor);

      floor = new Floor(TYPE.DIRT);
      floor.cmpTransform.local.scaleY(1);
      floor.cmpTransform.local.scaleX(1);
      floor.cmpTransform.local.translateX(-2);
      level.appendChild(floor);

      floor = new Floor(TYPE.DIRT);
      floor.cmpTransform.local.scaleY(1);
      floor.cmpTransform.local.scaleX(1);
      floor.cmpTransform.local.translateX(-2);
      floor.cmpTransform.local.translateY(0.9);
      level.appendChild(floor);

      floor = new Floor(TYPE.DIRT);
      floor.cmpTransform.local.scaleY(1);
      floor.cmpTransform.local.scaleX(1);
      floor.cmpTransform.local.translateX(-2);
      floor.cmpTransform.local.translateY(1.8);
      level.appendChild(floor);

      floor = new Floor(TYPE.DIRT);
      floor.cmpTransform.local.scaleY(1);
      floor.cmpTransform.local.scaleX(1);
      floor.cmpTransform.local.translateX(-2);
      floor.cmpTransform.local.translateY(2.7);
      level.appendChild(floor);

      floor = new Floor(TYPE.DIRT);
      floor.cmpTransform.local.scaleY(1);
      floor.cmpTransform.local.scaleX(1);
      floor.cmpTransform.local.translateX(-2);
      floor.cmpTransform.local.translateY(3.6);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(2);
      floor.cmpTransform.local.scaleX(3);
      floor.cmpTransform.local.translateX(8.1);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(2);
      floor.cmpTransform.local.scaleX(3);
      floor.cmpTransform.local.translateX(10.5);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(2);
      floor.cmpTransform.local.scaleX(3);
      floor.cmpTransform.local.translateX(13.4);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(2);
      floor.cmpTransform.local.scaleX(3);
      floor.cmpTransform.local.translateX(16.3);
      level.appendChild(floor);

      //Pyramide

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(2.5);
      floor.cmpTransform.local.translateY(0.2);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(2.9);
      floor.cmpTransform.local.translateY(0.2);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(3.3);
      floor.cmpTransform.local.translateY(0.2);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(3.7);
      floor.cmpTransform.local.translateY(0.2);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(4.1);
      floor.cmpTransform.local.translateY(0.2);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(2.9);
      floor.cmpTransform.local.translateY(0.5);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(3.3);
      floor.cmpTransform.local.translateY(0.5);
      level.appendChild(floor);

      floor = new Floor(TYPE.GRASS);
      floor.cmpTransform.local.scaleY(0.5);
      floor.cmpTransform.local.scaleX(0.5);
      floor.cmpTransform.local.translateX(3.7);
      floor.cmpTransform.local.translateY(0.5);
      level.appendChild(floor);

      //......................................
      //Enemies and Items

     // enemy1 = new Enemy("Stoner1", 1.5, 1);
      enemy2 = new Enemy("Stoner2", 5, 1);
      //level.appendChild(enemy1);
      level.appendChild(enemy2);
      //level.appendChild( enemy1.creatHitbox());
      level.appendChild( enemy2.creatHitbox());


      item = new Items("Potion", 6, 1);
      level.appendChild(item);
      level.appendChild( item.creatHitbox());
      level.appendChild( hare.createHitboxWeapon());

      for (let i = 0; i < hare.healthpoints - 1; i++) {
        let healthpoint: Healthpoints = new Healthpoints("Player Healthpoint 1");
        level.appendChild(healthpoint);
        healthpoint.act(STATUS.FULL);
        healthbar.push(healthpoint);
      }

      level.appendChild(hare.creatHitbox());

      hare.healthbar = healthbar;
      // let healthpoints: Healthpoints = new Healthpoints("Player Healthpoint 1", 1, 1);
      // level.appendChild(healthpoints);

      // healthpoints = new Healthpoints("Player Healthpoint 2", 2, 1);
      // level.appendChild(healthpoints); 

      return level;
    }
  }