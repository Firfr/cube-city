uniform float uTime;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  // 从上到下平滑渐变
  float alpha = smoothstep(1.0, 0.0, abs(vUv.y * 2.0 - 1.0));
  
  // 随时间变化的条纹效果
  float timeFactor = sin(uTime * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
  
  // 最终颜色，结合了基础颜色、渐变透明度和动态条纹
  gl_FragColor = vec4(uColor, alpha * timeFactor * 0.8);
} 