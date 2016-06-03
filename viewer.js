function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function parseXpiksLogs(parent, text) {
    var lines = text.split("\n");
    var threads_colors = ['#00897b', '#d32f2f', '#ad1457', '#7b1fa2', '#5e35b1', '#3f51b5', '#3f51b5', '#039be5', '#0097a7', '#388e3c', '#afb42b', '#fbc02d', '#8d6e63'];
    shuffle(threads_colors);

    var usedThreads = {};
    var lastUsedThreads = 0;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var parts = line.split(' ');

        if ((parts.length < 4) || (parts[4] !== '-')) {
            var rawLine = document.createTextNode(line);
            parent.appendChild(rawLine);
            continue;
        }

        var element = document.createElement('p');
        element.setAttribute('class', parts[1] + ' logitem');

        var time = document.createTextNode(parts[0] + ' ');
        element.appendChild(time);

        var threadIDElement = document.createElement('span');
        var threadColor = '';
        var threadID = parts[2];
        if (usedThreads.hasOwnProperty(threadID)) {
            threadColor = usedThreads[threadID];
        } else {
            threadColor = threads_colors[lastUsedThreads];
            usedThreads[threadID] = threadColor;
            lastUsedThreads++;
        }

        threadIDElement.setAttribute('style', 'color: ' + threadColor);
        threadIDElement.innerHTML = threadID;
        element.appendChild(threadIDElement);

        var logTextElement = document.createElement('span');
        logTextElement.innerHTML = ' ' + parts.slice(3).join(' ');
        element.appendChild(logTextElement);

        parent.appendChild(element);
    }
}

function readAndPublish(file) {
    var label = document.getElementById('inputlabel');
    var textDisplayArea = document.getElementById('textDisplayArea');

    var reader = new FileReader();

    reader.onload = function(e) {
	var text = reader.result;
        parseXpiksLogs(textDisplayArea, text);
	textDisplayArea.style.visibility = "visible";
	label.querySelector('span').innerHTML = file.name;
    };

    reader.readAsText(file);
}


function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var obj = evt.dataTransfer;
    var files;
    if (obj) {
	files = obj.files; // FileList object.
    } else {
        var fileInput = evt.target;
	files = fileInput.files;
    }

    var f = files[0];
    readAndPublish(f);
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
        var textDisplayArea = document.getElementById('textDisplayArea');
	var text = e.originalEvent.clipboardData.getData('text');
        parseXpiksLogs(textDisplayArea, text);
        textDisplayArea.style.visibility = "visible";
        $(".brd").css({"visibility" : "visible"});
    });
};
