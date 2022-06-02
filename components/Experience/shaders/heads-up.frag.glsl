varying vec2 vUv;

uniform float uNoiseScale;
uniform float uTime;
uniform float uAspect;
uniform vec2 uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;

#pragma glslify: cnoise = require('./noise')

void main() {
  float noise = cnoise(vec3(
    vUv.x * uNoiseScale,
    vUv.y * uNoiseScale,
    uTime * uSpeed
  ));

  vec3 value = mix(uColor1, uColor2, noise);

  gl_FragColor = vec4(value, 0.5);
}