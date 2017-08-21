var $gallery = $('#gallery-inner');
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
	
	$gallery.fadeOut(250, function(){
		$gallery.css('background-image', 'url(' + img.url + ')')
			.html(template)
			.fadeIn(250);
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
			$gallery.css('background-image','none');
		},
		error: function (request, status, error) { 
		
			console.log(status + ', ' + error); 
		}
	
	})
		.done(function($data) {
			
			$gallery.fadeOut(250)
			
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
			window.setInterval(function(){getCounting($images);}, 15000);
			
			
			
			
			//console.log($images);
			
			
			
			// Basic gallery
			/*function timer(){
				// Load the first images
				console.log('time');
				$timeout = window.setTimeout(timer, 1000);
			
			};*/
			
		})
}

