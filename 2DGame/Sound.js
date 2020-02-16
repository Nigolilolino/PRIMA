"use strict";
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
var L16_ScrollerCollide;
///<reference types="../FUDGE/Build/FudgeCore.js"/> 
(function (L16_ScrollerCollide) {
    class Sound {
        static init() {
            let audioElements = document.querySelectorAll("audio");
            for (let element of audioElements) {
                Sound.sounds[element.id] = element;
            }
        }
        static play(_id) {
            if (Sound.sounds[_id].id == "WalkOnGrass") {
                Sound.sounds[_id].volume = Sound.volEffects;
            }
            else {
                Sound.sounds[_id].volume = Sound.volMusic;
            }
            Sound.sounds[_id].play();
        }
    }
    Sound.volMusic = 0.5;
    Sound.volEffects = 0.1;
    Sound.volEnvironment = 0.1;
    Sound.volVoices = 0.1;
    Sound.sounds = {};
    L16_ScrollerCollide.Sound = Sound;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Sound.js.map