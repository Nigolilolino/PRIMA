///<reference types="../FUDGE/Build/FudgeCore.js"/>
namespace L1_FirstFUDGE {

    import fudge = FudgeCore;

    window.addEventListener("load", handleLoad);

    function handleLoad(_event: Event): void {
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        fudge.RenderManager.initialize();
        fudge.Debug.log(canvas);
        console.log(canvas);   

        let node: fudge.Node = new fudge.Node("Quad");

        //Erstellung eines Meshs und dessen Komponente
        let mesh: fudge.MeshQuad = new fudge.MeshQuad();
        let cmpMesh: fudge.ComponentMesh = new fudge.ComponentMesh(mesh);

        //Erstellung eines Materials und dessen Komponente
        let material: fudge.Material = new fudge.Material("Solidwhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1,0,0,1)));
        let cmpMaterial: fudge.ComponentMaterial = new fudge.ComponentMaterial(material);

        //sVerknüpfung der Komonenten mit dem Knoten
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);

        //Kamera Komponente
        let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();


        let viewport: fudge.Viewport = new fudge.Viewport;
        viewport.initialize("camera", node, cmpCamera, canvas);
        //Verschiebung der Kamera
        viewport.camera.pivot.translateZ(2);
        fudge.Debug.log(viewport);
        viewport.draw();
    }
}