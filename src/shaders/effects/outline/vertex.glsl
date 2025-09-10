uniform float uThickness;

void main() {
    // 沿法线方向将顶点外扩，形成外壳
    vec3 newPosition = position + normal * uThickness;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
} 