$(function(){
	positionFooter(); 
	function positionFooter(){
		var padding_top = $("footer").css("padding-top").replace("px", "");
		var page_height = $(document.body).height() - padding_top + 10;
		var window_height = $(window).height();
		var difference = window_height - page_height;
		if (difference < 0) 
			difference = 0;
 
		$("footer").css({
			padding: difference + "px 0 0 0"
		})
	}
 
	$(window)
		.resize(positionFooter)
});
