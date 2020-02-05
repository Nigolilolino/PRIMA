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
  
  
    function test(): void {
      let canvas: HTMLCanvasElement = document.querySelector("canvas");
      let crc2: CanvasRenderingContext2D = canvas.getContext("2d");
      let img: HTMLImageElement = document.querySelector("img");
      let txtHare: fudge.TextureImage = new fudge.TextureImage();
      txtHare.image = img;
      Hare.generateSprites(txtHare);
  
      fudge.RenderManager.initialize(true, false);
      game = new fudge.Node("Game");
      hare = new Hare("Hare");
      level = createLevel();
      game.appendChild(level);
      game.appendChild(hare);
  
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
      fudge.Loop.start(fudge.LOOP_MODE.TIME_GAME, 10);
  
      function update(_event: fudge.Eventƒ): void {
        processInput();
        //fudge.Debug.log(hare.cmpTransform.local.translation.toVector2());
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
  
      hare.act(ACTION.IDLE);
    }
  
    function createLevel(): fudge.Node {
      let level: fudge.Node = new fudge.Node("Level");
      let floor: Floor = new Floor();
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
      floor.cmpTransform.local.scaleX(2);
      floor.cmpTransform.local.translateX(5.5);
      level.appendChild(floor);
  
      return level;
    }
  }