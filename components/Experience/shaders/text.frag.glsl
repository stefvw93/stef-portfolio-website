varying vec2 vUv;

uniform float uFragmentation;
uniform float uNoiseScale;
uniform float uTime;
uniform vec2 uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;

#pragma glslify: cnoise = require('./noise')

void main() {
  vec2 time = uSpeed * uTime;
  float displacement = vUv.y * uNoiseScale + sin((vUv.x * uNoiseScale) + time.x);
  float a = cnoise((vec3(displacement, time.y, 0.0)) * uNoiseScale);
  float strength = mod(a * uFragmentation, 1.0);
  gl_FragColor = vec4(mix(uColor1, uColor2, vec3(strength)), 1.0);
}