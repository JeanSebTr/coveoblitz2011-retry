var zmq = require('zmq'),
   sock = zmq.socket('pair');

var Class = function()
{
   this.progress = 0;
   console.log('Intinialise search engine...'.blue);
   sock.connect('tcp://127.0.0.1:3002');
   sock.on('message', function(msg){
      var data = JSON.parse(msg);
      if(data.cmd == 'progess')
      {
         this.indexProgress(data.read, data.total);
      }
      else if(data.cmd == 'progress')
      {
         
      }
   });
};

Class.prototype = {
   indexProgress: function(pos, total)
   {
      this.progress = pos / total * 100;
   },
   search: function()
   {
      
   },
   tags: function()
   {
      
   }
};

module.exports = Class;

