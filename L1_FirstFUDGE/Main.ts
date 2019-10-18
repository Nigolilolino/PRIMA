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
        let node2: fudge.Node = new fudge.Node("Quad");
        let ball: fudge.Node = new fudge.Node("Quad");


        //Erstellung eines Meshs und dessen Komponente
        let mesh: fudge.MeshQuad = new fudge.MeshQuad();
        let cmpMesh: fudge.ComponentMesh = new fudge.ComponentMesh(mesh);
        cmpMesh.pivot.scaleX(0.1);
        cmpMesh.pivot.scaleY(0.4);
        cmpMesh.pivot.translateX(1);

        let mesh2: fudge.MeshQuad = new fudge.MeshQuad();
        let cmpMesh2: fudge.ComponentMesh = new fudge.ComponentMesh(mesh2);
        cmpMesh2.pivot.scaleX(0.1);
        cmpMesh2.pivot.scaleY(0.4);
        cmpMesh2.pivot.translateX(-1);

        let ballMesh: fudge.MeshQuad = new fudge.MeshQuad();
        let cmpBallMesh: fudge.ComponentMesh = new fudge.ComponentMesh(ballMesh);
        cmpBallMesh.pivot.scaleX(0.1);
        cmpBallMesh.pivot.scaleY(0.1);
       

        //Erstellung eines Materials und dessen Komponente
        let material: fudge.Material = new fudge.Material("Solidwhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1,0,0,1)));
        let cmpMaterial: fudge.ComponentMaterial = new fudge.ComponentMaterial(material);

        let material2: fudge.Material = new fudge.Material("Solidwhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(0,1,0,1)));
        let cmpMaterial2: fudge.ComponentMaterial = new fudge.ComponentMaterial(material2);

        let ballMaterial: fudge.Material = new fudge.Material("Solidwhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1,1,1,1)));
        let cmpBallMaterial: fudge.ComponentMaterial = new fudge.ComponentMaterial(ballMaterial);

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
        document.body.onkeydown = function(e: KeyboardEvent): void{
        
            if (e.keyCode == 38) {
                cmpMesh.pivot.translateY(0.01);
                viewport.draw();
            } else if (e.keyCode == 40) {
                cmpMesh.pivot.translateY(-0.01);
                viewport.draw();
            } else if (e.keyCode == 87) {
                cmpMesh2.pivot.translateY(0.01);
                viewport.draw();
            } else if (e.keyCode == 83) {
                cmpMesh2.pivot.translateY(-0.01);
                viewport.draw();
            }
        };

        document.body.onkeydown = function(e: KeyboardEvent): void {
        
            if (e.keyCode == 38) {
                cmpMesh.pivot.translateY(0.04);
                viewport.draw();
            } else if (e.keyCode == 40) {
                cmpMesh.pivot.translateY(-0.04);
                viewport.draw();
            }
            
            if (e.keyCode == 87) {
                cmpMesh2.pivot.translateY(0.04);
                viewport.draw();
            } else if (e.keyCode == 83) {
                cmpMesh2.pivot.translateY(-0.04);
                viewport.draw();
            }
        };
        //***************************************************************************************************** */

        //Kamera Komponente
        let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();

        let viewport: fudge.Viewport = new fudge.Viewport;
        viewport.initialize("camera", node, cmpCamera, canvas);
        //Verschiebung der Kamera
        viewport.camera.pivot.translateZ(2);
        //viewport.camera.pivot.translateX(1);
        //viewport.camera.pivot.rotateY(20);
        fudge.Debug.log(viewport);
        viewport.draw();
    }
}