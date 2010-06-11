# jQuery "create" event

This event duck punches `$.fn.domManip` to fire a custom "create" event when new, matching elements are inserted into the DOM.

Use it like:
	
	// bind a handler that will fire when new div.foo 
	// elements are inserted into the DOM
	$("div.foo").live("create", function(e){
		$(this).doSomething();
	});
