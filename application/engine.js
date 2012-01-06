var zmq = require('zmq');

var Class = function()
{
   this.progress = 0;
   console.log('Intinialise search engine...'.blue);
   this.sock = zmq.socket('pair')
   this.sock.connect('tcp://127.0.0.1:3002');
   this.sock.on('message', function(msg){
      var data = JSON.parse(msg.toString());
      if(data.cmd == 'progess')
      {
         this.indexProgress(data.read, data.total);
      }
      else if(data.cmd == 'result')
      {
         
      }
   });
};

Class.prototype = {
   indexProgress: function(pos, total)
   {
      this.progress = pos / total * 100;
   },
   search: function(qry, page)
   {
      
   },
   tags: function()
   {
      this.sock.send(JSON.stringify({
         "cmd": "tags",
         "offset": 0,
         "length": 20
      }));
   }
};

module.exports = Class;

