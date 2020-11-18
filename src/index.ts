import { GLCompute } from 'glcompute';
const golShaderSource = require('./kernels/GOLShader.glsl');
const renderShaderSource = require('./kernels/RenderShader.glsl');
const interactionShaderSource = require('./kernels/InteractionShader.glsl');

const canvas = document.getElementById('glcanvas')  as HTMLCanvasElement;
const glcompute = new GLCompute(null, canvas, { antialias: false });

// Init programs.
const gol = glcompute.initProgram('gol', golShaderSource, [
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
const render = glcompute.initProgram('render', renderShaderSource, [
	{
		name: 'u_state',
		value: 0,
		dataType: 'INT',
	},
]);
const interaction = glcompute.initProgram('interaction', interactionShaderSource, [
	{
		name: 'u_noiseLookup',
		value: 0,
		dataType: 'INT',
	},
]);

// Make a random array of 1's and 0's.
function makeRandomArray(length: number, probability = 0.1) {
	const array = new Uint8Array(length);
	for (let i = 0, length = array.length; i < length; i++) {
		array[i] = Math.random() < probability ? 255 : 0;
	}
	return array;
}

// Init state.
const state = glcompute.initDataLayer('state', {
	dimensions: [canvas.clientWidth, canvas.clientHeight],
	type: 'uint8',
	numComponents: 1,
	data: makeRandomArray(canvas.clientWidth * canvas.clientHeight),
	filter: 'NEAREST',
}, true, 2); // Use two buffers, one for this state, one for last state.
onResize();
window.addEventListener('resize', onResize);
function onResize() {
	// Re-init textures at new size.
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	state.resize([width, height], makeRandomArray(width * height));
	gol.setUniform('u_pxSize', [1 / width, 1 / height], 'FLOAT');
	glcompute.onResize(canvas);
}

// Set up interactions.
const TOUCH_RADIUS = 10;
// Create a lookup texture for adding noise on interaction.
const noise = glcompute.initDataLayer('noise',
	{
		dimensions: [TOUCH_RADIUS * 2, TOUCH_RADIUS * 2],
		type: 'uint8',
		numComponents: 1,
		data: makeRandomArray(4 * TOUCH_RADIUS * TOUCH_RADIUS, 0.5),
		filter: 'NEAREST',
	},
);
canvas.addEventListener('mousemove', (e: MouseEvent) => {
	glcompute.stepCircle(interaction, [e.clientX, canvas.clientHeight - e.clientY], TOUCH_RADIUS, [noise], state);
});
canvas.addEventListener('touchmove', (e: TouchEvent) => {
	e.preventDefault();
	for (let i = 0; i < e.touches.length; i++) {
		const touch = e.touches[i];
		glcompute.stepCircle(interaction, [touch.pageX, canvas.clientHeight - touch.pageY], TOUCH_RADIUS, [noise], state);
	}
});
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

// Start render loop.
window.requestAnimationFrame(step);
function step() {
	// Compute rules.
	glcompute.step(gol, [state], state);
	// Render current state.
	glcompute.step(render, [state]);
	// Start a new render cycle.
	window.requestAnimationFrame(step);
}