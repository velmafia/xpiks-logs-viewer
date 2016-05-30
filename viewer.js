function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function colorizer(text){
	var lines = text.split("\n"); 
	var keywords = ["debug", "info", "warning","critical", "fatal"];
	for (var i =0; i < lines.length; i++){
		for (var j=0; j < keywords.length; j++){
			word = lines[i].substring(13, 13+8).toLowerCase();
			if (strStartsWith(word,keywords[j]) ) {
				var start = "<p class = \"" + keywords[j] +"\">";
				var end = "</p>";
				lines[i]=start+lines[i]+end;
			};
		};
	};
	var colored_text = lines.join("");
	console.log(colored_text)
	return colored_text;
};



window.onload = function() {
		var fileInput = document.getElementById('files');
		var label	 = fileInput.nextElementSibling;
		var textDisplayArea = document.getElementById('textDisplayArea');

		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var fileName = e.target.value.split( '\\' ).pop();
			if (fileName){
				label.querySelector( 'span' ).innerHTML = fileName;

				var reader = new FileReader();

				reader.onload = function(e) {
					var text = reader.result;
					textDisplayArea.innerHTML = colorizer(text);
					textDisplayArea.style.visibility = "visible";
				}

				reader.readAsText(file);
			}				
		});
}