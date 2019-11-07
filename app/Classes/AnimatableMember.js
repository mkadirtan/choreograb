import {Member} from './Member';
import {Register} from "./Register";
import {property as getProp} from "underscore";
import {TimelineLite} from "gsap";

export class AnimatableMember extends Member{
    constructor(group, param){
        super(group, param);
        this.registers = [];
        this.animatableObject = param.animatableObject;
        this.timeline = new TimelineLite();
        this.register = new Register(group.getIntervalPipe())
    }
    addRegister(){
        let newRegister = this.register.pipe();
        let isDuplicate = false;
        let i = 0;
        this.registers.forEach(function(register, index){
            if(register.interval === newRegister.interval){
                isDuplicate = true;
                i = index;
            }
        });

        if(isDuplicate){
            this.registers[i] = newRegister
        }
        else {
            this.registers.push(newRegister);
        }
        console.log(newRegister);
    }
    getAnimatableObject(){
        return this.animatableObject;
    }
    animate(registers){
        if(!registers){
            registers = this.registers;
        }
        let timeline = this.timeline;
        let animatableProperties = this.register.animatableProperties; //
        //todo move this part completely to animatable register class

        //Underscore getter functions
        //Don't confuse with animatable "property" !!
        let start = getProp(["interval", "start"]);
        let end = getProp(["interval", "end"]);

        //Sort registers
        //todo make sorting elsewhere
        registers.sort((a, b) => {
            return start(a) - end(b)
        });

        animatableProperties.forEach(property => {
            let value = property.value;
            let target = getProp(property.target)(this);

            //Clean-up
            timeline.kill(property.keys, target);
            //Animate
            registers.forEach((register, index, registers) => {
                if (index > 0) {
                    timeline.fromTo(
                        target, //etc. position
                        start(register) - end(registers[index - 1]), //duration
                        value(registers[index - 1]), //from vars
                        value(register), //to vars
                        end(registers[index - 1])//position (end of last register)
                    );
                }
            });
        });
    }
}