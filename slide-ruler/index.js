;(function() {
  let slideRuler = new SlideRuler({
    container: document.querySelector(".js-ruler-container"),
    max: 105,
    min: 50,
    value: 70,
    callback(value) {
      document.querySelector(".js-value").innerHTML = value;
    }
  });
  slideRuler.init();
})();
