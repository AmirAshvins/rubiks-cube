import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import Cube from './Cube';

export enum RubiksCubeSizes {
    'cube2x2' = 'cube2x2',
    'cube3x3' = 'cube3x3',
}

class RubiksCube {
    private readonly scale: number;
    private readonly epsilon: number;
    private readonly consoleDebug: boolean;
    private selectedCube!: Cube;
    public readonly rubiksCubeGroup: THREE.Group;
    private cubes: Array<Cube>;
    private rotating: boolean;


    /**
     * Constructs a new RubiksCube.
     */
    constructor(size: RubiksCubeSizes) {
        this.scale = 20;
        this.epsilon = 0.5;
        this.consoleDebug = true;
        this.cubes = [];
        this.rubiksCubeGroup = new THREE.Group();
        this.rotating = false;

        this.rubiksCubeGroup.scale.x = this.scale;
        this.rubiksCubeGroup.scale.y = this.scale;
        this.rubiksCubeGroup.scale.z = this.scale;

        this.rubiksCubeGroup.rotation.x = Math.PI / 7;
        this.rubiksCubeGroup.rotation.y = -Math.PI / 4;

        this.initializeRubiksCube(size);
        this.animate();
    }

    /**
     * The text mapping of the Rubik's Cube's controls.
     */
    private get textMapping(): Record<string, string> {
        return {
            w: 'W: rotate up',
            s: 'S: rotate down',
            a: 'A: rotate left',
            d: 'D: rotate right',
            q: 'Q: rotate face left',
            e: 'E: rotate face right',
        };
    }

    /**
     * Initializes the cubes of this Rubik's cube.
     * @param size      the size of this Rubik's cube
     */
    private initializeRubiksCube(size: RubiksCubeSizes) {
        switch (size) {
            case RubiksCubeSizes.cube2x2:
                this.cubes = [
                    // Front 2x2.
                    new Cube(-1, 1, 1),
                    new Cube(1, 1, 1),
                    new Cube(-1, -1, 1),
                    new Cube(1, -1, 1),

                    // Back 2x2.
                    new Cube(-1, 1, -1),
                    new Cube(1, 1, -1),
                    new Cube(-1, -1, -1),
                    new Cube(1, -1, -1),
                ];
                break;
            case RubiksCubeSizes.cube3x3:
                this.cubes = [
                    // Front face.
                    new Cube(-1, 1, 1),
                    new Cube(0, 1, 1),
                    new Cube(1, 1, 1),
                    new Cube(-1, 0, 1),
                    new Cube(0, 0, 1),
                    new Cube(1, 0, 1),
                    new Cube(-1, -1, 1),
                    new Cube(0, -1, 1),
                    new Cube(1, -1, 1),

                    // Middle face.
                    new Cube(-1, 1, 0),
                    new Cube(0, 1, 0),
                    new Cube(1, 1, 0),
                    new Cube(-1, 0, 0),
                    new Cube(0, 0, 0),
                    new Cube(1, 0, 0),
                    new Cube(-1, -1, 0),
                    new Cube(0, -1, 0),
                    new Cube(1, -1, 0),

                    // Back face.
                    new Cube(-1, 1, -1),
                    new Cube(0, 1, -1),
                    new Cube(1, 1, -1),
                    new Cube(-1, 0, -1),
                    new Cube(0, 0, -1),
                    new Cube(1, 0, -1),
                    new Cube(-1, -1, -1),
                    new Cube(0, -1, -1),
                    new Cube(1, -1, -1),
                ];
                break;
        }

        for (const cube of this.cubes) {
            this.rubiksCubeGroup.add(cube.cubeGroup);
        }
        this.selectedCube = this.cubes[0];
    }

    /**
     * Starts the animation of this Rubik's Cube.
     * @param time     used to describe a discrete point in time or a time interval
     */
    private animate(time?: number) {
        TWEEN.update(time);
        requestAnimationFrame(this.animate.bind(this));
    }

    /**
     * Rotates this Rubik's cube along the World axis (current axis).
     * @param cubeGroup
     * @param axis
     * @param noAnimation
     */
    private rotateAroundWorldAxis(cubeGroup: Cube['cubeGroup'], axis: THREE.Vector3, noAnimation?: boolean) {
        const start = {rotation: 0};
        const prev = {rotation: 0};
        const end = {rotation: Math.PI / 2};

        if (noAnimation) {
            cubeGroup.position.applyAxisAngle(axis, end.rotation - start.rotation);
            cubeGroup.rotateOnWorldAxis(axis, end.rotation - start.rotation);
            return;
        }

        const tween = new TWEEN.Tween(start)
            .to(end, 300)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onStart(() => {
                this.rotating = true;
            })
            .onUpdate(({rotation}) => {
                // Move the position of a cube and Rotate the cube on the world axis.
                cubeGroup.position.applyAxisAngle(axis, rotation - prev.rotation);
                cubeGroup.rotateOnWorldAxis(axis, rotation - prev.rotation);
                // Keep track of the previous rotation for tweening.
                prev.rotation = rotation;
            })
            .onComplete(() => {
                this.rotating = false;
            })
            .onStop(() => {
                this.rotating = false;
            });

        tween.start();
    }

    /**
     * Determines how the cube should react to the provided keyboard event.
     * @param event
     * @param noAnimation
     */
    public onKeyDown(event: KeyboardEvent | { key: string }, noAnimation?: boolean) {
        if (this.rotating)
            return;
        switch (event.key) {
            case 'w': {
                this.displayKey(event.key);
                const axis = new THREE.Vector3(-1, 0, 0);
                for (const cube of this.cubes) {
                    if (this.cubeInSameX(cube, this.selectedCube!)) {
                        this.rotateAroundWorldAxis(cube.cubeGroup, axis, noAnimation);
                    }
                }
                break;
            }
            case 'a': {
                this.displayKey(event.key);
                const axis = new THREE.Vector3(0, -1, 0);
                for (const cube of this.cubes) {
                    if (this.cubeInSameY(cube, this.selectedCube))
                        this.rotateAroundWorldAxis(cube.cubeGroup, axis, noAnimation);
                }
                break;
            }
            case 's': {
                this.displayKey(event.key);
                const axis = new THREE.Vector3(1, 0, 0);
                for (const cube of this.cubes) {
                    if (this.cubeInSameX(cube, this.selectedCube))
                        this.rotateAroundWorldAxis(cube.cubeGroup, axis, noAnimation);
                }
                break;
            }
            case 'd': {
                this.displayKey(event.key);
                const axis = new THREE.Vector3(0, 1, 0);
                for (const cube of this.cubes) {
                    if (this.cubeInSameY(cube, this.selectedCube))
                        this.rotateAroundWorldAxis(cube.cubeGroup, axis, noAnimation);
                }
                break;
            }
            case 'q': {
                this.displayKey(event.key);
                const axis = new THREE.Vector3(0, 0, 1);
                for (const cube of this.cubes) {
                    if (this.cubeInSameZ(cube, this.selectedCube))
                        this.rotateAroundWorldAxis(cube.cubeGroup, axis, noAnimation);
                }
                break;
            }
            case 'e': {
                this.displayKey(event.key);
                const axis = new THREE.Vector3(0, 0, -1);
                for (const cube of this.cubes) {
                    if (this.cubeInSameZ(cube, this.selectedCube))
                        this.rotateAroundWorldAxis(cube.cubeGroup, axis, noAnimation);
                }
                break;
            }
        }
    }

    /**
     * Determines whether the two given cubes are in the same vertical axis.
     * @param c1    the first cube.
     * @param c2    the second cube.
     */
    private cubeInSameY(c1: Cube, c2: Cube) {
        return (
            c1.cubeGroup.position.y > c2.cubeGroup.position.y - this.epsilon &&
            c1.cubeGroup.position.y < c2.cubeGroup.position.y + this.epsilon
        );
    }

    /**
     * Determines whether the two given cubes are in the same horizontal axis.
     * @param c1    the first cube.
     * @param c2    the second cube.
     */
    private cubeInSameX(c1: Cube, c2: Cube) {
        return (
            c1.cubeGroup.position.x > c2.cubeGroup.position.x - this.epsilon &&
            c1.cubeGroup.position.x < c2.cubeGroup.position.x + this.epsilon
        );
    }

    /**
     * Determines whether the two given cubes are in the same diagonal axis.
     * @param c1    the first cube.
     * @param c2    the second cube.
     */
    private cubeInSameZ(c1: Cube, c2: Cube) {
        return (
            c1.cubeGroup.position.z > c2.cubeGroup.position.z - this.epsilon &&
            c1.cubeGroup.position.z < c2.cubeGroup.position.z + this.epsilon
        );
    }

    /**
     * Displays the text associated with the provided [key] in the console.
     * @param key   the key of the keyboard event
     */
    private displayKey(key: KeyboardEvent["key"]) {
        if (this.consoleDebug) {
            console.log(this.getText(key));
        }
    }

    /**
     * Fetches the text associate with he provided [key].
     * @param key   the key of the keyboard event
     */
    private getText(key: KeyboardEvent["key"]) {
        return this.textMapping[key] || '';
    }

    /**
     * Highlights the provided cube and blurs all the other ones.
     * @param cubeToHighlight
     */
    public highlightCubes(cubeToHighlight: THREE.Object3D) {
        for (const cube of this.cubes) {
            if (cube.cubeMesh.uuid === cubeToHighlight.uuid) {
                this.selectedCube = cube;
                cube.uniforms.opacity.value = 0.5;
            } else {
                cube.uniforms.opacity.value = 1.0;
            }
        }
    }

}

export default RubiksCube;
