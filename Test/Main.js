"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/>
var Test;
///<reference types="../FUDGE/Build/FudgeCore.js"/>
(function (Test) {
    var ƒ = FudgeCore;
    var Sprite = L14_ScrollerFoundation.Sprite;
    var NodeSprite = L14_ScrollerFoundation.NodeSprite;
    window.addEventListener("load", test);
    let sprite;
    let root;
    function test() {
        let img = document.querySelector("img");
        let canvas = document.querySelector("canvas");
        let crc2 = canvas.getContext("2d");
        let txtImage = new ƒ.TextureImage();
        let images = document.querySelectorAll("img");
        let imgEnemy = images[0];
        ƒ.Debug.log(img);
        ƒ.Debug.log(imgEnemy);
        txtImage.image = imgEnemy;
        sprite = new Sprite("Hare");
        //sprite.generateByGrid(txtImage, ƒ.Rectangle.GET(17, 3, 86, 59), 4, ƒ.Vector2.ZERO(), 64, ƒ.ORIGIN2D.BOTTOMCENTER); //IDLE
        //sprite.generateByGrid(txtImage, ƒ.Rectangle.GET(14, 74, 88, 59), 9, ƒ.Vector2.ZERO(), 64, ƒ.ORIGIN2D.BOTTOMCENTER);//WALK
        //sprite.generateByGrid(txtImage, ƒ.Rectangle.GET(14, 137, 94, 85), 8, ƒ.Vector2.ZERO(), 64, ƒ.ORIGIN2D.BOTTOMCENTER);// Hit
        sprite.generateByGrid(txtImage, ƒ.Rectangle.GET(17, 235, 94, 57), 4, ƒ.Vector2.ZERO(), 64, ƒ.ORIGIN2D.BOTTOMCENTER); // DIE
        ƒ.RenderManager.initialize(true, false);
        root = new ƒ.Node("Root");
        let mtxHare;
        let hare;
        hare = new NodeSprite("Hare0", sprite);
        hare.setFrameDirection(1);
        root.appendChild(hare);
        //hare = new NodeSprite("Hare1", sprite);
        //mtxHare = ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.X(1));
        //mtxHare.scaleX(-1);
        //hare.addComponent(new ƒ.ComponentTransform(mtxHare));
        //root.appendChild(hare);
        //hare = new NodeSprite("Hare2", sprite);
        //mtxHare = ƒ.Matrix4x4.IDENTITY;
        //hare.addComponent(new ƒ.ComponentTransform(mtxHare));
        //root.appendChild(hare);
        //hare = new NodeSprite("Hare3", sprite);
        //mtxHare = ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.X(-1));
        //hare.addComponent(new ƒ.ComponentTransform(mtxHare));
        //root.appendChild(hare); 
        for (let child of root.getChildren())
            child.addEventListener("showNext", (_event) => { _event.currentTarget.showFrameNext(); }, true);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.pivot.translateZ(5);
        cmpCamera.pivot.lookAt(ƒ.Vector3.ZERO());
        cmpCamera.backgroundColor = ƒ.Color.CSS("aliceblue");
        let viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        viewport.draw();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 10);
        function update(_event) {
            //ƒ.Debug.log(frame);
            //root.showFrameNext();
            root.broadcastEvent(new CustomEvent("showNext"));
            //root.getChildren()[3].cmpTransform.local.rotateY(5);
            //mtxHare = root.getChildren()[2].cmpTransform.local;
            //mtxHare.translateX(0.1);
            //ƒ.Debug.log(mtxHare.translation.toString());
            //if (mtxHare.translation.x > 2)
            //mtxHare.translation = ƒ.Vector3.X(-2);
            viewport.draw();
            crc2.strokeRect(-1, -1, canvas.width / 2, canvas.height + 2);
            crc2.strokeRect(-1, canvas.height / 2, canvas.width + 2, canvas.height);
        }
    }
})(Test || (Test = {}));
//# sourceMappingURL=Main.js.map