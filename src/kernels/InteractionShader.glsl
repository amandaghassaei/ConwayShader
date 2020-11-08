precision lowp float;

varying vec2 uv_local;
uniform sampler2D u_noiseLookup;

void main() {
	float state = texture2D(u_noiseLookup, uv_local).r;
	gl_FragColor = vec4(state, 0, 0, 1);
}
