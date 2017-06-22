chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "See the Gist";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});  
});

var open_window_ids=[]

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
		console.log('From button');
		if (response.selected_text == "") {
			console.log("Selected text is null");
			document.body.innerHTML += "<h3 style='text-align: center'>No text selected! Select text and try again.</h3>";
		}
		else {
			var apiResponse = getSummary(response);
			var summary_final = apiResponse.sentences;
			if (summary_final.length == 0) {
				document.getElementById("header").innerHTML += "<h3 class='heading'>Not enough text selected to generate summary. Select larger block of text and try again.</h3>";
				document.getElementById("footer").innerHTML += "<div style='padding:15px;'>By Zippybots <a href='http://zippybots.com' target='_blank'><span id='link'>(zippybots.com)</span></a></div>";
			}
			else{
				document.getElementById("header").innerHTML += "<h1 class='heading'>Summary</h1>";
				var para = "";
				for (var i = 0;i<summary_final.length;i++)
				{
					para += summary_final[i]+" ";
					if( i % 3 == 2) 
					{
						document.getElementById("summary").innerHTML += "<p class='point'>"+para+"</p>";	
						para = "";
					}
				}
				if (para) document.getElementById("summary").innerHTML += "<p class='point'>"+para+"</p>";
				document.getElementById("footer").innerHTML += "<div style='padding:15px;'>By Zippybots <a href='http://zippybots.com' target='_blank'><span id='link'>(zippybots.com)</span></a></div>";
			}
		}
	});
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
	for (var i = open_window_ids.length - 1; i >= 0; i--) {
			chrome.windows.remove(open_window_ids[i],function(){});
			open_window_ids.pop(open_window_ids[i]);
		}	
			// window.document.body.innerHTML += doc;
    chrome.windows.create({url: 'popup.html', type: 'popup',focused:true},function(window){
    	open_window_ids.push(window.id);
    });
    displayCurrent(open_window_ids[0]);
});

function displayCurrent(id){

chrome.windows.get(id,function (window){
	chrome.tabs.sendMessage(id, {"message": "get_selected_text"}, function(response) {
			if (response.selected_text == "") {
			console.log("Selected text is null");
			document.body.innerHTML += "<h3 style='text-align: center'>No text selected! Select text and try again.</h3>";
		}
		else if(document){
			var apiResponse = getSummary(response);
			var summary_final = apiResponse.sentences;
			console.log(summary_final);
			if (summary_final.length == 0) {
				document.getElementById("header").innerHTML += "<h3 class='heading'>Not enough text selected to generate summary. Select larger block of text and try again.</h3>";
				document.getElementById("footer").innerHTML += "<div style='padding:15px;'>By Zippybots <a href='http://zippybots.com' target='_blank'><span id='link'>(zippybots.com)</span></a></div>";
			}
			else{
				document.getElementById("header").innerHTML += "<h1 class='heading'>Summary</h1>";
				var para = "";
				for (var i = 0;i<summary_final.length;i++)
				{
					para += summary_final[i]+" ";
					if( i % 3 == 2) 
					{
						document.getElementById("summary").innerHTML += "<p class='point'>"+para+"</p>";	
						para = "";
					}
				}
				if (para) document.getElementById("summary").innerHTML += "<p class='point'>"+para+"</p>";
				document.getElementById("footer").innerHTML += "<div style='padding:15px;'>By Zippybots <a href='http://zippybots.com' target='_blank'><span id='link'>(zippybots.com)</span></a></div>";
			}
		}
		});	

});

}
