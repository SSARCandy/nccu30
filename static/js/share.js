function share() {
	window.open('https://www.facebook.com/dialog/share?%20app_id=113786725672316&display=popup&href=' + window.location.href, '分享','width=600,height=400');
}

$(document).ready(function(e){
	if($(window).width() <= 768) {
		$('.job-p').css('height', $(window).innerHeight());
	}
});