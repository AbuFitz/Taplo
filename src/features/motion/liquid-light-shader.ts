/** Taplo light: continuous flow with a local pointer/focus distortion, rendered by Paper ShaderMount. */
export const liquidLightShader = `#version 300 es
precision highp float;
uniform float u_time;
uniform mediump vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_energy;
uniform float u_light;
uniform float u_ceiling;
out vec4 fragColor;
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p) {
 vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
void main() {
 vec2 uv=gl_FragCoord.xy/u_resolution;
 float aspect=u_resolution.x/u_resolution.y;
 vec2 p=(uv-.5)*vec2(aspect,1.0)*2.0;
 vec2 cursor=(vec2(u_pointer.x,1.0-u_pointer.y)-.5)*vec2(aspect,1.0)*2.0;
 float t=u_time*.24;
 vec2 d=p-cursor;
 float influence=exp(-dot(d,d)*2.4)*u_energy;
 p+=vec2(d.y,-d.x)*influence*.72;
 p+=normalize(d+vec2(.001))*influence*.25*sin(length(d)*7.0-t*3.0);
 vec2 drift=vec2(noise(p*1.25+vec2(t*.55,-t*.3)),noise(p*1.15+vec2(-t*.4,t*.45)))-.5;
 p+=drift*.8;
 float wave=sin(p.x*2.25+t+cos(p.y*2.1-t*.65))*.58+cos(p.y*2.45-t*.8+sin(p.x*1.8+t*.4))*.42;
 float light=smoothstep(-.65,.75,wave+influence*.48);
 float grain=(hash(floor(gl_FragCoord.xy*.65))-.5)*.028;
 float ink=mix(.025,u_ceiling,light)+grain;
 float gallery=mix(.78,1.0,light)+grain*.45;
 float value=mix(ink,gallery,u_light);
 fragColor=vec4(vec3(value),1.0);
}`;
