"use strict";
var L1_FirstFUDGE;
(function (L1_FirstFUDGE) {
    var fudge = FudgeCore;
    window.addEventListener("load", handleLoad);
    function handleLoad(_event) {
        let canvas = document.querySelector("canvas");
        console.log(canvas);
        let viewport = new fudge.Viewport;
        viewport.initialize("Viewport", null, null, canvas);
    }
})(L1_FirstFUDGE || (L1_FirstFUDGE = {}));
//# sourceMappingURL=Main.js.map