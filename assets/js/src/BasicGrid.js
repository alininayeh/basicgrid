var BasicGrid = function(config) {
    this.data = config.data;
    this.htmlElement = $(config.htmlElement);
    this.searchBy = config.searchBy;
    this.itemsPerPage = config.itemsPerPage || 10;
    this.sortBy = config.sortBy;
    
    this._init();
};

BasicGrid.prototype._createTableHTML = function() {
    var self = this;
    
    var d = this.data[0], i, html = '', j, m;
    
    function checkSortBy(sortBy) {
        for(j = 0, m = self.sortBy.length; j < m; j++) {
            if(self.sortBy[j] === i) {
                return true;
            }
        }
        
        return false;
    }
    
    html += '<table><tr class="head">';
    
    for(i in d) {
        if(this.sortBy && checkSortBy(i)) {
            html += '<th class="BasicSearch-td-' + i + '"><strong class="BasicGrid-sort-by" data-sort-by="' + i + '"><span class="BasicSearch-sort-arrow"></span>' + i + '</strong>';
        }
        else {
            html += '<th class="BasicSearch-td-' + i + '"><strong>' + i + '</strong>';
        }
        
        if(i === this.searchBy) {
            html += '<form class="BasicGrid-search"><input type="text" value="Search by ' + i + '" class="BasicGrid-search-by" /><span class="BasicGrid-search-button"></span></form>';
        }
        
        html += '</th>';
    }
    
    html += '</tr></table>';
    
    this.htmlElement.html(html);
};

BasicGrid.prototype._createPaginationHTML = function() {
    this.htmlElement.append('<div class="BasicGrid-pagination"><a href="#" class="BasicGrid-prev">&laquo;</a><a href="#" class="BasicGrid-next">&raquo;</a></div>');
};

BasicGrid.prototype._addEvents = function() {
    var self = this;
    
    var $filtruNume = self.htmlElement.find('.BasicGrid-search-by'),
        timeout, searchBy = {}, $icon = self.htmlElement.find('.BasicGrid-search-button');

    $filtruNume.keyup(
        function() {
            clearTimeout(timeout);

            timeout = setTimeout(
                function() {
                    searchBy[self.searchBy] = $filtruNume.val();
                    
                    self.filter(searchBy);
                    
                    if(this.value != '') {
                        $icon.addClass('BasicGrid-clear-button');
                    }
                },
                200
            );
        }
    ).focus(function() {
        if(this.value === 'Search by ' + self.searchBy) {
            this.value = '';
        }
    }).blur(function() {
        if(this.value === '') {
            this.value = 'Search by ' + self.searchBy;
        }
    });
    
    $icon.click(
        function() {
            if($(this).hasClass('BasicGrid-clear-button')) {
                $(this).removeClass('BasicGrid-clear-button')
                clearTimeout(timeout);
                $filtruNume.val('');
                searchBy[self.searchBy] = $filtruNume.val();
                self.filter(searchBy);
                $filtruNume.val('Search by ' + self.searchBy);
            }
        }
    );
    
    self.htmlElement.find('.BasicGrid-sort-by').click(
        function() {
            var $this = $(this), sortOrder = $this.attr('data-sort-order');

            self.htmlElement.find('.BasicGrid-sort-by').attr('data-sort-order', '');
            self.htmlElement.find('.BasicGrid-sort-by .BasicSearch-sort-arrow').html('');

            if(!sortOrder || sortOrder == 'desc') {
                $this.attr('data-sort-order', 'asc');
                $('.BasicSearch-sort-arrow', $this).html('&#x25B2;');
                self.sort($this.attr('data-sort-by'), 'asc');
            }
            else if(sortOrder == 'asc') {
                $this.attr('data-sort-order', 'desc');
                $('.BasicSearch-sort-arrow', $this).html('&#x25BC;');
                self.sort($this.attr('data-sort-by'), 'desc');
            }
        }

    );
};

BasicGrid.prototype._setupPagination = function() {
    var self = this;

    self._updatePagination();

    self._$prev.click(
        function() {
            self._prevPage();
            return false;
        }
    );

    self._$next.click(
        function() {
            self._nextPage();
            return false;
        }
    );
};

BasicGrid.prototype._updatePagination = function() {
    var self = this;

    self._pages = Math.ceil(self._items / self.itemsPerPage);

    if(self._pages > 1) {
        self._$pagination.show();

        $('.item', self._$pagination).unbind().remove();
        self._$prev.addClass('disabled');

        for(var i = 1; i <= self._pages; i++) {
            $('<a href="#" class="item item' + i + '">' + i + '</a>').insertBefore(self._$next);
        }

        var $items = $('.item', self._$pagination);
        $items.eq(0).addClass('selected');

        $items.click(
            function() {
                self._goToPage(this.innerHTML);
                return false;
            }
        );

        self._page = 1;
        
        self._formatPagination();
    }
    else {
        self._$pagination.hide();
        $('.item', self._$pagination).unbind().remove();
    }
};

BasicGrid.prototype._goToPage = function(page) {
    var self = this;

    var from = (page - 1) * self.itemsPerPage,
        to =  from + self.itemsPerPage;

    self._populateGrid(from, to);

    $('.selected', self._$pagination).removeClass('selected');
    self.htmlElement.find('.item' + page).addClass('selected');

    self._page = page;

    if(self._page == self._pages) {
        self._$prev.removeClass('disabled');
        self._$next.addClass('disabled');
    }
    else if(self._page > 1){
        self._$prev.removeClass('disabled');
        self._$next.removeClass('disabled');
    }
    else {
        self._$prev.addClass('disabled');
        self._$next.removeClass('disabled');
    }
    
    self._formatPagination();
};

BasicGrid.prototype._formatPagination = function() {
    this.htmlElement.find('.BasicGrid-more').remove();
    
    if(this._pages > 10) {
        var $items = this._$pagination.find('.item'),
            $last = $items.last(),
            $first = $items.first(),
            i;
        
        $items.hide();
        
        
        
        if(this._page < 5) {
            for(i = 0; i < 5; i++) {
                $items.eq(i).show();
            }
            
            $last.show();
            $('<span class="BasicGrid-more">...</span>').insertBefore($last);
        }
        else if(this._page <= this._pages - 4) {
            var start = parseInt(this._page) - 3,
                end = parseInt(this._page) + 2;
            
            for(i = start; i < end; i++) {
                $items.eq(i).show();
            }
            
            $first.show();
            $('<span class="BasicGrid-more">...</span>').insertAfter($first);
            
            $last.show();
            $('<span class="BasicGrid-more">...</span>').insertBefore($last);
        }
        else {
            var start = parseInt(this._pages) - 5,
                end = parseInt(this._pages);
            
            for(i = start; i <= end; i++) {
                $items.eq(i).show();
            }
            
            $first.show();
            $('<span class="BasicGrid-more">...</span>').insertAfter($first);
        }
    }
    else {
        this._$pagination.find('.BasicGrid-hidden-pages-prev, .BasicGrid-hidden-pages-next').hide();
    }
}

BasicGrid.prototype._prevPage = function() {
    var self = this;

    if(self._page > 1) {
        self._page--;
        self._goToPage(self._page);
    }
};

BasicGrid.prototype._nextPage = function() {
    var self = this;

    if(self._page < self._pages) {
        self._page++;
        self._goToPage(self._page);
    }
};

BasicGrid.prototype._addRow = function(data, i) {
    var self = this;

    var html = '', i;

    if (data === false) {
        html =  '<tr><td style="text-align: center" colspan="' + self.htmlElement.find('th').length + '">No results found</td></tr>';
    } else {
        html +=  '<tr>';
        
        for(i in data) {
            html += '<td>' + data[i] + '</td>';
        }
        
        html += '</tr>';
    }

    self._$grid.append(html);

};

BasicGrid.prototype._populateGrid = function(from, to) {
    var self = this;

    var n = self._items, a = 0, b;

    if(from && to) {
        a = from;
        b = (to <= n) ? to : n;
    }
    else {
        var m = a + self.itemsPerPage;
        b = (m <= n) ? m : n;
    }

    $('tr', self._$grid).not('.head').remove();

    if (b > 0) {
        for(var i = a; i < b; i++) {
            self._addRow(self._filteredData[i], i);
        }
    } else {
        self._addRow(false);
    }

};

BasicGrid.prototype._processData = function(data) {
    var self = this;

    self._data = [];

    for(var i = 0, n = data.length; i < n; i++) {
        var d = data[i];

        self._data.push(d);
    }

    self._filteredData = self._data;
    self._items = self._filteredData.length;
};

BasicGrid.prototype.filter = function(filterOptions) {
    var self = this;

    if(filterOptions) {
        var filteredData = [], type, i, n, d;

        for(var propName in filterOptions) {
            type = propName;
        }

        
        var nume = filterOptions[type].toLowerCase();

        if(!self._searchableData) {
            self._searchableData = self._data;
        }

        for(i = 0, n = self._searchableData.length; i < n; i++) {
            d = self._searchableData[i];

            if(d[type].toLowerCase().indexOf(nume) != -1) {
                filteredData.push(d);
            }
        }

        self._filteredData = filteredData;
        self._items = filteredData.length;
    }
    else {
        self._filteredData = self._data;
        self._items = self._filteredData.length;
    }

    self._populateGrid();
    self._updatePagination();
};

BasicGrid.prototype.sort = function(by, ascOrDesc) {
    var self = this,
        data = self._filteredData;

    data.sort(function(a, b) {
        if(ascOrDesc === 'asc') {
            if(a[by].toLowerCase() > b[by].toLowerCase()) {
                return 1;
            }

            if(a[by].toLowerCase() < b[by].toLowerCase()){
                return -1;
            }
        }
        else {
            if(a[by].toLowerCase() < b[by].toLowerCase()) {
                return 1;
            }

            if(a[by].toLowerCase() > b[by].toLowerCase()) {
                return -1;
            }
        }

        return 0;
    });

    self._filteredData = data;
    self._populateGrid();
    self._updatePagination();
};

BasicGrid.prototype._init = function() {
    this._createTableHTML();
    this._createPaginationHTML();
    this._addEvents();
    
    this._$grid = this.htmlElement.find('table');
    this._$pagination = this.htmlElement.find('.BasicGrid-pagination');
    this._$prev = this.htmlElement.find('.BasicGrid-prev');
    this._$next = this.htmlElement.find('.BasicGrid-next');

    this._processData(this.data);
    this._setupPagination();
    this._populateGrid();
};