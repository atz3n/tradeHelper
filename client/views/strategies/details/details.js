var pageSession = new ReactiveDict();

Template.StrategiesDetails.rendered = function() {
	Session.set('activePage', 'strategies');
};

Template.StrategiesDetails.events({
	
});

Template.StrategiesDetails.helpers({
	
});

Template.StrategiesDetailsDetailsForm.rendered = function() {
	pageSession.set("pluginBundlesCrudItems", this.data.strategy.pluginBundles || []);


	pageSession.set("strategiesDetailsDetailsFormInfoMessage", "");
	pageSession.set("strategiesDetailsDetailsFormErrorMessage", "");

  pageSession.set('activeState', this.data.strategy.status);

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.StrategiesDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("strategiesDetailsDetailsFormInfoMessage", "");
		pageSession.set("strategiesDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var strategiesDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(strategiesDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("strategiesDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("strategiesDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		Router.go("strategies", {});
	},
    "click #form-goToActives-button": function(e, t) {
    e.preventDefault();

    Router.go("actives", {});
  },
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("strategies", {});
  },

  "click #form-activate-button": function(e, t) {
    e.preventDefault();
    var strId = this.params.strategyId;

	
    if (!Strategies.findOne({ _id: strId }).active) {
      Meteor.call('strategyStart', strId, function(e, r) {
        if (e) console.log(e);
        else if (r) {
          Strategies.update({ _id: strId }, { $set: { active: true } });
          Strategies.update({ _id: strId }, { $set: { paused: false } });
        }
      });
    }
  }
});

Template.StrategiesDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("strategiesDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("strategiesDetailsDetailsFormErrorMessage");
	}, 
		"pluginBundlesCrudItems": function() {
    if(pageSession.get("pluginBundlesCrudItems")){
      if(pageSession.get("pluginBundlesCrudItems").length > 0){
        var ret = pageSession.get("pluginBundlesCrudItems");
        
        for(var i = 0 ; i < ret.length ; i++){
          ret[i].bundle = getPluginBundleName(ret[i].bundle);
        }

        return ret;
      }
    }
      
		return pageSession.get("pluginBundlesCrudItems");
  },
  "strategyActive": function() {
    if (Strategies.findOne({ _id: this.params.strategyId }).active)
      return true;
    else
      return false;
	}
});
