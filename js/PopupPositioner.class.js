function PopupPositioner() {
	var that = this;
	
	this.calculateElementsIntersection = function(elements1, elements2) {
		var intersect = [];
		
		//get elements between the comments
		$.each(elements1, function(i, nextElement) {
			$.each(elements2, function(i, prevElement) {
				if(nextElement == prevElement) {
					intersect.push(nextElement);
				}
			});
		});
		
		var minLeft = Infinity;
		var maxRight = -Infinity;
		var minTop = Infinity;
		var maxBottom = -Infinity;
		
		//calculate size of rectange that covers all elements
		$.each(intersect, function(i, element) {
			var element = $(element);  
			
			if(element.is('br') || !element.is(':visible')) {
				return;
			}
		
			var left = element.offset().left;
			var right = element.offset().left + element.outerWidth(true);
			var top = element.offset().top;
			var bottom = element.offset().top + element.outerHeight(true);
			
			//console.log(element);
			//console.log(left, right, top, bottom);
		
			if(left < minLeft) {
				minLeft = left;
			}
			
			if(top < minTop) {
				minTop = top;
			}
			
			if(right > maxRight) {
				maxRight = right;
			}
			
			if(bottom > maxBottom) {
				maxBottom = bottom;
			}
		});
		
		return {
			left: minLeft,
			right: maxRight,
			top: minTop,
			bottom: maxBottom
		};
	}
	
	this.bailout = function(popup) {
		popup.text('(somewhere here)');
	}
	
	this.setPopupPosition = function(popup, startComment, endComment) {
		var next = startComment.nextAll().not('.ezdebug_template_infobox');
		var prev = endComment.prevAll().not('.ezdebug_template_infobox');
		
		if(next !== undefined && next.length != 0 && prev !== undefined && prev.length != 0) {
		
			/*if first element after opening comment is same as first element before closing comment whole template covers one element
			eg.
			<div class='template_element'>
			...
			</div>
			*/
			if(next[0] == prev[0]) {
				var element = next.first();
				//console.log("SINGLE - " + templateFile);
				
				//console.log(templateElement);
				popup.width(element.width());
				popup.height(element.height());
				
				//fun!
				//element.attr('style', '-webkit-transform: rotateY(360deg);-webkit-transition: all 1s ease-in-out;');
				
				//console.log(element);
				//element.is('article, aside, blockquote, body, br, button, canvas, catption, col, colgroup, dd, div, dl, dt, embed, fieldset, figcaption, figure, footer, form, li, td')
				if(element.css('display') == 'block') {
					//console.log('SINGLE INSIDE');
					element.prepend(popup);
				} else {
					//console.log('SINGLE BEFORE');
					popup.css(element.position());
					startComment.after(popup);
				}
			}
			/*if first element after opening comment is NOT the same as first element before closing comment whole template covers multiple elements
			eg.
			<div class='template_element_1'>
			...
			</div>
			...
			<ul class='template_element_2'>
			...
			</ul>
			*/
			else {
				//console.log('MULTIPLE');
				
				var box = that.calculateElementsIntersection(next, prev);
				
				if(box.right > 0 && box.bottom > 0) {
					popup.width(box.right - box.left);
					popup.height(box.bottom - box.top);
				} else {
					that.bailout(popup);
				}
				
				startComment.after(popup);
			}
		} else { //if end comment is just after the start comment or elements between start and end comments are not visible
			//console.log("NO NEXT/PREV - " + templateFile);
			that.bailout(popup);
			startComment.after(popup);
		}
	}
}