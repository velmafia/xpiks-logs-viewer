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

function appendRepeatItem(parent, repeatCount, repeatType) {
    var repeatLineP = document.createElement('p');
    repeatLineP.setAttribute('class', repeatType + ' logitem');
    var repeatLineText = document.createTextNode('--- Same logline was repeated ' + repeatCount + ' more time(s)');
    repeatLineP.appendChild(repeatLineText);
    parent.appendChild(repeatLineP);
}

function parseXpiksLogs(parent, text) {
    var lines = text.split("\n");
    var threads_colors = ['#00897b', '#d32f2f', '#ad1457', '#7b1fa2', '#5e35b1', '#3f51b5', '#039be5', '#0097a7', '#388e3c', '#afb42b', '#fbc02d', '#8d6e63', '#f48fb1', '#4a148c', '#880e4f', '#b71c1c', '#0d47a1', '#004d40', '#006064'];
    shuffle(threads_colors);

    var usedThreads = {};
    var lastUsedThreads = 0;
    var lastLogLine = '';
    var sameLogLinesCount = 0;
    var lastLogType = '';

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var parts = line.split(' ');

        if ((parts.length < 3) || (!strStartsWith(parts[2], 'T#'))) {
            var rawLine = document.createTextNode(line);
            parent.appendChild(rawLine);
            continue;
        }

        var logLine = parts.slice(3).join(' ');
        if (logLine != lastLogLine) {
            if (sameLogLinesCount > 0) {
                appendRepeatItem(parent, sameLogLinesCount, lastLogType);
            }

            lastLogLine = logLine;
            lastLogType = parts[1];
            sameLogLinesCount = 0;
        } else {
            sameLogLinesCount++;
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
            lastUsedThreads = (lastUsedThreads + 1) % threads_colors.length;
        }

        threadIDElement.setAttribute('style', 'color: ' + threadColor);
        threadIDElement.innerHTML = threadID;
        element.appendChild(threadIDElement);

        var logTextElement = document.createElement('span');

        logTextElement.innerHTML = ' ' + logLine;
        element.appendChild(logTextElement);

        parent.appendChild(element);
    }
}

function clearPreviousEntries(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function readAndPublish(file) {
    var label = document.getElementById('inputlabel');
    var textDisplayArea = document.getElementById('textDisplayArea');

    var reader = new FileReader();

    reader.onload = function(e) {
	var text = reader.result;
        clearPreviousEntries(textDisplayArea);
        parseXpiksLogs(textDisplayArea, text);
	textDisplayArea.style.visibility = "visible";
	label.querySelector('span').innerHTML = file.name;
    };

    reader.readAsText(file);
}

function handleDragDrop(event) {
    event.stopPropagation();
    event.preventDefault();

    var files = event.dataTransfer.files;

    if (files && files.length > 0) {
        var f = event.dataTransfer.files[0];
        readAndPublish(f);
    } else {
        var textDisplayArea = document.getElementById('textDisplayArea');
        var text = event.dataTransfer.getData('text');
        clearPreviousEntries(textDisplayArea);
        parseXpiksLogs(textDisplayArea, text);
        textDisplayArea.style.visibility = "visible";
        $(".brd").css({"visibility" : "visible"});
    }

    $('.upload-cont').css('border', '');
}

function openFileDialogHandler(event) {
    if (event.target.files &&
        event.target.files.length) {
        var f = event.target.files[0];
        readAndPublish(f);
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    $(".upload-cont").css({"border":"thick dashed white"});
}

window.onload = function() {
    var fileInput = document.getElementById('files');
    var dropZone = document.getElementById('box');

    fileInput.addEventListener('change', openFileDialogHandler);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDragDrop);

    $(document).on("paste", function (e) {
        // Short pause to wait for paste to complete
        var textDisplayArea = document.getElementById('textDisplayArea');
	var text = e.originalEvent.clipboardData.getData('text');
        clearPreviousEntries(textDisplayArea);
        parseXpiksLogs(textDisplayArea, text);
        textDisplayArea.style.visibility = "visible";
        $(".brd").css({"visibility" : "visible"});
    });
};
