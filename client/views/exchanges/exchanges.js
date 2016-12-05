Template.Exchanges.rendered = function() {
	Session.set('activePage', 'exchanges');
};

Template.Exchanges.events({
	
});

Template.Exchanges.helpers({
	
});

Template.ExchangesSideMenu.rendered = function() {
	$(".menu-item-collapse .dropdown-toggle").each(function() {
		if($(this).find("li.active")) {
			$(this).removeClass("collapsed");
		}
		$(this).parent().find(".collapse").each(function() {
			if($(this).find("li.active").length) {
				$(this).addClass("in");
			}
		});
	});
	
};

Template.ExchangesSideMenu.events({
	"click .toggle-text": function(e, t) {
		e.preventDefault();
		$(e.target).closest("ul").toggleClass("menu-hide-text");
	}
	
});

Template.ExchangesSideMenu.helpers({
	
});
