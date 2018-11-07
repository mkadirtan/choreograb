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

export let Motifs = {
    self: this,
    _current: null,
    _next: null,
    _previous: null,
    _motifs: [],
    _scene: null,
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
    motifs: function(motifs){
        if(!motifs){
            return this._motifs;
        }else{
            this._motifs = motifs;
        }
    },
    current: function(motif){
        if(!motif){
            return this._current;
        }else{
            this._current = motif;
        }
    },
    previous: function(motif){
        if(!motif){
            return this._previous;
        }else{
            this._previous = motif;
        }
    },
    next: function(motif){
        if(!motif){
            return this._next;
        }else{
            this._next = motif;
        }
    },
    scene: function(scene){
        if(!scene){
            return this._scene;
        }else{
            this._scene = scene;
        }
    },
};

/**
 * Motif objects have properties for
 * name, start & end time, guides.
 * "active" token called _isActive.
 */

export function CreateMotif(name,scene){
    this.name = name;
    this._isActive = false;
    this._start = 0;
    this._end = 0;
    this._guides = [];
    this._scene = scene;
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
    show: function(){
        this.guides().forEach(function(element){
            element.show();
        })
    },
    hide: function(){
        this.guides().forEach(function(element){
            element.hide();
        })
    },
    update: function(){
        if(this.active()){
            this.show();
        }
        else{
            this.hide();
        }
    },
    addGuide: function(guide){
        this.guides().push(guide);
    },
    removeGuide: function(guide){
        guide.hide();
        this.guides().forEach(function(e, i, a){
            if(e === guide){
                a.splice(i, 1);
            }
        })
    },
    active: function(status){
        if(!status){
            return this._isActive;
        }
        else{
            this._isActive = status;
        }
    },
    start: function(time){
        if(!time){
            return this._start;
        }
        else{
            this._start = time;
        }
    },
    end: function(time){
        if(!time){
            return this._end;
        }
        else{
            this._end = time;
        }
    },
    guides: function(guides){
        if(!guides){
            return this._guides;
        }
        else{
            this._guides = guides;
        }
    },
    scene: function(scene){
        if(!scene){
            return this._scene;
        }
        else{
            this._scene = scene;
        }
    }
};
