"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/>
var FudgeCraftCopy;
///<reference types="../FUDGE/Build/FudgeCore.js"/>
(function (FudgeCraftCopy) {
    FudgeCraftCopy.ƒ = FudgeCore;
    window.addEventListener("load", hndLoad);
    FudgeCraftCopy.game = new FudgeCraftCopy.ƒ.Node("FudgeCraft");
    FudgeCraftCopy.grid = new FudgeCraftCopy.Grid();
    let control = new FudgeCraftCopy.Control();
    let viewport;
    let camera;
    let speedCameraRotation = 0.2;
    let speedCameraTranslation = 0.02;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        FudgeCraftCopy.ƒ.RenderManager.initialize(true);
        FudgeCraftCopy.ƒ.Debug.log("Canvas", canvas);
        // enable unlimited mouse-movement (user needs to click on canvas first)
        canvas.addEventListener("click", canvas.requestPointerLock);
        // set lights
        let cmpLight = new FudgeCraftCopy.ƒ.ComponentLight(new FudgeCraftCopy.ƒ.LightDirectional(FudgeCraftCopy.ƒ.Color.WHITE));
        cmpLight.pivot.lookAt(new FudgeCraftCopy.ƒ.Vector3(0.5, 1, 0.8));
        // game.addComponent(cmpLight);
        let cmpLightAmbient = new FudgeCraftCopy.ƒ.ComponentLight(new FudgeCraftCopy.ƒ.LightAmbient(FudgeCraftCopy.ƒ.Color.DARK_GREY));
        FudgeCraftCopy.game.addComponent(cmpLightAmbient);
        // setup orbiting camera
        camera = new FudgeCraftCopy.CameraOrbit(75);
        FudgeCraftCopy.game.appendChild(camera);
        camera.setRotationX(-20);
        camera.setRotationY(20);
        camera.cmpCamera.getContainer().addComponent(cmpLight);
        // setup viewport
        viewport = new FudgeCraftCopy.ƒ.Viewport();
        viewport.initialize("Viewport", FudgeCraftCopy.game, camera.cmpCamera, canvas);
        FudgeCraftCopy.ƒ.Debug.log("Viewport", viewport);
        // setup event handling
        viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        viewport.activateWheelEvent("\u0192wheel" /* WHEEL */, true);
        viewport.addEventListener("\u0192pointermove" /* MOVE */, hndPointerMove);
        viewport.addEventListener("\u0192wheel" /* WHEEL */, hndWheelMove);
        window.addEventListener("keydown", hndKeyDown);
        FudgeCraftCopy.game.appendChild(control);
        startGame();
        //startTests();
        updateDisplay();
        FudgeCraftCopy.ƒ.Debug.log("Game", FudgeCraftCopy.game);
    }
    function startGame() {
        FudgeCraftCopy.grid.push(FudgeCraftCopy.ƒ.Vector3.ZERO(), new FudgeCraftCopy.GridElement(new FudgeCraftCopy.Cube(FudgeCraftCopy.CUBE_TYPE.BLACK, FudgeCraftCopy.ƒ.Vector3.ZERO())));
        startRandomFragment();
    }
    function updateDisplay() {
        viewport.draw();
    }
    FudgeCraftCopy.updateDisplay = updateDisplay;
    function hndPointerMove(_event) {
        // ƒ.Debug.log(_event.movementX, _event.movementY);
        camera.rotateY(_event.movementX * speedCameraRotation);
        camera.rotateX(_event.movementY * speedCameraRotation);
        updateDisplay();
    }
    function hndWheelMove(_event) {
        camera.translate(_event.deltaY * speedCameraTranslation);
        updateDisplay();
    }
    function hndKeyDown(_event) {
        if (_event.code == FudgeCraftCopy.ƒ.KEYBOARD_CODE.SPACE) {
            let frozen = control.freeze();
            let combos = new FudgeCraftCopy.Combos(frozen);
            handleCombos(combos);
            startRandomFragment();
        }
        let transformation = FudgeCraftCopy.Control.transformations[_event.code];
        if (transformation)
            move(transformation);
        updateDisplay();
    }
    function handleCombos(_combos) {
        for (let combo of _combos.found)
            if (combo.length > 2)
                for (let element of combo) {
                    let mtxLocal = element.cube.cmpTransform.local;
                    FudgeCraftCopy.ƒ.Debug.log(element.cube.name, mtxLocal.translation.getMutator());
                    // mtxLocal.rotateX(45);
                    // mtxLocal.rotateY(45);
                    // mtxLocal.rotateY(45, true);
                    mtxLocal.scale(FudgeCraftCopy.ƒ.Vector3.ONE(0.5));
                    FudgeCraftCopy.ƒ.Debug.log(element.cube.cmpTransform.local.translation);
                    let test = new FudgeCraftCopy.ƒ.Vector3(element.cube.cmpTransform.local.translation.x, element.cube.cmpTransform.local.translation.y, element.cube.cmpTransform.local.translation.z);
                    FudgeCraftCopy.grid.pop(test);
                    compress();
                }
    }
    function move(_transformation) {
        let animationSteps = 10;
        let fullRotation = 90;
        let fullTranslation = 1;
        let move = {
            rotation: _transformation.rotation ? FudgeCraftCopy.ƒ.Vector3.SCALE(_transformation.rotation, fullRotation) : new FudgeCraftCopy.ƒ.Vector3(),
            translation: _transformation.translation ? FudgeCraftCopy.ƒ.Vector3.SCALE(_transformation.translation, fullTranslation) : new FudgeCraftCopy.ƒ.Vector3()
        };
        let timers = FudgeCraftCopy.ƒ.Time.game.getTimers();
        if (Object.keys(timers).length > 0)
            return;
        if (control.checkCollisions(move).length > 0)
            return;
        move.translation.scale(1 / animationSteps);
        move.rotation.scale(1 / animationSteps);
        FudgeCraftCopy.ƒ.Time.game.setTimer(10, animationSteps, function () {
            control.move(move);
            updateDisplay();
        });
    }
    function startRandomFragment() {
        let fragment = FudgeCraftCopy.Fragment.getRandom();
        control.cmpTransform.local = FudgeCraftCopy.ƒ.Matrix4x4.IDENTITY;
        control.setFragment(fragment);
        let vector = new FudgeCraftCopy.ƒ.Vector3(0, 0, 4);
        fragment.cmpTransform.local.translate(vector);
    }
    FudgeCraftCopy.startRandomFragment = startRandomFragment;
    function compress() {
        let moves = FudgeCraftCopy.grid.compress();
        for (let element of moves) {
            let move = element;
            let vectorOfElement = new FudgeCraftCopy.ƒ.Vector3(Math.round(move.element.position.x), Math.round(move.element.position.y), Math.round(move.element.position.z));
            let newVectorOfElement = new FudgeCraftCopy.ƒ.Vector3(Math.round(move.target.x), Math.round(move.target.y), Math.round(move.target.z));
            FudgeCraftCopy.grid.pop(vectorOfElement);
            move.element.cube.cmpTransform.local.translation = newVectorOfElement;
            FudgeCraftCopy.grid.push(newVectorOfElement, move.element);
        }
        if (moves.length != 0) {
            compress();
        }
        FudgeCraftCopy.ƒ.Debug.log("liste");
        FudgeCraftCopy.ƒ.Debug.log(moves);
    }
})(FudgeCraftCopy || (FudgeCraftCopy = {}));
//# sourceMappingURL=Main.js.map