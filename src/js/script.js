$.fn.extend({
	printElement: function() {
		var frameName = 'printIframe';
		var doc = window.frames[frameName];
		if (!doc) {
			$('<iframe>').hide().attr('name', frameName).appendTo(document.body);
			doc = window.frames[frameName];
		}
		doc.document.body.innerHTML = this.html();
		doc.window.print();
		return this;
	}
});

$.fn.Tabs = function() {
	var selector = this;

	this.each(function() {
		var obj = $(this); 
		$(obj.attr('href')).hide();
		$(obj).click(function() {
			$(selector).removeClass('selected');
			
			$(selector).each(function(i, element) {
				$($(element).attr('href')).hide();
			});
			
			$(this).addClass('selected');
			$($(this).attr('href')).fadeIn();
			return false;
		});
	});

	$(this).show();
	$(this).first().click();
	if(location.hash!='' && $('a[href="' + location.hash + '"]').length)
		$('a[href="' + location.hash + '"]').click();	
};


jQuery.validator.setDefaults({
  errorClass: 'invalid',
	successClass: 'valid',
	focusInvalid: false,
	errorElement: 'span',
	errorPlacement: function (error, element) {
    if ( element.parent().hasClass('jq-checkbox') ||  element.parent().hasClass('jq-radio')) {
      element.closest('label').after(error);
      
    } else if (element.parent().hasClass('jq-selectbox')) {
      element.closest('.jq-selectbox').after(error);
    } else {
      error.insertAfter(element);
    }
  },
  highlight: function(element, errorClass, validClass) {
    if ( $(element).parent().hasClass('jq-checkbox') ||  $(element).parent().hasClass('jq-radio') || $(element).parent().hasClass('jq-selectbox')) {
    	$(element).parent().addClass(errorClass).removeClass(validClass);
    } else {
    	$(element).addClass(errorClass).removeClass(validClass);
    }
  },
  unhighlight: function(element, errorClass, validClass) {
  	if ( $(element).parent().hasClass('jq-checkbox') ||  $(element).parent().hasClass('jq-radio') || $(element).parent().hasClass('jq-selectbox')) {
    	$(element).parent().removeClass(errorClass).addClass(validClass);
    } else {
    	$(element).removeClass(errorClass).addClass(validClass);
    }
  }
});

jQuery.extend(jQuery.validator.messages, {
	required: "Обязательное поле",
	email: "Некорректный email адрес",
	url: "Некорректный URL",
	number: "Некорректный номер",
	digits: "Это поле поддерживает только числа",
	equalTo: "Поля не совпадают",
	maxlength: jQuery.validator.format('Максимальная длина поля {0} символа(ов)'),
	minlength: jQuery.validator.format('Минимальная длина поля {0} символа(ов)'),
	require_from_group: jQuery.validator.format('Отметьте миниммум {0} из этих полей')
})

//кастомные методы валидатора
jQuery.validator.addMethod("lettersonly", function(value, element) {
  return this.optional(element) || /^[a-zA-ZА-Яа-я\s]+$/i.test(value);
}, "Только буквы");

jQuery.validator.addMethod("telephone", function(value, element) {
  return this.optional(element) || /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){6,14}(\s*)?$/i.test(value);
}, "Некорректный формат");
jQuery.validator.addMethod("multiemail", function (value, element) {
	if (this.optional(element)) {
		return true;
	}
	var emails = value.split(','),
			valid = true;

	for (var i = 0, limit = emails.length; i < limit; i++) {
		value = jQuery.trim(emails[i]);
		valid = valid && jQuery.validator.methods.email.call(this, value, element);
	}
	return valid;
}, jQuery.validator.messages.email);


//функция для навешивания изображений фоном
function backgrounded (selector) {
	$(selector).each(function(){
		var $this = $(this),
		$src = $this.find('.ui-backgrounded-bg').attr('src');
		if($this.find('.ui-backgrounded-bg').length) {
			$this.addClass('backgrounded').css('backgroundImage','url('+$src+')');
		}
	});
}


//lazy load для сторонних либ
function lazyLibraryLoad(scriptSrc,linkHref,callback) {
  let script = document.createElement('script');
  script.src = scriptSrc;
	document.querySelector('#wrapper').after(script);

  if (linkHref !== '') {
    let style = document.createElement('link');
    style.href = linkHref;
    style.rel = 'stylesheet';
    document.querySelector('link').before(style);
  }

  script.onload = callback
}


//плавный скролл с постоянной скоростью
function smoothScroll(targetOffset) {
	let scroll = $(document).scrollTop();
	let speed = Math.abs(targetOffset - scroll) * 0.3 + 40;
	$('html,body').animate({
		scrollTop: targetOffset
	},speed);
}





//предпросмотр изображения (для одиночных инпутов)
function filePreview(input, imgToUpdate) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$(imgToUpdate).attr('src',e.target.result);
		}
		reader.readAsDataURL(input.files[0]);
	}
}



//генерируем попап с уведомлением
function createNotification(notifyTitle, notifyTxt = '', url = './ajax/popups/popup-notify.html') {
	//убираем прелоадер
	Preloader.destroy();
	$.magnificPopup.close();
	setTimeout(()=>{
		$.magnificPopup.open({
			items: { src: url },
			type: 'ajax',    
			overflowY: 'scroll',
			removalDelay: 610,
			mainClass: 'my-mfp-zoom-in',
			ajax: {
				tError: 'Ошибка. <a href="%url%">Контент</a> не может быть загружен',
			},
			callbacks: {
				ajaxContentAdded: function () {
					$('.mfp-popup-notify').html(notifyTitle);
					if (notifyTxt && notifyTxt != '') {
						$('.mfp-popup-notify-txt').html(notifyTxt);
					}
					setTimeout(function(){
						$('.mfp-wrap, .mfp-bg').addClass('delay-back');
						$('.mfp-popup').addClass('delay-back');
					},700);
				}
			}
		});
	},620);
}


//прелоадер
const Preloader = {
	markup: `<div class="preloader-wrap">
		<div class="preloader">
			<div class="preloader-dot"></div>
			<div class="preloader-digit twelwe">12</div>
			<div class="preloader-arrow-minute"></div>
			<div class="preloader-arrow-second"></div>
			<div class="preloader-digit six">6</div>
		</div>
	</div>`,
	create() {
		$('body').append(this.markup);
		setTimeout(()=>{
			$('.preloader-wrap').addClass('opened');
		},1);
	},
	destroy() {
		$('.preloader-wrap').removeClass('opened');
		setTimeout(()=>{
			$('.preloader-wrap').remove();
		},250);
	}
}



jQuery(document).ready(function($){
	
	backgrounded('.ui-backgrounded');
	
	//инициализация MFP popup для форм
	$(document).on('click','.ajax-mfp',function(e){
		e.preventDefault();
		let link = $(this);
		let href = link.attr('data-href');

		if (href && href.length) {
			$.magnificPopup.open({
				items: { src: href },
				type: 'ajax',    
				overflowY: 'scroll',
				removalDelay: 610,
				mainClass: 'my-mfp-zoom-in',
				ajax: {
					tError: 'Ошибка. <a href="%url%">Контент</a> не может быть загружен',
				},
				callbacks: {
					open: function () {
						setTimeout(function(){
							$('.mfp-wrap, .mfp-bg').addClass('delay-back');
							$('.mfp-popup').addClass('delay-back');
						},700);
					}
				}
			});
		}
	});

	
	$(document).on('click','.anchors-menu a, .scroll-to', function(e){
		const href = $(this).attr('href');
		const params = href.split('#');
		const target = '#'+params[params.length-1];
		if ($(target).length) {
			let adjustment = document.documentElement.clientWidth > 992 ? 5 : -70;
			e.preventDefault();
			let targetOffset = $(target).offset().top + adjustment;
			smoothScroll(targetOffset);
			$('.anchors-menu a').removeClass('active');
			$(this).addClass('active');
		}
	})


	
	$(document).on('mouseup',function(e){
    if ($('.header-mid').has(e.target).length === 0 && $('.main-menu.opened').length) {
      $('.main-menu').removeClass('opened');
      $('.mm-toggler').removeClass('opened');
    }
	});
	


	

	


	if ($('.lightgallery-ex').length) {
		lazyLibraryLoad(
			'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/1.10.0/js/lightgallery.min.js',   
			'https://cdnjs.cloudflare.com/ajax/libs/lightgallery/1.10.0/css/lightgallery.min.css',
			()=>{
				$('.lightgallery-ex').lightGallery({
					selector: 'a.lightgallery',
					download: false
				})
			}
		);
	}

	if ( $('.ya-share2').length ) {
		var shareScript = document.createElement('script');
		shareScript.src = '//yastatic.net/share2/share.js';
		document.body.appendChild(shareScript);
	}

	//плавающие соц кнопки
	if ( $('.ui-share').length) {

		$(window).on('scroll', function(){
			var windowOffset = $(window).scrollTop(),
					floatOffset = $('.article-floatspace').offset().top,
					contentHeight = $('.article-body').height(),
					floatHeight = $('.ui-share').height(),
					floatStop = floatOffset + contentHeight - floatHeight;

			if (windowOffset > floatOffset && windowOffset < floatStop) {
				$('.ui-share').addClass('float').removeClass('flip-bottom');
			} else {
				$('.ui-share').removeClass('float').addClass('flip-bottom');

				if (windowOffset < floatStop) {
	        $('.ui-share').removeClass('flip-bottom');
	    	}
			}
		});
	}//if end


	$('#form_contact').validate({
		rules: {
			email: {
				email: true
			}
		}
	})


	//стилизация элементов форм
	$('input[type="checkbox"], input[type="radio"], input[type="file"], select').not('.not-styler').styler({
		singleSelectzIndex: '1',
	});


	$(document).on('click','.mm-toggler',function(e){
		e.preventDefault();
		$(this).toggleClass('opened');
		$('.main-menu').toggleClass('opened');
	})


});//ready close