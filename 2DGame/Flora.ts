///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;

    export enum ENVI_TYPE {
      TREE_TRUNK = "TreeTrunk",
      TREE_CROWN = "TreeCrown",
      TREE_ROOT = "TreeRoot",
      LEAVES = "Leaves",
      BACKGROUND = "Background",
      SKY = "Sky"
    }
  
    export class Flora extends fudge.Node {
      private static sprites: Sprite[];
      private static mesh: fudge.MeshSprite = new fudge.MeshSprite();
      private static material: fudge.Material = new fudge.Material("Flora", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("red", 0.5)));
      private static readonly pivot: fudge.Matrix4x4 = fudge.Matrix4x4.TRANSLATION(fudge.Vector3.Y(-0.5));
  
      public constructor(_type: ENVI_TYPE, _x: number, _y: number, _z: number) {
        super("Flora");
        if (_type == "TreeTrunk") {
          let nodeSprite: NodeSprite = new NodeSprite("TreeTrunk", Flora.sprites[0]);
          nodeSprite.activate(true);
          this.appendChild(nodeSprite);
        } else if (_type == "TreeRoot") {
          let nodeSprite: NodeSprite = new NodeSprite("TreeRoot", Flora.sprites[1]);
          nodeSprite.activate(true);
          this.appendChild(nodeSprite);
        }else if (_type == "TreeCrown") {
          let nodeSprite: NodeSprite = new NodeSprite("TreeCrown", Flora.sprites[2]);
          nodeSprite.activate(true);
          this.appendChild(nodeSprite);
        }else if (_type == "Leaves") {
          let nodeSprite: NodeSprite = new NodeSprite("Leaves", Flora.sprites[3]);
          nodeSprite.activate(true);
          this.appendChild(nodeSprite);
        }else if (_type == "Background") {
          let nodeSprite: NodeSprite = new NodeSprite("Background", Flora.sprites[4]);
          nodeSprite.activate(true);
          this.appendChild(nodeSprite);
        }else if (_type == "Sky") {
          let nodeSprite: NodeSprite = new NodeSprite("Sky", Flora.sprites[5]);
          nodeSprite.activate(true);
          this.appendChild(nodeSprite);
        }
        this.addComponent(new fudge.ComponentTransform());
        this.cmpTransform.local.translation = new fudge.Vector3(_x, _y, _z);
        //this.addComponent(new fudge.ComponentMaterial(Flora.material));
        let cmpMesh: fudge.ComponentMesh = new fudge.ComponentMesh(Flora.mesh);
        //cmpMesh.pivot.translateY(-0.5);
        cmpMesh.pivot = Flora.pivot;
        this.addComponent(cmpMesh);
      }

      public static generateSprites(_txtImage: fudge.TextureImage[]): void {
        Flora.sprites = [];
        let sprite: Sprite = new Sprite("TreeTrunk");
        sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(0, 53, 260, 260), 1, fudge.Vector2.ZERO(), 200, fudge.ORIGIN2D.CENTER);
        Flora.sprites.push(sprite);

        sprite = new Sprite("TreeRoot");
        sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(760, 390, 495, 213), 1, fudge.Vector2.ZERO(), 200, fudge.ORIGIN2D.CENTER);
        Flora.sprites.push(sprite);

        sprite = new Sprite("TreeCrown");
        sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(758, 117, 500, 150), 1, fudge.Vector2.ZERO(), 200, fudge.ORIGIN2D.CENTER);
        Flora.sprites.push(sprite);

        sprite = new Sprite("Leaves");
        sprite.generateByGrid(_txtImage[0], fudge.Rectangle.GET(290, 5, 440, 307), 1, fudge.Vector2.ZERO(), 200, fudge.ORIGIN2D.CENTER);
        Flora.sprites.push(sprite);

        sprite = new Sprite("Background");
        sprite.generateByGrid(_txtImage[1], fudge.Rectangle.GET(0, 1, 1280, 640), 1, fudge.Vector2.ZERO(), 150, fudge.ORIGIN2D.CENTER);
        Flora.sprites.push(sprite);

        sprite = new Sprite("Sky");
        sprite.generateByGrid(_txtImage[2], fudge.Rectangle.GET(0, 20, 1280, 720), 1, fudge.Vector2.ZERO(), 100, fudge.ORIGIN2D.CENTER);
        Flora.sprites.push(sprite);
      }

      

      public show(): void {
        for (let child of this.getChildren())
          child.activate(child.name == "Flora");
      }
  
      public getRectWorld(): fudge.Rectangle {
        let rect: fudge.Rectangle = fudge.Rectangle.GET(0, 0, 100, 100);
        let topleft: fudge.Vector3 = new fudge.Vector3(-0.5, 0.5, 0);
        let bottomright: fudge.Vector3 = new fudge.Vector3(0.5, -0.5, 0);
        
        //let pivot: fudge.Matrix4x4 = this.getComponent(fudge.ComponentMesh).pivot;
        let mtxResult: fudge.Matrix4x4 = fudge.Matrix4x4.MULTIPLICATION(this.mtxWorld, Flora.pivot);
        topleft.transform(mtxResult, true);
        bottomright.transform(mtxResult, true);
  
        let size: fudge.Vector2 = new fudge.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
        rect.position = topleft.toVector2();
        rect.size = size;
  
        return rect;
      }
    }
  }