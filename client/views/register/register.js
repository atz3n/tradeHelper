var pageSession = new ReactiveDict();
var enAccessCode = Meteor.settings.public.EnableAccessCode;


var createAcc = function(submit_button, register_name, register_email, register_password) {
  Accounts.createUser({ email: register_email, password: register_password, profile: { name: register_name } }, function(err) {
    submit_button.button("reset");
    if (err) {
      if (err.error === 499) {
        pageSession.set("verificationEmailSent", true);
      } else {
        pageSession.set("errorMessage", err.message);
      }
    } else {
      pageSession.set("errorMessage", "");
      pageSession.set("verificationEmailSent", true);
    }
  });
}


Template.Register.rendered = function() {
  pageSession.set("errorMessage", "");
  pageSession.set("verificationEmailSent", false);


  Meteor.defer(function() {
    $("input[autofocus]").focus();
  });

};

Template.Register.created = function() {
  pageSession.set("errorMessage", "");
};

Template.Register.events({
  'submit #register_form': function(e, t) {
    e.preventDefault();

    var submit_button = $(t.find(":submit"));

    var register_name = t.find('#register_name').value.trim();
    var register_email = t.find('#register_email').value.trim();
    var register_password = t.find('#register_password').value;
    
    var register_accessCode = '';
    if(enAccessCode === 'true') register_accessCode = t.find('#register_accessCode').value;

    // check name
    if (register_name == "") {
      pageSession.set("errorMessage", "Please enter your name.");
      t.find('#register_name').focus();
      return false;
    }

    // check email
    if (!isValidEmail(register_email)) {
      pageSession.set("errorMessage", "Please enter valid e-mail address.");
      t.find('#register_email').focus();
      return false;
    }

    // check password
    var min_password_len = 6;
    if (!isValidPassword(register_password, min_password_len)) {
      pageSession.set("errorMessage", "Your password must be at least " + min_password_len + " characters long.");
      t.find('#register_password').focus();
      return false;
    }

    // check access code
    if (enAccessCode === 'true') {
      submit_button.button("loading");
      Meteor.call('checkAccessCode', register_accessCode, function(e, r) {
        if (e) {
          pageSession.set("errorMessage", "An error occured while checking the access code.");
          submit_button.button("reset");
        } else {
          if (!r) {
            pageSession.set("errorMessage", "Your access code is wrong.");
            t.find('#register_accessCode').focus();
            submit_button.button("reset");
          } else {
            createAcc(submit_button, register_name, register_email, register_password);
          }
        }
      });

    } else {
      submit_button.button("loading");
      createAcc(submit_button, register_name, register_email, register_password);
    }




    // createAcc(submit_button, register_email, register_password, register_name);

    // Accounts.createUser({ email: register_email, password: register_password, profile: { name: register_name } }, function(err) {
    //   submit_button.button("reset");
    //   if (err) {
    //     if (err.error === 499) {
    //       pageSession.set("verificationEmailSent", true);
    //     } else {
    //       pageSession.set("errorMessage", err.message);
    //     }
    //   } else {
    //     pageSession.set("errorMessage", "");
    //     pageSession.set("verificationEmailSent", true);
    //   }
    // });
    return false;
  },

  "click .go-home": function(e, t) {
    Router.go("/");
  }

});

Template.Register.helpers({
  errorMessage: function() {
    return pageSession.get("errorMessage");
  },
  verificationEmailSent: function() {
    return pageSession.get("verificationEmailSent");
  },
  enAccessCode: function() {
    return enAccessCode;
  }
});
