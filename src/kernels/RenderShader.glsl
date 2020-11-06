precision lowp float;

varying vec2 uv;
uniform sampler2D u_state;

void main() {
	float currentState = texture2D(u_state, uv).r;
	gl_FragColor = vec4(currentState, currentState, currentState, 1);
}