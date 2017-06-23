chrome.runtime.onInstalled.addListener(function() {
  var context = "selection";
  var title = "See the Gist";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],"id": "context_selection"});  
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

console.log("Booting");

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	
	var activeTab = tabs[0];
	chrome.tabs.sendMessage(activeTab.id, {"message": "get_selected_text"}, function(response) {
		console.log('From button');
		if (response.selected_text == "") {
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
	if (info.menuItemId == "context_selection") {
		for (var i = open_window_ids.length - 1; i >= 0; i--) {
			chrome.windows.remove(open_window_ids[i],function(){});
			open_window_ids.pop();
		}	
			// window.document.body.innerHTML += doc;
	    var activeTab;
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			activeTab = tabs[0];
			chrome.windows.create({url: 'popup2.html',focused:true},function(window){
	    		open_window_ids.push(window.id);
	    		displayCurrent(open_window_ids[0],activeTab,window);
	    	});
		});
	}
});

function displayCurrent(id,activeTab,popupwindow){
	console.log("Got id :"+id);
	var popupTabId = popupwindow.tabs[0].id;
	chrome.tabs.sendMessage(activeTab.id, {"message": "get_selected_text"}, function(response) {
		console.log("Resp:"+response.selectedText);
		if (response.selected_text == "") {
			console.log("Selected text is null");
			chrome.tabs.sendMessage(popupTabId,{"message":"no_text_selected"},function (response){});
		}
		else {
			var apiResponse = getSummary(response);
			var summary_final = apiResponse.sentences;
			if (summary_final.length == 0) {
				chrome.tabs.sendMessage(popupTabId,{"message":"not_enough_text"},function (response){});
			}
			else {
				chrome.tabs.sendMessage(popupTabId,{"message":"summary","data":summary_final},function (response){});	
			}
		}	
	});

	
}