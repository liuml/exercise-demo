;(function() {
  let valueElement = document.querySelector('.js-value'),
    rulerUlElement = document.querySelector('.js-ruler'),
    scaleElement = document.querySelector('.js-scale'),
    scaleWidth = scaleElement.clientWidth,
    index = 0,
    startX = 0,
    offsetX = 0,
    startTime = new Date() * 1

  const min = 60,
    max = 105

  function startHandler(event) {
    startX = event.touches[0].pageX
    startTime = new Date() * 1
    offsetX = 0
    console.log(startX)
  }

  function moveHandler(event) {
    event.preventDefault()
    // 实际滑动距离
    offsetX = event.touches[0].pageX - startX
    // 划过几格
    slideNum = Math.round(offsetX / scaleWidth)
    offsetX = slideNum * scaleWidth
    let translateX = -(scaleWidth * index) + offsetX
    rulerUlElement.style.transform = `translateX(${translateX}px)`
    rulerUlElement.style.webkitTransform = `translateX(${translateX}px)`
  }

  function endHandler() {
    console.log('offsetTime', new Date() * 1 - startTime)
    console.log('offsetX', offsetX)
    // 左滑
    if (offsetX < 0) {
      index += Math.abs(offsetX / scaleWidth)
    } else {
      index -= Math.abs(offsetX / scaleWidth)
    }
    if (index < 0) {
      index = 0
      rulerUlElement.style.transform = `translateX(0px)`
      rulerUlElement.style.webkitTransform = `translateX(0px)`
    } else if (index > max - min) {
      index = max - min
      let translateX = -(scaleWidth * index)
      rulerUlElement.style.transform = `translateX(${translateX}px)`
      rulerUlElement.style.webkitTransform = `translateX(${translateX}px)`
    }
    valueElement.innerHTML = min + index
  }

  rulerUlElement.style.width = `${scaleWidth * (max - min)}px`
  rulerUlElement.addEventListener('touchstart', startHandler)
  rulerUlElement.addEventListener('touchmove', moveHandler)
  rulerUlElement.addEventListener('touchend', endHandler)
})()
