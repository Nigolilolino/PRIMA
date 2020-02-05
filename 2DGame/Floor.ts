///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
  
    export class Floor extends fudge.Node {
      private static mesh: fudge.MeshSprite = new fudge.MeshSprite();
      private static material: fudge.Material = new fudge.Material("Floor", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("red", 0.5)));
      private static readonly pivot: fudge.Matrix4x4 = fudge.Matrix4x4.TRANSLATION(fudge.Vector3.Y(-0.5));
  
      public constructor() {
        super("Floor");
        this.addComponent(new fudge.ComponentTransform());
        this.addComponent(new fudge.ComponentMaterial(Floor.material));
        let cmpMesh: fudge.ComponentMesh = new fudge.ComponentMesh(Floor.mesh);
        //cmpMesh.pivot.translateY(-0.5);
        cmpMesh.pivot = Floor.pivot;
        this.addComponent(cmpMesh);
      }
  
      public getRectWorld(): fudge.Rectangle {
        let rect: fudge.Rectangle = fudge.Rectangle.GET(0, 0, 100, 100);
        let topleft: fudge.Vector3 = new fudge.Vector3(-0.5, 0.5, 0);
        let bottomright: fudge.Vector3 = new fudge.Vector3(0.5, -0.5, 0);
        
        //let pivot: fudge.Matrix4x4 = this.getComponent(fudge.ComponentMesh).pivot;
        let mtxResult: fudge.Matrix4x4 = fudge.Matrix4x4.MULTIPLICATION(this.mtxWorld, Floor.pivot);
        topleft.transform(mtxResult, true);
        bottomright.transform(mtxResult, true);
  
        let size: fudge.Vector2 = new fudge.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
        rect.position = topleft.toVector2();
        rect.size = size;
  
        return rect;
      }
    }
  }