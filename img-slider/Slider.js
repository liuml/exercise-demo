function Slider(args) {
  this.wrap = args.dom
  this.list = args.list
  this.index = args.index || 0
  this.init()
  this.renderDom()
  this.regEvent()
}
Slider.prototype.init = function () {
  // 获取窗口的高宽比例
  this.radio = window.innerHeight / window.innerWidth
  // translate的距离
  this.translateOffset = window.innerWidth
}

Slider.prototype.renderDom = function () {
  var wrap = this.wrap
  var datalist = this.list
  var length = datalist.length
  var _this = this

  this.ulElement = document.createElement('ul')
  this.ulElement.style.width = length * this.translateOffset + 'px'
  this.ulElement.style.height = window.innerHeight + 'px'
  for (var i = 0; i < length; i++) {
    var liElement = document.createElement('li')
    var imgSrc = datalist[i]
    var imgObj = new Image()
    imgObj.src = imgSrc
    imgObj.onload = function () {
      var w = this.width
      var h = this.height
      // 长图
      if (h / w > _this.radio) {
        // 修改li的align-items为flex-start，由于Safari浏览器不支持alignItems所以使用增加 class的方式
        liElement.classList.add('ai-start')
      }
    }
    liElement.appendChild(imgObj)
    this.ulElement.appendChild(liElement)
    this.ulElement.style.transform = 'translateX(calc(-100vw * '+ this.index +'))'
    this.ulElement.style.webkitTransform = 'translateX(calc(-100vw * '+ this.index +'))'
  }
  wrap.appendChild(this.ulElement)
}

Slider.prototype.regEvent = function () {
  var _this = this
  var ulElement = this.ulElement
  var translateOffset = this.translateOffset
  var length = this.list.length

  var startHandler = function (event) {
    _this.startX = event.touches[0].pageX
    _this.startY = event.touches[0].pageY
    _this.offsetX = 0
    _this.startTime = new Date() * 1
  }
  var moveHandler = function (event) {
    // event.preventDefault()
    _this.offsetX = event.touches[0].pageX - _this.startX
    _this.offsetY = event.touches[0].pageY - _this.startY
    var translateX = -(translateOffset * _this.index) +  _this.offsetX
    var imgHeight = event.target.clientHeight
    if (imgHeight > window.innerHeight && Math.abs(_this.offsetY) > Math.abs(_this.offsetX)) {
      // 当图片是超出屏幕，并且垂直方向上滑动距离超过水平方向上滑动的距离，则认为是要上下滚动图片
      return
    }
    ulElement.style.transform = 'translateX('+ translateX +'px)'
    ulElement.style.webkitTransform = 'translateX('+ translateX +'px)'
  }
  var endHandler = function (event) {
    var endTime = new Date() * 1
    var boundaryW = translateOffset / 5

    if (endTime - _this.startTime > 800) {
      if (_this.offsetX >= boundaryW) {
        // 上一张图片
        _this.go('-1')
      } else if (_this.offsetX <= -boundaryW) {
        // 下一张图片
        _this.go('1')
      } else{
        // 留在当前图片
        _this.go('0')
      }
    } else {
      // 滑动距离没有超过边界值，但是时间比较短
      if (_this.offsetX > 50) {
        // 上一张图片
        _this.go('-1')
      } else if (_this.offsetX < -50) {
        // 下一张图片
        _this.go('1')
      } else {
        _this.go('0')
      }
    }
  }

  ulElement.addEventListener('touchstart', startHandler)
  ulElement.addEventListener('touchmove', moveHandler)
  ulElement.addEventListener('touchend', endHandler)
}

Slider.prototype.go = function (n) {
  var cindex
  var length = this.list.length
  var ulElement = this.ulElement
  if (typeof n === 'number') {
    // 显示第几张图片
    cindex = n
  } else if (typeof n === 'string') {
    cindex = this.index + n * 1
  }
  if (cindex > length - 1) {
    cindex = length - 1
  } else if (cindex < 0) {
    cindex = 0
  }
  this.index = cindex
  ulElement.style.transform = 'translateX(calc(-100vw * '+ this.index +'))'
  ulElement.style.webkitTransform = 'translateX(calc(-100vw * '+ this.index +'))'
}