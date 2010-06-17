$(function(){
	var container = $("#container"), target = $("#target");

	$.ajaxSetup({ async: false });

	QUnit.testDone = function(){
		$("#container").empty().html('<div id="target"></div>');
		target = $("#target");
	};
	
	function handler(){
		ok(true, 'create handler fired');
		return false;
	}
	
	test("multiple elements, complex html structure", function(){
		var html = [];
		
		expect(2);
	
		$("span.one").live("create", handler);
		
		html.push('<div>');
	 	html.push('<p>the</p>');
		html.push('<p class="one">quick<span>brown</span></p>');
		html.push('<span>fox</span>');
		html.push('<span class="one">jumped</span>');
		html.push('<p><span class="one">over</span><span>the</span><div class="one">lazy dog</div>');
		html.push('</div>');
		
		target.append( html.join('') );
	});
	
	module("methods");
	
	test("append", function(){
		expect(1);
	
		$("#test-append").live("create", handler);
		target.append('<div id="test-append"></div>');
	});
	
	test("append (fn)", function(){
		expect(1);
		
		$("#test-append-fn").live("create", handler);
		target.append(function(){
			return '<div id="test-append-fn"></div>'
		});
	});
	
	test("prepend", function(){
		expect(1);
	 	
	 	$("#test-prepend").live("create", handler);
	 	target.prepend('<div id="test-prepend"></div>');
	});

	test("prepend (fn)", function(){
		expect(1);
		
		$("#test-prepend-fn").live("create", handler);
		target.prepend(function(){
			return '<div id="test-prepend-fn"></div>'
		});
	});
	
	test("before", function(){
		expect(1);
	 	
	 	$("#test-before").live("create", handler);
	 	target.before('<div id="test-before"></div>');
	});

	test("before (fn)", function(){
		expect(1);
		
		$("#test-before-fn").live("create", handler);
		target.before(function(){
			return '<div id="test-before-fn"></div>'
		});
	});
	
	test("after", function(){
		expect(1);
	 	
	 	$("#test-after").live("create", handler);
	 	target.after('<div id="test-after"></div>');
	});
	
	test("after (fn)", function(){
		expect(1);
		
		$("#test-after-fn").live("create", handler);
		target.after(function(){
			return '<div id="test-after-fn"></div>'
		});
	});
	
	test("insertBefore", function(){
		expect(1);
		
		$("#test-insertBefore").live("create", handler);
		$('<div id="test-insertBefore"></div>').insertBefore( target );
	});
	
	test("insertAfter", function(){
		expect(1);
		
		$("#test-insertAfter").live("create", handler);
		$('<div id="test-insertAfter"></div>').insertAfter( target );
	});
	
	test("wrap", function(){
		expect(1);
	 	
	 	$("#test-wrap").live("create", handler);
	 	target.wrap('<div id="test-wrap"></div>');
	});
	
	test("wrap (fn)", function(){
		expect(1);
	 	
	 	$("#test-wrap-fn").live("create", handler);
	 	target.wrap(function(){
	 		return '<div id="test-wrap-fn"></div>';
	 	});
	});
	
	test("html", function(){
		expect(1);
	 	
	 	 $("#test-html").live("create", handler);
	 	target.html('<div id="test-html"></div>');
	});
	
	test("html (fn)", function(){
		expect(1);
		
		$("#test-html-fn").live("create", handler);
		$("#htmltarget").html(function(){
			return '<p id="test-html-fn"></p>';
		});
	});
	
	module("ajax");
	
	test("load", function(){
		expect(1);
		
		el = $("#test-ajax").live("create", handler);
		target.load('ajax.htm').empty();
		el.die("create");
	});
	
	test("load selector", function(){
		expect(1);
		
		el = $("p:has(span)").live("create", handler);
		target.load('ajax.htm p');
		el.die("create");
	});
});
