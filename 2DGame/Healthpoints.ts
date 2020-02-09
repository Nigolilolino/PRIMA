///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
  
    export enum STATUS {
        FULL = "Full",
        EMPTY = "Empty" 
  
      }

    export class Healthpoints extends fudge.Node {

        private static sprites: Sprite[];
  
      constructor(_name: string) {
        super(_name);
        this.addComponent(new fudge.ComponentTransform());
  
        for (let sprite of Healthpoints.sprites) {
          let nodeSprite: NodeSprite = new NodeSprite(sprite.name, sprite);
          nodeSprite.activate(false);
  
          nodeSprite.addEventListener(
            "showNext",
            (_event: Event) => { (<NodeSprite>_event.currentTarget).showFrameNext(); },
            true
          );
  
          this.appendChild(nodeSprite);
        }
    
        fudge.Loop.addEventListener(fudge.EVENT.LOOP_FRAME, this.update);
      }
  
      public static generateSprites(_txtImage: fudge.TextureImage): void {
        Healthpoints.sprites = [];
        let sprite: Sprite = new Sprite(STATUS.EMPTY);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(32, 0, 35, 34), 1, fudge.Vector2.ZERO(), 120, fudge.ORIGIN2D.BOTTOMCENTER);
        Healthpoints.sprites.push(sprite);

        sprite = new Sprite(STATUS.FULL);
        sprite.generateByGrid(_txtImage, fudge.Rectangle.GET(110, 0, 35, 34), 1, fudge.Vector2.ZERO(), 120, fudge.ORIGIN2D.BOTTOMCENTER);
        Healthpoints.sprites.push(sprite);
      }
  
      public show(_status: STATUS): void {
        for (let child of this.getChildren()){
          child.activate(child.name == _status);
        }
      }
  
      public act(_status: STATUS): void {
        this.show(_status);
      }
  
      private update = (_event: fudge.Eventƒ): void => {
        this.broadcastEvent(new CustomEvent("showNext"));
        fudge.Debug.log("hkjhks");
      }

    }
  }