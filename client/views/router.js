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
	"plugins.insert_pl_swing",
	"plugins.details_pl_swing",
	"plugins.edit_pl_swing",
	"plugins.insert_pl_stop_loss",
	"plugins.details_pl_stop_loss",
	"plugins.edit_pl_stop_loss",
	"plugins.insert_pl_take_profit",
	"plugins.details_pl_take_profit",
	"plugins.edit_pl_take_profit",
	"exchanges",
	"exchanges.insert_ex_kraken",
	"exchanges.edit_ex_kraken",
	"exchanges.details_ex_kraken",
	"exchanges.insert_ex_test_data",
	"exchanges.edit_ex_test_data",
	"exchanges.details_ex_test_data",
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
	{ route: "user_settings",	roles: ["user","admin"] },
	{ route: "user_settings.profile",	roles: ["user","admin"] },
	{ route: "user_settings.change_pass",	roles: ["user","admin"] }
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
	this.route("plugins.insert_pl_swing", {path: "/plugins/insert_pl_swing", controller: "PluginsInsertPlSwingController"});
	this.route("plugins.details_pl_swing", {path: "/plugins/details_pl_swing/:plSwingId", controller: "PluginsDetailsPlSwingController"});
	this.route("plugins.edit_pl_swing", {path: "/plugins/edit_pl_swing/:plSwingId", controller: "PluginsEditPlSwingController"});
	this.route("plugins.insert_pl_stop_loss", {path: "/plugins/insert_pl_stop_loss", controller: "PluginsInsertPlStopLossController"});
	this.route("plugins.details_pl_stop_loss", {path: "/plugins/details_pl_stop_loss/:plStopLossId", controller: "PluginsDetailsPlStopLossController"});
	this.route("plugins.edit_pl_stop_loss", {path: "/plugins/edit_pl_stop_loss/:plStopLossId", controller: "PluginsEditPlStopLossController"});
	this.route("plugins.insert_pl_take_profit", {path: "/plugins/insert_pl_take_profit", controller: "PluginsInsertPlTakeProfitController"});
	this.route("plugins.details_pl_take_profit", {path: "/plugins/details_pl_take_profit/:plTakeProfitId", controller: "PluginsDetailsPlTakeProfitController"});
	this.route("plugins.edit_pl_take_profit", {path: "/plugins/edit_pl_take_profit/:plTakeProfitId", controller: "PluginsEditPlTakeProfitController"});
	this.route("exchanges", {path: "/exchanges", controller: "ExchangesController"});
	this.route("exchanges.insert_ex_kraken", {path: "/exchanges/insert_ex_kraken", controller: "ExchangesInsertExKrakenController"});
	this.route("exchanges.edit_ex_kraken", {path: "/exchanges/edit_ex_kraken/:exKrakenId", controller: "ExchangesEditExKrakenController"});
	this.route("exchanges.details_ex_kraken", {path: "/exchanges/details_ex_kraken/:exKrakenId", controller: "ExchangesDetailsExKrakenController"});
	this.route("exchanges.insert_ex_test_data", {path: "/exchanges/insert_ex_test_data", controller: "ExchangesInsertExTestDataController"});
	this.route("exchanges.edit_ex_test_data", {path: "/exchanges/edit_ex_test_data/:exTestDataId", controller: "ExchangesEditExTestDataController"});
	this.route("exchanges.details_ex_test_data", {path: "/exchanges/details_ex_test_data/:exTestDataId", controller: "ExchangesDetailsExTestDataController"});
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
