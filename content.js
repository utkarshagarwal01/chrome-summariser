chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log("Message sent");
  	if (request.message == "get_selected_text") {
  		var selectedText = document.getSelection().toString();
  		console.log(selectedText);
  		sendResponse({selected_text: selectedText});
  	}
  }
);

