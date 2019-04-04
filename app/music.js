import musicFile from './media/audio/lost_compressed.mp3';
import {Howl, Howler} from 'howler';

export let music = new Howl({
    src: [musicFile]
});