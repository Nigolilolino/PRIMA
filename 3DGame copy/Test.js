"use strict";
var L09_FudgeCraft_DetectCombos;
(function (L09_FudgeCraft_DetectCombos) {
    function startTests() {
        //    testGrid();
        testCombos();
    }
    L09_FudgeCraft_DetectCombos.startTests = startTests;
    function testCombos() {
        let setup = [
            { type: CUBE_TYPE.RED, positions: [[0, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, -1], [-1, 0, 0]] },
            { type: CUBE_TYPE.GREEN, positions: [[-5, 0, 0], [-5, 0, 1], [-5, 1, 2], [-5, -1, 2]] },
            { type: CUBE_TYPE.CYAN, positions: [[3, 0, 0], [3, 0, 1], [3, 0, 2], [3, 0, 3], [3, 0, 4], [3, 0, 5], [3, 0, 6], [3, 0, -1], [3, 0, -2]] }
        ];
        setup.forEach((_combo) => {
            _combo.positions.forEach((_position) => {
                let position = new ƒ.Vector3(..._position);
                let cube = new Cube(_combo.type, position);
                grid.push(position, new GridElement(cube));
            });
        });
        let startElements = setup.map((_combo) => {
            return grid.pull(new ƒ.Vector3(..._combo.positions[0]));
        });
        let combos = new Combos(startElements);
        for (let combo of combos.found)
            for (let element of combo) {
                let mtxLocal = element.cube.cmpTransform.local;
                console.log(element.cube.name, mtxLocal.translation.getMutator());
                // mtxLocal.rotateX(45);
                // mtxLocal.rotateY(45);
                // mtxLocal.rotateY(45, true);
                mtxLocal.scale(ƒ.Vector3.ONE(0.5));
            }
        updateDisplay();
    }
    function testGrid() {
        let cube = new Cube(CUBE_TYPE.GREEN, ƒ.Vector3.ZERO());
        grid.push(cube.cmpTransform.local.translation, new GridElement(cube));
        let pulled = grid.pull(cube.cmpTransform.local.translation);
        logResult(cube == pulled.cube, "Grid push and pull", cube, pulled.cube, pulled);
        let popped = grid.pop(cube.cmpTransform.local.translation);
        logResult(cube == popped.cube, "Grid pop", cube, popped.cube, popped);
        let empty = grid.pull(cube.cmpTransform.local.translation);
        logResult(empty == undefined, "Grid element deleted");
    }
    function logResult(_success, ..._args) {
        let log = _success ? console.log : console.warn;
        log(`Test success: ${_success}`, _args);
    }
})(L09_FudgeCraft_DetectCombos || (L09_FudgeCraft_DetectCombos = {}));
//# sourceMappingURL=Test.js.map