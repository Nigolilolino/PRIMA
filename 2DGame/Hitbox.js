"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    var fudge = FudgeCore;
    class Hitbox extends fudge.Node {
        constructor(_master, _name) {
            if (_name) {
                super(_name);
            }
            else {
                super("Hitbox");
            }
            this.master = _master;
            this.addComponent(new fudge.ComponentTransform());
            //this.addComponent(new fudge.ComponentMaterial(Hitbox.material));
            let cmpMesh = new fudge.ComponentMesh(Hitbox.mesh);
            //cmpMesh.pivot.translateY(-0.5);
            cmpMesh.pivot = Hitbox.pivot;
            this.addComponent(cmpMesh);
        }
        getRectWorld() {
            let rect = fudge.Rectangle.GET(0, 0, 100, 100);
            let topleft = new fudge.Vector3(-0.5, 0.5, 0);
            let bottomright = new fudge.Vector3(0.5, -0.5, 0);
            //let pivot: fudge.Matrix4x4 = this.getComponent(fudge.ComponentMesh).pivot;
            let mtxResult = fudge.Matrix4x4.MULTIPLICATION(this.mtxWorld, Hitbox.pivot);
            topleft.transform(mtxResult, true);
            bottomright.transform(mtxResult, true);
            let size = new fudge.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
            rect.position = topleft.toVector2();
            rect.size = size;
            return rect;
        }
        checkCollision() {
            for (let floor of L16_ScrollerCollide.level.getChildren()) {
                if (floor.name == "EnemyHitbox" || floor.name == "ItemHitbox" || floor.name == "StoneHitbox") {
                    if (this.name == "EnemyHitbox" || this.name == "ItemHitbox") {
                        continue;
                    }
                    let hit = false;
                    let rectOfThis = this.getRectWorld();
                    let rectOfThat = floor.getRectWorld();
                    let expansionRight = new fudge.Vector2(rectOfThat.size.x);
                    let expansionDown = new fudge.Vector2(0, rectOfThat.size.y);
                    let topRight = fudge.Vector2.SUM(rectOfThat.position, expansionRight);
                    let bottomLeft = fudge.Vector2.SUM(rectOfThat.position, expansionDown);
                    let bottomRight = fudge.Vector2.SUM(rectOfThat.position, expansionDown, expansionRight);
                    if (rectOfThis.isInside(rectOfThat.position)) {
                        hit = true;
                    }
                    else if (rectOfThis.isInside(topRight)) {
                        hit = true;
                    }
                    else if (rectOfThis.isInside(bottomLeft)) {
                        hit = true;
                    }
                    else if (rectOfThis.isInside(bottomRight)) {
                        hit = true;
                    }
                    if (hit && floor.name == "StoneHitbox") {
                        let stoneHitbox = floor;
                        let stone = stoneHitbox.master;
                        stone.deleteThis();
                        return "Hit";
                    }
                    if (hit && floor.name == "EnemyHitbox") {
                        return "Hit";
                    }
                    if (hit && floor.name == "ItemHitbox") {
                        let hitbox = floor;
                        let level = hitbox.getParent();
                        level.removeChild(hitbox.master);
                        level.removeChild(hitbox);
                        return "Collected";
                    }
                }
                else {
                    continue;
                }
            }
        }
        checkCollisionWeapon() {
            for (let floor of L16_ScrollerCollide.level.getChildren()) {
                if (floor.name == "EnemyHitbox") {
                    let hit = false;
                    let rectOfThis = this.getRectWorld();
                    let rectOfThat = floor.getRectWorld();
                    let expansionRight = new fudge.Vector2(rectOfThis.size.x);
                    let expansionDown = new fudge.Vector2(0, rectOfThis.size.y);
                    let topRight = fudge.Vector2.SUM(rectOfThis.position, expansionRight);
                    let bottomLeft = fudge.Vector2.SUM(rectOfThis.position, expansionDown);
                    let bottomRight = fudge.Vector2.SUM(rectOfThis.position, expansionDown, expansionRight);
                    if (rectOfThat.isInside(rectOfThis.position)) {
                        hit = true;
                    }
                    else if (rectOfThat.isInside(topRight)) {
                        hit = true;
                    }
                    else if (rectOfThat.isInside(bottomLeft)) {
                        hit = true;
                    }
                    else if (rectOfThat.isInside(bottomRight)) {
                        hit = true;
                    }
                    if (hit && floor.name == "EnemyHitbox") {
                        return ["Hit", floor];
                    }
                }
            }
        }
    }
    Hitbox.mesh = new fudge.MeshSprite();
    Hitbox.material = new fudge.Material("Hitbox", fudge.ShaderUniColor, new fudge.CoatColored(fudge.Color.CSS("black", 0.5)));
    Hitbox.pivot = fudge.Matrix4x4.TRANSLATION(fudge.Vector3.Y(-0.5));
    L16_ScrollerCollide.Hitbox = Hitbox;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Hitbox.js.map