uniform sampler2D uTexture;

uniform float uIorR;
uniform float uIorY;
uniform float uIorG;
uniform float uIorC;
uniform float uIorB;
uniform float uIorP;

uniform float uRefractFactor; // 可以增加/减少每个样本的折射效果
uniform float uChromaticAberration; //控制不同颜色通道之间的分离强度
uniform float uSaturation; //控制颜色饱和度

uniform float uShininess;
uniform float uDiffuseness;
uniform vec3 uLight;

uniform float uFresnelPower;

varying vec2 screenUV;
varying vec2 vUv;
varying vec3 worldNormal;
varying vec3 eyeVector;

const int LOOP = 16;

float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec3 sat(vec3 rgb, float intensity) {
  vec3 L = vec3(0.2125, 0.7154, 0.0721);
  vec3 grayscale = vec3(dot(rgb, L));
  return mix(grayscale, rgb, intensity);
}

float specular(vec3 light, float shininess, float diffuseness) {
  vec3 normal = worldNormal;
  vec3 lightVector = normalize(-light);
  vec3 halfVector = normalize(eyeVector + lightVector);

  float NdotL = dot(normal, lightVector);
  float NdotH =  dot(normal, halfVector);
  float NdotH2 = NdotH * NdotH;

  float kDiffuse = max(0.0, NdotL);
  float kSpecular = pow(NdotH2, shininess);

  return  kSpecular + kDiffuse * diffuseness;
}

float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
  float fresnelFactor = abs(dot(eyeVector, worldNormal));
  float inversefresnelFactor = 1.0 - fresnelFactor;

  return pow(inversefresnelFactor, power);
}

void main(){
  vec3 color=vec3(1.);

  vec3 normal=worldNormal;

  for ( int i = 0; i < LOOP; i ++ ) {
    float slide = float(i) / float(LOOP) * 0.01;

    vec3 refractVecR = refract(eyeVector, normal,(1.0/uIorR));
    vec3 refractVecY = refract(eyeVector, normal, (1.0/uIorY));
    vec3 refractVecG = refract(eyeVector, normal, (1.0/uIorG));
    vec3 refractVecC = refract(eyeVector, normal, (1.0/uIorC));
    vec3 refractVecB = refract(eyeVector, normal, (1.0/uIorB));
    vec3 refractVecP = refract(eyeVector, normal, (1.0/uIorP));


    // 使用 uRefractFactor 来调整折射效果
    float r = texture2D(uTexture, screenUV + refractVecR.xy * (uRefractFactor + slide * 1.0) * uChromaticAberration).x * 0.5;

    float y = (texture2D(uTexture, screenUV + refractVecY.xy * (uRefractFactor + slide * 1.0) * uChromaticAberration).x * 2.0 +
                texture2D(uTexture, screenUV + refractVecY.xy * (uRefractFactor + slide * 1.0) * uChromaticAberration).y * 2.0 -
                texture2D(uTexture, screenUV + refractVecY.xy * (uRefractFactor + slide * 1.0) * uChromaticAberration).z) / 6.0;

    float g = texture2D(uTexture, screenUV + refractVecG.xy * (uRefractFactor + slide * 2.0) * uChromaticAberration).y * 0.5;

    float c = (texture2D(uTexture, screenUV + refractVecC.xy * (uRefractFactor + slide * 2.5) * uChromaticAberration).y * 2.0 +
                texture2D(uTexture, screenUV + refractVecC.xy * (uRefractFactor + slide * 2.5) * uChromaticAberration).z * 2.0 -
                texture2D(uTexture, screenUV + refractVecC.xy * (uRefractFactor + slide * 2.5) * uChromaticAberration).x) / 6.0;

    float b = texture2D(uTexture, screenUV + refractVecB.xy * (uRefractFactor + slide * 3.0) * uChromaticAberration).z * 0.5;

    float p = (texture2D(uTexture, screenUV + refractVecP.xy * (uRefractFactor + slide * 1.0) * uChromaticAberration).z * 2.0 +
                texture2D(uTexture, screenUV + refractVecP.xy * (uRefractFactor + slide * 1.0) * uChromaticAberration).x * 2.0 -
                texture2D(uTexture, screenUV + refractVecP.xy * (uRefractFactor + slide * 1.0) * uChromaticAberration).y) / 6.0;

    float R = r + (2.0*p + 2.0*y - c)/3.0;
    float G = g + (2.0*y + 2.0*c - p)/3.0;
    float B = b + (2.0*c + 2.0*p - y)/3.0;

    color.r = R;
    color.g = G;
    color.b = B;

    color = sat(color, uSaturation);
  }
  // Divide by the number of layers to normalize colors (rgb values can be worth up to the value of LOOP)
  color /= float( LOOP );

    // Specular
  float specularLight = specular(uLight, uShininess, uDiffuseness);
  color += specularLight;

  // Fresnel
  float f = fresnel(eyeVector, normal, uFresnelPower);
  color.rgb += f * vec3(1.0);

  // 在最终颜色上添加一些噪声
  vec3 finalNoise = vec3(noise(vUv * 10000.0)) * 0.05 * 0.3;
  // color -= finalNoise;

  gl_FragColor = vec4(color, 1.0);
  gl_FragColor=sRGBTransferOETF(gl_FragColor);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}