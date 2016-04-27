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
	"controls",
	"strategies",
	"strategies.insert",
	"strategies.details",
	"strategies.edit",
	"pluginbundles",
	"pluginbundles.insert",
	"pluginbundles.details",
	"pluginbundles.edit",
	"plugins",
	"plugins.insert_swing",
	"plugins.details_swing",
	"plugins.edit_swing",
	"plugins.insert_dummy",
	"plugins.details_dummy",
	"plugins.edit_dummy",
	"exchanges",
	"exchanges.insert_kraken",
	"exchanges.edit_kraken",
	"exchanges.details_kraken",
	"exchanges.insert_test_data",
	"exchanges.edit_test_data",
	"exchanges.details_test_data",
	"settings",
	"info",
	"history",
	"develop",
	"develop.details_settings",
	"develop.edit_settings",
	"admin",
	"admin.users",
	"admin.users.details",
	"admin.users.insert",
	"admin.users.edit",
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
	this.route("controls", {path: "/controls", controller: "ControlsController"});
	this.route("strategies", {path: "/strategies", controller: "StrategiesController"});
	this.route("strategies.insert", {path: "/strategies/insert", controller: "StrategiesInsertController"});
	this.route("strategies.details", {path: "/strategies/details/:strategyId", controller: "StrategiesDetailsController"});
	this.route("strategies.edit", {path: "/strategies/edit/:strategyId", controller: "StrategiesEditController"});
	this.route("pluginbundles", {path: "/pluginbundles", controller: "PluginbundlesController"});
	this.route("pluginbundles.insert", {path: "/pluginbundles/insert", controller: "PluginbundlesInsertController"});
	this.route("pluginbundles.details", {path: "/pluginbundles/details/:pluginbundleId", controller: "PluginbundlesDetailsController"});
	this.route("pluginbundles.edit", {path: "/pluginbundles/edit/:pluginbundleId", controller: "PluginbundlesEditController"});
	this.route("plugins", {path: "/plugins", controller: "PluginsController"});
	this.route("plugins.insert_swing", {path: "/plugins/insert_swing", controller: "PluginsInsertSwingController"});
	this.route("plugins.details_swing", {path: "/plugins/details_swing/:swingId", controller: "PluginsDetailsSwingController"});
	this.route("plugins.edit_swing", {path: "/plugins/edit_swing/:swingId", controller: "PluginsEditSwingController"});
	this.route("plugins.insert_dummy", {path: "/plugins/insert_dummy", controller: "PluginsInsertDummyController"});
	this.route("plugins.details_dummy", {path: "/plugins/details_dummy/:dummyId", controller: "PluginsDetailsDummyController"});
	this.route("plugins.edit_dummy", {path: "/plugins/edit_dummy/:dummyId", controller: "PluginsEditDummyController"});
	this.route("exchanges", {path: "/exchanges", controller: "ExchangesController"});
	this.route("exchanges.insert_kraken", {path: "/exchanges/insert_kraken", controller: "ExchangesInsertKrakenController"});
	this.route("exchanges.edit_kraken", {path: "/exchanges/edit_kraken/:krakenId", controller: "ExchangesEditKrakenController"});
	this.route("exchanges.details_kraken", {path: "/exchanges/details_kraken/:krakenId", controller: "ExchangesDetailsKrakenController"});
	this.route("exchanges.insert_test_data", {path: "/exchanges/insert_test_data", controller: "ExchangesInsertTestDataController"});
	this.route("exchanges.edit_test_data", {path: "/exchanges/edit_test_data/:testDataId", controller: "ExchangesEditTestDataController"});
	this.route("exchanges.details_test_data", {path: "/exchanges/details_test_data/:testDataId", controller: "ExchangesDetailsTestDataController"});
	this.route("settings", {path: "/settings", controller: "SettingsController"});
	this.route("info", {path: "/info", controller: "InfoController"});
	this.route("history", {path: "/history", controller: "HistoryController"});
	this.route("develop", {path: "/develop", controller: "DevelopController"});
	this.route("develop.details_settings", {path: "/develop/details_settings/:settingId", controller: "DevelopDetailsSettingsController"});
	this.route("develop.edit_settings", {path: "/develop/edit_settings/:settingId", controller: "DevelopEditSettingsController"});
	this.route("admin", {path: "/admin", controller: "AdminController"});
	this.route("admin.users", {path: "/admin/users", controller: "AdminUsersController"});
	this.route("admin.users.details", {path: "/admin/users/details/:userId", controller: "AdminUsersDetailsController"});
	this.route("admin.users.insert", {path: "/admin/users/insert", controller: "AdminUsersInsertController"});
	this.route("admin.users.edit", {path: "/admin/users/edit/:userId", controller: "AdminUsersEditController"});
	this.route("user_settings", {path: "/user_settings", controller: "UserSettingsController"});
	this.route("user_settings.profile", {path: "/user_settings/profile", controller: "UserSettingsProfileController"});
	this.route("user_settings.change_pass", {path: "/user_settings/change_pass", controller: "UserSettingsChangePassController"});
	this.route("logout", {path: "/logout", controller: "LogoutController"});
});
