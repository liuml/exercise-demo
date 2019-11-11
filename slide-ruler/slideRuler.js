class SlideRuler {
	constructor({
		container,
		max,
		min,
		value,
		deceleration = 0.0006,
		callback
	}) {
		this.container = container;
		this.max = max;
		this.min = min;
		this.value = value || min;
		this.deceleration = deceleration;
		this.callback = callback;
		this.translateX = 0;
		this.pointX = 0;
		this.startX = 0;
		this.offsetX = 0;
		this.maxTranslate = 0;
		this.scaleWidth = 0;
		this.startTime = new Date().getTime();
	}
	init() {
		this.render();
		this.regEvent();
	}
	render() {
		this.ruler = this.getSliderRuler();
		this.container.appendChild(this.ruler);
		this.container.appendChild(this.getRulerMark());
		this.scaleWidth = this.ruler.querySelector('.scale-item').clientWidth;
		this.maxTranslate = -((this.max - this.min) * this.scaleWidth);
		this.ruler.style.width = `${this.scaleWidth * (this.max - this.min)}px`;
	}
	regEvent() {
		this.ruler.addEventListener('touchstart', this.startHandler);
		this.ruler.addEventListener('touchmove', this.moveHandler)
		this.ruler.addEventListener('touchend', this.endHandler)
		this.ruler.addEventListener('transitionend', this.transitionendHandler)
	}
	getSliderRuler() {
		let rulerElement = document.createElement('ul');
		rulerElement.className = 'ruler-content';
		for (let i = this.min; i <= this.max; i++) {
			let scaleElement = document.createElement('li');
			let numberElement = document.createElement('div');
			scaleElement.className = 'scale-item';
			numberElement.className = 'number';
			scaleElement.appendChild(numberElement);
			if (i % 5 === 0) {
				let numberTextElement = document.createElement('div');
				numberElement.className = 'number number-part';
				numberTextElement.className = 'number-text';
				numberTextElement.innerHTML = i;
				scaleElement.appendChild(numberTextElement);
			}
			rulerElement.appendChild(scaleElement);
		}
		return rulerElement;
	}
	getRulerMark() {
		let markElement = document.createElement('div');
		markElement.className = 'mark';
		return markElement;
	}
	translate(x) {
		let value = this.min - Math.round(x / this.scaleWidth);
		if (value < this.min) {
			value = this.min;
		} else if (value > this.max) {
			value = this.max;
		}
		this.translateX = x;
		this.value = value;
		this.ruler.style.transform = `translateX(${x}px)`;
		this.ruler.style.webkitTransform = `translateX(${x}px)`;
		this.callback && this.callback(value);
	}
	scrollTo(x, time = 0, easing = 'cubic-bezier(0.1, 0.57, 0.1, 1)') {
		this.ruler.style.transitionTimingFunction = easing;
		this.ruler.style.transitionDuration = `${time}ms`;
		this.translate(x);
	}
	isOutBoundary() {
		if (this.translateX > 0 || this.translateX < this.maxTranslate) {
			this.translateX = this.translateX > 0 ? 0 : this.maxTranslate;
			console.log('isOutBoundary', this.translateX)
			this.scrollTo(this.translateX, 600);
			return true;
		}
	}
	/**
	 * 刻度尺滑动距离要自动吸附到最近的刻度上，不能在两个刻度中间
	 */
	roundTranslate(translateX) {
		if (translateX % this.scaleWidth !== 0) {
			return Math.round(translateX / this.scaleWidth) * this.scaleWidth;
		}
	}
	inertiaSliding(time) {
		let easing = '';
		let distance = this.translateX - this.startX;
		let speed = Math.abs(distance) / time;
		let destination = this.translateX + ((speed * speed) / (2 * this.deceleration)) * (distance < 0 ? -1 : 1);
		let duration = speed / this.deceleration;
		if (destination > 0) {
			destination = (this.container.clientWidth / 2.5) * (speed / 8);
			distance = Math.abs(this.translateX) + destination;
			duration = distance / speed;
		} else if (destination < this.maxTranslate) {
			destination = this.maxTranslate - (this.container.clientWidth / 2.5) * (speed / 8);
			distance = Math.abs(destination - this.translateX);
			duration = distance / speed;
		}
		destination = Math.round(destination);
		// 如果有惯性滑动
		if (destination !== this.translateX) {
			// 惯性滑动超出了边界
			if (destination > 0 || destination < this.maxTranslate) {
				easing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
			}
			destination = this.roundTranslate(destination);
			console.log('inertiaSliding', destination)
			this.scrollTo(destination, duration, easing);
		}
	}
	startHandler = event => {
		let point = event.touches[0];
		this.startTime = new Date().getTime();
		this.offsetX = 0;
		this.startX = this.translateX;
		this.pointX = point.pageX;
	}
	moveHandler = event => {
		event.preventDefault();
		let point = event.touches[0];
		this.offsetX = point.pageX - this.pointX;
		this.pointX = point.pageX;
		let x = this.translateX + this.offsetX;
		// 超出边界需要减速
		if (x > 0 || x < this.maxTranslate) {
			x = this.translateX + this.offsetX / 3;
		}
		this.translate(x);
	}
	endHandler = event => {
		event.preventDefault();
		let duration = new Date().getTime() - this.startTime;
		// 超出边界
		if (this.isOutBoundary()) {
			return;
		}
		this.translateX = this.roundTranslate(this.translateX);
		console.log('endHandler', this.translateX)
		this.scrollTo(this.translateX);
		// 处理惯性滑动
		if (duration < 300) {
			this.inertiaSliding(duration);
		}
	}
	transitionendHandler = () => {
		this.ruler.transitionDuration = '0ms';
		this.isOutBoundary();
	}
}