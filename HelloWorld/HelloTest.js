"use strict";
var HelloWorld;
(function (HelloWorld) {
    console.log("Hello World");
    //document.addEventListener("DOMContentLoaded", function () {
    //document.getElementById("test").innerHTML = "Hello World";
    //  document.body.innerHTML = "Eyoooooo";
    //});
    window.addEventListener("load", handleLoad);
    function handleLoad(_event) {
        document.body.innerHTML = "Eyoooooo";
    }
})(HelloWorld || (HelloWorld = {}));
//Coding Style ansehen
//# sourceMappingURL=HelloTest.js.map