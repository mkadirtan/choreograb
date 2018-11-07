/**
 * loadModel imports single model to scene.
 */

/**
 * !Problem with path module and asset paths..!
 */
/*function loadModel(param){
    BABYLON.SceneLoader.ImportMeshAsync("", path.dirname(param.url), path.basename(param.url)).then(function(result){
        let loadedMesh = result.meshes[0];
        loadedMesh.name = param.name;
        loadedMesh.position = {x: 0, y: -loadedMesh.getBoundingInfo().minimum.y, z: 0};
        return character;
    })
}

let Player = loadModel({
    name: "Player",
    url: "/mesh.babylon"
});*/

export let players = [];

export function CreatePlayer(param){
    this.mesh = param.mesh;
    this.keys = [];
    this.timeline = param.timeline;
//    this.timeline = new TimelineMax()
}

CreatePlayer.prototype = {
    addKey: function(param){
        let self = this;
        self.keys.push({
            motifName: param.motifName,
            position: param.position,
            rotation: param.rotation
        });
        return self;
    },
    updateAnimation: function(motifs){
        let self = this;
        /*
         * !Erase previous timeline data here for rotation and position!
         */
        self.timeline.kill({x: true, y: true, z: true});

        /*
         * !If first motif's start time is not equal to T = 0!
         */

        motifs.forEach(function(motif, motifIndex, motifs){
            let motifFound = false;
            self.keys.forEach(function(key, keyIndex, keys){
                if(key.motifName === motif.name){
                    /*
                     * !Add animation here!
                     */
                    self.timeline.to();
                    motifFound = true;
                }
            });
            if(!motifFound){
                /*
                 * !Player doesn't change rotation or position for
                 * not keyed motifs.!
                 */
                self.timeline.to();
            }
        });
        return self;
    }
};

export function generatePlayers(count, timeFunction, timeControl, player, playerArray){
    //if(!player){
    //    player = Player;
    //}
    if(!playerArray){
        playerArray = players;
    }
    for(let i = 0; i<count; i++){
        let newPlayer = player.clone("player"+i);
        newPlayer.position.z = -3;
        newPlayer.position.x += i+1;
        playerArray.push(new CreatePlayer({
            mesh: newPlayer,
            timeline: timeFunction
        }));
        timeControl.timeline.add(players[players.length-1].timeline,0);
    }
}