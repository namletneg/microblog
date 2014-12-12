
/*
 * GET home page.
 */
var crypto = require('crypto'),
    User = require('../models/user'),
    Post = require('../models/post');
module.exports = function(app){
    app.get('/',function(req, res){
        Post.get(null, function(err, posts){
            if(err){
                posts = [];
            }
            res.render('index',{
                title: '首页',
                posts: posts
            });
        });
    });

    //app.get('/reg', checkNoLogin);
    app.get('/reg',function(req, res){
        res.render('reg',{title: '用户注册'});
    });
    //app.post('/reg', checkNoLogin);
    app.post('/reg',function(req, res){
        //检验用户两次输入的口令是否一致
        if(req.body['password-repeat'] != req.body['password']){
            req.flash('error', '两次输入的密码不一致');
            return res.redirect('/reg');
        }
        //生产密码的散列值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('base64'),
            newUser = new User({
                name: req.body.username,
                password: password
            });
        //检查用户名是否已经存在
        User.get(newUser.name, function(err, user){
            if(user){
                err = '抱歉，您晚了一步，用户名已被注册！';
            }
            if(err){
                req.flash('error', err);
                return res.redirect('/reg');
            }
            //如果不存在则新增用户
            newUser.save(function(err){
                if(err){
                    req.flash('error',err);
                    return res.redirect('/reg');
                }
                req.session.user = newUser;
                req.flash('success', '注册成功');
                console.log(666);
                res.redirect('/');
                console.log(777);
            });
        });
    });

    //app.get('/login', checkNoLogin);
    app.get('/login',function(req,res){
        res.render('login',{title: '用户登录'});
    });
    //app.post('/login', checkNoLogin);
    app.post('/login',function(req, res){
        //生产密码的散列值
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('base64');

        User.get(req.body.username, function(err, user){
            if(!user){
                req.flash('error', '用户不存在');
                return res.redirect('/login');
            }
            if(user.password !== password){
                req.flash('error', '用户密码不正确');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登录成功');
            res.redirect('/');
        });
    });

    //app.get('/logout', checkLogin);
    app.get('/logout', function(req, res){
        req.session.user = null;
        req.flash('success','退出成功');
        res.redirect('/');
    });

    //app.post('/post', checkLogin);
    app.post('/post', function(req, res){
        var currentUser = req.session.user,
            post = new Post(currentUser.name, req.body.post);

        post.save(function(err){
            if(err){
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发表成功');
            res.redirect('/u/' + currentUser.name);
        });
    });
    app.get('/u/:user', function(req, res){
        User.get(req.params.user, function(err, user){
            if(!user){
                req.flash('error', '用户不存在');
                return res.redirect('/');
            }
            Post.get(user.name, function(err, posts){
                if(err){
                    req.flash('error', err);
                    return res.redirect('/');
                }
                res.render('user',{
                    title: user.name,
                    posts: posts
                });
            });
        });
    });
};

function checkLogin(req, res, next){
    if(!req.session.user){
        req.flash('error', '未登录');
        return res.redirect('/login');
    }
    next();
}
function checkNoLogin(req, res, next){
    if(req.session.user){
        req.flash('error', '已登录');
        return res.redirect('/');
    }
    next();
}

/*exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};

exports.user = function(req, res){

};

exports.post = function(req, res){

};

exports.reg = function(req, res){

};

exports.doReg = function(req, res){

};

exports.login = function(req, res){

};

exports.doLogin = function(req, res){

};*/

exports.logout = function(req, res){

};