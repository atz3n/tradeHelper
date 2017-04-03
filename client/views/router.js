Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

var publicRoutes = [
	"about",
	"home_public",
	"login",
	"register",
	"verify_email",
	"forgot_password",
	"reset_password"
];

var privateRoutes = [
	"home_private",
	"charts",
	"actives",
	"actives.details",
	"strategies",
	"strategies.insert",
	"strategies.details",
	"strategies.edit",
	"plugins",
	"plugins.pl_stop_loss_out",
	"plugins.pl_stop_loss_out.insert_pl_stop_loss_out",
	"plugins.pl_stop_loss_out.details_pl_stop_loss_out",
	"plugins.pl_stop_loss_out.edit_pl_stop_loss_out",
	"plugins.pl_take_profit_out",
	"plugins.pl_take_profit_out.insert_pl_take_profit_out",
	"plugins.pl_take_profit_out.details_pl_take_profit_out",
	"plugins.pl_take_profit_out.edit_pl_take_profit_out",
	"plugins.pl_trailing_stop_in",
	"plugins.pl_trailing_stop_in.insert_pl_trailing_stop_in",
	"plugins.pl_trailing_stop_in.details_pl_trailing_stop_in",
	"plugins.pl_trailing_stop_in.edit_pl_trailing_stop_in",
	"plugins.pl_trailing_stop_out",
	"plugins.pl_trailing_stop_out.insert_pl_trailing_stop_out",
	"plugins.pl_trailing_stop_out.details_pl_trailing_stop_out",
	"plugins.pl_trailing_stop_out.edit_pl_trailing_stop_out",
	"plugins.pl_profit_line_stop_out",
	"plugins.pl_profit_line_stop_out.insert_pl_profit_line_stop_out",
	"plugins.pl_profit_line_stop_out.details_pl_profit_line_stop_out",
	"plugins.pl_profit_line_stop_out.edit_pl_profit_line_stop_out",
	"plugins.pl_dummy",
	"plugins.pl_dummy.insert_pl_dummy",
	"plugins.pl_dummy.details_pl_dummy",
	"plugins.pl_dummy.edit_pl_dummy",
	"exchanges",
	"exchanges.ex_kraken",
	"exchanges.ex_kraken.insert_ex_kraken",
	"exchanges.ex_kraken.edit_ex_kraken",
	"exchanges.ex_kraken.details_ex_kraken",
	"exchanges.ex_test_data",
	"exchanges.ex_test_data.insert_ex_test_data",
	"exchanges.ex_test_data.edit_ex_test_data",
	"exchanges.ex_test_data.details_ex_test_data",
	"settings",
	"info",
	"info.howto",
	"info.pages",
	"info.plugins",
	"info.exchanges",
	"info.misc",
	"history",
	"history.str_history",
	"history.str_history.details",
	"forum",
	"forum.insert",
	"forum.details",
	"forum.edit",
	"develop",
	"develop.details_settings",
	"develop.edit_settings",
	"admin",
	"admin.users",
	"admin.users.details",
	"admin.users.insert",
	"admin.users.edit",
	"admin.actives",
	"user_settings",
	"user_settings.profile",
	"user_settings.change_pass",
	"logout"
];

var freeRoutes = [
	
];

var roleMap = [
	{ route: "admin",	roles: ["admin"] },
	{ route: "admin.users",	roles: ["admin"] },
	{ route: "admin.users.details",	roles: ["admin"] },
	{ route: "admin.users.insert",	roles: ["admin"] },
	{ route: "admin.users.edit",	roles: ["admin"] },
	{ route: "admin.actives",	roles: ["admin"] },
	{ route: "user_settings",	roles: ["user","admin", "developer"] },
	{ route: "user_settings.profile",	roles: ["user","admin", "developer"] },
	{ route: "user_settings.change_pass",	roles: ["user","admin", "developer"] }
];

this.firstGrantedRoute = function(preferredRoute) {
	if(preferredRoute && routeGranted(preferredRoute)) return preferredRoute;

	var grantedRoute = "";

	_.every(privateRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(publicRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(freeRoutes, function(route) {
		if(routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	if(!grantedRoute) {
		// what to do?
		console.log("All routes are restricted for current user.");
	}

	return "";
}

// this function returns true if user is in role allowed to access given route
this.routeGranted = function(routeName) {
	if(!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if(!roleMap || roleMap.length === 0) {
		// this app don't have role map - enable access
		return true;
	}

	var roleMapItem = _.find(roleMap, function(roleItem) { return roleItem.route == routeName; });
	if(!roleMapItem) {
		// page is not restricted
		return true;
	}

	if(!Meteor.user() || !Meteor.user().roles) {
		// user is not logged in
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	var allowedRoles = roleMapItem.roles;
	var granted = _.intersection(allowedRoles, Meteor.user().roles);
	if(!granted || granted.length === 0) {
		return false;
	}

	return true;
};

Router.ensureLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(!Meteor.userId()) {
		// user is not logged in - redirect to public home
		var redirectRoute = firstGrantedRoute("home_public");
		this.redirect(redirectRoute);
	} else {
		// user is logged in - check role
		if(!routeGranted(this.route.getName())) {
			// user is not in allowedRoles - redirect to first granted route
			var redirectRoute = firstGrantedRoute("home_private");
			this.redirect(redirectRoute);
		} else {
			this.next();
		}
	}
};

Router.ensureNotLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(Meteor.userId()) {
		var redirectRoute = firstGrantedRoute("home_private");
		this.redirect(redirectRoute);
	}
	else {
		this.next();
	}
};

// called for pages in free zone - some of pages can be restricted
Router.ensureGranted = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(!routeGranted(this.route.getName())) {
		// user is not in allowedRoles - redirect to first granted route
		var redirectRoute = firstGrantedRoute("");
		this.redirect(redirectRoute);
	} else {
		this.next();
	}
};

Router.currentRouteParams = function() {
	var route = Router ? Router.current() : null;
	if(!route) {
		return {};
	}

	var params = {};
	for(var key in route.params) {
		params[key] = JSON.parse(JSON.stringify(route.params[key]));
	}

	return params;
};


Router.waitOn(function() { 
	Meteor.subscribe("current_user_data");
});

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		this.render('loading');
		$("body").addClass("wait");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});

Router.onBeforeAction(Router.ensureNotLogged, {only: publicRoutes});
Router.onBeforeAction(Router.ensureLogged, {only: privateRoutes});
Router.onBeforeAction(Router.ensureGranted, {only: freeRoutes}); // yes, route from free zone can be restricted to specific set of user roles

Router.map(function () {
	
	this.route("about", {path: "/about", controller: "AboutController"});
	this.route("home_public", {path: "/", controller: "HomePublicController"});
	this.route("login", {path: "/login", controller: "LoginController"});
	this.route("register", {path: "/register", controller: "RegisterController"});
	this.route("verify_email", {path: "/verify_email/:verifyEmailToken", controller: "VerifyEmailController"});
	this.route("forgot_password", {path: "/forgot_password", controller: "ForgotPasswordController"});
	this.route("reset_password", {path: "/reset_password/:resetPasswordToken", controller: "ResetPasswordController"});
	this.route("home_private", {path: "/home_private", controller: "HomePrivateController"});
	this.route("charts", {path: "/charts", controller: "ChartsController"});
	this.route("actives", {path: "/actives", controller: "ActivesController"});
	this.route("actives.details", {path: "/actives/details/:strategyId", controller: "ActivesDetailsController"});
	this.route("strategies", {path: "/strategies", controller: "StrategiesController"});
	this.route("strategies.insert", {path: "/strategies/insert", controller: "StrategiesInsertController"});
	this.route("strategies.details", {path: "/strategies/details/:strategyId", controller: "StrategiesDetailsController"});
	this.route("strategies.edit", {path: "/strategies/edit/:strategyId", controller: "StrategiesEditController"});
	this.route("plugins", {path: "/plugins", controller: "PluginsController"});
	this.route("plugins.pl_stop_loss_out", {path: "/plugins/pl_stop_loss_out", controller: "PluginsPlStopLossOutController"});
	this.route("plugins.pl_stop_loss_out.insert_pl_stop_loss_out", {path: "/plugins/pl_stop_loss_out/insert_pl_stop_loss_out", controller: "PluginsPlStopLossOutInsertPlStopLossOutController"});
	this.route("plugins.pl_stop_loss_out.details_pl_stop_loss_out", {path: "/plugins/pl_stop_loss_out/details_pl_stop_loss_out/:plStopLossOutId", controller: "PluginsPlStopLossOutDetailsPlStopLossOutController"});
	this.route("plugins.pl_stop_loss_out.edit_pl_stop_loss_out", {path: "/plugins/pl_stop_loss_out/edit_pl_stop_loss_out/:plStopLossOutId", controller: "PluginsPlStopLossOutEditPlStopLossOutController"});
	this.route("plugins.pl_take_profit_out", {path: "/plugins/pl_take_profit_out", controller: "PluginsPlTakeProfitOutController"});
	this.route("plugins.pl_take_profit_out.insert_pl_take_profit_out", {path: "/plugins/pl_take_profit_out/insert_pl_take_profit_out", controller: "PluginsPlTakeProfitOutInsertPlTakeProfitOutController"});
	this.route("plugins.pl_take_profit_out.details_pl_take_profit_out", {path: "/plugins/pl_take_profit_out/details_pl_take_profit_out/:plTakeProfitOutId", controller: "PluginsPlTakeProfitOutDetailsPlTakeProfitOutController"});
	this.route("plugins.pl_take_profit_out.edit_pl_take_profit_out", {path: "/plugins/pl_take_profit_out/edit_pl_take_profit_out/:plTakeProfitOutId", controller: "PluginsPlTakeProfitOutEditPlTakeProfitOutController"});
	this.route("plugins.pl_trailing_stop_in", {path: "/plugins/pl_trailing_stop_in", controller: "PluginsPlTrailingStopInController"});
	this.route("plugins.pl_trailing_stop_in.insert_pl_trailing_stop_in", {path: "/plugins/pl_trailing_stop_in/insert_pl_trailing_stop_in", controller: "PluginsPlTrailingStopInInsertPlTrailingStopInController"});
	this.route("plugins.pl_trailing_stop_in.details_pl_trailing_stop_in", {path: "/plugins/pl_trailing_stop_in/details_pl_trailing_stop_in/:plTrailingStopInId", controller: "PluginsPlTrailingStopInDetailsPlTrailingStopInController"});
	this.route("plugins.pl_trailing_stop_in.edit_pl_trailing_stop_in", {path: "/plugins/pl_trailing_stop_in/edit_pl_trailing_stop_in/:plTrailingStopInId", controller: "PluginsPlTrailingStopInEditPlTrailingStopInController"});
	this.route("plugins.pl_trailing_stop_out", {path: "/plugins/pl_trailing_stop_out", controller: "PluginsPlTrailingStopOutController"});
	this.route("plugins.pl_trailing_stop_out.insert_pl_trailing_stop_out", {path: "/plugins/pl_trailing_stop_out/insert_pl_trailing_stop_out", controller: "PluginsPlTrailingStopOutInsertPlTrailingStopOutController"});
	this.route("plugins.pl_trailing_stop_out.details_pl_trailing_stop_out", {path: "/plugins/pl_trailing_stop_out/details_pl_trailing_stop_out/:plTrailingStopOutId", controller: "PluginsPlTrailingStopOutDetailsPlTrailingStopOutController"});
	this.route("plugins.pl_trailing_stop_out.edit_pl_trailing_stop_out", {path: "/plugins/pl_trailing_stop_out/edit_pl_trailing_stop_out/:plTrailingStopOutId", controller: "PluginsPlTrailingStopOutEditPlTrailingStopOutController"});
	this.route("plugins.pl_profit_line_stop_out", {path: "/plugins/pl_profit_line_stop_out", controller: "PluginsPlProfitLineStopOutController"});
	this.route("plugins.pl_profit_line_stop_out.insert_pl_profit_line_stop_out", {path: "/plugins/pl_profit_line_stop_out/insert_pl_profit_line_stop_out", controller: "PluginsPlProfitLineStopOutInsertPlProfitLineStopOutController"});
	this.route("plugins.pl_profit_line_stop_out.details_pl_profit_line_stop_out", {path: "/plugins/pl_profit_line_stop_out/details_pl_profit_line_stop_out/:plProfitLineStopOutId", controller: "PluginsPlProfitLineStopOutDetailsPlProfitLineStopOutController"});
	this.route("plugins.pl_profit_line_stop_out.edit_pl_profit_line_stop_out", {path: "/plugins/pl_profit_line_stop_out/edit_pl_profit_line_stop_out/:plProfitLineStopOutId", controller: "PluginsPlProfitLineStopOutEditPlProfitLineStopOutController"});
	this.route("plugins.pl_dummy", {path: "/plugins/pl_dummy", controller: "PluginsPlDummyController"});
	this.route("plugins.pl_dummy.insert_pl_dummy", {path: "/plugins/pl_dummy/insert_pl_dummy", controller: "PluginsPlDummyInsertPlDummyController"});
	this.route("plugins.pl_dummy.details_pl_dummy", {path: "/plugins/pl_dummy/details_pl_dummy/:plDummyId", controller: "PluginsPlDummyDetailsPlDummyController"});
	this.route("plugins.pl_dummy.edit_pl_dummy", {path: "/plugins/pl_dummy/edit_pl_dummy/:plDummyId", controller: "PluginsPlDummyEditPlDummyController"});
	this.route("exchanges", {path: "/exchanges", controller: "ExchangesController"});
	this.route("exchanges.ex_kraken", {path: "/exchanges/ex_kraken", controller: "ExchangesExKrakenController"});
	this.route("exchanges.ex_kraken.insert_ex_kraken", {path: "/exchanges/ex_kraken/insert_ex_kraken", controller: "ExchangesExKrakenInsertExKrakenController"});
	this.route("exchanges.ex_kraken.edit_ex_kraken", {path: "/exchanges/ex_kraken/edit_ex_kraken/:exKrakenId", controller: "ExchangesExKrakenEditExKrakenController"});
	this.route("exchanges.ex_kraken.details_ex_kraken", {path: "/exchanges/ex_kraken/details_ex_kraken/:exKrakenId", controller: "ExchangesExKrakenDetailsExKrakenController"});
	this.route("exchanges.ex_test_data", {path: "/exchanges/ex_test_data", controller: "ExchangesExTestDataController"});
	this.route("exchanges.ex_test_data.insert_ex_test_data", {path: "/exchanges/ex_test_data/insert_ex_test_data", controller: "ExchangesExTestDataInsertExTestDataController"});
	this.route("exchanges.ex_test_data.edit_ex_test_data", {path: "/exchanges/ex_test_data/edit_ex_test_data/:exTestDataId", controller: "ExchangesExTestDataEditExTestDataController"});
	this.route("exchanges.ex_test_data.details_ex_test_data", {path: "/exchanges/ex_test_data/details_ex_test_data/:exTestDataId", controller: "ExchangesExTestDataDetailsExTestDataController"});
	this.route("settings", {path: "/settings", controller: "SettingsController"});
	this.route("info", {path: "/info", controller: "InfoController"});
	this.route("info.howto", {path: "/info/howto", controller: "InfoHowtoController"});
	this.route("info.pages", {path: "/info/pages", controller: "InfoPagesController"});
	this.route("info.plugins", {path: "/info/plugins", controller: "InfoPluginsController"});
	this.route("info.exchanges", {path: "/info/exchanges", controller: "InfoExchangesController"});
	this.route("info.misc", {path: "/info/misc", controller: "InfoMiscController"});
	this.route("history", {path: "/history", controller: "HistoryController"});
	this.route("history.str_history", {path: "/history/str_history/:activeId", controller: "HistoryStrHistoryController"});
	this.route("history.str_history.details", {path: "/history/str_history/:activeId/details/:historyId", controller: "HistoryStrHistoryDetailsController"});
	this.route("forum", {path: "/forum", controller: "ForumController"});
	this.route("forum.insert", {path: "/forum/insert", controller: "ForumInsertController"});
	this.route("forum.details", {path: "/forum/details/:topicId", controller: "ForumDetailsController"});
	this.route("forum.edit", {path: "/forum/edit/:topicId", controller: "ForumEditController"});
	this.route("develop", {path: "/develop", controller: "DevelopController"});
	this.route("develop.details_settings", {path: "/develop/details_settings/:settingId", controller: "DevelopDetailsSettingsController"});
	this.route("develop.edit_settings", {path: "/develop/edit_settings/:settingId", controller: "DevelopEditSettingsController"});
	this.route("admin", {path: "/admin", controller: "AdminController"});
	this.route("admin.users", {path: "/admin/users", controller: "AdminUsersController"});
	this.route("admin.users.details", {path: "/admin/users/details/:userId", controller: "AdminUsersDetailsController"});
	this.route("admin.users.insert", {path: "/admin/users/insert", controller: "AdminUsersInsertController"});
	this.route("admin.users.edit", {path: "/admin/users/edit/:userId", controller: "AdminUsersEditController"});
	this.route("admin.actives", {path: "/admin/actives", controller: "AdminActivesController"});
	this.route("user_settings", {path: "/user_settings", controller: "UserSettingsController"});
	this.route("user_settings.profile", {path: "/user_settings/profile", controller: "UserSettingsProfileController"});
	this.route("user_settings.change_pass", {path: "/user_settings/change_pass", controller: "UserSettingsChangePassController"});
	this.route("logout", {path: "/logout", controller: "LogoutController"});
});
