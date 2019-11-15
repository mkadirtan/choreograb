import {Slider} from "@babylonjs/gui";
import {TimelineControl} from "../Controllers/TimelineControl";

export const slider = new Slider("mainSlider");
slider.minimum = 0;
slider.maximum = 50;

slider.onPointerDownObservable.add(()=> {
    slider.onValueChangedObservable.add(value => {
        TimelineControl.update(value);
    });
});

slider.onPointerUpObservable.add(()=>{
    slider.onValueChangedObservable.clear();
});

slider.value = 0;