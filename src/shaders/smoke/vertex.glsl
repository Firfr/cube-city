uniform float uTime;
uniform sampler2D uPerlinNoise;
// 新增可调节参数
uniform float uWindStrength;   // 风强度
uniform float uWindPower;      // 风影响的y指数
uniform float uTwistStrength;  // 扭曲强度
uniform float uNoiseFreq;      // 噪声采样频率
uniform float uNoiseSpeed;     // 噪声速度
uniform float uWindSpeed;      // 风噪声速度

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

vec2 rotate2D(vec2 value, float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    mat2 m = mat2(c, s, -s, c);
    return m * value;
}

void main()
{
    vec3 newPosition = position;
    // Twist
    float noise = texture(uPerlinNoise, vec2(0.5, uv.y * uNoiseFreq - uTime * uNoiseSpeed)).r;
    float angle = noise * PI * 0.5 * uTwistStrength;
    // Wind
    vec2 windOffset = vec2(
        texture(uPerlinNoise, vec2(0.25, uTime * uWindSpeed)).r - 0.5,
        texture(uPerlinNoise, vec2(0.75, uTime * uWindSpeed)).r - 0.5
    );
    windOffset *= pow(uv.y, uWindPower) * uWindStrength;
    newPosition.xz = rotate2D(newPosition.xz, angle * position.y);
    newPosition.xz += windOffset;
    // Final position
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition.x, position.y, newPosition.z, 1.0);
    // Varyings
    vUv = uv;
}