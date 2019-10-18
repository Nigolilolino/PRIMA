"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/>
var L1_FirstFUDGE;
///<reference types="../FUDGE/Build/FudgeCore.js"/>
(function (L1_FirstFUDGE) {
    var fudge = FudgeCore;
    window.addEventListener("load", handleLoad);
    function handleLoad(_event) {
        let canvas = document.querySelector("canvas");
        fudge.RenderManager.initialize();
        fudge.Debug.log(canvas);
        console.log(canvas);
        let node = new fudge.Node("Quad");
        let node2 = new fudge.Node("Quad");
        let ball = new fudge.Node("Quad");
        //Erstellung eines Meshs und dessen Komponente
        let mesh = new fudge.MeshQuad();
        let cmpMesh = new fudge.ComponentMesh(mesh);
        cmpMesh.pivot.scaleX(0.1);
        cmpMesh.pivot.scaleY(0.4);
        cmpMesh.pivot.translateX(1);
        let mesh2 = new fudge.MeshQuad();
        let cmpMesh2 = new fudge.ComponentMesh(mesh2);
        cmpMesh2.pivot.scaleX(0.1);
        cmpMesh2.pivot.scaleY(0.4);
        cmpMesh2.pivot.translateX(-1);
        let ballMesh = new fudge.MeshQuad();
        let cmpBallMesh = new fudge.ComponentMesh(ballMesh);
        cmpBallMesh.pivot.scaleX(0.1);
        cmpBallMesh.pivot.scaleY(0.1);
        //Erstellung eines Materials und dessen Komponente
        let material = new fudge.Material("Solidwhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1, 0, 0, 1)));
        let cmpMaterial = new fudge.ComponentMaterial(material);
        let material2 = new fudge.Material("Solidwhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(0, 1, 0, 1)));
        let cmpMaterial2 = new fudge.ComponentMaterial(material2);
        let ballMaterial = new fudge.Material("Solidwhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1, 1, 1, 1)));
        let cmpBallMaterial = new fudge.ComponentMaterial(ballMaterial);
        //Verknüpfung der Komonenten mit dem Knoten
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        //Spieler 2 und der Ball werden als Unterknoten des ersten Spielers eingefügt (Wurde ohne Dell Oro gemacht).
        node.appendChild(node2);
        node2.addComponent(cmpMesh2);
        node2.addComponent(cmpMaterial2);
        node.appendChild(ball);
        ball.addComponent(cmpBallMesh);
        ball.addComponent(cmpBallMaterial);
        //****************************************EXPERIMENTEL**************************************// 
        //Beide Spielerfiguren sind über W,S,Pfeil hoch und Pfeil runter  steuerbar. Wurde ohne Dell Oro gemacht.
        document.body.onkeydown = function (e) {
            if (e.keyCode == 38) {
                cmpMesh.pivot.translateY(0.01);
                viewport.draw();
            }
            else if (e.keyCode == 40) {
                cmpMesh.pivot.translateY(-0.01);
                viewport.draw();
            }
            else if (e.keyCode == 87) {
                cmpMesh2.pivot.translateY(0.01);
                viewport.draw();
            }
            else if (e.keyCode == 83) {
                cmpMesh2.pivot.translateY(-0.01);
                viewport.draw();
            }
        };
        document.body.onkeydown = function (e) {
            if (e.keyCode == 38) {
                cmpMesh.pivot.translateY(0.04);
                viewport.draw();
            }
            else if (e.keyCode == 40) {
                cmpMesh.pivot.translateY(-0.04);
                viewport.draw();
            }
            if (e.keyCode == 87) {
                cmpMesh2.pivot.translateY(0.04);
                viewport.draw();
            }
            else if (e.keyCode == 83) {
                cmpMesh2.pivot.translateY(-0.04);
                viewport.draw();
            }
        };
        //***************************************************************************************************** */
        //Kamera Komponente
        let cmpCamera = new fudge.ComponentCamera();
        let viewport = new fudge.Viewport;
        viewport.initialize("camera", node, cmpCamera, canvas);
        //Verschiebung der Kamera
        viewport.camera.pivot.translateZ(2);
        //viewport.camera.pivot.translateX(1);
        //viewport.camera.pivot.rotateY(20);
        fudge.Debug.log(viewport);
        viewport.draw();
    }
})(L1_FirstFUDGE || (L1_FirstFUDGE = {}));
//# sourceMappingURL=Main.js.map