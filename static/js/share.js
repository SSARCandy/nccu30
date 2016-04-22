function share() {
	window.open('https://www.facebook.com/dialog/share?%20app_id=256435891359679&display=popup&href=' + window.location.href, '分享', 'width=600,height=400');
}

function submitContactUs() {
	var name = $('#contactus_name').val();
	var email = $('#contactus_email').val();
	var phone = $('#contactus_phone').val();
	var contents = $('#contactus_content').val();

	if (!name || !email || !contents) {
		Materialize.toast('請填寫必填欄位！', 4000, 'toast-error');
		return;
	}

	$.ajax({
		url: "https://docs.google.com/forms/d/1m_q8ASyLAcGGzfgVjXnrUIIVN2AoqGKhVZF0DVFieV8/formResponse",
		data: {
			"entry.286053133": name,
			"entry.960917549": email,
			"entry.1798188079": phone,
			"entry.311772598": contents
		},
		type: "POST",
		dataType: "xml",
		success: function () {
			Materialize.toast('回饋已送出！', 4000, 'toast-success');
		},
		error: function (err) {
			Materialize.toast('回饋已送出！', 4000, 'toast-success');
			console.log(err);
		}
	});

}

$(document).ready(function (e) {
	$(".button-collapse").sideNav({
		closeOnClick: true
	});


	init();
});

function init() {
	// mobile hamburger bar
	$('.parallax').parallax();
	$('.carousel').carousel({ dist: -10, padding: -20, shift: 0 });
	$('.materialboxed').materialbox();

	$('.slider').slider({
		full_width: true,
		height: '101%',
		indicators: false,
		// interval: 10000,
	});

	$('.slider.home').slider({
		full_width: true,
		height: $(window).height() - 64,
		indicators: false,
		// interval: 10000,
	});

  $('ul>li').on('click', function () {
    $('ul>li').removeClass('active');
    $(this).addClass('active');
	});

}

// handle back
window.addEventListener("popstate", function (e) {
	location.reload();
});