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
         'result': {
            'tata':20,
            'toto':18,
            'blob':22,
            'beer':15,
            'deer':24,
            'nodejs':25,
            'coveo':21
         }
      }, 200);
   });
};
