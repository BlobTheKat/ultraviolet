const cat = Img('sample.png', Formats.RGBA, SMOOTH)
const icon = Img('icon.png', Formats.RGBA)

const sh = Shader({blockAtlas: 'texture', chunkCtx: 'ucolor', t: 'float'}, `void main(){
	uvec2 a = chunkCtx().xy;
	if(a.y>=65535u) discard;
	if(a.y>255u){
		a.x += uint(t)%((a.y>>8u)+1u);
		a.y &= 255u;
		if(a.x>65535u){ a.y += a.x>>8u&65280u; a.x &= 65535u; }
	}
	color = getPixel(blockAtlas, ivec3(int(a.x&255u)<<4|int(pos.x*1024.)&15, int(a.x>>8u)<<4|int(pos.y*1024.)&15,a.y));
}`, 0, 1)
//ctx.setShader(sh)
//const chunkCtx = Texture(64, 64, 1, Formats.RG16)
//const blockAtlas = Texture(16, 4096, 1)

export function frame(){
	ctx.translate(.5, .5)
	const S = Math.min(ctx.width,ctx.height)/10
	ctx.scale(S/ctx.width,S/ctx.height)
	ctx.rotate(t/2)
	ctx.drawRect(cat, -1, -1, 2, 2)
}