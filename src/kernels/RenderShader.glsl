precision lowp float;

varying vec2 vUV;
uniform sampler2D u_state;

void main() {
	float currentState = texture2D(u_state, vUV).r;
	gl_FragColor = vec4(currentState, currentState, currentState, 1);
}