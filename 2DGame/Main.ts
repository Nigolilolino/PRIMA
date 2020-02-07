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
    let enemy2: Enemy;
    let enemy1: Enemy;
    let item: Items;
  
    function test(): void {
      let canvas: HTMLCanvasElement = document.querySelector("canvas");
      let crc2: CanvasRenderingContext2D = canvas.getContext("2d");
      let img: HTMLImageElement = document.querySelector("img");
      let txtHare: fudge.TextureImage = new fudge.TextureImage();
      txtHare.image = img;
      let images: any = document.querySelectorAll("img");
      let imgEnemy = images[1];
      let txtEnemy: fudge.TextureImage = new fudge.TextureImage();
      let imgItem = images[2];
      let txtItems: fudge.TextureImage = new fudge.TextureImage();
      txtEnemy.image = imgEnemy;
      txtItems.image = imgItem;
      Hare.generateSprites(txtHare);
      Enemy.generateSprites(txtEnemy);
      Items.generateSprites(txtItems);
  
      fudge.RenderManager.initialize(true, false);
      game = new fudge.Node("Game");
      hare = new Hare("Hare");
      enemy1 = new Enemy("Stoner1", 1.5, 1);
      enemy2 = new Enemy("Stoner2", 5, 1);
      item = new Items("Potion", 6, 1);
      level = createLevel();
      game.appendChild(level);
      game.appendChild(enemy1);
      game.appendChild(enemy2);
      game.appendChild(item);
      
      game.appendChild(hare);
      game.appendChild( hare.creatHitbox());
  
      let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();
      cmpCamera.pivot.translateZ(5);
      cmpCamera.pivot.lookAt(fudge.Vector3.ZERO());
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
        viewport.draw(); 
        cmpCamera.pivot.translation = new fudge.Vector3(hare.mtxWorld.translation.x, hare.mtxWorld.translation.y, cmpCamera.pivot.translation.z);
        //crc2.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
        //crc2.strokeRect(-1, canvas.height / 2, canvas.width + 2, canvas.height);
      }
    }
  
    function handleKeyboard(_event: KeyboardEvent): void {
      keysPressed[_event.code] = (_event.type == "keydown");
      if (_event.code == fudge.KEYBOARD_CODE.W && _event.type == "keydown")
        hare.act(ACTION.JUMP);

      if (_event.code == fudge.KEYBOARD_CODE.ARROW_UP && _event.type == "keydown")
      enemy1.act(ACTION.JUMP);
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
      if (keysPressed[fudge.KEYBOARD_CODE.ARROW_RIGHT]) {
        enemy1.act(ACTION.WALK, DIRECTION.RIGHT);
        return;
      }
      if (keysPressed[fudge.KEYBOARD_CODE.ARROW_LEFT]) {
        enemy1.act(ACTION.WALK, DIRECTION.LEFT);
        return;
      }
     
      
      hare.act(ACTION.IDLE);
      enemy1.act(ACTION.IDLE);
      enemy2.act(ACTION.IDLE);
      item.act(ACTION.IDLE); 
    }
  
    function createLevel(): fudge.Node {
      let level: fudge.Node = new fudge.Node("Level");
      level.appendChild( enemy1.creatHitbox());
      level.appendChild( enemy2.creatHitbox());
      level.appendChild( item.creatHitbox());
      level.appendChild( hare.createHitboxWeapon());

      let floor: Floor = new Floor();
      floor.cmpTransform.local.scaleX(3);
      floor.cmpTransform.local.scaleY(1);
      level.appendChild(floor);
  
      floor = new Floor();
      floor.cmpTransform.local.scaleY(1);
      floor.cmpTransform.local.scaleX(2);
      floor.cmpTransform.local.translateY(0.2);
      floor.cmpTransform.local.translateX(1.5);
      level.appendChild(floor);

      floor = new Floor();
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
  }