var ld = require('../')

var key = new Buffer([0x55,0xFE,0xF6,0x30,0x62,0xBF,0x0B,0xC1,0xC9,0xB3,0x7C,0x34,0x97,0x3E,0x29,0xFB])
key = flipBytes(key)

function init(){
	var tag = [
	0x04,0x38,0x66,0x82,0x52,0xa2,0x40,0x81,0x31,0x48,0x1f,0x00,0xe1,0x10,0x12,0x00,
	0x01,0x03,0xa0,0x0c,0x34,0x03,0x13,0xd1,0x01,0x0f,0x54,0x02,0x65,0x6e,0x39,0x36,
	0x30,0x36,0x32,0x33,0x34,0x52,0x32,0x39,0x31,0x35,0xfe,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x39,0x36,0x30,0x36,0x32,0x33,0x34,0x52,
	0x32,0x39,0x31,0x35,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0xa6,0x1c,0xf3,0x7f,0x1a,0xfd,0x92,0x27,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
	0x60,0x0c,0x3f,0xbd,0x04,0x00,0x00,0x1e,0xc0,0x05,0x00,0x00,0x00,0x00,0x00,0x00,
	0x00,0x00,0x00,0x00]

	var buf = new Buffer([0xa6,0x1c,0xf3,0x7f,0x1a,0xfd,0x92,0x27])
	// buf = buf.reverse()
	buf = flipBytes(buf)
	console.log(buf.toString('hex'))
	console.log(decrypt(buf).toString('hex'))
}

function flipBytes(buf){
	var out = new Buffer(buf.length)
	for(var i = 0; i<buf.length; i+=4)
		out.writeUInt32BE(buf.readUInt32LE(i) >>> 0,i)
	return out
}

function flipUInt32(num){
	var buf = new Buffer(4)
	buf.writeUInt32LE(num,0)
	return buf.readUInt32BE(0) >>> 0
}

function encrypt(buffer){
	var buf = new Buffer(8)
	var d1 = buffer.readInt32LE(0)
	var d2 = buffer.readInt32LE(4)
	var keya = [key.readUInt32BE(0),key.readUInt32BE(4),key.readUInt32BE(8),key.readUInt32BE(12)]
	var data = TEA.encipher([d1,d2],keya)
	buf.writeUInt32LE(data[0],0)
	buf.writeUInt32LE(data[1],4)
	// console.log('ENCRYPT',buffer.toString('hex'),buf.toString('hex'))
	return buf
}

function decrypt(buffer){
	var buf = new Buffer(8)
	var d1 = buffer.readUInt32LE(0)
	var d2 = buffer.readUInt32LE(4)
	buffer = flipBytes(buffer)
	var keya = [key.readUInt32BE(0),key.readUInt32BE(4),key.readUInt32BE(8),key.readUInt32BE(12)]
	var data = TEA.decipher([d1,d2],keya)
	buf.writeUInt32LE(data[0],0)
	buf.writeUInt32LE(data[1],4)
	// console.log('DECRYPT',buffer.toString('hex'),buf.toString('hex'))
	return buf
}

var TEA = {
    encipher: function(v,k){ // 64bit v, 128bit k
        var v0=v[0],
            v1=v[1],
            sum=0,
            delta=0x9E3779B9,
            k0=k[0],
            k1=k[1],
            k2=k[2],
            k3=k[3];

        for(var i=0;i<32;i++)
        {
            sum += delta;
            sum >>>= 0;
            v0 += (((v1<<4)+k0) ^ (v1+sum) ^ ((v1>>>5)+k1)) >>> 0;
            v1 += (((v0<<4)+k2) ^ (v0+sum) ^ ((v0>>>5)+k3)) >>> 0;
        }

        return [v0 >>> 0,v1 >>> 0];
    },
    decipher: function(v,k)
    {
        var v0=v[0],
            v1=v[1],
            sum=0xC6EF3720,
            delta=0x9E3779B9,
            k0=k[0],
            k1=k[1],
            k2=k[2],
            k3=k[3];
        for(var i=0;i<32;i++)
        {
            v1 -= (((v0<<4)+k2) ^ (v0+sum) ^ ((v0>>>5)+k3)) >>> 0
            v0 -= (((v1<<4)+k0) ^ (v1+sum) ^ ((v1>>>5)+k1)) >>> 0
            sum -= delta;
            sum >>>= 0;
        }
       
        return [v0 >>> 0,v1 >>> 0];
    }
}

function ToUint32(x) {
    return x >>> 0;
}


init()