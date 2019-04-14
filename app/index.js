/**
 * ASSETS
 */

/**
 * ASSETS
 */
/**
 * BABYLON IMPORTS
 */

/**
 * BABYLON IMPORTS
 */
/**
 * LOCAL IMPORTS
 */
import { scene } from './scene';
import { Motif } from './motifs';
import { Guides } from "./guides";
import {timeControl} from "./timeline";

(function(){
    new Motif({
        name: 'Sahne 1',
        start: 0,
        end: 2
    });
    new Motif({
        name: 'Sahne 2',
        start: 6,
        end: 8
    });
    Guides.create.CircleGuide();
})();

//new Motif({name: asd, start:0, end: 2});

/**
 * LOCAL IMPORTS
 */

/**
 * Initialization step for;
 * scene, timeline, players, music, motif, guide, GUI objects.
 */

/**
 * Scene initialization steps:
 *  Get canvas element.
 *  Create and bind an engine to canvas element.
 *  Create and bind a scene to engine.
 *  Add a ground object.
 *  Add pickingPlane and parentMesh for mesh operations.
 *  Add environmental objects.
 */

/**
 * Timeline initialization steps:
 *  Create main timeline object: timeControl.timeline
 *  test
 */

/**
 * Players initialization steps:
 *  Create required amounts of players and add them to scene.
 *  Place them side by side on the scene, near the ground.
 *  Add timeline data to players and assign their timeline to timeControl.timeline.
 */

/**
 * Motif initialization steps:
 *  Create motifs control object.
 *  Load selected motif data and create motif objects.
 */

/**
 * Guide initialization steps:
 *  Load selected guide data.
 *  Create guide objects and bind them to motif.
 */

/**
 * GUI initialization steps:
 *  Create main GUI object called "UI".
 *  Create leftPanel, rightPanel and bottomPanel.
 *  Create main slider.
 *  Create buttons and bind them to panels.
 */

/**
 * Music initialization steps:
 *  Create music object.
 *  Add synchronization between timeline, slider and music.
 */

/**
 * Button creation process.
 * leftPanel buttons are;
 * rightPanel buttons are;
 * bottomPanel buttons are;
 */

/**
 * Event handlers initalization steps:
 *
 *
 */