import "./assets/stylesheets/features.scss";
import "./assets/stylesheets/flying.scss";
import "./assets/stylesheets/footer.scss";
import "./assets/stylesheets/header.scss";
import "./assets/stylesheets/nav.scss";
import "./assets/stylesheets/normalize.scss";
import "./assets/stylesheets/startjourney.scss";
import "./assets/stylesheets/style.scss";
import "./assets/stylesheets/taptofly.scss";
import "./assets/stylesheets/vision.scss";

/* Media screen size */
var over1440 = window.matchMedia('(min-width: 1439px)');

/* Slider */

function $(elem) {
  return document.querySelector(elem);
}
function hasClass(el, className) {
  return el.classList ? el.classList.contains(className) : new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}
function addClass(el, className) {
  if (el.classList) {
   el.classList.add(className);
  } else {
   el.className += ' ' + className
  }
}
function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

function $extendObj(_def, addons) {
  if (typeof addons !== "undefined") {
    for (var prop in _def) {
      if (addons[prop] != undefined) {
        _def[prop] = addons[prop];
      }
    }
  }
}

function toggleClass(el, className) {
  el.classList.toggle(className);
}

var slider_plugin = (function() {
  var slider = function(settings) {
      var _ = this;
      _.def = {
        target: $('.header__container__carousel'),
        dotsWrapper: $('.header__container__carousel__dots'),
        transition: {
          speed: 1000,
          easing: ''
        },
        swipe: true,
        autoHeight: true,
        autoWidth: true,
        afterChangeSlide: function afterChangeSlide() {}
      };

      $extendObj(_.def, settings);

      _.init();
    }
    slider.prototype.init = function () {
        var _ = this;

        /*Resize*/
        function on_resize(c, t) {
            onresize = function () {
                clearTimeout(t);
                t = this.setTimeout(c, 100);
            }
            return onresize;
        }
        
        /*Lazy-loading*/
        function loadedImg(el) {
          var loaded = false;  
          function loadHandler() {
            if (loaded) {
              return;
            }
            loaded = true;
            _.loadedCnt++;
            if (_.loadedCnt >= _.totalSlides + 2) {
              _.updateSliderDimension();
            }
          }
          var img = el.querySelector('img');
          console.log(img)
          if (img) {
            img.onload = loadHandler;
            img.src = img.getAttribute('data-src');
            img.style.display = 'block';
            if (img.complete) {
              loadHandler();
            }
          } else {
            _.updateSliderDimension();
          }
        }

        /* Add & Remove multi event listener */
        function addListenerMulti(el, s, fn) {
          s.split(' ').forEach(function(e) {
            return el.addEventListener(e, fn, false);
          });
        }

        function removeListenerMulti(el, s, fn) {
          s.split(' ').forEach(function(e) {
            return el.removeEventListener(e, fn, false);
          });
        }

           /* */
           function startSwipe(e) {
            var touch = e;
            if(over1440.matches) {
              _.getCurTop();
            } else {
              _.getCurLeft();
            }

            if (!_.isAnimating) {
              if (e.type == 'touchstart') {
                touch = e.targetTouches[0] || e.changedTouches[0];
              }
              _.startX = touch.pageX;
              _.startY = touch.pageY;
              addListenerMulti(_.sliderInner, 'mousemove touchmove', swipeMove);
              addListenerMulti($('body'), 'mouseup touchend', swipeEnd);
            }
          }

          function swipeEnd(e) {
            var touch = e;

            if(over1440.matches) {
              _.getCurTop();  
              if (Math.abs(_.moveY - _.startY) === 0) return; 
              _.stayAtCur = Math.abs(_.moveY - _.startY) < 40 || typeof _.moveY === "undefined" ? true : false;
              _.dir = _.startY < _.moveY ? 'top' : 'bottom';  
              if (_.stayAtCur) {} 
              else {
                _.dir == 'top' ? _.curSlide-- : _.curSlide++;
                if (_.curSlide < 0) {
                  _.curSlide = _.totalSlides;
                } else if (_.curSlide == _.totalSlides + 2) {
                  _.curSlide = 1;
                }
              } 
            } else {
              _.getCurLeft();  
              if (Math.abs(_.moveX - _.startX) === 0) return; 
              _.stayAtCur = Math.abs(_.moveX - _.startX) < 40 || typeof _.moveX === "undefined" ? true : false;
              _.dir = _.startX < _.moveX ? 'left' : 'right';  
              if (_.stayAtCur) {} 
              else {
                _.dir == 'left' ? _.curSlide-- : _.curSlide++;
                if (_.curSlide < 0) {
                  _.curSlide = _.totalSlides;
                } else if (_.curSlide == _.totalSlides + 2) {
                  _.curSlide = 1;
                }
              } 
            }
            _.gotoSlide();  
            delete _.startX;
            delete _.startY;
            delete _.moveX;
            delete _.moveY;  
            _.isAnimating = false;
            removeClass(_.def.target, 'isAnimating');
          //  removeListenerMulti(_.sliderInner, 'mousemove touchmove', swipeMove);
          //  removeListenerMulti($('body'), 'mouseup touchend', swipeEnd);
          }

          function swipeMove(e) {
            var touch = e;
            if (e.type == 'touchmove') {
              touch = e.targetTouches[0] || e.changedTouches[0];
            }
            _.moveX = touch.pageX;
            _.moveY = touch.pageY;  // for scrolling up and down
            if(over1440.matches) {
              if (Math.abs(_.moveY - _.startY) < 40) return; 
              _.isAnimating = true;
             addClass(_.def.target, 'isAnimating');
             e.preventDefault();  
             if (_.curTop + _.moveY - _.startY > 0 && _.curTop == 0) {
               _.curTop = -_.totalSlides * _.slideH;
             } else if (_.curTop + _.moveY - _.startY < -(_.totalSlides + 1) * _.slideH) {
               _.curTop = -_.slideH;
             }
             _.sliderInner.style.top = _.curTop + _.moveY - _.startY + "px";
            } else {
              if (Math.abs(_.moveX - _.startX) < 40) return; 
              _.isAnimating = true;
             addClass(_.def.target, 'isAnimating');
             e.preventDefault();  
             if (_.curLeft + _.moveX - _.startX > 0 && _.curLeft == 0) {
               _.curLeft = -_.totalSlides * _.slideW;
             } else if (_.curLeft + _.moveX - _.startX < -(_.totalSlides + 1) * _.slideW) {
               _.curLeft = -_.slideW;
             }
             _.sliderInner.style.left = _.curLeft + _.moveX - _.startX + "px";
            }

          }

      window.addEventListener("resize", on_resize(function() {
      _.updateSliderDimension();
      }),false);

      var target = document.querySelector('.header__container__carousel');
      console.log('target is: ' + target);

      var nowHTML = _.def.target.innerHTML;
      _.def.target.innerHTML = '<div class="header__container__carousel--wrapper">' + nowHTML + '</div>';



      _.allSlides = 0;
      _.curSlide = 0;
      _.curLeft = 0;
      _.totalSlides = _.def.target.querySelectorAll('.header__container__carousel__tile').length;
      _.sliderInner = _.def.target.querySelector('.header__container__carousel--wrapper');
      _.loadedCnt = 0;
      if(!over1440.matches) {
        target.addEventListener('mousemove', startSwipe(_));
      }


      var cloneFirst = _.def.target.querySelectorAll('.header__container__carousel__tile')[0].cloneNode(true);
      _.sliderInner.appendChild(cloneFirst);
      var cloneLast = _.def.target.querySelectorAll('.header__container__carousel__tile')[_.totalSlides - 1].cloneNode(true);
      _.sliderInner.insertBefore(cloneLast, _.sliderInner.firstChild);

      _.curSlide++;
      _.allSlides = _.def.target.querySelectorAll('.header__container__carousel__tile');

      if(over1440.matches){
        _.sliderInner.style.height = (_.totalSlides + 2) * 100 + "vh";
        for (var _i = 0; _i < _.totalSlides + 2; _i++) {
        _.allSlides[_i].style.height = 100 / (_.totalSlides + 2) + "%";
        loadedImg(_.allSlides[_i]);
        }
      } else {
        _.sliderInner.style.width = (_.totalSlides + 2) * 100 + "%";
        for (var _i = 0; _i < _.totalSlides + 2; _i++) {
        _.allSlides[_i].style.width = 100 / (_.totalSlides + 2) + "%";
        loadedImg(_.allSlides[_i]);
        }
      }

      _.buildDots();
      _.setDot();

      _.isAnimating = false;
      }

    slider.prototype.buildDots = function () {
        var _ = this;
        for(var i = 0; i < _.totalSlides; i++) {
            var dot = document.createElement('li');
            dot.setAttribute('data-slide', i + 1);
            _.def.dotsWrapper.appendChild(dot)
        } 
        
        _.def.dotsWrapper.addEventListener('click', function(e) {
            if(e.target && e.target.nodeName == "LI") {
                _.curSlide = e.target.getAttribute('data-slide');
                _.gotoSlide();
            }
        }, false);
      }
      
    slider.prototype.getCurLeft = function () {
      var _ = this;
      _.curLeft = parseInt(_.sliderInner.style.left.split('px')[0]);
      } 

    slider.prototype.getCurTop = function () {
      var _ = this;
      _.curTop = parseInt(_.sliderInner.style.top.split('px')[0]);
      }
      
    slider.prototype.gotoSlide = function () {
      var _ = this;

      if(over1440.matches) {
        _.sliderInner.style.transition = 'top ' + _.def.transition.speed / 1000 + 's ' + _.def.transition.easing;
        _.sliderInner.style.top = -_.curSlide * _.slideH + 'px';  
      } else {
        _.sliderInner.style.transition = 'left ' + _.def.transition.speed / 1000 + 's ' + _.def.transition.easing;
        _.sliderInner.style.left = -_.curSlide * _.slideW + 'px';  
      }
 
      addClass(_.def.target, 'isAnimating');  

      setTimeout(function () {
      _.sliderInner.style.transition = '';
        removeClass(_.def.target, 'isAnimating');
      }, _.def.transition.speed);
      _.setDot();  
      if (_.def.autoWidth) {
        _.def.target.style.width = _.allSlides[_.curSlide].offsetWidth + "px";
      }
      _.def.afterChangeSlide(_);
      }
    slider.prototype.setDot = function () {
          var _ = this;
          var tardot = _.curSlide - 1;
          for (var j = 0; j < _.totalSlides; j++) {
            removeClass(_.def.dotsWrapper.querySelectorAll('li')[j], 'active');
          }  
          if (_.curSlide - 1 < 0) {
            tardot = _.totalSlides - 1;
          } else if (_.curSlide - 1 > _.totalSlides - 1) {
            tardot = 0;
          }
          addClass(_.def.dotsWrapper.querySelectorAll('li')[tardot], 'active');
      }

    slider.prototype.updateSliderDimension = function () {
      var _ = this; 
      if(over1440.matches) {
        _.slideH = parseInt(_.def.target.querySelectorAll('.header__container__carousel__tile')[0].offsetHeight);
        _.sliderInner.style.top = -_.slideH * _.curSlide + "px";
        _.slideW = parseInt(_.def.target.querySelectorAll('.header__container__carousel__tile')[0].offsetWidth);
       // _.sliderInner.style.left = -_.slideW * _.curSlide + "px";
        if (_.def.autoWidth) {
            _.def.target.style.width = _.allSlides[_.curSlide].offsetWidth + "px";
        } else {
            for (var i = 0; i < _.totalSlides + 2; i++) {
            if (_.allSlides[i].offsetWidth > _.def.target.offsetWidth) {
                _.def.target.style.width = _.allSlides[i].offsetWidth + "px";
            }
            }
        }
      } else {
        _.slideH = parseInt(_.def.target.querySelectorAll('.header__container__carousel__tile')[0].offsetHeight);
        _.slideW = parseInt(_.def.target.querySelectorAll('.header__container__carousel__tile')[0].offsetWidth);
        console.log("slideW : " + _.slideW);
        _.sliderInner.style.left = -_.slideW * (_.curSlide - 1)+ "px";
        if (_.def.autoHeight) {
            _.def.target.style.height = _.allSlides[_.curSlide].offsetHeight + "px";
        } else {
            for (var i = 0; i < _.totalSlides + 2; i++) {
            if (_.allSlides[i].offsetHeight > _.def.target.offsetHeight) {
                _.def.target.style.height = _.allSlides[i].offsetHeight + "px";

            }
            }
        }
      }
      _.def.afterChangeSlide(_);
      }
  return slider;
})();

var slider = new slider_plugin();

var navRightBtn = $('.nav__right__burger');

var navOpen = document.querySelector('.nav__open');
console.log(navRightBtn);
navRightBtn.addEventListener("click", function() {
  toggleClass(navOpen, 'active');
  toggleClass(navRightBtn, 'active'); 
});

/* Display changes */

if (over1440.matches)
 {
  $('.header__container__carousel__dots').style.display = 'flex';
  $('.header__container__background__right p').style.display = 'block';
  $('.nav__left p').style.display = 'block';

 } else {
  $('.header__container__carousel__dots').style.display = 'none';
  $('.header__container__background__right p').style.display = 'none';
  $('.nav__left p').style.display = 'none';
 }