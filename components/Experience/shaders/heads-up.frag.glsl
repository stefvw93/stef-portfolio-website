varying vec2 vUv;

uniform float uAspect;
uniform float uNoiseMix;
uniform float uNoiseScale;
uniform float uSharpness;
uniform float uSpread;
uniform float uTime;
uniform float uWidth;
uniform vec2 uSpeed;
uniform vec3 uColor;

#pragma glslify: cnoise = require('./noise')

void main() {
  float noise = cnoise(vec3(
    vUv.x * uNoiseScale * uAspect + uTime * uSpeed.x,
    vUv.y * uNoiseScale + uTime * uSpeed.y,
    1.0
  ));

  vec2 a = vec2(uWidth);
  vec2 b = vec2(uWidth + uSpread, (uWidth + uSpread) * uAspect);
  vec2 c = vec2(1);
  vec2 border = smoothstep(a, b, vUv) * smoothstep(a, b, c - vUv);
  float alpha = 1.0 - border.x * border.y;
  alpha = mix(noise, alpha, uNoiseMix);
  alpha = smoothstep(0.5 * uSharpness, 0.5, alpha);

  gl_FragColor = vec4(uColor, alpha);
}