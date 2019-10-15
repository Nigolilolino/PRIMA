namespace HelloWorld {

  console.log("Hello World");
  //document.addEventListener("DOMContentLoaded", function () {
      //document.getElementById("test").innerHTML = "Hello World";

    //  document.body.innerHTML = "Eyoooooo";
  //});

  window.addEventListener("load", handleLoad);

  function handleLoad(_event: Event): void {
      let welcomeDiv: HTMLElement = document.getElementById("message");
      welcomeDiv.innerHTML = "Best Taschenrechner EU-West";

      let numberSpace1: HTMLInputElement = <HTMLInputElement>document.getElementById("input1");
      let numberSpace2: HTMLInputElement = <HTMLInputElement>document.getElementById("input2");
      let result: HTMLInputElement = <HTMLInputElement>document.getElementById("result");
      let addBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("additionBtn");
      let subBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("substractionBtn");
      let multiBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("multiplyBtn");
      let diviBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("divideBtn");

      addBtn.addEventListener("click", Addition);
      subBtn.addEventListener("click", Substraction);
      multiBtn.addEventListener("click", Multiplication);
      diviBtn.addEventListener("click", Division);

      function Addition(_event: Event): void {
        let number1: number = parseFloat(numberSpace1.value);
        let number2: number = parseFloat(numberSpace2.value);

        let temp: number = number1 + number2; 
        result.value = temp.toString();
      }

      function Substraction(_event: Event): void {
        let number1: number = parseFloat(numberSpace1.value);
        let number2: number = parseFloat(numberSpace2.value);

        let temp: number = number1 - number2; 
        result.value = temp.toString();
      }
      
      function Multiplication(_event: Event): void {
        let number1: number = parseFloat(numberSpace1.value);
        let number2: number = parseFloat(numberSpace2.value);

        let temp: number = number1 * number2; 
        result.value = temp.toString();
      }

      function Division(_event: Event): void {
        let number1: number = parseFloat(numberSpace1.value);
        let number2: number = parseFloat(numberSpace2.value);

        let temp: number = number1 / number2; 
        result.value = temp.toString();
      }

  }
}



//Coding Style ansehen