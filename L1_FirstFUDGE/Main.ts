namespace L1_FirstFUDGE{
    import fudge = FudgeCore;

    window.addEventListener("load", handleLoad);

    function handleLoad(_event: Event): void{
        let canvas: HTMLCanvasElement = document.querySelector("canvas");

        console.log(canvas);   

        let viewport: fudge.Viewport = new fudge.Viewport;
        viewport.initialize("Viewport", null, null, canvas);
    }
}