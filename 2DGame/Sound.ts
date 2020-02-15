///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    interface Sounds {
        [id: string]: HTMLAudioElement;
      }
    export class Sound {
    private static sounds: Sounds = {};
    public static vol: number = 0.5;
    public static volWalking: number = 0.1;

    public static init(): void {
        let audioElements: NodeListOf<HTMLAudioElement> = document.querySelectorAll("audio");
        for (let element of audioElements) {
            Sound.sounds[element.id] = element;
        }
    }

    public static play(_id: string): void {

        if (Sound.sounds[_id].id == "WalkOnGrass") {
            Sound.sounds[_id].volume = Sound.volWalking;
        } else {
            Sound.sounds[_id].volume = Sound.vol;
        }
        Sound.sounds[_id].play();
    }


    }
}