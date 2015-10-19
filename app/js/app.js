window.ContactManager = {
  Models: {},
  Collections: {},
  Views: {},

  BAASBOX_URL : "http://localhost:9000",
  BAASBOX_APP_CODE : "1234567890",
    
  start: function(data) {
    //initialize BaasBox
    BaasBox.setEndPoint(this.BAASBOX_URL); //the address of your BaasBox server
    BaasBox.appcode = this.BAASBOX_APP_CODE;               //the application code of your server
    
    //at the moment we log in as admin  
    BaasBox.login("admin", "admin")
        .done(function (user) {
            console.log("Logged in ", user);
            //once we are logged in, let's start backbone
            Backbone.history.start();
    })
        .fail(function (err) {
          console.log("error ", err);
    });
      
    var router = new ContactManager.Router();
    var contacts = new ContactManager.Collections.Contacts();
    
    router.on('route:home', function() {
      router.navigate('contacts', {
        trigger: true,
        replace: true
      });
    });

    router.on('route:showContacts', function() {
        var contactsDefer = contacts.fetch();
        contactsDefer.done(function(res){
            console.log("contact: ",res);
            var contactsView = new ContactManager.Views.Contacts({
                collection: contacts
            });
            $('.main-container').html(contactsView.render().$el);
        });
    });

    router.on('route:newContact', function() {
      var newContactForm = new ContactManager.Views.ContactForm({
        model: new ContactManager.Models.Contact()
      });

      newContactForm.on('form:submitted', function(attrs) {
        contacts.create(attrs,{wait:true});
          router.navigate('contacts', {trigger: true});
      });

      $('.main-container').html(newContactForm.render().$el);
    });

    router.on('route:editContact', function(id) {
      var contact = contacts.get(id),
          editContactForm;

      if (contact) {
        editContactForm = new ContactManager.Views.ContactForm({
            model: contact
        });

        editContactForm.on('form:submitted', function(attrs) {
            contact.save(attrs,{wait:true});
            router.navigate('contacts', {trigger: true});
        });

        $('.main-container').html(editContactForm.render().$el);
      } else {
        router.navigate('contacts');
      }
    });

      router.on('route:deleteContact', function(id) {
          var contact = contacts.get(id);
          if (contact) {
              contact.destroy({wait:true});
              router.navigate('contacts', {trigger: true});
          } else {
              router.navigate('contacts');
          }
      });
  }
};
