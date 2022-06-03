varying vec2 vUv;
varying float vZ;

uniform float uFragmentation;
uniform float uNoiseScale;
uniform float uTime;
uniform vec2 uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform sampler2D uAlphaMap;
uniform float uDentSize;

#pragma glslify: cnoise = require('./noise')

void main() {
  vec4 alphaMap = texture2D(uAlphaMap, vUv);
  vec2 time = uSpeed * uTime;
  float displacement = vUv.y * uNoiseScale + sin((vUv.x * uNoiseScale) + time.x);
  float a = cnoise((vec3(displacement, time.y, 0.0)) * uNoiseScale);
  float strength = mod(a * uFragmentation, 1.0);

  gl_FragColor = vec4(mix(uColor1, uColor2, vec3(strength)), alphaMap.r);
  // gl_FragColor = vec4(mix(uColor1, uColor2, vec3(strength)), 1.0);
  gl_FragColor = mix(gl_FragColor, vec4(vec3(1.0), 0.0), vZ);
  // gl_FragColor = vec4(vec3(uDentSize), 1.0);
}