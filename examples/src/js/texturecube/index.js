import {
	Renderer,
	Scene,
	PerspectiveCamera,
	GridHelper,
	OrbitControls,
	AxisHelper,
	OrthographicCamera,
	TextureCube,
	BoxGeometry,
	Shader,
	Mesh,
	ObjLoader,
	Geometry,
	Color,
	PointLight,
	DirectionalLight,
} from 'index';

// Renderer
const renderer = new Renderer({
	ratio: window.innerWidth / window.innerHeight,
});
renderer.setDevicePixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.canvas);

// Scene
const scene = new Scene();

// Camera
const cameras = {
	dev: new PerspectiveCamera({
		fov: 45,
	}),
	main: new OrthographicCamera({
		fov: 45,
	}),
};

cameras.dev.position.set(10, 5, 10);
cameras.dev.lookAt();

cameras.main.position.set(0, 0, 1);
cameras.main.lookAt(0, 0, 0);

// Helpers
const controls = new OrbitControls(cameras.dev, renderer.canvas);

const grid = new GridHelper(10);
scene.add(grid);

const axis = new AxisHelper(1);
scene.add(axis);

controls.update();

const texture = new TextureCube({
	src: [
		'/assets/textures/cube/px.jpg',
		'/assets/textures/cube/nx.jpg',
		'/assets/textures/cube/py.jpg',
		'/assets/textures/cube/ny.jpg',
		'/assets/textures/cube/pz.jpg',
		'/assets/textures/cube/nz.jpg',
	],
});

// const geometry = new BoxGeometry(1, 1, 1);
// const material = new Shader({
// 	name: 'Box',
// 	hookFragmentPre: `
// 		uniform samplerCube uTexture0;
// 	`,
// 	hookFragmentMain: `
// 		color = textureCube(uTexture0, vPosition).rgb;
// 	`,
// 	uniforms: {
// 		uTexture0: {
// 			type: 'tc',
// 			value: texture.texture,
// 		},
// 	},
// });
// const box = new Mesh(geometry, material);
// scene.add(box);


const directionalLight = new DirectionalLight();

directionalLight.position.set(1, 1, 1);

scene.add(directionalLight);

const pointLight0 = new PointLight();
const pointLight1 = new PointLight();
const pointLight2 = new PointLight();
scene.add(pointLight0);
scene.add(pointLight1);
scene.add(pointLight2);

const lights = [
	pointLight0,
	pointLight1,
	pointLight2,
];

pointLight0.uniforms.color.value[0] = Math.random();
pointLight0.uniforms.color.value[1] = Math.random();
pointLight0.uniforms.color.value[2] = Math.random();

pointLight1.uniforms.color.value[0] = Math.random();
pointLight1.uniforms.color.value[1] = Math.random();
pointLight1.uniforms.color.value[2] = Math.random();

pointLight2.uniforms.color.value[0] = Math.random();
pointLight2.uniforms.color.value[1] = Math.random();
pointLight2.uniforms.color.value[2] = Math.random();

let mesh;

new ObjLoader('assets/models/mass.obj').then(objGeometry => {
	const geometry = new Geometry(objGeometry.vertices,
		objGeometry.indices, objGeometry.vertexNormals);

	const material = new Shader({
		hookVertexPre: `
			out vec3 vTexturePosition;
		`,
		hookVertexEnd: `
			vTexturePosition = (uModelMatrix * vec4(aVertexPosition, 1.0)).xyz;
		`,
		hookFragmentPre: `
			uniform samplerCube uTexture0;
			in vec3 vTexturePosition;
		`,
		hookFragmentMain: `
			color = texture(uTexture0, vTexturePosition).rgb;
		`,
		pointLights: [pointLight0.uniforms, pointLight1.uniforms, pointLight2.uniforms],
		uniforms: {
			uTexture0: {
				type: 'tc',
				value: texture.texture,
			},
		},
	});

	mesh = new Mesh(geometry, material);

	const scale = 0.25;
	mesh.scale.set(scale, scale, scale);
	scene.add(mesh);

	// gui.add(mesh.position, 'y', -10, 10);

	// const normalsHelper = new NormalsHelper(mesh);
	// scene.add(normalsHelper);
}).catch(error => {
	console.log('error loading', error);
});

function resize() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	renderer.setSize(width, height);
}
resize();

window.addEventListener('resize', resize);

function update(time) {
	requestAnimationFrame(update);

	if (mesh) {
		mesh.rotation.y += 0.003;
	}

	const radius = 20;
	const t = time * 0.0005;

	lights.forEach((light, i) => {
		const theta = (i / lights.length) * Math.PI * 2;
		const x = Math.cos(t + theta) * radius;
		const y = Math.cos(t + theta) * radius;
		const z = Math.sin(t + theta) * radius;
		light.position.set(x, y, z);
	});

	renderer.render(scene, cameras.dev);
}
update();
