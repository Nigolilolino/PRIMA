namespace HelloWorld{

  console.log("Hello World");
  //document.addEventListener("DOMContentLoaded", function () {
      //document.getElementById("test").innerHTML = "Hello World";

    //  document.body.innerHTML = "Eyoooooo";
  //});

  window.addEventListener("load", handleLoad);

  function handleLoad(_event: Event): void{
      document.body.innerHTML = "Eyoooooo";
  }
}



//Coding Style ansehen