/** @param {MessageEvent<string>} e */
onmessage = (e) => {	
	/** @type {ResponseData} */
	let data = {url:e.data, image:null, errored:false};
	fetch(data.url, {mode:'cors'})
	.then(r=>r.blob())
	.then(b => createImageBitmap(b))
	.then(image => {
		data.image = image;
	})
	.catch(() => {
		data.errored = true;
	})
	.finally(() =>{
		self.postMessage(data);
	});
}