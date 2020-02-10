///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;

    export class Stone extends fudge.Node {

        private static sprites: Sprite[];
        private direction: String;
  
      constructor(_name: string, _x: number, _y: number, _direction: String) {
        super(_name);
        this.addComponent(new fudge.ComponentTransform());
  
        for (let sprite of Stone.sprites) {
          let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
          nodeSprite.activate(true);
  
          nodeSprite.addEventListener(
            "showNext",
            (_event: Event) => { (<NodeSprite>_event.currentTarget).showFrameNext(); },
            true
          );
  
          this.appendChild(nodeSprite);
        }
        this.cmpTransform.local.translation = new fudge.Vector3(_x, _y, 0);
        this.cmpTransform.local.scale(new fudge.Vector3(0.6, 0.6, 0));
        this.direction = _direction;
        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, this.update);
      }
  
      public static generateSprites(_txtImage: fudge.TextureImage): void {
        Stone.sprites = [];
        let sprite: Sprite = new Sprite(ACTION.IDLE);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(15, 170, 36, 38), 7, fudge.Vector2.ZERO(), 64, fudge.ORIGIN2D.BOTTOMCENTER);
        Stone.sprites.push(sprite);
      }
  
      public show(_action: ACTION): void {
        for (let child of this.getChildren()) {
          child.activate(child.name == _action);
        }
      }
  
      public act(_action: ACTION): void {
        this.show(_action);
      }
  
      private update = (_event: fudge.Eventƒ): void => {
        this.broadcastEvent(new CustomEvent("showNext"));
        if(this.direction == "right"){
            this.cmpTransform.local.translateX(0.1);
        }else{
            this.cmpTransform.local.translateX(-0.1);
        }
      }

    }
  }