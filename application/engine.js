var zmq = require('zmq');

var Class = function()
{
   // members
   this.progress = 0;
   this.sockets = [];
   var $this = this;
   
   // constructor
   console.log('Intinialise search engine...'.blue);
   this.sock = zmq.socket('pair');
   this.sock.connect('tcp://127.0.0.1:3002');
   this.sock.on('message', function(msg){
      console.log(msg.toString());
      var data = JSON.parse(msg.toString());
      console.log(data);
      if(data.cmd == 'progress')
      {
         console.log(data);
         $this.indexProgress(data.read, data.total);
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
   },
   addClient: function(socket)
   {
      this.sockets.push(socket);
      socket.on('disconnect', function(){
         
      });
   }
};

module.exports = Class;

