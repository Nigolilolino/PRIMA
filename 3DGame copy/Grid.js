"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/>
var FudgeCraftCopy;
///<reference types="../FUDGE/Build/FudgeCore.js"/>
(function (FudgeCraftCopy) {
    class GridElement {
        constructor(_cube = null) {
            this.cube = _cube;
        }
    }
    FudgeCraftCopy.GridElement = GridElement;
    class Grid extends Map {
        // private grid: Map<string, Cube> = new Map();
        constructor() {
            super();
        }
        push(_position, _element = null) {
            let key = this.toKey(_position);
            this.set(key, _element);
            if (_element)
                FudgeCraftCopy.game.appendChild(_element.cube);
        }
        pull(_position) {
            let key = this.toKey(_position);
            let element = this.get(key);
            return element;
        }
        pop(_position) {
            let key = this.toKey(_position);
            let element = this.get(key);
            this.delete(key);
            if (element)
                FudgeCraftCopy.game.removeChild(element.cube);
            return element;
        }
        findNeigbors(_of) {
            let found = [];
            let offsets = [[0, 0, 1], [0, 0, -1], [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0]];
            for (let offset of offsets) {
                let posNeighbor = FudgeCraftCopy.ƒ.Vector3.SUM(_of, new FudgeCraftCopy.ƒ.Vector3(...offset));
                let neighbor = FudgeCraftCopy.grid.pull(posNeighbor);
                if (neighbor)
                    found.push(neighbor);
            }
            return found;
        }
        toKey(_position) {
            let position = _position.map(Math.round);
            let key = position.toString();
            return key;
        }
    }
    FudgeCraftCopy.Grid = Grid;
})(FudgeCraftCopy || (FudgeCraftCopy = {}));
//# sourceMappingURL=Grid.js.map