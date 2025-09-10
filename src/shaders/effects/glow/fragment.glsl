uniform vec3 uGlowColor;
varying float vFresnel;

void main() {
  // 根据菲涅尔效应计算透明度
  float alpha = pow(vFresnel, 2.5);
  
  // 输出最终颜色
  gl_FragColor = vec4(uGlowColor, alpha);
} 