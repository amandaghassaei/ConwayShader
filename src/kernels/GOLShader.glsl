precision lowp float;

varying vec2 uv;
uniform sampler2D u_state;
uniform vec2 u_pxSize;

void main() {
	float currentState = texture2D(u_state, uv).r;

	int count = 0;
	for (int i = -1; i < 2; i++) {
		for (int j =- 1; j < 2; j++) {
			if (i == 0 && j == 0) continue;
			vec2 neighborUV = uv + vec2(u_pxSize.x * float(i), u_pxSize.y * float(j)); // TODO: need float()?
			if (texture2D(u_state, neighborUV).r == 1.0) count++;
		}
	}

	// https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules
	if (count == 3 || (currentState == 1.0 && count == 2)) {
		gl_FragColor = vec4(1);
		return;
	}
	gl_FragColor = vec4(0, 0, 0,1);
}