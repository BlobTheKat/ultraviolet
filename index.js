const cat = await Img(['sample.png', 'sample2.png'], SMOOTH)
const cat2 = Texture(512, 512, 2)
await cat2.paste(cat)
export function frame(){
	ctx.translate(.5, .5)
	const S = Math.min(ctx.width,ctx.height)/10
	ctx.scale(S/ctx.width,S/ctx.height)
	ctx.rotate(t/2)
	ctx.drawRect(cat2.layer(1), -1, -1, 2, 2)
}



const sh = Shader({blockAtlas: TEXTURE, chunkCtx: UCOLOR, t: FLOAT}, `void main(){
	uvec2 a = chunkCtx().xy;
	if(a.y>=65535u) discard;
	if(a.y>255u){
		a.x += uint(t)%((a.y>>8u)+1u);
		a.y &= 255u;
		if(a.x>65535u){ a.y += a.x>>8u&65280u; a.x &= 65535u; }
	}
	color = getPixel(blockAtlas, ivec3(int(a.x&255u)<<4|int(pos.x*1024.)&15, int(a.x>>8u)<<4|int(pos.y*1024.)&15,a.y));
}`, FLOAT, 0)
//ctx.shader = sh
//const chunkCtx = Texture(64, 64, 1, Formats.RG16)
//const blockAtlas = Texture(16, 4096, 1)