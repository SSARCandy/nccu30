function share() {
	window.open('https://www.facebook.com/dialog/share?%20app_id=256435891359679&display=popup&href=' + window.location.href, '分享', 'width=600,height=400');
}

$(document).ready(function(e) {
	$(".nav li").on("click", function() {
		$(".nav li").removeClass("active");
		$(this).addClass("active");
	});
	// mobile hamburger bar
	$(".button-collapse").sideNav();
	// slider initialize
	if ($(window).height() < 700) {
		$('.slider').slider({ full_width: true, interval: 8000, height: $(window).height() - 110 });
	} else {
		$('.slider').slider({ full_width: true, interval: 8000, height: 550 });
	}
	$('.parallax').parallax();
	$('.carousel').carousel({ dist: -10, padding: -20, shift: 0 });
	$('.materialboxed').materialbox();

	$('#gallery').justifiedGallery({
		lastRow: 'nojustify',
		rowHeight: 100,
		rel: 'gallery2',
		margins: 1
	}).on('jg.complete', function() {
		$('#gallery a').swipebox();
	});

});
