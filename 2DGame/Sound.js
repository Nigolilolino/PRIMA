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
            if (Sound.sounds[_id].id == "WalkOnGrass" || Sound.sounds[_id].id == "Sword" || Sound.sounds[_id].id == "Slurp") {
                Sound.sounds[_id].volume = Sound.volEffects;
            }
            else if (Sound.sounds[_id].id == "Theme") {
                Sound.sounds[_id].volume = Sound.volMusic;
            }
            else if (Sound.sounds[_id].id == "Wind") {
                Sound.sounds[_id].volume = Sound.volEnvironment;
            }
            else if (Sound.sounds[_id].id == "HitHuman" || Sound.sounds[_id].id == "HurtMonsterSmall" || Sound.sounds[_id].id == "HurtMonsterBig") {
                Sound.sounds[_id].volume = Sound.volVoices;
            }
            Sound.sounds[_id].play();
        }
    }
    Sound.volMusic = 0.3;
    Sound.volEffects = 0.1;
    Sound.volEnvironment = 0.1;
    Sound.volVoices = 0.3;
    Sound.sounds = {};
    L16_ScrollerCollide.Sound = Sound;
})(L16_ScrollerCollide || (L16_ScrollerCollide = {}));
//# sourceMappingURL=Sound.js.map