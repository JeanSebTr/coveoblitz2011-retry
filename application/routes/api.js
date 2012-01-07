/*
 * GET home page.
 */

module.exports = function(app, engine){
   app.get('/api/search', function(req, res){
      res.json({
         'success': true,
         'result': [
            {
               'title':'Ton titre bidon',
               'summary':'lorem ipsum doloris amet blabla'
            },
            {
               'title':'Ton title deux',
               'summary':'lorem fidouda ipsumum'
            }
         ]
      }, 200);
   });
   
   app.get('/api/progress', function(req, res){
      res.json({
         'success': true,
         'result': engine.progress
      }, 200);
   });
   
   app.get('/api/tags', function(req, res){
      res.json({
         'success': true,
         'result': [
            {'name' : 'pizza', 'freq' : 14},
            {'name' : 'hot-dog', 'freq' : 33},
            {'name' : 'xxx', 'freq' : 69},
            {'name' : 'sofa', 'freq' : 3},
            {'name' : 'couch', 'freq' : 54},
            {'name' : 'kitchen', 'freq' : 9},
            {'name' : 'beer', 'freq' :156},
         ]
      }, 200);
   });
};
