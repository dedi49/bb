var $members;
$.ajax({
    url: 'http://congress.api.sunlightfoundation.com/legislators/locate?zip=11216&apikey=a31ee5f4e2944c5e95bef87a7ad19be7',
    dataType: 'json',
    data: {},
    async:false,
    success: function(data) {
        $members = data.results;
    }
});

var HomeView = Backbone.View.extend({

    template:_.template($('#home').html()),

    render:function(eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

var LocaitonView = Backbone.View.extend({

    template:_.template($('#get-your-location').html()),

    render:function(eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

var AddressView = Backbone.View.extend({

    template:_.template($('#get-your-address').html()),

    render:function(eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

var BrowseView = Backbone.View.extend({

    template:_.template($("#browse-alphabetical").html()),

    render:function(eventName) {
        $(this.el).html(this.template());
        return this;
    }
});


// model
var Member = Backbone.Model.extend({
    defaults: {
        name: 'nike',
        img: "http://www.rcolepeterson.com/cole.jpg"
    }
});

//collection
var MemberCollection = Backbone.Collection.extend({
    defaults: {
        model: Member
    },
    model: Member,
    url: 'js/members.json'
});

var memberCollection = new MemberCollection([
    {
        name: "Jeffrey",
        age: 27
    },
    {
        name: "Dennis",
        age: 24
    },
    {
        name: "Arsenal",
        age: 100
    },
    {
        name: "Wenger",
        age: 65
    }
]);

//view
var MemberView = Backbone.View.extend({

    tagName: 'li',

    // el: $("#container"),

    template: '#vuong',

    initialize: function(){
        this.render();
    },

    render: function(){
        var template = _.template($(this.template).html(), this.model.toJSON());
        this.$el.html(template);
        return this;
    }
});

var MemberListView = Backbone.View.extend({

    template:_.template($("#vuong").html()),

    tagName: 'ul',

    initialize: function() {
        // this.collection.bind("reset", this.render, this);
        // this.collection.bind("change", this.render, this);
        // this.collection.fetch();
        // this.render();
        _.bindAll(this, 'render');
    },

    render:function(eventName) {
        // $(this.el).html(this.template());


        _.bindAll(this);
        this.collection.each(function(member) {
            var memberView = new MemberView({model: member});
            this.$el.append(memberView.render().el);
        }, this);

        // console.log(this.collection);

        return this;
    },


    // el: $('#container'),

    // template: '#vuong',

    initialize: function() {
        // this.render();
    },

    // render: function() {
    //     this.collection.each(function(member) {
    //         var memberView = new MemberView({model: member});
    //         console.log(memberView.el);
    //         this.$el.append(memberView.render().el);
    //     }, this);

    //     return this;
    // }
});

var MemberDetailView = Backbone.View.extend({

    template:_.template($('#member-detail').html()),

    render:function(eventName) {
        $(this.el).html(this.template());
        return this;
    }
});

var memberListView = new MemberListView({collection: memberCollection});

$('body').html(memberListView.render().el);

var AppRouter = Backbone.Router.extend({

    routes:{
        "": "home",
        "get-your-location": "get_your_location",
        "get-your-address": "get_your_address",
        "browse-alphabetical": "browse_alphabetical",
        "members": "member_list",
        "members/:id": "member_detail",
    },

    initialize:function () {
        // Handle back button throughout the application
        // $('.back').live('click', function(event) {
        //     var history.back();
        //     return false;
        // });
        // this.firstPage = true;
    },

    home: function () {
        this.changePage(new HomeView());
    },

    get_your_location: function() {
        this.changePage(new LocaitonView());
    },

    get_your_address: function() {
        this.changePage(new AddressView());
    },

    browse_alphabetical: function() {
        this.changePage(new BrowseView());
    },

    member_list: function() {
        this.changePage(new MemberListView());
    },

    member_detail: function() {
        this.changePage(new MemberDetailView());
    },

    changePage:function (page) {
        $(page.el).attr('data-role', 'page');
        page.render();
        $('body').append($(page.el));
        var transition = $.mobile.defaultPageTransition;
        // We don't want to slide the first page
        if (this.firstPage) {
            transition = 'none';
            this.firstPage = false;
        }
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }

});

$(document).ready(function () {
    app = new AppRouter();
    Backbone.history.start();
});