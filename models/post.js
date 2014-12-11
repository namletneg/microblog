/**
 * Created by Administrator on 2014/12/11.
 */
var mongodb = require('./db');

function Post(username, post, time){
    this.user = username;
    this.post = post;
    this.time = time || new Date();
}

module.exports = Post;

Post.prototype.save = function save(callback){
    //存入 Mongodb 的文档
    var post = {
        user: this.user,
        post: this.post,
        time: this.time
    };
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function(err, collection){
            if(err){
                return callback(err);
            }
            // 为user 属性添加索引
            collection.ensureIndex('user');
            // 写入 post文档
            collection.insert(post, {safe: true}, function(err, post){
                mongodb.close();
                callback(err, post);
            });
        });
    });
};

Post.get = function get(username, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function(err, collection){
            if(err){
                return callback(err);
            }
            //查找 username 的文档，如果 username 是 null 则匹配全部
            var query = {};
            if(username){
                query.user = username;
            }
            collection.find(query).sort({time: -1}).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    callback(err, null);
                }
                //封装 posts 为 Post 对象
                var posts = [];
                docs.forEach(function(doc, index){
                    var post = new Post(doc.user, doc.post, doc.time);
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
    });
};