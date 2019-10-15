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
        //Erstellung eines Meshs und dessen Komponente
        let mesh = new fudge.MeshQuad();
        let cmpMesh = new fudge.ComponentMesh(mesh);
        //Erstellung eines Materials und dessen Komponente
        let material = new fudge.Material("Solidwhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1, 0, 0, 1)));
        let cmpMaterial = new fudge.ComponentMaterial(material);
        //sVerknüpfung der Komonenten mit dem Knoten
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        //Kamera Komponente
        let cmpCamera = new fudge.ComponentCamera();
        let viewport = new fudge.Viewport;
        viewport.initialize("camera", node, cmpCamera, canvas);
        //Verschiebung der Kamera
        viewport.camera.pivot.translateZ(2);
        fudge.Debug.log(viewport);
        viewport.draw();
    }
})(L1_FirstFUDGE || (L1_FirstFUDGE = {}));
//# sourceMappingURL=Main.js.map