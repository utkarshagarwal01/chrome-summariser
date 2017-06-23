chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
	console.log("Message sent");
	console.log(document);
  	if (request.message == "get_selected_text") {
  		var selectedText = document.getSelection().toString();
  		console.log(selectedText);
  		console.log("Before sendR");
  		sendResponse({selected_text: selectedText});
  	}

  	else if (request.message == "no_text_selected") {
  		console.log("no_text_selected");
  		document.body.innerHTML += "<h3 style='text-align: center'>No text selected! Select text and try again.</h3>";
  	}

  	else if (request.message == "not_enough_text") {
  		document.getElementById("header").innerHTML += "<h3 class='heading'>Not enough text selected to generate summary. Select larger block of text and try again.</h3>";
		document.getElementById("footer").innerHTML += "<div style='padding:15px;'>Powered by <a href='http://zippybots.com' target='_blank'><span id='link'>Zippybots</span></a></div>";
  	}

  	else if (request.message == "summary") {
		var summary_final = request.data;
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
		document.getElementById("footer").innerHTML += "<div style='padding:15px;'>Powered by <a href='http://zippybots.com' target='_blank'><span id='link'>Zippybots</span></a></div>";
	}
});