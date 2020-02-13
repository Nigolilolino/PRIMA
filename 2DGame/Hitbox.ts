///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    import fudge = FudgeCore;
  
    export class Hitbox extends fudge.Node {
      public master: fudge.Node;
      private static mesh: fudge.MeshSprite = new fudge.MeshSprite();
      private static material: fudge.Material = new fudge.Material("Hitbox", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("black", 0.5)));
      private static readonly pivot: fudge.Matrix4x4 = fudge.Matrix4x4.TRANSLATION(fudge.Vector3.Y(-0.5));
      
  
      public constructor(_master: fudge.Node, _name?: string) {

        if (_name) {
          super(_name);
        } else {
          super("Hitbox");
        }
        this.master = _master;
        this.addComponent(new fudge.ComponentTransform());
        //this.addComponent(new fudge.ComponentMaterial(Hitbox.material));
        let cmpMesh: fudge.ComponentMesh = new fudge.ComponentMesh(Hitbox.mesh);
        cmpMesh.pivot = Hitbox.pivot;
        this.addComponent(cmpMesh); 
      
      }
  
      public getRectWorld(): fudge.Rectangle {
        let rect: fudge.Rectangle = fudge.Rectangle.GET(0, 0, 100, 100);
        let topleft: fudge.Vector3 = new fudge.Vector3(-0.5, 0.5, 0);
        let bottomright: fudge.Vector3 = new fudge.Vector3(0.5, -0.5, 0);
        
        //let pivot: fudge.Matrix4x4 = this.getComponent(fudge.ComponentMesh).pivot;
        let mtxResult: fudge.Matrix4x4 = fudge.Matrix4x4.MULTIPLICATION(this.mtxWorld, Hitbox.pivot);
        topleft.transform(mtxResult, true);
        bottomright.transform(mtxResult, true);
  
        let size: fudge.Vector2 = new fudge.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
        rect.position = topleft.toVector2();
        rect.size = size;
  
        return rect;
      }

      public checkCollision(): string {

        for (let floor of level.getChildren()) {


          if (floor.name == "EnemyHitbox" || floor.name == "ItemHitbox" || floor.name == "StoneHitbox") {
            if (this.name == "EnemyHitbox" || this.name == "ItemHitbox") { 
              continue;
            }

            let hit: boolean = false;
            let rectOfThis: fudge.Rectangle = (<Hitbox>this).getRectWorld();
            let rectOfThat: fudge.Rectangle = (<Hitbox>floor).getRectWorld();
            let expansionRight: fudge.Vector2 = new fudge.Vector2(rectOfThat.size.x);
            let expansionDown: fudge.Vector2 = new fudge.Vector2(0 , rectOfThat.size.y);
            let topRight: fudge.Vector2 = fudge.Vector2.SUM(rectOfThat.position, expansionRight);
            let bottomLeft: fudge.Vector2 = fudge.Vector2.SUM(rectOfThat.position, expansionDown);
            let bottomRight: fudge.Vector2 = fudge.Vector2.SUM(rectOfThat.position, expansionDown, expansionRight);

            if (rectOfThis.isInside(rectOfThat.position)) {
              hit = true;
            } else if (rectOfThis.isInside(topRight)) {
              hit = true;
            } else if (rectOfThis.isInside(bottomLeft)) {
              hit = true;
            } else if (rectOfThis.isInside(bottomRight)) {
              hit = true;
            }

            if (hit && floor.name == "StoneHitbox") {
              let stoneHitbox: Hitbox = <Hitbox>floor;
              let stone: Stone = <Stone>stoneHitbox.master;
              stone.deleteThis();
              return "Hit";
            }

            if (hit && floor.name == "EnemyHitbox") {
              return "Hit";
            }

            if (hit && floor.name == "ItemHitbox") {
              let hitbox: Hitbox = <Hitbox>floor;
              let level: fudge.Node = hitbox.getParent();
              level.removeChild(hitbox.master);
              level.removeChild(hitbox);
              return "Collected";
            }
          } else {
            continue;
          }

        }
      }

      public checkCollisionWeapon(): any {

        for (let floor of level.getChildren()) {

          if (floor.name == "EnemyHitbox") {

            let hit: boolean = false;
            let rectOfThis: fudge.Rectangle = (<Hitbox>this).getRectWorld();
            let rectOfThat: fudge.Rectangle = (<Hitbox>floor).getRectWorld();
            let expansionRight: fudge.Vector2 = new fudge.Vector2(rectOfThis.size.x);
            let expansionDown: fudge.Vector2 = new fudge.Vector2(0 , rectOfThis.size.y);
            let topRight: fudge.Vector2 = fudge.Vector2.SUM(rectOfThis.position, expansionRight);
            let bottomLeft: fudge.Vector2 = fudge.Vector2.SUM(rectOfThis.position, expansionDown);
            let bottomRight: fudge.Vector2 = fudge.Vector2.SUM(rectOfThis.position, expansionDown, expansionRight);

            if (rectOfThat.isInside(rectOfThis.position)) {
              hit = true;
            } else if (rectOfThat.isInside(topRight)) {
              hit = true;
            } else if (rectOfThat.isInside(bottomLeft)) {
              hit = true;
            } else if (rectOfThat.isInside(bottomRight)) {
              hit = true;
            }

            if (hit && floor.name == "EnemyHitbox") {
              return ["Hit", floor];
            }

        }
      }

    }
  }
}