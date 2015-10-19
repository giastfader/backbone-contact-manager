ContactManager.Collections.Contacts = Backbone.Collection.extend({
  model: ContactManager.Models.Contact,
  url : function(){
    return BaasBox.endPoint + "/document/contacts";
  },
    parse: function(response) {
        //unwrap the response from the server....
        if (response.data) return response.data;
        return response;
    }
});

