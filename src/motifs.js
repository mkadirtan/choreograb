/**
 * "Motifs" object is a controller for all motif objects.
 * Its methods are:
 * update:
 *  Gets current time from timeline and sets next, current and previous motifs accordingly.
 *  Sends an "active" ticket to every motif.
 *  Then every motif hides or reveals itself accordingly.
 * addMotif:
 *  Adds a new motif to motifs array.
 * removeMotif:
 *  Hides the motif.
 *  Removes the motif from the motifs array.
 *  Doesn't destroy the motif.
 * current:
 *  Setter & Getter
 * next:
 *  Setter & Getter
 * previous:
 *  Setter & Getter
 */

let Motifs = {
    self: this,
    _current: null,
    _next: null,
    _previous: null,
    _motifs: null,
    update(){
        let currentTime = timeline.time();
        if(!(self._current.start() <= currentTime && currentTime <= self._current.end())){
            self._motifs.forEach(
                function(motif, index, array){
                    if (motif.start() <= currentTime && currentTime <= motif.end()) {
                        if(array.length > 2){
                            if(index === array.length-1){
                                self.next(array[0]);
                                self.previous(array[index-1])
                            }
                            else if(index === 0){
                                self.next(array[index+1]);
                                self.previous(array[length-1]);
                            }
                            else{
                                self.next(array[index+1]);
                                self.previous(array[index-1]);
                            }
                        }
                        self.current(motif);
                        motif.active(true);
                    }
                    else{
                        motif.active(false);
                    }
                }
            );
        }
        self._motifs.forEach(function(motif){
            motif.update();
        })
    },
    addMotif(motif){
        self.motifs().push(motif);
    },
    removeMotif(motif){
        self.motifs().forEach(function(e, i, a){
            if(e === motif){
                a.splice(i, 1);
            }
        })
    },
    get motifs(){return self._motifs},
    set motifs(motifs){self._motifs = motifs},
    get current(){return self._current;},
    set current(motif){self._current = motif;},
    get next(){return self._next;},
    set next(motif){self._next = motif;},
    get previous(){return self._previous;},
    set previous(motif){self._previous = motif;}
};

/**
 * Motif objects have properties for
 * name, start & end time, guides.
 * "active" token called _isActive.
 */

function CreateMotif(param){
    this.self = this;
    this.name = param.name;
    this._isActive = false;
    this._start = 0;
    this._end = 0;
    this._guides = [];
}

/**
 * Every motif has methods;
 * start:
 * Setter & Getter
 * end:
 * Setter & Getter
 * addGuide:
 * Binds guide to this motif.
 * Guide's visibility and such are controlled from motif.
 * removeGuide:
 * Hides the guide and unbinds it from motif.
 * Guide object is still present.
 * update:
 * Motif hides or reveals itself according to "active" token.
 * show:
 * Motif reveals itself.
 * hide:
 * Motif hides itself.
 * active:
 * Setter & Getter
 */

CreateMotif.prototype = {
    show(){
        self._guides.forEach(function(element){
            element.show();
        })
    },
    hide(){
        self._guides.forEach(function(element){
            element.hide();
        })
    },
    update(){
        if(self.active()){
            self.show();
        }
        else{
            self.hide();
        }
    },
    addGuide(guide){
        self._guides.push(guide);
    },
    removeGuide(guide){
        guide.hide();
        self._guides.forEach(function(e, i, a){
            if(e === guide){
                a.splice(i, 1);
            }
        })
    },
    get active(){return self._isActive;},
    set active(status){self._isActive = status;},
    get start(){return self._start;},
    set start(time){self._start = time;},
    get end(){return self._end;},
    set end(time){self._end = time;}
};
