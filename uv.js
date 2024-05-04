// Pull requests to clean up code are welcome
{const NS = globalThis[document.currentScript.src&&new URL(document.currentScript.src).hash.slice(1)||'globalThis']??={}

/** @type {WebGL2RenderingContext} */
let gl = null, vert
const GL = WebGL2RenderingContext.prototype
const UB = GL.UNSIGNED_BYTE, US = GL.UNSIGNED_SHORT, UI = GL.UNSIGNED_INT, RI = GL.RED_INTEGER, RGI = GL.RG_INTEGER, RBI = GL.RGB_INTEGER, RAI = GL.RGBA_INTEGER, HF = GL.HALF_FLOAT, F = GL.FLOAT
NS.Formats = {
	R: [GL.R8, GL.RED, UB], RG: [GL.RG8, GL.RG, UB], RGB: [GL.RGB8, GL.RGB, UB], RGBA: [GL.RGBA8, GL.RGBA, UB],
	RGB565: [GL.RGB565, GL.RGB, GL.UNSIGNED_SHORT_5_6_5], R11F_G11F_B10F: [GL.R11F_G11F_B10F, GL.RGB, GL.UNSIGNED_INT_10F_11F_11F_REV],
	RGB5_A1: [GL.RGB5_A1, GL.RGBA, GL.UNSIGNED_SHORT_5_5_5_1], RGB10_A2: [GL.RGB10_A2, GL.RGBA, GL.UNSIGNED_INT_2_10_10_10_REV],
	RGBA4: [GL.RGBA4, RAI, GL.UNSIGNED_SHORT_4_4_4_4], RGB9_E5: [GL.RGB9_E5, GL.RGB, GL.UNSIGNED_INT_5_9_9_9_REV],
	R8: [GL.R8UI, RI, UB], RG8: [GL.RG8UI, RGI, UB], RGB8: [GL.RGB8UI, RBI, UB], RGBA8: [GL.RGBA8UI, RAI, UB],
	R16: [GL.R16UI, RI, US], RG16: [GL.RG16UI, RGI, US], RGB16: [GL.RGB16UI, RBI, US], RGBA16: [GL.RGBA16UI, RAI, US],
	R32: [GL.R32UI, RI, UI], RG32: [GL.RG32UI, RGI, UI], RGB32: [GL.RGB32UI, RBI, UI], RGBA32: [GL.RGBA32UI, RAI, UI],
	R16F: [GL.R16F, GL.RED, HF], RG16F: [GL.RG16F, GL.RG, HF], RGB16F: [GL.RGB16F, GL.RGB, HF], RGBA16F: [GL.RGBA16F, GL.RGBA, HF],
	R16F_32F: [GL.R16F, GL.RED, F], RG16F_32F: [GL.RG16F, GL.RG, F], RGB16F_32F: [GL.RGB16F, GL.RGB, F], RGBA16F_32F: [GL.RGBA16F, GL.RGBA, F],
	R32F: [GL.R32F, GL.RED, F], RG32F: [GL.RG32F, GL.RG, F], RGB32F: [GL.RGB32F, GL.RGB, F], RGBA32F: [GL.RGBA32F, GL.RGBA, F],
}
let mainFormat = NS.Formats.RGBA
let defaultOptions = 0
NS.Texture = (w=0,h=0,l=0,format=NS.Formats.RGBA,options=defaultOptions) => {
	const t = Object.setPrototypeOf(gl.createTexture(), TEX_PROTO)
	t.unit = -1
	t.width = 0
	t.height = 0
	t.layers = 0
	t.format = format
	t.mipmap = ~(t.options=options)>>2&2
	if(w|h) t.of(w, h, l, format, options)
	return t
}
NS.Texture.setDefaultOptions = o => defaultOptions = o
const currentlyBound = new Array(16).fill(null)
let currentUnit = 0
function bindt(t){
	t.unit = currentUnit+(t.layers?4294967296:0)
	const b = t.unit<4294967296?GL.TEXTURE_2D:GL.TEXTURE_2D_ARRAY
	let o = currentlyBound[currentUnit]
	if(o) (o.unit!=t.unit)&&(gl.bindTexture(39419-b, null)), o.unit = -1, currentlyBound[currentUnit]=null
	gl.bindTexture(b, currentlyBound[currentUnit] = t)
	return b
}
const BITMAP_OPTS = {imageOrientation: 'flipY', premultiplyAlpha: 'none'}
let preprocess = true
const TEX_PROTO = class{
	fromSrc(src,o){this.from(typeof src=='string'?fetch(src,o).then(a=>a.blob()):src);return this}
	from(thing, format = NS.Formats.RGBA, options = defaultOptions){
		if(typeof thing != 'object') return
		this.format = format; this.options = options
		if(thing instanceof Blob) thing = createImageBitmap(thing, BITMAP_OPTS)
		if(thing.then) return thing.then(thing => this.from(thing, format, options))
		bindt(this)
		const {0: A, 1: B, 2: C} = format
		if(!preprocess) gl.pixelStorei(37440,1), gl.pixelStorei(37441,1), preprocess = true
		gl.texImage2D(GL.TEXTURE_2D, 0, A, this.width = thing.width, this.height = thing.height, 0, B, C, thing)
		gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, (~options&1)+GL.NEAREST)
		const f = (~options>>1)&3
		if(options&8) gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST_MIPMAP_NEAREST + f),this.mipmap=3
		else gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, (f&1)+GL.NEAREST),this.mipmap=1
		gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, options&32?GL.MIRRORED_REPEAT:options&16?GL.REPEAT:GL.CLAMP_TO_EDGE)
		gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, options&128?GL.MIRRORED_REPEAT:options&64?GL.REPEAT:GL.CLAMP_TO_EDGE)
		return this
	}
	put(thing, x=0, y=0, z=0){
		if(typeof thing != 'object') return
		if(thing instanceof Blob) thing = createImageBitmap(thing, BITMAP_OPTS)
		if(thing.then) return thing.then(thing => this.put(thing, x, y, l))
		if(!preprocess) gl.pixelStorei(37440,1), gl.pixelStorei(37441,1), preprocess = true
		if(bindt(this)==GL.TEXTURE_2D) gl.texSubImage2D(GL.TEXTURE_2D, 0, x, y, thing.width, thing.height, this.format[1], this.format[2], thing)
		else gl.texSubImage3D(GL.TEXTURE_2D_ARRAY, 0, x, y, z, thing.width, thing.height, 1, this.format[1], this.format[2], thing)
		this.mipmap|=1
	}
	setOptions(options = defaultOptions){
		bindt(this)
		this.options = options
		const b = this.layers?GL.TEXTURE_2D_ARRAY:GL.TEXTURE_2D
		gl.texParameteri(b, GL.TEXTURE_MAG_FILTER, (~options&1)+GL.NEAREST)
		const f = (~options>>1)&3
		if(options&8) gl.texParameteri(b, GL.TEXTURE_MIN_FILTER, GL.NEAREST_MIPMAP_NEAREST + f),this.mipmap&=-3
		else gl.texParameteri(b, GL.TEXTURE_MIN_FILTER, (f&1)+GL.NEAREST),this.mipmap|=2
		gl.texParameteri(b, GL.TEXTURE_WRAP_S, options&32?GL.MIRRORED_REPEAT:options&16?GL.REPEAT:GL.CLAMP_TO_EDGE)
		gl.texParameteri(b, GL.TEXTURE_WRAP_T, options&128?GL.MIRRORED_REPEAT:options&64?GL.REPEAT:GL.CLAMP_TO_EDGE)
		return this
	}
	of(width = 0, height = 0, layers = 0, format = NS.Formats.RGBA, options = defaultOptions){
		this.layers = layers
		const b = bindt(this)
		const {0: A, 1: B, 2: C} = format
		this.format = format; this.options = options
		if(layers) gl.texImage3D(b, 0, A, this.width = width, this.height = height, layers, 0, B, C, null)
		else gl.texImage2D(b, 0, A, this.width = width, this.height = height, 0, B, C, null)
		gl.texParameteri(b, GL.TEXTURE_MAG_FILTER, (~options&1)+GL.NEAREST)
		const f = (~options>>1)&3
		if(options&8) gl.texParameteri(b, GL.TEXTURE_MIN_FILTER, GL.NEAREST_MIPMAP_NEAREST + f),this.mipmap=3
		else gl.texParameteri(b, GL.TEXTURE_MIN_FILTER, (f&1)+GL.NEAREST),this.mipmap=1
		gl.texParameteri(b, GL.TEXTURE_WRAP_S, options&32?GL.MIRRORED_REPEAT:options&16?GL.REPEAT:GL.CLAMP_TO_EDGE)
		gl.texParameteri(b, GL.TEXTURE_WRAP_T, options&128?GL.MIRRORED_REPEAT:options&64?GL.REPEAT:GL.CLAMP_TO_EDGE)
		return this
	}
	putData(sx=0, sy=0, sw, sh, data, format=this.format){
		bindt(this)
		if(preprocess) gl.pixelStorei(37440,0), gl.pixelStorei(37441,0), preprocess = false
		gl.texSubImage2D(GL.TEXTURE_2D, 0, sx, sy, sw, sh, format[1], format[2], data)
		this.mipmap|=1
	}
	putDataLayers(sx=0, sy=0, sz=0, sw, sh, sd, data, format=this.format){
		bindt(this)
		if(preprocess) gl.pixelStorei(37440,0), gl.pixelStorei(37441,0), preprocess = false
		gl.texSubImage2D(GL.TEXTURE_2D_ARRAY, 0, sx, sy, sz, sw, sh, sd, format[1], format[2], data)
		this.mipmap|=1
	}
	uv(x=0,y=0,w=this.width,h=this.height,l=0){ return {x:x/this.width,y:(1-y+h)/this.height,w:w/this.width,h:h/this.height,l,sub} }
	delete(){
		gl.deleteTexture(this)
		const u=this.unit
		if(u){
			if(currentUnit!=(currentUnit=u|0)) gl.activeTexture(33984+currentUnit)
			this.unit=-1
			gl.bindTexture(u<4294967296?3553:35866,currentlyBound[u&15]=null)
		}
	}
}.prototype
const fpool = []
NS.Mesh = () => {
	const a = []
	a.cur = fpool.pop() ?? new Float32Array(8192)
	a.i = 0
	return new M(a)
}
NS.Mesh.single = (a=whole,f=0,b=0,c=0,d=0,e=0)=>NS.Mesh.singleMat(1,0,0,1,0,0,a,f,b,c,d,e)
NS.Mesh.singleRect = (b=0,c=0,d=1,e=1,a=whole,j=0,f=0,g=0,h=0,i=0)=>NS.Mesh.singleMat(d,0,0,e,b,c,a,j,f,g,h,i)
NS.Mesh.singleMat = (a=0,b=0,c=0,d=0,e=0,f=0,{x:tx,y:ty,w:tw,h:th,l}=whole,fx=0,t1=0,t2=0,t3=0,t4=0) => {
	const x = new Float32Array(16)
	x[0] = a; x[1] = c; x[2] = e; x[3] = b; x[4] = d; x[5] = f
	x[6] = tx; x[7] = ty; x[8] = tw; x[9] = th
	x[10] = t1; x[11] = t2; x[12] = t3; x[13] = t4; x[14] = l; x[15] = fx
	return x
}
function sub(a,b,c,d){return {x:this.x+a*this.w,y:this.y+b*this.h,w:this.w*c,h:this.h*d,l:this.l,sub}}
NS.uv = (x=0,y=0,w=1,h=1,l=0)=>({x,y,w,h,l,sub})
const whole = NS.uv()
NS._ = undefined
class M{
	arr;#a;#b;#c;#d;#e;#f
	constructor(z,a=1,b=0,c=0,d=1,e=0,f=0){this.arr=z;this.#a=a;this.#b=b;this.#c=c;this.#d=d;this.#e=e;this.#f=f}
	translate(x=0,y=0){ this.#e+=x*this.#a+y*this.#c;this.#f+=x*this.#b+y*this.#d }
	scale(x=1,y=x){ this.#a*=x; this.#b*=x; this.#c*=y; this.#d*=y }
	rotate(r=0){
		const cs = Math.cos(r), sn = Math.sin(r), a=this.#a,b=this.#b,c=this.#c,d=this.#d
		this.#a=a*cs-c*sn; this.#b=b*cs-d*sn
		this.#c=a*sn+c*cs; this.#d=b*sn+d*cs
	}
	transform(a,b,c,d,e,f){
		const ta=this.#a,tb=this.#b,tc=this.#c,td=this.#d,te=this.#e,tf=this.#f
		this.#a = a*ta+c*tb; this.#b = b*ta+d*tb
		this.#c = a*tc+c*td; this.#d = b*tc+d*td
		this.#e = a*te+c*tf+e; this.#f = b*te+d*tf+f
	}
	skew(x=0, y=0){
		const ta=this.#a,tb=this.#b
		this.#a+=this.#c*y; this.#b+=this.#d*y
		this.#c+=ta*x; this.#d+=tb*x
	}
	multiply(x=1, y=0){
		const ta=this.#a,tc=this.#c
		this.#a=ta*x-this.#b*y;this.#b=ta*y+this.#b*x
		this.#c=tc*x-this.#d*y;this.#d=tc*y+this.#d*x
	}
	getTransform(){ return {a: this.#a, b: this.#b, c: this.#c, d: this.#d, e: this.#e, f: this.#f} }
	new(a=1,b=0,c=0,d=1,e=0,f=0){return new M(this.arr,a,b,c,d,e,f)}
	reset(a=1,b=0,c=0,d=1,e=0,f=0){this.#a=a;this.#b=b;this.#c=c;this.#d=d;this.#e=e;this.#f=f}
	box(x=0,y=0,w=1,h=w){ this.#e+=x*this.#a+y*this.#c; this.#f+=x*this.#b+y*this.#d; this.#a*=w; this.#b*=w; this.#c*=h; this.#d*=h }
	to(x, y){if(typeof x=='object')({x,y}=x);return {x:this.#a*x+this.#c*y+this.#e,y:this.#b*x+this.#d*y+this.#f}}
	from(x, y){
		if(typeof x=='object')({x,y}=x)
		const a=this.#a,b=this.#b,c=this.#c,d=this.#d, det = a*d - b*c
		return {
			x: (x*d - x*c + c*this.#f - d*this.#e)/det,
			y: (y*a - y*b + b*this.#e - a*this.#f)/det
		}
	}
	sub(){ return new M(this.arr,this.#a,this.#b,this.#c,this.#d,this.#e,this.#f) }
	resetTo(m){this.#a=m.#a;this.#b=m.#b;this.#c=m.#c;this.#d=m.#d;this.#e=m.#e;this.#f=m.#f}
	add({x:tx,y:ty,w:tw,h:th,l} = whole, fx = 0, t1=0, t2=0, t3=0, t4=0){
		const j = (this.arr.i+=16)-16, cur = this.arr.cur
		cur[j  ] = this.#a; cur[j+1] = this.#c; cur[j+2] = this.#e
		cur[j+3] = this.#b; cur[j+4] = this.#d; cur[j+5] = this.#f
		cur[j+6] = tx; cur[j+7] = ty; cur[j+8] = tw; cur[j+9] = th
		cur[j+10] = t1; cur[j+11] = t2; cur[j+12] = t3; cur[j+13] = t4; cur[j+14] = l; cur[j+15] = fx
		if(j === 8176) this.arr.push(cur), this.arr.cur = fpool.pop() ?? new Float32Array(8192),this.arr.i=0
	}
	addRect(x=0, y=0, w=1, h=1, {x:tx,y:ty,w:tw,h:th,l} = whole, fx=0, t1=0, t2=0, t3=0, t4=0){
		const j = (this.arr.i+=16)-16, cur = this.arr.cur
		cur[j  ] = this.#a*w; cur[j+1] = this.#c*h; cur[j+2] = this.#e+x*this.#a+y*this.#c
		cur[j+3] = this.#b*w; cur[j+4] = this.#d*h; cur[j+5] = this.#f+x*this.#b+y*this.#d
		cur[j+6] = tx; cur[j+7] = ty; cur[j+8] = tw; cur[j+9] = th
		cur[j+10] = t1; cur[j+11] = t2; cur[j+12] = t3; cur[j+13] = t4; cur[j+14] = l; cur[j+15] = fx
		if(j === 8176) this.arr.push(cur), this.arr.cur = fpool.pop() ?? new Float32Array(8192),this.arr.i=0
	}
	addMat(a=1, b=0, c=0, d=1, e=0, f=0, {x:tx,y:ty,w:tw,h:th,l} = whole, fx=0, t1=0, t2=0, t3=0, t4=0){
		const j = (this.arr.i+=16)-16, cur = this.arr.cur
		const ta=this.#a,tb=this.#b,tc=this.#c,td=this.#d,te=this.#e,tf=this.#f
		cur[j  ] = a*ta+c*tb; cur[j+1] = a*tc+c*td; cur[j+2] = a*te+c*tf+e
		cur[j+3] = b*ta+d*tb; cur[j+4] = b*tc+d*td; cur[j+5] = b*te+d*tf+f
		cur[j+6] = tx; cur[j+7] = ty; cur[j+8] = tw; cur[j+9] = th
		cur[j+10] = t1; cur[j+11] = t2; cur[j+12] = t3; cur[j+13] = t4; cur[j+14] = l; cur[j+15] = fx
		if(j === 8176) this.arr.push(cur), this.arr.cur = fpool.pop() ?? new Float32Array(8192),this.arr.i=0
	}
	upload(){
		const b = gl.createBuffer()
		gl.bindBuffer(GL.ARRAY_BUFFER, b)
		const L = this.arr.length*32768+(this.arr.i<<2)
		gl.bufferData(GL.ARRAY_BUFFER, L, GL.STATIC_DRAW)
		let i = 0
		for(;i<this.arr.length;i++)
			gl.bufferSubData(GL.ARRAY_BUFFER, i*32768, this.arr[i])
		gl.bufferSubData(GL.ARRAY_BUFFER, i*32768, this.arr.cur, 0, this.arr.i)
		const v = gl.createVertexArray()
		gl.bindVertexArray(bvo = v)
		gl.vertexAttribPointer(0, 3, F, false, 64, 0)
		gl.vertexAttribPointer(1, 3, F, false, 64, 12)
		gl.vertexAttribPointer(2, 4, F, false, 64, 24)
		gl.vertexAttribPointer(3, 4, F, false, 64, 40)
		gl.vertexAttribPointer(4, 2, F, false, 64, 56)
		for(let i = 0; i < 5; i++){
			gl.enableVertexAttribArray(i)
			gl.vertexAttribDivisor(i, 1)
		}
		v.size = L/64
		v.buf = b
		this.delete()
		return v
	}
	get size(){ return this.arr.length*512+this.arr.i/16 }
	delete(){
		if(fpool.length < 128) fpool.push(this.arr.cur)
		for(let i = Math.min(this.arr.length, 128-fpool.length); i >= 0; i--) fpool.push(this.arr[i])
		this.arr.length = 0
		this.arr.cur = null
		this.arr.i = 0
	}
	export(){
		const f = new Float32Array(this.arr.length*8192+this.arr.i)
		for(let i = 0; i < this.arr.length; i++){
			f.set(this.arr[i], i*8192)
		}
		if(this.arr.i) f.set(this.arr.cur.subarray(0, this.arr.i), this.arr.length*8192)
		return f
	}
	import(f){
		if(f instanceof ArrayBuffer) f = new Float32Array(f)
		if(f.length%16)return void((warns&16)&&(warns&=-17,console.warn('.import(): Length must be a multiple of 16')))
		let j = Math.min(f.length, 8192-this.arr.i)
		if(j) this.arr.cur.set(f.subarray(0, j), this.arr.i)
		if((this.arr.i += j)>=8192) this.arr.push(this.arr.cur), this.arr.cur = fpool.pop() ?? new Float32Array(8192),this.arr.i=0
		else return
		while(j<=f.length-8192)
			this.arr.push(f.slice(j,j+=8192))
		const a = f.subarray(j)
		this.arr.cur.set(a)
		this.arr.i = a.length
	}
}
WebGLVertexArrayObject.prototype.delete = function(){
	gl.deleteVertexArray(this)
	if(this.buf) gl.deleteBuffer(this.buf)
}
const mat2x3 = new Float32Array(6)
let fb = null
let mainStencil = 0
let pmask = 285217039
let ux=0, uy=0, uz=0, uw=0, vx=0, vy=0
let warns = -1
let vpw = 0, vph = 0
class Target{
	fb;#a;#b;#c;#d;#e;#f;#ux;#uy;#uz;#uw;#s;#t
	get width(){return (this.fb||gl.canvas).width}
	get height(){return (this.fb||gl.canvas).height}
	get texture(){return this.fb?.texture}
	get gl(){return gl}
	getData(x=0,y=0,w=this.width,h=this.height,arr=null){
		if(fb!=this.fb) gl.bindFramebuffer(GL.FRAMEBUFFER, fb=this.fb)
		const f = this.fb?this.fb.format:mainFormat
		if(!arr){
			const a = f[0]
			const S = (a==32856||a==36214||a==36208||a==34842||a==34836||a==36220?4:a==32849||a==36215||a==36209||a==34843||a==34837||a==32849||a==36221?3:a==33323||a==33338||a==33340||a==33327||a==33328||a==33336?2:1)*w*h
			arr = f[2]==UB?new Uint8Array(S):f[2]==F?new Float32Array(S):f[2]==UI||f[2]==GL.UNSIGNED_INT_10F_11F_11F_REV||f[2]==GL.UNSIGNED_INT_2_10_10_10_REV||f[2]==GL.UNSIGNED_INT_5_9_9_9_REV?new Uint32Array(S):new Uint16Array(S)
		}
		gl.readPixels(x,y,w,h,f[1],f[2],arr)
		return arr
	}
	copyTo(tex, dx=0, dy=0, dl=0, sx=0, sy=0, sw=this.width, sh=this.height){
		if(fb!=this.fb) gl.bindFramebuffer(GL.FRAMEBUFFER, fb = this.fb)
		bindt(tex) == GL.TEXTURE_2D ? gl.copyTexSubImage2D(GL.TEXTURE_2D, 0, dx, dy, sx, sy, sw, sh)
		: gl.copyTexSubImage3D(GL.TEXTURE_2D_ARRAY, 0, dx, dy, dl, sx, sy, sw, sh)
		tex.mipmap|=1
	}
	resize(width = this.width, height = this.height, format = NS.Formats.RGBA){
		const fb = this.fb
		if(fb){
			fb.texture = null
			fb.format = format
			gl.bindFramebuffer(GL.READ_FRAMEBUFFER, fb)
			if(fb.colorR) gl.deleteRenderbuffer(fb.colorR)
			const s = fb.colorR = gl.createRenderbuffer()
			gl.bindRenderbuffer(GL.RENDERBUFFER, s)
			gl.renderbufferStorage(GL.RENDERBUFFER, format[0], w, h)
			gl.framebufferRenderbuffer(GL.READ_FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.RENDERBUFFER, s)
			if(fb.stencil>=0){
				if(fb.stencilR) gl.deleteRenderbuffer(fb.stencilR)
				const s = fb.stencilR = gl.createRenderbuffer()
				gl.bindRenderbuffer(GL.RENDERBUFFER, s)
				gl.renderbufferStorage(GL.RENDERBUFFER, GL.STENCIL_INDEX8, width, height)
				gl.framebufferRenderbuffer(GL.READ_FRAMEBUFFER, GL.STENCIL_ATTACHMENT, GL.RENDERBUFFER, s)
			}
		}else{
			gl.canvas.width = width
			gl.canvas.height = height
			// No universal support, but too cool to miss out
			if(gl.drawingBufferStorage) gl.drawingBufferStorage(format[0], width, height)
			else if(warns&(format!=NS.Formats.RGBA)) warns&=-2,console.warn('Browser does not support specifying format for main target')
			mainFormat = format
		}
	}
	setTexture(tex,l=0){
		if(!this.fb) return void((warns&2)&&(warns&=-3,console.warn('Cannot attach a texture to the main target (its output must always be the <canvas>, use .resize() to change size/format)')))
		gl.bindFramebuffer(GL.READ_FRAMEBUFFER, this.fb)
		this.fb.width = tex.width
		this.fb.height = tex.height
		if(this.fb.stencil>=0){
			if(this.fb.stencilR) gl.deleteRenderbuffer(this.fb.stencilR)
			const s = this.fb.stencilR = gl.createRenderbuffer()
			gl.bindRenderbuffer(GL.RENDERBUFFER, s)
			gl.renderbufferStorage(GL.RENDERBUFFER, GL.STENCIL_INDEX8, tex.width, tex.height)
			gl.framebufferRenderbuffer(GL.READ_FRAMEBUFFER, GL.STENCIL_ATTACHMENT, GL.RENDERBUFFER, s)
		}
		if(this.fb.texture === tex&&this.fb.l==l) return
		this.fb.texture = tex
		this.fb.format = tex.format
		this.fb.l = l
		if(this.fb.colorR) gl.deleteRenderbuffer(this.fb.colorR),this.fb.colorR=null
		!tex.layers ? gl.framebufferTexture2D(GL.READ_FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, tex, 0)
		: gl.framebufferTextureLayer(GL.READ_FRAMEBUFFER, GL.COLOR_ATTACHMENT0, tex, 0, l)
	}
	constructor(fb,p,a=1,b=0,c=0,d=1,e=0,f=0,ux=0,uy=0,uz=0,uw=0,vx=0,vy=0){
		this.fb=fb; this.p=p
		this.#a=a;this.#b=b;this.#c=c;this.#d=d;this.#e=e;this.#f=f
		this.#ux=ux;this.#uy=uy;this.#uz=uz;this.#uw=uw
		this.#s=vx;this.#t=vy
	}
	translate(x=0,y=0){ this.#e+=x*this.#a+y*this.#c;this.#f+=x*this.#b+y*this.#d }
	scale(x=1,y=x){ this.#a*=x; this.#b*=x; this.#c*=y; this.#d*=y }
	rotate(r=0){
		const cs = Math.cos(r), sn = Math.sin(r), a=this.#a,b=this.#b,c=this.#c,d=this.#d
		this.#a=a*cs-c*sn; this.#b=b*cs-d*sn
		this.#c=a*sn+c*cs; this.#d=b*sn+d*cs
	}
	transform(a,b,c,d,e,f){
		const ta=this.#a,tb=this.#b,tc=this.#c,td=this.#d,te=this.#e,tf=this.#f
		this.#a = a*ta+c*tb; this.#b = b*ta+d*tb
		this.#c = a*tc+c*td; this.#d = b*tc+d*td
		this.#e = a*te+c*tf+e; this.#f = b*te+d*tf+f
	}
	skew(x=0, y=0){
		const ta=this.#a,tb=this.#b
		this.#a+=this.#c*y; this.#b+=this.#d*y
		this.#c+=ta*x; this.#d+=tb*x
	}
	multiply(x=1, y=0){
		const ta=this.#a,tc=this.#c
		this.#a=ta*x-this.#b*y;this.#b=ta*y+this.#b*x
		this.#c=tc*x-this.#d*y;this.#d=tc*y+this.#d*x
	}
	getTransform(){ return {a: this.#a, b: this.#b, c: this.#c, d: this.#d, e: this.#e, f: this.#f} }
	new(a=1,b=0,c=0,d=1,e=0,f=0){return new Target(this.fb,defaultProgram,a,b,c,d,e,f)}
	reset(a=1,b=0,c=0,d=1,e=0,f=0,ux=0,uy=0,uz=0,uw=0,vx=0,vy=0){this.#a=a;this.#b=b;this.#c=c;this.#d=d;this.#e=e;this.#f=f;this.#ux=ux;this.#uy=uy;this.#uz=uz;this.#uw=uw;this.#s=vx;this.#t=vy;this.p=defaultProgram}
	resetTo(t){
		this.#a=t.#a;this.#b=t.#b;this.#c=t.#c;this.#d=t.#d;this.#e=t.#e;this.#f=t.#f;this.#ux=t.#ux;this.#uy=t.#uy;this.#uz=t.#uz;this.#uw=t.#uw;this.#s=t.#s;this.#t=t.#t;this.p=t.p
	}
	box(x=0,y=0,w=1,h=w){ this.#e+=x*this.#a+y*this.#c; this.#f+=x*this.#b+y*this.#d; this.#a*=w; this.#b*=w; this.#c*=h; this.#d*=h }
	to(x, y){if(typeof x=='object')({x,y}=x);return {x:this.#a*x+this.#c*y+this.#e,y:this.#b*x+this.#d*y+this.#f}}
	from(x, y){
		if(typeof x=='object')({x,y}=x)
		const a=this.#a,b=this.#b,c=this.#c,d=this.#d, det = a*d - b*c
		return {
			x: (x*d - x*c + c*this.#f - d*this.#e)/det,
			y: (y*a - y*b + b*this.#e - a*this.#f)/det
		}
	}
	sub(){ return new Target(this.fb,this.p,this.#a,this.#b,this.#c,this.#d,this.#e,this.#f,this.#ux,this.#uy,this.#uz,this.#uw,this.#s,this.#t) }
	useShader(p=defaultProgram){ this.p = p }
	setU(ux=0,uy=0,uz=0,uw=0){this.#ux=ux;this.#uy=uy;this.#uz=uz;this.#uw=uw}
	setST(s=0,t=0){this.#s=s;this.#t=t}
	clear(r = 0, g = 0, b = 0, a = 0){
		gl.clearColor(r, g, b, a)
		pmask = (pmask&240)|(r==r)|(g==g)<<1|(b==b)<<2|(a==a)<<3
		gl.colorMask(pmask&1,pmask&2,pmask&4,pmask&8)
		let mask = GL.COLOR_BUFFER_BIT
		if(this.fb) if(++this.fb.stencil>=8) this.fb.stencil=0,mask|=GL.STENCIL_BUFFER_BIT
		else if(++mainStencil>=8) mainStencil=0,mask|=GL.STENCIL_BUFFER_BIT
		gl.stencilMask(1<<(this.fb?this.fb.stencil:mainStencil))
		if(fb!=this.fb) gl.bindFramebuffer(GL.FRAMEBUFFER, fb = this.fb)
		gl.clear(mask)
	}
	clearColor(r = 0, g = 0, b = 0, a = 0){
		gl.clearColor(r, g, b, a)
		pmask = (pmask&240)|(r==r)|(g==g)<<1|(b==b)<<2|(a==a)<<3
		gl.colorMask(pmask&1,pmask&2,pmask&4,pmask&8)
		if(fb!=this.fb) gl.bindFramebuffer(GL.FRAMEBUFFER, fb = this.fb)
		gl.clear(GL.COLOR_BUFFER_BIT)
	}
	clearStencil(){
		if(this.fb) if(++this.fb.stencil>=8){
			this.fb.stencil=0
			if(fb!=this.fb) gl.bindFramebuffer(GL.FRAMEBUFFER, fb = this.fb)
			gl.clear(GL.STENCIL_BUFFER_BIT)
		}else if(++mainStencil>=8){
			mainStencil=0
			if(fb!=this.fb) gl.bindFramebuffer(GL.FRAMEBUFFER, fb = this.fb)
			gl.clear(GL.STENCIL_BUFFER_BIT)
		}
		gl.stencilMask(1<<(this.fb?this.fb.stencil:mainStencil))
	}
	draw(buf, textures, mask = 15, blend = 1135889, size=Infinity){
		if(fb!=this.fb) gl.bindFramebuffer(GL.FRAMEBUFFER, fb = this.fb)
		const W = (fb||gl.canvas).width, H = (fb||gl.canvas).height
		if(!W|!H) return
		if(vpw!=W||vph!=H) gl.viewport(0,0,vpw=W,vph=H)
		if(curProgram!=this.p) gl.useProgram(curProgram = this.p),ux=vx=NaN
		mat2x3[0] = this.#a*2; mat2x3[3] = this.#b*2; mat2x3[1] = this.#c*2
		mat2x3[4] = this.#d*2; mat2x3[2] = this.#e*2-1; mat2x3[5] = this.#f*2-1
		gl.uniformMatrix2x3fv(curProgram.muni, false, mat2x3)
		if(ux!=this.#ux||uy!=this.#uy||uz!=this.#uz||uw!=this.#uw)
			gl.uniform4f(curProgram.uni1, ux=this.#ux, uy=this.#uy, uz=this.#uz, uw=this.#uw)
		if(vx!=this.#s) gl.uniform1ui(curProgram.uni2, vx=this.#s)
		if(vy!=this.#t) gl.uniform1ui(curProgram.uni3, vy=this.#t)
		mask = mask&2281701631|blend<<8
		if((pmask^mask)&15) gl.colorMask(mask&1,mask&2,mask&4,mask&8)
		if((pmask^mask)&496){
			if(mask&240){
				const s = fb?fb.stencil:mainStencil
				if(!(pmask&240)) gl.enable(GL.STENCIL_TEST)
				if((mask^pmask)&240){
					gl.stencilFunc(mask&32?mask&16?GL.NEVER:GL.NOTEQUAL:mask&16?GL.EQUAL:GL.ALWAYS, 255, 1<<s)
					const op = mask&128?mask&64?GL.INVERT:GL.REPLACE:mask&64?GL.ZERO:GL.KEEP
					gl.stencilOp(op, op, op)
				}
			}else if(pmask&240) gl.disable(GL.STENCIL_TEST)
		}
		if((pmask^mask)&1996488704) gl.blendEquationSeparate((mask>>24&7)+32773,(mask>>28&7)+32773)
		if((pmask^mask)&16776960) gl.blendFuncSeparate((mask>>8&15)+766*!!(mask&3584), (mask>>16&15)+766*!!(mask&917504), (mask>>12&15)+766*!!(mask&57344), (mask>>20&15)+766*!!(mask&14680064))
		if((mask^pmask)&134217728) if(mask&134217728) gl.enable(GL.DITHER); else gl.disable(GL.DITHER)
		pmask = mask
		let tt = this.fb?.texture
		if(Array.isArray(textures)){
			if(textures.length < curProgram.tunis.length || textures.length>16) return void((warns&4)&&(warns&=-5,console.warn('.draw(): Shader expects '+curProgram.tunis.length+' texture(s)')))
			let av = 65535
			for(let i = 0; i < textures.length; i++){
				const t = textures[i]
				if(t==tt) return void((warns&8)&&(warns&=-9,console.warn('.draw(): Cannot use texture that is also being drawn to')))
				if(t.unit > -1){
					av &= -32769>>t.unit, gl.uniform1i(curProgram.tunis[i], t.unit)
					if((t.mipmap&3)==3){
			  			if(currentUnit!=(currentUnit=t.unit|0)) gl.activeTexture(GL.TEXTURE0+currentUnit)
			  			gl.generateMipmap(t.layers?GL.TEXTURE_2D_ARRAY:GL.TEXTURE_2D)
	  				}
				}
			}
			for(let i = 0; i < textures.length; i++){
				const t = textures[i]
				if(t.unit > -1) continue
				currentUnit = Math.clz32(av)-16
				av &= -32769>>currentUnit
				gl.activeTexture(GL.TEXTURE0+currentUnit)
				gl.uniform1i(curProgram.tunis[i], currentUnit)
				if((t.mipmap&3)==3) gl.generateMipmap(bindt(t)); else bindt(t)
			}
		}else if(textures){
			if(curProgram.tunis.length>1) return warns!=(warns&=-5)?console.warn('.draw(): Shader expects '+curProgram.tunis.length+' texture(s)'):void 0
			if(textures==tt)return warns!=(warns&=-9)?console.warn('.draw(): Cannot use a texture that is also being drawn to'):void 0
			if(textures.unit > -1){
				gl.uniform1i(curProgram.tunis[0], textures.unit)
				if((textures.mipmap&3)==3){
			 	if(currentUnit!=(currentUnit=textures.unit|0)) gl.activeTexture(GL.TEXTURE0+currentUnit)
			 	gl.generateMipmap(textures.layers?GL.TEXTURE_2D_ARRAY:GL.TEXTURE_2D)
		 	}
			}else{
				gl.uniform1i(curProgram.tunis[0], currentUnit)
				if((textures.mipmap&3)==3) gl.generateMipmap(bindt(textures)); else bindt(textures)
			}
		}
		if(tt) tt.mipmap|=1
		if(buf instanceof WebGLVertexArrayObject){
			if(bvo != buf) gl.bindVertexArray(bvo = buf)
			gl.drawArraysInstanced(GL.TRIANGLE_STRIP, 0, 4, Math.min(size, buf.size))
			return
		}
		gl.bindBuffer(GL.ARRAY_BUFFER, glbuf)
		if(bvo) gl.bindVertexArray(bvo = null)
		if(!buf.arr){
			gl.bufferData(GL.ARRAY_BUFFER, buf, GL.STREAM_DRAW)
			gl.drawArraysInstanced(GL.TRIANGLE_STRIP, 0, 4, Math.min(size, buf.byteLength/64))
		}else{
			if(!buf.arr.cur)return warns!=(warns&=-65)?console.warn('.draw(): Mesh has already been consumed. Use .upload() if you want to draw the mesh more than once'):void 0
			gl.bufferData(GL.ARRAY_BUFFER, buf.arr.length*32768+buf.arr.i*4, GL.STREAM_DRAW)
			for(let i = 0; i < buf.arr.length; i++)
				gl.bufferSubData(GL.ARRAY_BUFFER, i*32768, buf.arr[i])
			gl.bufferSubData(GL.ARRAY_BUFFER, buf.arr.length*32768, buf.arr.cur, 0, buf.arr.i)
			gl.drawArraysInstanced(GL.TRIANGLE_STRIP, 0, 4, Math.min(size, buf.size))
			buf.delete()
		}
	}
	delete(){
		const fb = this.fb
		if(!fb) return
		gl.deleteFramebuffer(fb)
		if(fb.stencilR) gl.deleteRenderbuffer(fb.stencilR)
		if(fb.colorR) gl.deleteRenderbuffer(fb.colorR)
	}
}
let bvo = null, glbuf, curProgram, defaultProgram
NS.setTargetCanvas = c => {
	gl = c.getContext('webgl2', {preserveDrawingBuffer: false, antialias: false, depth: false, premultipliedAlpha: true, stencil: true})
	gl.pixelStorei(37440, 1) // flip y
	glbuf = gl.createBuffer()
	gl.bindBuffer(GL.ARRAY_BUFFER, glbuf)
	gl.vertexAttribPointer(0, 3, F, false, 64, 0)
	gl.vertexAttribPointer(1, 3, F, false, 64, 12)
	gl.vertexAttribPointer(2, 4, F, false, 64, 24)
	gl.vertexAttribPointer(3, 4, F, false, 64, 40)
	gl.vertexAttribPointer(4, 2, F, false, 64, 56)
	for(let i = 0; i < 5; i++){
		gl.enableVertexAttribArray(i)
		gl.vertexAttribDivisor(i, 1)
	}
	vert = gl.createShader(GL.VERTEX_SHADER)
	gl.shaderSource(vert, `#version 300 es
uniform mat2x3 global;
layout(location=0) in mat2x3 m;
layout(location=2) in vec4 _uv;
layout(location=3) in vec4 _tint;
layout(location=4) in vec2 values;
out vec3 uv; out vec2 pos,xy; flat out float effect; flat out vec4 tint;
void main(){
	pos = vec2(gl_VertexID&1, gl_VertexID>>1);
	gl_Position = vec4(vec3(xy=vec3(pos,1.)*m,1.)*global,0.,1.);
	uv = vec3(_uv.xy + pos*_uv.zw, values.x); tint = _tint; effect = values.y;
}`)
	gl.compileShader(vert)
	defaultProgram = NS.Shader(`void main(){ color = texture(tex0, uv.xy)*(1.-tint); }`)
	gl.useProgram(curProgram = defaultProgram)
	gl.clearStencil(0)
	gl.stencilMask(1)
	gl.disable(GL.DEPTH_TEST)
	gl.enable(GL.BLEND)
	gl.disable(GL.DITHER)
	for(const ext of ['EXT_color_buffer_float', 'EXT_color_buffer_half_float']) gl.getExtension(ext)
	fb = bvo = null
	mainStencil = 0
	pmask = 285217039
	ux=0, uy=0, uz=0, uw=0, vx=0, vy=0
	return new Target(null, defaultProgram)
}
Object.assign(NS, {
	R: 1, G: 2, B: 4, A: 8,
	RGB: 7, RGBA: 15,
	IF_ONE: 16,
	IF_ZERO: 32,
	NO_DRAW: 48,
	UNSET: 64,
	SET: 128,
	FLIP: 192,
	DITHERING: 134217728,
	ONE: 17, ZERO: 0,
	RGB_ONE: 1,
	A_ONE: 16,
	SRC: 34,
	RGB_SRC: 2,
	ONE_MINUS_SRC: 51,
	RGB_ONE_MINUS_SRC: 3,
	SRC_ALPHA: 68,
	RGB_SRC_ALPHA: 4,
	A_SRC: 64,
	ONE_MINUS_SRC_ALPHA: 85,
	RGB_ONE_MINUS_SRC_ALPHA: 5,
	A_ONE_MINUS_SRC: 80,
	DST: 136,
	RGB_DST: 8,
	ONE_MINUS_DST: 153,
	RGB_ONE_MINUS_DST: 9,
	DST_ALPHA: 102,
	RGB_DST_ALPHA: 6,
	A_DST: 96,
	ONE_MINUS_DST_ALPHA: 119,
	RGB_ONE_MINUS_DST_ALPHA: 7,
	A_ONE_MINUS_DST: 112,
	SRC_ALPHA_SATURATE: 170,
	RGB_SRC_ALPHA_SATURATE: 10,

	ADD: 17,
	RGB_ADD: 1,
	A_ADD: 16,
	SUBTRACT: 85,
	RGB_SUBTRACT: 5,
	A_SUBTRACT: 80,
	REVERSE_SUBTRACT: 102,
	RGB_REVERSE_SUBTRACT: 6,
	A_REVERSE_SUBTRACT: 96,
	MIN: 34,
	RGB_MIN: 2,
	A_MIN: 32,
	MAX: 51,
	RGB_MAX: 3,
	A_MAX: 48,

	UPSCALE_PIXELATED: 1, DOWNSCALE_PIXELATED: 2, DOWNSCALE_MIPMAP_NEAREST: 4,
	PIXELATED: 7, MIPMAPS: 8,
	REPEAT: 80, REPEAT_MIRRORED: 160, REPEAT_X: 16, REPEAT_MIRRORED_X: 32, REPEAT_Y: 64, REPEAT_MIRRORED_Y: 128,
	FIXED:0,FLOAT:1,UINT:2,LAYERED:4
})
NS.Blend = (src = 17, combine = 17, dst = 0) => src|dst<<8|combine<<16
NS.Blend.REPLACE = 1114129
NS.Blend.DEFAULT = 1135889
NS.PI ??= Math.PI; NS.PI2 ??= NS.PI*2
NS.colorSpace = space => {gl.drawingBufferColorSpace = space}

NS.Target = (w = 0, h = 0, format = NS.Formats.RGBA, stencil = true) => {
	const t = gl.createFramebuffer()
	gl.bindFramebuffer(GL.READ_FRAMEBUFFER, t)
	t.stencil = NaN
	t.texture = null; t.l = 0
	if(typeof w == 'boolean') stencil = w, w = 0
	if(typeof w == 'object'){
		t.l = h
		t.texture = w; stencil = !!format; format = t.texture.format
		t.width = w = t.texture.width; t.height = h = t.texture.height
		!t.texture.layers ? gl.framebufferTexture2D(GL.READ_FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, t.texture, 0)
		: gl.framebufferTextureLayer(GL.READ_FRAMEBUFFER, GL.COLOR_ATTACHMENT0, t.texture, 0, t.l)
	}else{
		t.width = w; t.height = h
		const s = t.colorR = gl.createRenderbuffer()
		gl.bindRenderbuffer(GL.RENDERBUFFER, s)
		gl.renderbufferStorage(GL.RENDERBUFFER, format[0], w, h)
		gl.framebufferRenderbuffer(GL.READ_FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.RENDERBUFFER, s)
	}
	t.format = format
	if(stencil){
		const s = t.stencilR = gl.createRenderbuffer()
		gl.bindRenderbuffer(GL.RENDERBUFFER, s)
		gl.renderbufferStorage(GL.RENDERBUFFER, GL.STENCIL_INDEX8, w, h)
		gl.framebufferRenderbuffer(GL.READ_FRAMEBUFFER, GL.STENCIL_ATTACHMENT, GL.RENDERBUFFER, s)
		t.stencil = 0
	}
	return new Target(t, defaultProgram)
}
NS.Shader = (src, t=[], w=0) => {
	const p = gl.createProgram()
	let us='',pr = -1
	for(let i=0;i<16;i++){
		const type = t[i]||0
		if(type==pr)us+=',tex'+i
		else pr=type, us+=';uniform '+(type&3?type&2?'highp u':'highp ':'lowp ')+'sampler2D'+(type&4?'Array tex':' tex')+i
	}
	const frag = gl.createShader(GL.FRAGMENT_SHADER)
	gl.shaderSource(frag, `#version 300 es
precision mediump float; precision highp int;
in vec3 uv; in vec2 pos,xy; flat in float effect; flat in vec4 tint; out ${w?w>1?'u':'highp ':'lowp '}vec4 color${us};uniform highp vec4 u; uniform highp uint s, t;
`+src)
	gl.compileShader(frag)
	const err = gl.getShaderInfoLog(frag)
	if(err){
		console.warn('GLSL error:\n',err)
		gl.shaderSource(frag, `#version 300 es
out lowp vec4 c;void main(){c=vec4(0,0,0,1);}`)
		gl.compileShader(frag)
	}
	gl.attachShader(p, vert)
	gl.attachShader(p, frag)
	gl.linkProgram(p)
	p.muni = gl.getUniformLocation(p, 'global')
	p.uni1 = gl.getUniformLocation(p, 'u')
	p.uni2 = gl.getUniformLocation(p, 's')
	p.uni3 = gl.getUniformLocation(p, 't')
	p.tunis = Array.from({length:16},(_,i) => gl.getUniformLocation(p,'tex'+i))
	while(p.tunis.length&&!p.tunis[p.tunis.length-1]) p.tunis.pop()
	return p
}
NS.autoCanvas = (renderFn) => {
	const c = document.createElement('canvas')
	document.documentElement.append(c)
	c.style = 'position: fixed; top: 0; left: 0; border: 0; padding: 0; margin: 0; transform-origin: 0 0'
	const x = NS.setTargetCanvas(c)
	let last = -1000000
	requestAnimationFrame(function f(){
		requestAnimationFrame(f)
		x.resize(Math.round(visualViewport.width * visualViewport.scale * devicePixelRatio), Math.round(visualViewport.height * visualViewport.scale * devicePixelRatio))
		c.style.transform = 'scale('+1/devicePixelRatio+')'
		x.reset(devicePixelRatio/x.width,0,0,devicePixelRatio/x.height,0,0)
		renderFn(x.width/devicePixelRatio, x.height/devicePixelRatio, -.001*Math.max(-1e3, last-(last=performance.now())))
	})
	return x
}}