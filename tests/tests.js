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
		
		expect(8);
	
		$("span.one, #test-p, #test-span").live("create", handler);
		
		html.push('<div>');
	 	html.push('<p>the</p>');
		html.push('<p class="one">quick<span>brown</span></p>');
		html.push('<span>fox</span>');
		html.push('<span class="one">jumped</span>');
		html.push('<p><span class="one">over</span><span>the</span><div class="one">lazy dog</div>');
		html.push('</div>');
		html.push('<p id="test-p"></p>');
		html.push('<span id="test-span"></span>');
		html.push('<select><option></option></select><span></span>');
		
		$( html.join('') ).appendTo( target );
		
		// now, make sure everything actually made it to the DOM
		equals( $(".one").length, 4, "node 1: div element with 4 nested .one elements" );
		equals( $("#test-p").length, 1, "node 2: p element with id test-p" );
		equals( $("#test-span").length, 1, "node 3: span element with id test-span" );
		equals( $("select").length, 1, "node 4: select element" );
	});
	
	test("generated/enumerated IDs", function(){
		expect(4);
		var el;
		
		$("span.test-id, #test-id").live("create", handler);

		el = $('<span class="test-id"></span>').appendTo(target);
		equals( el.attr("id"), "", "generated id was removed" );
		el = $('<span id="test-id"></span>').appendTo(target);
		equals( el.attr("id"), "test-id", "enumerated ID was not removed" );
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
	
	test("replaceWith", function(){
		expect(2);
		
		$(".test-replaceWith").live("create", handler);
		
		// add a new node
		var elem = $('<div class="test-replaceWith"></div>').appendTo("body");
		
		// replace target with new html
		target.replaceWith('<div class="test-replaceWith"></div>');
		
		// replace target with an existing node.. should not trigger event
		target.replaceWith( elem );
		
		elem.remove();
	});
	
	test("replaceWith (fn)", function(){
		expect(2);
		
		$(".test-replaceWith-fn").live("create", handler);
		
		// add a new node
		var elem = $('<div class="test-replaceWith-fn"></div>').appendTo("body");
		
		// replace target with new html
	 	target.replaceWith(function(){
	 		return '<div class="test-replaceWith-fn"></div>';
		});
		
		// replace target with an existing node.. should not trigger event
		target.replaceWith(function(){
			return elem;
	 	});
	 	
	 	elem.remove();
	});
	
	test("replaceAll", function(){
		expect(1);
		
		target.html('<span></span><span></span><span></span>');
		
		$("p.replaceAll").live("create", handler);
		
		// replace target with new html
		$('<p class="replaceAll"></p>').replaceAll('#target span');
		
		// one is returned because the p element is created once, then cloned
		// two more times.  TODO look into this
	});

	test("cloning then insert", function(){
		expect(1);
		
		target.append('<div class="test-clone"></div>');
		$(".test-clone").live("create", handler);
	 	target.find(".test-clone").clone().appendTo( target );
	});
	
	test("html", function(){
		expect(3);
		
		$("#test-html-div, #test-html-p, span.test-html-span").live("create", handler);
		target.html('<div id="test-html-div"></div><p id="test-html-p"><span class="test-html-span" /></p>');
	});
	
	test("html (fn)", function(){
		expect(3);
		
		$("#test-html-fn, #test-html-fn-span, #test-html-fn span").live("create", handler);
		$("#htmltarget").html(function(){
			return '<p id="test-html-fn"><span /></p><span id="test-html-fn-span" />';
		});
	});
	
	test("html (clearing)", function(){
		expect(1);
		
		$("#test-html-clear").live("create", handler);
		
		$("#htmltarget").html(function(){
			return '<span id="test-html-clear"></span>';
		}).html('');
	});
	
	module("ajax");
	
	test("load", function(){
		expect(1);
		
		el = $("#test-ajax").live("create", handler);
		target.load('ajax.htm').empty();
	});
	
	test("load selector", function(){
		expect(1);
		
		el = $("p:has(span)").live("create", handler);
		target.load('ajax.htm p');
	});
});
