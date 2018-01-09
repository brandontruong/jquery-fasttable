 /* Javascript */
(function ($) {
    "use strict";
    $.fn.fastTable = function(options) {
        var self = this;
        // Set default settings
		self.settings = $.extend({
			rowHeight: 20,
        }, options);
        
        self.init = function () {
			var $elm = $(self);
			self.items = self.settings.dataList || [];
			self.topIndex = 0;
			self.maxRowsInView = ($elm.height() / self.settings.rowHeight);
			self.endIndex = self.maxRowsInView;
			var $tableContainer = $('<div/>', {id: 'table-container'}).height(self.items.length * self.settings.rowHeight).appendTo($elm);
			self.$table = $('<table/>').height(self.maxRowsInView * self.settings.rowHeight).css('position','relative').appendTo($tableContainer);
			self.displayRowsFrom(self.topIndex, false);
			$elm.on('scroll', function () {
				var scrolledRows = Math.floor($(self).scrollTop() / self.settings.rowHeight);
				if(Math.abs(scrolledRows - self.topIndex) >= 1){
					self.displayRowsFrom(scrolledRows, true);
				}
			});
        };
        
        self.createRow = function (rowIdx) {
            var $rowElem = $('<tr/>');
            self.settings.buildRow($rowElem[0], rowIdx);
            return $rowElem;
        };

        self.displayRows = function (fromIndex, toIndex, removeRows) {
            for (var index = fromIndex; index < toIndex; index++) {
                if(removeRows){$("tr:first", self.$table).remove();}
                self.createRow(index).appendTo(self.$table);
            }
        };

        self.displayRowsFrom = function (fromIndex, removeRows) {
            if (fromIndex + self.maxRowsInView >= self.endIndex && self.endIndex === self.items.length) { return; }

            self.topIndex = fromIndex;
            if(self.topIndex + self.maxRowsInView > self.items.length){ self.topIndex = self.items.length - self.maxRowsInView; }
            self.endIndex = self.topIndex + self.maxRowsInView;

            self.displayRows(self.topIndex, self.endIndex, removeRows);
            self.$table.css('top', self.topIndex * self.settings.rowHeight);
        };

        self.init();
        return self;
    };
})(jQuery);

$(function(){    
    $('#container').fastTable({
        dataList: hamletScripts,
        rowHeight: 20,
        buildRow: function(rowElem, rowIdx){
            $(rowElem).append($('<div></div>').text(hamletScripts[rowIdx]));
            if (rowIdx % 2 !== 0) $(rowElem).addClass("odd");
        }
    });
});
