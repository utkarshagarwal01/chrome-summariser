chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "Summarize this in Gist";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});  
});

function getSummary(selected) {

	var jsonData;

	$.ajax({
	    url: 'http://127.0.0.1:5000/api/summarize',
	    type: 'POST',
	    data: JSON.stringify(selected),
	    contentType: 'application/json; charset=utf-8',
	    dataType: 'json',
	    async: false,
	    success: function(data) {
	        jsonData = data;
    	}
	});

	return jsonData;
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	var activeTab = tabs[0];
	chrome.tabs.sendMessage(activeTab.id, {"message": "get_selected_text"}, function(response) {
		if (response.selected_text == "") {
			document.body.innerHTML += "<h3 style='text-align: center'>No text selected! Select text and try again.</h3>";
		}
		else {
			var apiResponse = getSummary(response);
			var sentences = apiResponse.sentences;

			if (sentences.length == 0) {
				document.body.innerHTML += "<h3 style='text-align: center'>Not enough text selected to generate summary. Select larger block of text and try again.</h3>";
			}
			else{
				document.getElementById("summary").innerHTML += "<tr><th style='font-size: 16px;'>Summary</th></tr>";
				document.getElementById("summary").innerHTML += "<tr style='background-color:white'><td>" + sentences + "</td></tr>";
			}
		}
	});
});

	
chrome.contextMenus.onClicked.addListener(function(info, tab){
			// window.document.body.innerHTML += doc;
	    chrome.windows.create({'url': 'popup.html', 'type': 'popup'}, function (window) {
    			console.log(window);	 
    			
	    		chrome.tabs.sendMessage(tab.id, {"message": "get_selected_text"}, function(response) {
				console.log("Selected text in ext: "+response.selected_text);
				var doc = "";
				if (response.selected_text == "") 
				{
					doc += "<h3 style='text-align: center'>No text selected! Select text and try again.</h3>";
				}
				else 
				{
					var apiResponse = getSummary(response);
					var sentences = apiResponse.sentences;
					if (sentences.length == 0) 
					{		
						doc += "<h3 style='text-align: center'>Not enough text selected to generate summary. Select larger block of text and try again.</h3>";
					}
					else
					{			
						doc += "<tr><th style='font-size: 16px;'>Summary</th></tr>";
						doc += "<tr style='background-color:white'><td>" + sentences + "</td></tr>";
					}
				}
				console.log(doc);
			});	
	    });
});


