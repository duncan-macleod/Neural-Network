uniform float opacityMultiplier;

attribute float opacity;

varying float vOpacity;

void main() {
	vOpacity = 0.1;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );

}
