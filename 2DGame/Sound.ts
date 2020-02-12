///<reference types="../FUDGE/Build/FudgeCore.js"/> 
namespace L16_ScrollerCollide {
    interface Sounds {
        [id: string]: HTMLAudioElement;
      }
    export class Sound {
    private static sounds: Sounds = {};
    public static vol: number = 0.5;

    public static init(): void {
        let audioElements: NodeListOf<HTMLAudioElement> = document.querySelectorAll("audio");
        for (let element of audioElements){
            Sound.sounds[element.id] = element;
        }
    }

    public static play(_id: string): void {
        Sound.sounds[_id].play();
        Sound.sounds[_id].volume = Sound.vol;
    }


    }
}