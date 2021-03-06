const compiler = require('shader-compiler').compiler;
const options = {
    removeUnused: true,
    ignoreConstantError: true
};

function test(code){
    compiler.parse(code, function(error, result){
        console.log(result);
    }, options);
}

test(`

#define HILO_MAX_PRECISION highp
#define HILO_MAX_VERTEX_PRECISION highp
#define HILO_MAX_FRAGMENT_PRECISION highp
#define HILO_LIGHT_TYPE_NONE 1
#define HILO_SIDE 1028
#define HILO_RECEIVE_SHADOWS 1
#define HILO_CAST_SHADOWS 1
#define HILO_DIFFUSE_MAP 0
#define HILO_HAS_TEXCOORD0 1
#define GLSLIFY 1
#define GLSLIFY 1
#define HILO_FRONT_SIDE 1028
#define HILO_BACK_SIDE 1029
#define HILO_FRONT_AND_BACK_SIDE 1032
#define HILO_PI 3.141592653589793
#define HILO_INVERSE_PI 0.3183098861837907
#ifdef GL_ES
    precision HILO_MAX_VERTEX_PRECISION float;
    #define GLSLIFY 1
#endif

attribute vec3 a_position;
uniform mat4 u_modelViewProjectionMatrix;
#define GLSLIFY 1
#ifdef HILO_QUANTIZED
    #ifdef HILO_POSITION_QUANTIZED
        uniform mat4 u_positionDecodeMat;
    #endif
    #ifdef HILO_NORMAL_QUANTIZED
        uniform mat4 u_normalDecodeMat;
    #endif
    #ifdef HILO_UV_QUANTIZED
        uniform mat3 u_uvDecodeMat;
    #endif
    #ifdef HILO_UV1_QUANTIZED
        uniform mat3 u_uv1DecodeMat;
    #endif
    
    vec2 unQuantize(vec2 data, mat3 decodeMat) {
        vec3 result = vec3(data, 1.0);
        result = decodeMat * result;
        return result.xy;
    }
    vec3 unQuantize(vec3 data, mat4 decodeMat) {
        vec4 result = vec4(data, 1.0);
        result = decodeMat * result;
        return result.xyz;
    }
#endif
#define GLSLIFY 1
#ifdef HILO_JOINT_COUNT
    attribute vec4 a_skinIndices;
    attribute vec4 a_skinWeights;
    #ifdef HILO_JOINT_MAT_MAP
        uniform sampler2D u_jointMatTexture;
        uniform vec2 u_jointMatTextureSize;
        mat4 getJointMat(float index) {
            index *= 4.0;
            float x = float(mod(index, u_jointMatTextureSize.x));
            float y = float(floor(index / u_jointMatTextureSize.x));
            float dx = 1.0 / float(u_jointMatTextureSize.x);
            float dy = 1.0 / float(u_jointMatTextureSize.y);
            y = dy * (y + 0.5);
            vec4 v1 = texture2D(u_jointMatTexture, vec2(dx * (x + 0.5), y));
            vec4 v2 = texture2D(u_jointMatTexture, vec2(dx * (x + 1.5), y));
            vec4 v3 = texture2D(u_jointMatTexture, vec2(dx * (x + 2.5), y));
            vec4 v4 = texture2D(u_jointMatTexture, vec2(dx * (x + 3.5), y));
            mat4 mat = mat4(v1, v2, v3, v4);
            return mat;
        }
    #else
        uniform mat4 u_jointMat[HILO_JOINT_COUNT];
        mat4 getJointMat(float index) {
            return u_jointMat[int(index)];
        }
    #endif
    
    mat4 getJointMat(vec4 weights, vec4 indices) {
        mat4 mat = weights.x * getJointMat(indices.x);
        mat += weights.y * getJointMat(indices.y);
        mat += weights.z * getJointMat(indices.z);
        mat += weights.w * getJointMat(indices.w);
        return mat;
    }
#endif
#define GLSLIFY 1
#ifdef HILO_HAS_TEXCOORD0
    attribute vec2 a_texcoord0;
    varying vec2 v_texcoord0;
    #ifdef HILO_UV_MATRIX
        uniform mat3 u_uvMatrix;
    #endif
#endif

#ifdef HILO_HAS_TEXCOORD1
    attribute vec2 a_texcoord1;
    varying vec2 v_texcoord1;
    #ifdef HILO_UV_MATRIX
        uniform mat3 u_uvMatrix1;
    #endif
#endif

#ifdef HILO_DIFFUSE_CUBE_MAP
    varying vec3 v_position;
#endif
#define GLSLIFY 1
#ifdef HILO_HAS_NORMAL
    attribute vec3 a_normal;
    uniform mat3 u_normalMatrix;
    varying vec3 v_normal;
    #ifdef HILO_NORMAL_MAP
        attribute vec4 a_tangent;
        varying mat3 v_TBN;
    #endif
#endif
#define GLSLIFY 1
#if defined(HILO_HAS_LIGHT) || defined(HILO_HAS_FOG) || defined(HILO_HAS_FRAG_POS)
    uniform mat4 u_modelViewMatrix;
    #ifdef HILO_HAS_FOG
        varying float v_dist;
    #endif
    
    #if defined(HILO_HAS_LIGHT) || defined(HILO_HAS_FRAG_POS) 
        varying vec3 v_fragPos;
    #endif
#endif
#define GLSLIFY 1
#ifdef HILO_MORPH_TARGET_COUNT
    uniform float u_morphWeights[HILO_MORPH_TARGET_COUNT];
    #if HILO_MORPH_TARGET_COUNT > 0
        #ifdef HILO_MORPH_HAS_POSITION
            attribute vec3 a_morphPosition0;
        #endif
        #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
            attribute vec3 a_morphNormal0;
        #endif
        #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
            attribute vec3 a_morphTangent0;
        #endif
    #endif
    
    #if HILO_MORPH_TARGET_COUNT > 1
        #ifdef HILO_MORPH_HAS_POSITION
            attribute vec3 a_morphPosition1;
        #endif
        #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
            attribute vec3 a_morphNormal1;
        #endif
        #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
            attribute vec3 a_morphTangent1;
        #endif
    #endif
    
    #if HILO_MORPH_TARGET_COUNT > 2
        #ifdef HILO_MORPH_HAS_POSITION
            attribute vec3 a_morphPosition2;
        #endif
        #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
            attribute vec3 a_morphNormal2;
        #endif
        #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
            attribute vec3 a_morphTangent2;
        #endif
    #endif
    
    #if HILO_MORPH_TARGET_COUNT > 3
        #ifdef HILO_MORPH_HAS_POSITION
            attribute vec3 a_morphPosition3;
        #endif
        #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
            attribute vec3 a_morphNormal3;
        #endif
        #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
            attribute vec3 a_morphTangent3;
        #endif
    #endif
    
    #if HILO_MORPH_TARGET_COUNT > 4
        #ifdef HILO_MORPH_HAS_POSITION
            attribute vec3 a_morphPosition4;
        #endif
        #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
            attribute vec3 a_morphNormal4;
        #endif
        #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
            attribute vec3 a_morphTangent4;
        #endif
    #endif
    
    #if HILO_MORPH_TARGET_COUNT > 5
        #ifdef HILO_MORPH_HAS_POSITION
            attribute vec3 a_morphPosition5;
        #endif
        #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
            attribute vec3 a_morphNormal5;
        #endif
        #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
            attribute vec3 a_morphTangent5;
        #endif
    #endif
    
    #if HILO_MORPH_TARGET_COUNT > 6
        #ifdef HILO_MORPH_HAS_POSITION
            attribute vec3 a_morphPosition6;
        #endif
        #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
            attribute vec3 a_morphNormal6;
        #endif
        #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
            attribute vec3 a_morphTangent6;
        #endif
    #endif
    
    #if HILO_MORPH_TARGET_COUNT > 7
        #ifdef HILO_MORPH_HAS_POSITION
            attribute vec3 a_morphPosition7;
        #endif
        #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
            attribute vec3 a_morphNormal7;
        #endif
        #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
            attribute vec3 a_morphTangent7;
        #endif
    #endif
#endif
#define GLSLIFY 1
#ifdef HILO_HAS_COLOR
    #if HILO_COLOR_SIZE == 3
        attribute vec3 a_color;
        #elif HILO_COLOR_SIZE == 4
        attribute vec4 a_color;
    #endif
    varying vec4 v_color;
#endif

void main(void) {
    vec4 pos = vec4(a_position, 1.0);
    #ifdef HILO_HAS_TEXCOORD0
        vec2 uv = a_texcoord0;
    #endif
    #ifdef HILO_HAS_TEXCOORD1
        vec2 uv1 = a_texcoord1;
    #endif
    #ifdef HILO_HAS_NORMAL
        vec3 normal = a_normal;
    #endif
    
    #ifdef HILO_NORMAL_MAP
        vec4 tangent = a_tangent;
    #endif
    
    #define GLSLIFY 1
    #ifdef HILO_HAS_COLOR
        #if HILO_COLOR_SIZE == 3
            v_color = vec4(a_color, 1.0);
            #elif HILO_COLOR_SIZE == 4
            v_color = a_color;
        #endif
    #endif
    #define GLSLIFY 1
    #ifdef HILO_QUANTIZED
        #ifdef HILO_POSITION_QUANTIZED
            pos.xyz = unQuantize(pos.xyz, u_positionDecodeMat);
        #endif
        #if defined(HILO_HAS_TEXCOORD0) && defined(HILO_UV_QUANTIZED)
            uv = unQuantize(uv, u_uvDecodeMat);
        #endif
        #if defined(HILO_HAS_TEXCOORD1) && defined(HILO_UV1_QUANTIZED)
            uv1 = unQuantize(uv1, u_uv1DecodeMat);
        #endif
        #if defined(HILO_HAS_NORMAL) && defined(HILO_NORMAL_QUANTIZED)
            normal = unQuantize(normal, u_normalDecodeMat);
        #endif
    #endif
    #define GLSLIFY 1
    #ifdef HILO_MORPH_TARGET_COUNT
        #if HILO_MORPH_TARGET_COUNT > 0
            #ifdef HILO_MORPH_HAS_POSITION
                pos.xyz += a_morphPosition0 * u_morphWeights[0];
            #endif
            #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
                normal += a_morphNormal0 * u_morphWeights[0];
            #endif
            #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
                tangent.xyz += a_morphTangent0 * u_morphWeights[0];
            #endif
        #endif
        
        #if HILO_MORPH_TARGET_COUNT > 1
            #ifdef HILO_MORPH_HAS_POSITION
                pos.xyz += a_morphPosition1 * u_morphWeights[1];
            #endif
            #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
                normal += a_morphNormal1 * u_morphWeights[1];
            #endif
            #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
                tangent.xyz += a_morphTangent1 * u_morphWeights[1];
            #endif
        #endif
        
        #if HILO_MORPH_TARGET_COUNT > 2
            #ifdef HILO_MORPH_HAS_POSITION
                pos.xyz += a_morphPosition2 * u_morphWeights[2];
            #endif
            #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
                normal += a_morphNormal2 * u_morphWeights[2];
            #endif
            #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
                tangent.xyz += a_morphTangent2 * u_morphWeights[2];
            #endif
        #endif
        
        #if HILO_MORPH_TARGET_COUNT > 3
            #ifdef HILO_MORPH_HAS_POSITION
                pos.xyz += a_morphPosition3 * u_morphWeights[3];
            #endif
            #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
                normal += a_morphNormal3 * u_morphWeights[3];
            #endif
            #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
                tangent.xyz += a_morphTangent3 * u_morphWeights[3];
            #endif
        #endif
        
        #if HILO_MORPH_TARGET_COUNT > 4
            #ifdef HILO_MORPH_HAS_POSITION
                pos.xyz += a_morphPosition4 * u_morphWeights[4];
            #endif
            #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
                normal += a_morphNormal4 * u_morphWeights[4];
            #endif
            #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
                tangent.xyz += a_morphTangent4 * u_morphWeights[4];
            #endif
        #endif
        
        #if HILO_MORPH_TARGET_COUNT > 5
            #ifdef HILO_MORPH_HAS_POSITION
                pos.xyz += a_morphPosition5 * u_morphWeights[5];
            #endif
            #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
                normal += a_morphNormal5 * u_morphWeights[5];
            #endif
            #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
                tangent.xyz += a_morphTangent5 * u_morphWeights[5];
            #endif
        #endif
        
        #if HILO_MORPH_TARGET_COUNT > 6
            #ifdef HILO_MORPH_HAS_POSITION
                pos.xyz += a_morphPosition6 * u_morphWeights[6];
            #endif
            #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
                normal += a_morphNormal6 * u_morphWeights[6];
            #endif
            #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
                tangent.xyz += a_morphTangent6 * u_morphWeights[6];
            #endif
        #endif
        
        #if HILO_MORPH_TARGET_COUNT > 7
            #ifdef HILO_MORPH_HAS_POSITION
                pos.xyz += a_morphPosition7 * u_morphWeights[7];
            #endif
            #if defined(HILO_MORPH_HAS_NORMAL) && defined(HILO_HAS_NORMAL)
                normal += a_morphNormal7 * u_morphWeights[7];
            #endif
            #if defined(HILO_MORPH_HAS_TANGENT) && defined(HILO_HAS_TANGENT)
                tangent.xyz += a_morphTangent7 * u_morphWeights[7];
            #endif
        #endif
    #endif
    #define GLSLIFY 1
    #ifdef HILO_JOINT_COUNT
        mat4 skinMat = getJointMat(a_skinWeights, a_skinIndices);
        pos = skinMat * pos;
        #ifdef HILO_HAS_NORMAL
            normal = mat3(skinMat) * normal;
        #endif
    #endif
    #define GLSLIFY 1
    #ifdef HILO_HAS_TEXCOORD0
        #ifdef HILO_UV_MATRIX
            v_texcoord0 = (u_uvMatrix * vec3(uv, 1.0)).xy;
        #else
            v_texcoord0 = uv;
        #endif
    #endif
    #ifdef HILO_HAS_TEXCOORD1
        #ifdef HILO_UV_MATRIX
            v_texcoord1 = (u_uvMatrix1 * vec3(uv1, 1.0)).xy;
        #else
            v_texcoord1 = uv1;
        #endif
    #endif
    #ifdef HILO_DIFFUSE_CUBE_MAP
        v_position = pos.xyz;
    #endif
    #define GLSLIFY 1
    #ifdef HILO_HAS_NORMAL
        #ifdef HILO_NORMAL_MAP
            vec3 T = normalize(u_normalMatrix * tangent.xyz);
            vec3 N = normalize(u_normalMatrix * normal);
            T = normalize(T - dot(T, N) * N);
            vec3 B = cross(N, T) * tangent.w;
            v_TBN = mat3(T, B, N);
        #endif
        v_normal = normalize(u_normalMatrix * normal);
    #endif
    #define GLSLIFY 1
    #if defined(HILO_HAS_LIGHT) || defined(HILO_HAS_FOG) || defined(HILO_HAS_FRAG_POS)
        vec3 fragPos = (u_modelViewMatrix * pos).xyz;
        #if defined(HILO_HAS_LIGHT) || defined(HILO_HAS_FRAG_POS)
            v_fragPos = fragPos;
        #endif
        
        #ifdef HILO_HAS_FOG
            v_dist = length(fragPos);
        #endif
    #endif
    
    gl_Position = u_modelViewProjectionMatrix * pos;
}

`);