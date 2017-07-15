(function(){
	$('.logo').on('click',function(){
		$('input[type="file"]').click();
	});
	$('input[type="file"]').on('change',function(){
		fileSelected();
	});
	$('.cancel').on('click', function() {
	    $("#showEdit").fadeOut();
	    $('#showResult').fadeIn();
	});

	$('.confirm').on('click', function() {
	    $("#showEdit").fadeOut();
	    var $image = $('#report > img');
	    var dataURL = $image.cropper("getCroppedCanvas");
	    var imgurl = dataURL.toDataURL("image/jpeg", 0.5);
	    $(".logo > img").attr("src", imgurl);
	    $('#showResult').fadeIn();

	});
	var maxSize = 1024*1024*3;	//3M
	function fileSelected(){
		// 读取文件
		var file = $('input[type="file"]')[0].files[0];
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
		$(reader).on('load',function(){
			var url = this.result;
			image.src = url;
		});
		// 图片加载完成
		$(image).on('load',function(){
			var w = image.naturalWidth,
				h = image.naturalHeight,
				scale = 1,	//图片缩放比例
				quality = 0.5;
			scale = maxSize > file.size ? 1 : 10;
			quality = maxSize > file.size ? 0.8: 0.5;
			canvas.width = w/scale;
			canvas.height = h/scale;
			ctx.drawImage(image,0,0,w,h,0,0,canvas.width,canvas.height);
			var data = canvas.toDataURL('image/jpeg',quality);
			$('#report').html('<img src="' + data + '" style="width: 100%;height:100%">');
			cutImage();
		});
		//用文件加载器加载文件
		reader.readAsDataURL(file);  
		
	}
	function cutImage(){
		$('#showResult').fadeOut();
        $("#showEdit").fadeIn();
        var $image = $('#report > img');
        $image.cropper({
            aspectRatio: 1 / 1,
            viewMode:1,
           	dragMode:'move',
            guides: false,
            highlight: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            background: false,
            minContainerHeight: 400,
            minContainerWidth: 300
        });
	}
})();