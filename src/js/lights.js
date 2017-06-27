function toggle(){
	var lights = document.body.id;
	var wrapper = document.getElementById('wrapper');
	var button = document.getElementById('do-not-press');
	if (lights == 'on'){
		document.body.id = 'off';
		wrapper.style.backgroundImage = 'url(../media/bw-eclipse.jpg)';
		button.classList.remove('fa-moon-o');
		button.classList.add('fa-sun-o');
	} else {
		document.body.id = 'on';
		wrapper.style.backgroundImage = '';
		button.classList.remove('fa-sun-o');
		button.classList.add('fa-moon-o');
	}
}