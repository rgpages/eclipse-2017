var el = document.getElementById('countdown'),
end = new Date('08/21/2017 10:16 AM'),
//end = new Date('07/13/2017 7:05 PM'),
_second = 1000, _minute = _second * 60, _hour = _minute * 60, _day = _hour * 24, timer;

function showRemaining() {
	//HTML
	head = '<div class="label">Countdown</div>';
	
	// Logic
	var now = new Date(), distance = end - now;
	if (distance > 0 && el !== null){
		var days = Math.floor(distance / _day),
		hours = Math.floor((distance % _day) / _hour),
		minutes = Math.floor((distance % _hour) / _minute),
		seconds = Math.floor((distance % _minute) / _second);
		if (days > 1){
			el.innerHTML = head + '<h1>' + days + '</h1><h5>Days</h5>';
		} else if (days == 1) {
			el.innerHTML = head + '<h1>' + days + '</h1><h5>Day</h5>';
		} else {
			el.innerHTML = head + '<h4>Less than<br>24 hours!</h4>';
		}
	}
}
showRemaining();
timer = setInterval(showRemaining, 1000*360);
