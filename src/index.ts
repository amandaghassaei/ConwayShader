import { GPGPU } from 'webgl-gpgpu';
const golShaderSource = require('./kernels/GOLShader.glsl');
const renderShaderSource = require('./kernels/RenderShader.glsl');
const interactionShaderSource = require('./kernels/InteractionShader.glsl');

const canvas = document.getElementById('glcanvas')  as HTMLCanvasElement;
const gpgpu = new GPGPU(null, canvas);

gpgpu.initProgram('gol', golShaderSource, [
	{
		name: 'u_state',
		value: 0,
		dataType: 'INT',
	},
	{
		name: 'u_pxSize',
		value: [1 / canvas.clientWidth, 1 / canvas.clientHeight],
		dataType: 'FLOAT',
	},
]);
gpgpu.initProgram('render', renderShaderSource, [
	{
		name: 'u_state',
		value: 0,
		dataType: 'INT',
	},
]);
gpgpu.initProgram('interaction', interactionShaderSource, [
	{
		name: 'u_noiseLookup',
		value: 0,
		dataType: 'INT',
	},
]);

// Set up interactions.
const TOUCH_RADIUS = 10;
// Create a lookup texture for adding noise on interaction.
gpgpu.initTexture(
	'noiseLookup',
	TOUCH_RADIUS * 2,
	TOUCH_RADIUS * 2,
	'uint8',
	1,
	false,
	makeRandomArray(4 * TOUCH_RADIUS * TOUCH_RADIUS, 0.5),
);
window.onmousemove = (e: MouseEvent) => {
	gpgpu.stepCircle('interaction', [e.clientX, e.clientY], TOUCH_RADIUS, ['noiseLookup'], 'lastState');
};
window.ontouchmove = (e: TouchEvent) => {
	e.preventDefault();
	for (let i = 0; i < e.touches.length; i++) {
		const touch = e.touches[i];
		gpgpu.stepCircle('interaction', [touch.pageX, touch.pageY], TOUCH_RADIUS, ['noiseLookup'], 'lastState');
	}
};
// Disable other gestures.
document.addEventListener('gesturestart', disableZoom);
document.addEventListener('gesturechange', disableZoom); 
document.addEventListener('gestureend', disableZoom);
function disableZoom(e: Event) {
	e.preventDefault();
	const scale = 'scale(1)';
	// @ts-ignore
	document.body.style.webkitTransform =  scale;    // Chrome, Opera, Safari
	// @ts-ignore
	document.body.style.msTransform =   scale;       // IE 9
	document.body.style.transform = scale;
}

window.addEventListener('resize', onResize);
onResize();
window.requestAnimationFrame(step);

// Make a random array of 1's and 0's.
function makeRandomArray(length: number, probability = 0.1) {
	const array = new Uint8Array(length);
	for (let i = 0, length = array.length; i < length; i++) {
		array[i] = Math.random() < probability ? 255 : 0;
	}
	return array;
}

function onResize() {
	// Re-init textures at new size.
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const data = makeRandomArray(width * height);
	gpgpu.initTexture('currentState', width, height, 'uint8', 1, true, undefined, true);
	gpgpu.initTexture('lastState', width, height, 'uint8', 1, true, data, true);
	gpgpu.setProgramUniform('gol', 'u_pxSize', [1 / width, 1 / height], 'FLOAT');
	gpgpu.onResize(canvas);
}

function step() {
	// Compute rules.
	gpgpu.step('gol', ['lastState'], 'currentState');
	// Render current state.
	gpgpu.step('render', ['currentState']);
	// Toggle textures.
	gpgpu.swapTextures('currentState', 'lastState');
	// Start a new render cycle.
	window.requestAnimationFrame(step);
}