import * as THREE from 'three';

/**
 * Represents a single cube of the Rubik's cube.
 */
class Cube {
    public readonly cubeGroup: THREE.Group;
    public readonly uniforms: Record<string, THREE.IUniform & { type?: string }>;
    public readonly cubeMesh: THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial>;
    private readonly lineMesh: THREE.LineSegments<THREE.EdgesGeometry<THREE.BoxGeometry>, THREE.LineBasicMaterial>;

    /**
     * Constructs a cube for the Rubik's cube with the provided position properties.
     * @param xOffset   the horizontal offset of the cube in the plain.
     * @param yOffset   the vertical offset of the cube in the plain.
     * @param zOffset   the diagonal offset of the cube in the plain.
     */
    constructor(
        xOffset: number,
        yOffset: number,
        zOffset: number,
    ) {
        this.cubeGroup = new THREE.Group();
        this.uniforms = {
            opacity: {
                type: 'f',
                value: 1.0,
            },
        };

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: this.uniforms,
            vertexShader: this.vertexShader(),
            fragmentShader: this.fragmentShader(),
        });
        this.cubeMesh = new THREE.Mesh(geometry, material);

        const lineEdges = new THREE.EdgesGeometry(this.cubeMesh.geometry);
        const lineMaterial = new THREE.LineBasicMaterial({color: '#000000'});
        this.lineMesh = new THREE.LineSegments(lineEdges, lineMaterial);

        this.cubeGroup.add(this.cubeMesh);
        this.cubeGroup.add(this.lineMesh);
        this.cubeGroup.position.x = xOffset;
        this.cubeGroup.position.y = yOffset;
        this.cubeGroup.position.z = zOffset;
    }

    /**
     * Creates a vortex shader of the cube
     */
    private vertexShader(): string {
        return `
	uniform float opacity;

    varying vec3 pos;

    void main() {
    	pos = position;

		gl_Position = projectionMatrix
			* modelViewMatrix
			* vec4(
				position.x,
				position.y,
				position.z,
				1.0
			);
    }
  `;
    };

    /**
     * Creates a fragment shader of the cube
     */
    private fragmentShader(): string {
        return `
	uniform float opacity;

    varying vec3 pos;

    void main() {
		vec4 red = vec4(1.0, 0.0, 0.0, opacity);
		vec4 white = vec4(1.0, 1.0, 1.0, opacity);
		vec4 blue = vec4(0.0, 0.0, 1.0, opacity);
		vec4 yellow = vec4(1.0, 1.0, 0.0, opacity);
		vec4 green = vec4(0.0, 1.0, 0.0, opacity);
		vec4 orange = vec4(1.0, 0.65, 0.0, opacity);

		vec4 black = vec4(0.0, 0.0, 0.0, opacity);

		float scale = 0.499;

		bool front = pos.z > scale;
		bool back = pos.z < -1.0 * scale;
		bool top = pos.y > scale;
		bool bottom = pos.y < -1.0 * scale;
		bool right = pos.x > scale;
		bool left = pos.x < -1.0 * scale;

		if (front) {
    		gl_FragColor = red;
		} else if (back) {
    		gl_FragColor = orange;
		} else if (top) {
			gl_FragColor = white;
		} else if (bottom) {
			gl_FragColor = yellow;
		} else if (right) {
			gl_FragColor = blue;
	 	} else if (left) {
			gl_FragColor = green;
		} else {
			gl_FragColor = black;
		}
    }
  `;
    };
}


export default Cube;
