;(function() {
  let valueElement = document.querySelector('.js-value'),
    rulerUlElement = document.querySelector('.js-ruler'),
    rulerContainerElement = document.querySelector('.js-ruler-container'),
    scaleElement = document.querySelector('.js-scale'),
    scaleWidth = scaleElement.clientWidth,
    translateX = 0,
    pointX = 0,
    startX = 0,
    offsetX = 0,
    startTime = new Date().getTime()

  const min = 60,
    max = 105,
    maxTranslate = -((max - min) * scaleWidth),
    deceleration = 0.0006

  function scrollTo(x, time = 0, easing = 'cubic-bezier(0.1, 0.57, 0.1, 1)') {
    rulerUlElement.style.transitionTimingFunction = easing
    rulerUlElement.style.transitionDuration = `${time}ms`
    translate(x)
  }
  function translate(x) {
    let value = min - Math.round(x / scaleWidth)
    if (value < min) {
      value = min
    } else if (value > max) {
      value = max
    }
    rulerUlElement.style.transform = `translateX(${x}px)`
    rulerUlElement.style.webkitTransform = `translateX(${x}px)`
    valueElement.innerHTML = value
    translateX = x
  }
  function handleOutBoundary() {
    if (translateX > 0 || translateX < maxTranslate) {
      if (translateX > 0) {
        translateX = 0
      } else if (translateX < maxTranslate) {
        translateX = maxTranslate
      }
      scrollTo(translateX, 600)
      return true
    }
  }
  function startHandler(event) {
    startTime = new Date().getTime()
    offsetX = 0
    startX = translateX
    pointX = event.touches[0].pageX
  }

  function moveHandler(event) {
    event.preventDefault()
    // 实际滑动距离
    offsetX = event.touches[0].pageX - pointX
    pointX = event.touches[0].pageX
    let x = translateX + offsetX
    // 超出边界需要减速
    if (x > 0 || x < maxTranslate) {
      x = translateX + offsetX / 3
    }
    translate(x)
  }

  function endHandler(event) {
    event.preventDefault()
    let duration = new Date().getTime() - startTime,
      easing = ''

    // 超出边界值
    if (handleOutBoundary()) {
      return
    }
    if (translateX % scaleWidth !== 0) {
      translateX = Math.round(translateX / scaleWidth) * scaleWidth
    }
    scrollTo(translateX)
    if (duration < 300) {
      let distance = translateX - startX,
        speed = Math.abs(distance) / duration,
        destination =
          translateX +
          ((speed * speed) / (2 * deceleration)) * (distance < 0 ? -1 : 1),
        time = speed / deceleration
      if (destination > 0) {
        destination = (rulerContainerElement.clientWidth / 2.5) * (speed / 8)
        distance = Math.abs(translateX) + destination
        time = distance / speed
      } else if (destination < maxTranslate) {
        destination =
          maxTranslate - (rulerContainerElement.clientWidth / 2.5) * (speed / 8)
        distance = Math.abs(destination - translateX)
        time = distance / speed
      }
      destination = Math.round(destination)
      if (destination !== translateX) {
        if (destination > 0 || destination < maxTranslate) {
          easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }
        if (destination % scaleWidth !== 0) {
          destination = Math.round(destination / scaleWidth) * scaleWidth
        }
        scrollTo(destination, time, easing)
      }
    }
  }

  function transitionendHandler() {
    rulerUlElement.style.transitionDuration = `0ms`
    handleOutBoundary()
  }
  rulerUlElement.style.width = `${scaleWidth * (max - min)}px`
  rulerUlElement.addEventListener('touchstart', startHandler)
  rulerUlElement.addEventListener('touchmove', moveHandler)
  rulerUlElement.addEventListener('touchend', endHandler)
  rulerUlElement.addEventListener('transitionend', transitionendHandler)
})()
