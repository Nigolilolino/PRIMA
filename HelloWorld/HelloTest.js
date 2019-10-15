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
        let welcomeDiv = document.getElementById("message");
        welcomeDiv.innerHTML = "Best Taschenrechner EU-West";
        let numberSpace1 = document.getElementById("input1");
        let numberSpace2 = document.getElementById("input2");
        let result = document.getElementById("result");
        let addBtn = document.getElementById("additionBtn");
        let subBtn = document.getElementById("substractionBtn");
        let multiBtn = document.getElementById("multiplyBtn");
        let diviBtn = document.getElementById("divideBtn");
        addBtn.addEventListener("click", Addition);
        subBtn.addEventListener("click", Substraction);
        multiBtn.addEventListener("click", Multiplication);
        diviBtn.addEventListener("click", Division);
        function Addition(_event) {
            let number1 = parseFloat(numberSpace1.value);
            let number2 = parseFloat(numberSpace2.value);
            let temp = number1 + number2;
            result.value = temp.toString();
        }
        function Substraction(_event) {
            let number1 = parseFloat(numberSpace1.value);
            let number2 = parseFloat(numberSpace2.value);
            let temp = number1 - number2;
            result.value = temp.toString();
        }
        function Multiplication(_event) {
            let number1 = parseFloat(numberSpace1.value);
            let number2 = parseFloat(numberSpace2.value);
            let temp = number1 * number2;
            result.value = temp.toString();
        }
        function Division(_event) {
            let number1 = parseFloat(numberSpace1.value);
            let number2 = parseFloat(numberSpace2.value);
            let temp = number1 / number2;
            result.value = temp.toString();
        }
    }
})(HelloWorld || (HelloWorld = {}));
//Coding Style ansehen
//# sourceMappingURL=HelloTest.js.map