/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    MongoStore = require('connect-mongo')(express),
    settings = require('./settings');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
    //关闭layout.ejs 布局
  /*app.set('view options',{
      layout : false
  });*/
  app.use(express.bodyParser());
  app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: settings.cookieSecret,
        store : new MongoStore({
            db: settings.db
        })
    }));
  app.use(express.router(routes));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.dynamicHelpers({
    user: function(req, res){
        return req.session.user;
    },
    error: function(req, res){
        var err = req.flash('error');
        if(err.length){
            return err;
        } else{
            return null;
        }
    },
    success: function(req, res){
        var succ = req.flash('success');
        if(succ.length){
            return succ;
        } else{
            return null;
        }
    }
});
// Routes

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
