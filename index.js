//const cat = await Img(['sample.png', 'sample2.png'], SMOOTH)
const img1 = Texture(2, 2, 1)
img1.pasteData(Uint8Array.of(255,0,0,255,0,255,0,255,0,0,255,255,255,255,255,255))
const img2 = Texture(2, 2, 1)
img2.pasteData(Uint8Array.of(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0))
export function frame(){
	ctx.translate(.5, .5)
	const S = Math.min(ctx.width,ctx.height)/10
	ctx.scale(S/ctx.width,S/ctx.height)
	ctx.rotate(t/2)
	ctx.drawRect(img1, -1, -1, 2, 2)
	ctx.drawRect(img2, -1, -1, 2, 2)
}