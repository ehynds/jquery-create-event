// written by eric hynds (erichynds.com)
// http://www.erichynds.com/jquery/jquery-create-event/
// version 1.4 - 10/12/2010

(function($, _domManip, _html){
	var selectors = [], gen = [], guid = 0, old = {};

	$.event.special.create = {
		add: function( data ){
			selectors.push( data.selector );
		},
		
		// won't fire in 1.4.2 http://dev.jquery.com/ticket/6202
		remove: function( data ){
			var len = selectors.length;

			while( len-- ){
				if( selectors[len] === data.selector ){
					selectors.splice(len, 1);
					break;
				}
			}
		}
	};
	
	// deal with 99% of DOM manip methods
	$.fn.domManip = function( args, table, callback ){
		
		// if no create events are bound, just fire the original domManip method 
		if( !selectors.length || $.isFunction(args[0]) ){
			return _domManip.apply( this, arguments );
		}
		
		return logic.call( this, _domManip, arguments );
	};
	
	// deal with the remaining 1% (html method)
	$.fn.html = function( value ){
		
		// if no create events are bound, html() is being called as a setter,
		// or the value is a function, fire the original and peace out.  only string values use innerHTML;
		// function values use append() which is covered by $.fn.domManip 
		if( !selectors.length || $.isFunction(value) || typeof value === "undefined" || !value.length ){
			return _html.apply( this, arguments );
		}
		
		// make value an array
		arguments[0] = [value];
		return logic.call( this, _html, arguments );
	};
	
	function logic( method, args ){
		var node, nodes = args[0], html = $(), numSelectors = selectors.length, matches = [];
		
		// crawl through the html structure passed in looking for matching elements.
		for( var i=0, len=nodes.length; i<len; i++ ){
			node = $(nodes[i]);
			
			if( !node.length ){
				continue;
			}
			
			(function walk( element ){
				element = element || node[0].parentNode;
				var cur = (element ? element.firstChild : node[0]);
				
				while(cur !== null){
					for( var x=0; x<numSelectors; x++ ){
						if( $(cur).is(selectors[x]) ){
							if( !cur.id ){
								cur.id = "jqcreateevt"+(++guid);
								gen.push(cur.id); // remember that this ID was generated
							}
							
							// remember this match
							matches.push(cur.id);
						}
					}
				
					walk( cur );
					cur = cur.nextSibling;
				}
			})();
			
			// the html we started with, but with ids attached to elements
			// bound with create.
			html = html.add( node );
		}
		
		// overwrite the passed in html with the new html
		args[0] = html;

		// inject elems into DOM
		var ret = method.apply(this, args);
		
		// for elements with a create event...
		$.each(matches, function(i,id){
			var elem = document.getElementById( id );
			
			if( elem ){
				// cleanup generated IDs
				if( $.inArray(id, gen) !== -1 ){
					elem.removeAttribute("id");
				}
			
				// double check to make sure the event hasn't already fired.
				// can happen with wrap()
				if( !$.data( elem, "jqcreateevt") ){
				 	$.event.trigger("create", {}, elem);
					$.data(elem, "jqcreateevt", true);
				}
			}
		});
		
		return ret;
	}
	
})(jQuery, jQuery.fn.domManip, jQuery.fn.html);
