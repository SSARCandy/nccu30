function share() {
	window.open('https://www.facebook.com/dialog/share?%20app_id=113786725672316&display=popup&href=' + window.location.href, '分享', 'width=600,height=400');
}

$(document).ready(function(e) {
	$(".nav li").on("click", function() {
		$(".nav li").removeClass("active");
		$(this).addClass("active");
	});



	$('#gallery').justifiedGallery({
		lastRow: 'nojustify',
		rowHeight: 100,
		rel: 'gallery2',
		margins: 1
	}).on('jg.complete', function() {
		$('#gallery a').swipebox();
	});

});