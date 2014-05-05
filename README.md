basicgrid
=========

A very basic searchable and sortable table made from JSON data. Requires jQuery.

Synthax:

~~~
new BasicGrid({data: {JSON}, htmlElement: {HTML element}[, searchBy: {string}, sortBy: {array of strings}, itemsPerPage: {integer}}])
~~~

### Sample codes (see example.html):

- Multiple columns, searchable, sortable, default 10 items per page:

~~~javascript
var list1 = [... a JSON object ...];
var Grid1 = new BasicGrid({data: list1, htmlElement: $('#grid-1'), searchBy: 'name', sortBy: ['name', 'address']});
~~~

- One column, not searchable, sortable, with 5 items per page:

~~~javascript
var list2 = [... a JSON object ...];
var Grid2 = new BasicGrid({data: list2, htmlElement: $('#grid-2'), itemsPerPage: 5});
~~~
