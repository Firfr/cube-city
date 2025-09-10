uniform float uTime;
uniform float uOpacity;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
    // 将UV坐标中心移到(0,0)，范围从-0.5到0.5
    vec2 centeredUv = vUv - 0.5;
    // 计算到中心的距离
    float dist = length(centeredUv);
    
    // 脉冲效果：创建一个随时间变化的半径
    float pulseRadius = 0.4 + sin(uTime * 4.0) * 0.05;
    
    // 绘制一个边缘平滑的圆环
    // smoothstep(edge0, edge1, x) 会在 x 从 edge0 到 edge1 之间平滑插值
    float ring = smoothstep(pulseRadius - 0.05, pulseRadius, dist) - smoothstep(pulseRadius, pulseRadius + 0.05, dist);
    
    // 计算最终的透明度，结合了圆环形状和全局透明度
    float alpha = ring * uOpacity;
    
    // 最终颜色输出
    gl_FragColor = vec4(uColor, alpha);
} 