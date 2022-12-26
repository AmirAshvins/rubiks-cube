import {useCallback, useEffect, useMemo} from "react";
import SceneController from "../../../core/models/in-app/SceneController";
import RubiksCube, {RubiksCubeSizes} from "../../../core/models/in-app/RubiksCube";
import * as THREE from "three";


const RubikCubeView = () => {
    const id = useMemo(() => 'scene-canvas', []);

    const randomlyMoveCubes = useCallback((rubiksCube: RubiksCube) => {
        for (const child of rubiksCube.rubiksCubeGroup.children) {
            rubiksCube.highlightCubes(child);
            const rotatingKeys = Array(Math.ceil(Math.random() * (100 - 10 + 1) + 10)).fill(null).map((_, i) => {
                const random = Math.random();
                if (random < 0.16) {
                    return 'q'
                } else if (random < 0.33) {
                    return 'w'
                } else if (random < 0.5) {
                    return 'e'
                } else if (random < 0.66) {
                    return 'a'
                } else if (random < 0.83) {
                    return 's'
                } else {
                    return 'd'
                }
            })
            for (const rotatingKey of rotatingKeys) {
                rubiksCube.onKeyDown({key: rotatingKey}, true);
            }
        }
    }, [])

    /**
     * Rotates the cube as the user puts down the mouse.
     */
    const onMouseDown = useCallback((event: MouseEvent, mouse: THREE.Vector2, controller: SceneController, rayCaster: THREE.Raycaster, rubiksCube: RubiksCube) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        rayCaster.setFromCamera(mouse, controller.camera);
        const objects = rayCaster.intersectObjects(rubiksCube.rubiksCubeGroup.children);
        const cubeObjects = objects.filter((c) => c.object.type === 'Mesh');
        if (cubeObjects.length > 0)
            rubiksCube.highlightCubes(cubeObjects[0].object);
    }, []);

    /**
     * Highlights the cube that the mouse event is pointing to.
     */
    const onKeyDown = useCallback((event: KeyboardEvent, rubiksCube: RubiksCube) => {
        if (event.repeat)
            return;
        rubiksCube.onKeyDown(event);
    }, []);

    /**
     * As soon as the component is mounted:
     * - creates the scene controller and Rubik's cube in the DOM.
     */
    useEffect(() => {
        const controller = new SceneController(id);
        controller.initScene();
        controller.animate();

        const rubiksCube = new RubiksCube(RubiksCubeSizes.cube3x3);
        controller.scene.add(rubiksCube.rubiksCubeGroup);
        randomlyMoveCubes(rubiksCube);

        const mouse = new THREE.Vector2();
        const rayCaster = new THREE.Raycaster();

        const _onMouseDown = (e: MouseEvent) => onMouseDown(e, mouse, controller, rayCaster, rubiksCube);
        const _onKeyDown = (e: KeyboardEvent) => onKeyDown(e, rubiksCube);

        window.addEventListener('mousedown', _onMouseDown);
        window.addEventListener('keydown', _onKeyDown);
        return () => {
            window.removeEventListener('mousedown', _onMouseDown);
            window.removeEventListener('keydown', _onKeyDown);
        }
    }, [id, onKeyDown, onMouseDown, randomlyMoveCubes]);

    return (
        <>
            <canvas id={id}/>
        </>
    );
}

export default RubikCubeView;
