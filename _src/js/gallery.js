var $slideshow = $('#slideshow');
var $timeout;
var count = 0;

// http://stackoverflow.com/a/5533262/922323
var len = function(obj) {
	
	var l = 0;
	
	$.each(obj, function(i, elem) {
		
		l++;
		
	});
	
	return l;
	
};

function getImg(img){
	
	//console.log(img);
	
	var template = (img.caption) ? [
		'<span>',
			'<span>',
				img.caption,
			'</span>',
			((img.credit) && ('<br><span>' + img.credit) + ((img.credit) && ('<br><span>/</span>' + img.org)) + '</span>'),
		'</span>'
	].join('\n') : '';
	
	$slideshow.fadeOut(500, function(){
		$slideshow.css('background', 'url(' + img.url + ')')
			.html(template)
			.fadeIn(500);
	});
	
}

function getCounting(imgs){
	
	getImg(imgs[count]);
	//console.log(count);
	
	count++;
	
	if (count == len(imgs)) {
		count = 0;
	}
	
}

function getGal(id){
	$.ajax({
		url: 'http://slideshow.registerguard.com/slideshowpro/api/election/index.php?id=' + id,
		dataType: 'jsonp',
		jsonpCallback: 'callback',
		cache: 1800,
		success: function() {
			$slideshow.css('background','none');
		},
		error: function (request, status, error) { 
		
			console.log(status + ', ' + error); 
		}
	
	})
		.done(function($data) {
			
			$slideshow.fadeOut(500)
			
			var $images = [];
			
			window.clearTimeout($timeout);
			$timeout = 0;
			
			// Create array of images
			$.each($data, function(i, v){
				//console.log(v)
				$images.push({
					url: v.url,
					caption: v.caption,
					credit: v.credit,
					org: v.org
				});
			});
			
			//getImg($images[0]);
			// This works
			// need to find recursive js settimeout() function to keep changing image
			
			getCounting($images);
			window.setInterval(function(){getCounting($images);}, 150000);
			
			
			
			
			//console.log($images);
			
			
			
			// Basic slideshow
			/*function timer(){
				// Load the first images
				console.log('time');
				$timeout = window.setTimeout(timer, 1000);
			
			};*/
			
		})
}

