varying vec2 vUv;
varying float vZ;

uniform vec2 uPointer;
uniform float uTime;
uniform vec2 uSpeed;
uniform float uDentSize;
uniform sampler2D uAlphaMap;

#pragma glslify: cnoise = require('./noise')

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float dist = distance(uPointer, modelPosition.xy);
  float offset = smoothstep(0.0, 1.0, max(0.0, .5 - dist)) * 1.0;
  float noise = cnoise((modelPosition.xyz + vec3(uTime / 6.)) * 6.) * (1. + offset);
  
  offset -= noise * 0.2;
  offset *= uDentSize;
  modelPosition.z -= offset;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
    
  vUv = uv;
  vZ = offset;
  gl_Position = projectedPosition;
}