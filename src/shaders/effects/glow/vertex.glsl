uniform float uThickness;
varying float vFresnel;

void main() {
    // 法线转换到世界空间
    vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
    // 视图方向
    vec3 viewDirection = normalize(cameraPosition - (modelMatrix * vec4(position, 1.0)).xyz);
    
    // 菲涅尔效应，边缘处 vFresnel 值接近 1
    vFresnel = 1.0 - dot(viewDirection, worldNormal);
    
    // 沿法线方向将顶点外扩，形成外壳
    vec3 newPosition = position + normal * uThickness;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
} 