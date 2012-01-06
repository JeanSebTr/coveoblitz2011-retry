/*
 * GET home page.
 */

module.exports = function(app, engine){
    app.get('/api/search', function(req, res){
        res.render('index.html', { title : 'Home page with an incredible title'});
    });
    
    app.get('/api/index' function(req, res){
      res.json({
         'success': true,
         'result': engine.progress
      }, 200);
    });
    
    app.get('/api/tags', function(req, res){
        res.render('index.html', { title : 'Home page with an incredible title'});
    });

    app.get('/test', function(req,res){
        var jsonStr = '{"title": "Un titre"}';
        var json = JSON.parse(jsonStr);
        res.send(json.title);
    });
};
