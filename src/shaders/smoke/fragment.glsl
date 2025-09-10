varying vec2 vUv;
uniform sampler2D uPerlinNoise;
uniform float uTime;
void main() {
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;
    smokeUv.y -= uTime * 0.03;
    float smoke = texture2D(uPerlinNoise, smokeUv).r;

    // Remap
    smoke *= smoothstep(0.0, 0.1, vUv.x);
    smoke *= smoothstep(1.0, 0.9, vUv.x);
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    smoke *= smoothstep(1.0, 0.4, vUv.y);
    gl_FragColor = vec4(0.7, 0.7, 0.7, smoke);
    // Final color
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}