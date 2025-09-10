varying vec2 screenUV;
varying  vec2 vUv;
varying vec3 worldNormal;
varying vec3 eyeVector;

void main(){

  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;
  gl_Position=projectionMatrix*mvPosition;


  // varying
  vUv = uv;
  screenUV=gl_Position.xy/gl_Position.w;// 归一化设备坐标 (NDC)
  screenUV=screenUV*.5+.5;// 转换到 [0, 1] 范围
  vec4 transformedNormal = modelMatrix * vec4(normal, 0.0);
  worldNormal = normalize(transformedNormal).xyz;

  eyeVector = normalize(worldPos.xyz - cameraPosition);
}
