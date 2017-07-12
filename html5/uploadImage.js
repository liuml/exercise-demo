(function(){
	document.querySelector('.logo').addEventListener('click',function(){
		document.querySelector('input[type="file"]').click();
	});
	document.querySelector('input[type="file"]').addEventListener('change',function(){
		fileSelected();
	});
	var maxFilesize = 1024*1024*2;	//2M
	function fileSelected(){
		// 读取文件
		var file = document.querySelector('input[type="file"]').files[0];
		var regFile = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
		if (!regFile.test(file.type)) {
			alert('文件格式必须为图片');
			return;
		}
		var reader = new FileReader(),
			image = new Image(),
			canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');
		// 文件加载完成
		reader.addEventListener('load',function(){
			var url = this.result;
			image.src = url;
		});
		// 图片加载完成
		image.addEventListener('load',function(){
			var w = image.naturalWidth,
				h = image.naturalHeight,
				scale = 3;	//图片缩放比例，此处是把图片大小高宽均缩小3倍
			canvas.width = w/scale;
			canvas.height = h/scale;
			ctx.drawImage(image,0,0,w,h,0,0,canvas.width,canvas.height);
			//上传文件
			fileUpload();
		});
		//用文件加载器加载文件
		reader.readAsDataURL(file);  
		
		function fileUpload(){
			var quality = 0.3;	//图片的质量
			var data = canvas.toDataURL('image/jpeg',quality);
			//调用ajax上传图片base64数据
			// 设置logo
			document.querySelector('.logo img').src = data;
			
			// 转为Blob对象
			// data = data.split(',')[1];
			// data = window.atob(data);
			// var ia = new Uint8Array(data.length);
			// for(var i = 0; i < data.length;i++){
			// 	ia[i] = data.charCodeAt(i);
			// }
			// var blob = new Blob([ia],{
			// 	type:'image/jpeg'
			// });
			// console.log(blob);
		}

	}
})();