import * as THREE from 'three';
import {PerspectiveCamera} from "three/src/cameras/PerspectiveCamera";
import {RootElement} from "../../../index";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

class SceneController {
    private readonly canvasID;
    private readonly fov;
    public scene: THREE.Scene;
    // private stats: Stats;
    public camera: PerspectiveCamera;
    private controls: OrbitControls;
    private renderer: THREE.WebGLRenderer;
    private clock!: THREE.Clock;
    private uniforms!: Record<string, THREE.IUniform & { type?: string }>;

    /**
     * Constructs a new Scene controller for the Rubik's cube.
     * @param canvasID      the id of the HTML Canvas Element in the DOM
     * @param camera        the Camera of the Three JS
     * @param scene         the scene of the Three JS
     // * @param stats         the Stats of the Three JS
     * @param controls      the controls of the Three JS
     * @param renderer      the Renderer of the Three JS
     * @param fov           Camera frustum vertical field of view
     */
    constructor(
        canvasID: string,
        camera?: THREE.PerspectiveCamera,
        scene?: THREE.Scene,
        // stats?: Stats,
        controls?: OrbitControls,
        renderer?: THREE.WebGLRenderer,
        fov: number = 36,
    ) {
        this.canvasID = canvasID;
        this.scene = scene as THREE.Scene;
        // this.stats = stats as Stats;
        this.camera = camera as THREE.PerspectiveCamera;
        this.controls = controls as OrbitControls;
        this.renderer = renderer as THREE.WebGLRenderer;
        this.fov = fov;
    }

    /**
     * Initializes the Scene of the Rubik's Cube.
     */
    initScene() {
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            window.innerWidth / window.innerHeight,
            1,
            1000,
        );
        this.camera.position.z = 196;

        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();

        // Declare uniforms to pass into global shaders.
        this.uniforms = {
            u_time: {type: 'f', value: 1.0},
            colorB: {type: 'vec3', value: new THREE.Color(0xfff000)},
            colorA: {type: 'vec3', value: new THREE.Color(0xffffff)},
        };

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById(this.canvasID) as HTMLCanvasElement,
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        RootElement.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxDistance = 800;
        this.controls.minDistance = 200;

        // this.stats = Stats();
        // document.body.appendChild(this.stats.dom);

        // ambient light which is for the whole scene
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        ambientLight.castShadow = true;
        this.scene.add(ambientLight);

        // spotlight which is illuminating the chart directly
        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.castShadow = true;
        spotLight.position.set(0, 64, 32);
        this.scene.add(spotLight);

        // if window resizes
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    /**
     * Starts the animation of the Scene.
     */
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
        // this.stats.update();
        this.controls.update();
    }

    /**
     * Renders the scene and the camera.
     */
    render() {
        // Update uniform data on each render.
        this.uniforms.u_time.value += this.clock.getDelta();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Changes the size of the camera and the renderer of this scene.
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export default SceneController;
