var Views = {

	run: function() {

		var url = "http://dl.dropbox.com/u/362483/Project/HN/news.js";

        var options  = {
			callback: this.process,
			bell:    "/projects/hn/bell.html",
			tunnel:  "http://dl.dropbox.com/u/123029/request/xmlhttprequest.html"
        };

		new Request(url, options);
	},

	process: function(response) {

		if (response.status!=200) {
			return;
		}

		var json  = $.parseJSON(response.responseText);
		var tmpl  = $("#tmpl_item").html();
		var items = [];

		console.log("response", json);

		$.each(json.items, function(a, item) {

			var title = "";
			$(item.title.split(" ")).each(function(index) {
				title += "<span>" + this + "</span>";
			});

			item.title  = title;
			item.domain = (item.domain) ? item.domain.replace(/(\(|\))/g, '') : item.domain;

			items.push(_.template(tmpl, item));
		});

		$('#index').html(items.join(''));
	}
}

Views.run();
