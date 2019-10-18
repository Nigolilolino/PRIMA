///<reference types="../FUDGE/Build/FudgeCore.js"/>
namespace L1_FirstFUDGE {

    import fudge = FudgeCore;

    window.addEventListener("load", handleLoad);

    function handleLoad(_event: Event): void {
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        fudge.RenderManager.initialize();
        fudge.Debug.log(canvas);
        console.log(canvas);   

        let player1Node: fudge.Node = new fudge.Node("Quad");
        let player2Node: fudge.Node = new fudge.Node("Quad");
        let ball: fudge.Node = new fudge.Node("Quad");


        //Erstellung eines Meshs und dessen Komponente
        let player1Mesh: fudge.MeshQuad = new fudge.MeshQuad();
        let cmpPlayer1Mesh: fudge.ComponentMesh = new fudge.ComponentMesh(player1Mesh);
        cmpPlayer1Mesh.pivot.scaleX(0.1);
        cmpPlayer1Mesh.pivot.scaleY(0.4);
        cmpPlayer1Mesh.pivot.translateX(1);

        let player2Mesh: fudge.MeshQuad = new fudge.MeshQuad();
        let cmpPlayer2Mesh: fudge.ComponentMesh = new fudge.ComponentMesh(player2Mesh);
        cmpPlayer2Mesh.pivot.scaleX(0.1);
        cmpPlayer2Mesh.pivot.scaleY(0.4);
        cmpPlayer2Mesh.pivot.translateX(-1);

        let ballMesh: fudge.MeshQuad = new fudge.MeshQuad();
        let cmpBallMesh: fudge.ComponentMesh = new fudge.ComponentMesh(ballMesh);
        cmpBallMesh.pivot.scaleX(0.1);
        cmpBallMesh.pivot.scaleY(0.1);
       

        //Erstellung eines Materials und dessen Komponente
        let player1Material: fudge.Material = new fudge.Material("Solidwhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1,0,0,1)));
        let cmpPlayer1Material: fudge.ComponentMaterial = new fudge.ComponentMaterial(player1Material);

        let player2Material: fudge.Material = new fudge.Material("Solidwhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(0,1,0,1)));
        let cmpPlayer2Material: fudge.ComponentMaterial = new fudge.ComponentMaterial(player2Material);

        let ballMaterial: fudge.Material = new fudge.Material("Solidwhite", fudge.ShaderUniColor, new fudge.CoatColored(new fudge.Color(1,1,1,1)));
        let cmpBallMaterial: fudge.ComponentMaterial = new fudge.ComponentMaterial(ballMaterial);

        //Verknüpfung der Komonenten mit dem Knoten
        player1Node.addComponent(cmpPlayer1Mesh);
        player1Node.addComponent(cmpPlayer1Material);

        //Spieler 2 und der Ball werden als Unterknoten des ersten Spielers eingefügt (Wurde ohne Dell Oro gemacht).
        player1Node.appendChild(player2Node);
        player2Node.addComponent(cmpPlayer2Mesh);
        player2Node.addComponent(cmpPlayer2Material);

        player1Node.appendChild(ball);
        ball.addComponent(cmpBallMesh);
        ball.addComponent(cmpBallMaterial);

        //****************************************EXPERIMENTEL**************************************// 
        //Beide Spielerfiguren sind über W,S,Pfeil hoch und Pfeil runter  steuerbar. Wurde ohne Dell Oro gemacht.
        document.body.onkeydown = function(e: KeyboardEvent): void{
        
            if (e.keyCode == 38) {
                cmpPlayer1Mesh.pivot.translateY(0.01);
                viewport.draw();
            } else if (e.keyCode == 40) {
                cmpPlayer1Mesh.pivot.translateY(-0.01);
                viewport.draw();
            } else if (e.keyCode == 87) {
                cmpPlayer2Mesh.pivot.translateY(0.01);
                viewport.draw();
            } else if (e.keyCode == 83) {
                cmpPlayer2Mesh.pivot.translateY(-0.01);
                viewport.draw();
            }
        };

        //***************************************************************************************************** */

        //Kamera Komponente
        let cmpCamera: fudge.ComponentCamera = new fudge.ComponentCamera();

        let viewport: fudge.Viewport = new fudge.Viewport;
        viewport.initialize("camera", player1Node, cmpCamera, canvas);
        //Verschiebung der Kamera
        viewport.camera.pivot.translateZ(2);
        //viewport.camera.pivot.translateX(1);
        //viewport.camera.pivot.rotateY(20);
        fudge.Debug.log(viewport);
        viewport.draw();
    }
}