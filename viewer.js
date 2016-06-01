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

function read_and_publish(file) {
	var label	 = document.getElementById('inputlabel');
	var textDisplayArea = document.getElementById('textDisplayArea');
	
	var reader = new FileReader();
	
	reader.onload = function(e) {
		var text = reader.result;
		textDisplayArea.innerHTML = "<p>"+colorizer(text)+"</p>";
		textDisplayArea.style.visibility = "visible";
		label.querySelector( 'span' ).innerHTML = file.name;
	}
	reader.readAsText(file);
};


 function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var obj = evt.dataTransfer
	var files;
	if (obj == null){
		var fileInput = evt.target;
		files = fileInput.files;
	} else {
		files = obj.files; // FileList object.
	}
	f =files[0];
	read_and_publish(f);
	$(".upload-cont").css("border","");
  }

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	$(".upload-cont").css({"border":"thin dashed white"});
}



window.onload = function() {
	var fileInput = document.getElementById('files');
	var dropZone = document.getElementById('box');

	fileInput.addEventListener('change', handleFileSelect);
	dropZone.addEventListener('dragover', handleDragOver, false);
	dropZone.addEventListener('drop', handleFileSelect, false);


	$(document).on("paste", function (e) {
        // Short pause to wait for paste to complete
		var text = e.originalEvent.clipboardData.getData('text');
		var tagged_text = colorizer(text);
        setTimeout( function() {           
			console.log(text);
            $(".brd").append("<p>"+tagged_text+"</p>");
			$(".brd").css({"visibility" : "visible"});
        }, 100);

	});  
}





  