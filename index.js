const cat = await Img('sample.png')

const sh = Shader({blockAtlas: 'texture', chunkCtx: 'ucolor', t: 'float'}, `void main(){
	uvec2 a = getColor(chunkCtx);
	if(a.y>=65535u) discard;
	if(a.y>255u){
		a.x += uint(t)%((a.y>>8u)+1u);
		a.y &= 255u;
		if(a.x>65535u){ a.y += a.x>>8u&65280u; a.x &= 65535u; }
	}
	color = getPixel(blockAtlas, ivec3(int(a.x&255u)<<4|int(uv.x*1024.)&15, int(a.x>>8u)<<4|int(uv.y*1024.)&15,a.y));
}`)
ctx.useShader(sh)
const chunkCtx = Texture(64, 64, 1, Formats.RG16)

ctx.addRect(0, 0, 64, 64)