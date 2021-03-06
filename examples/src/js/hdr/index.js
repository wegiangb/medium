import {
	GL,
	Renderer,
	Scene,
	PerspectiveCamera,
	Mesh,
	Shader,
	PlaneGeometry,
	GridHelper,
	OrbitControls,
	AxisHelper,
	Texture,
} from 'index';
const { gui, guiController } = require('../gui')(['webgl2']);

// Renderer
const renderer = new Renderer({
	ratio: window.innerWidth / window.innerHeight,
	prefferedContext: guiController.context,
});
renderer.setDevicePixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.canvas);

// Scene
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera({
	fov: 45,
});

camera.position.set(10, 5, 10);
camera.lookAt();

// Objects
let colors = [];
colors = colors.concat([1, 0, 0]);
colors = colors.concat([0, 1, 0]);
colors = colors.concat([0, 0, 1]);
colors = colors.concat([1, 1, 0]);

const texture0 = new Texture({
	src: '/assets/textures/cube/pisa-hdr/nx.hdr',
});

const geometry = new PlaneGeometry(1, 1, colors);
const material = new Shader({
	name: 'Plane',
	hookFragmentPre: `
		uniform sampler2D uTexture0;
		uniform float uMix;
	`,
	hookFragmentMain: GL.webgl2 ?
	'color = texture(uTexture0, vUv).rgb;' :
	'color = texture2D(uTexture0, vUv).rgb;',
	uniforms: {
		uMix: {
			type: 'f',
			value: 0.5,
		},
		uTexture0: {
			type: 't',
			value: texture0.texture,
			textureIndex: 0,
		},
	},
});

const plane = new Mesh(geometry, material);
scene.add(plane);

gui.add(plane.shader.uniforms.uMix, 'value', 0, 1);

// Helpers
const controls = new OrbitControls(camera, renderer.canvas);

const grid = new GridHelper(10);
scene.add(grid);
//
const axis = new AxisHelper(1);
scene.add(axis);

controls.update();

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	renderer.setSize(width, height);
}
resize();

window.addEventListener('resize', resize);

function update() {
	requestAnimationFrame(update);
	renderer.render(scene, camera);
}
update();
