var net      = require('net')
  , fs       = require('fs')
  , zmq      = require('zmq')
  , sock     = zmq.socket('pair')
  , filename = 'Documents.txt';
sock.bindSync('tcp://127.0.0.1:3002');


var struct = {};


var buf = '';
var seek = 0;

fs.stat(filename, function (err, stat) {

   var file = fs.createReadStream(filename, { flags: 'r', encoding: 'utf8' });

   file.on('data', function (data) {
      buf += data;

      var c = data.indexOf('\r\n');
      var r = /(.*)\r\n/g;
      while (line = r.exec(buf)) {
         var input = line[1].replace('\r\n', '');
         var s = seek + line['index'];

         var tmp      = input.split('\t')
           , id       = tmp[0]
           , doc      = tmp[1]
           , reg      = /\b(\w+)\b/gi
           , wordData = null;

         // For each words...
         while (wordData = reg.exec(doc)) {
            var idx  = wordData['index'] + 15
              , word = wordData[1];

            if ( !(word in struct)) {
               struct[word] = { docs: {} };
            }
            if (!struct[word]['docs'][s]) {
               struct[word]['docs'][s] = [];
            }
            struct[word]['docs'][s].push(s+idx);
         }
      }

      seek += buf.lastIndexOf('\r\n') + 1;
      buf = buf.substr(buf.lastIndexOf('\r\n') + 1);


      sock.send(JSON.stringify({ read: seek, total: stat.size, cmd: 'progress' }));
   });

   file.on('end', function (close) {
      console.log('to', JSON.stringify(struct['to']));
      //for (var i in struct) {
      //   console.log(i, JSON.stringify(struct[i]));
      //}
   });

});




//--- Communication ------------------------------------------------------------

sock.on('message', function (data) {
   console.log('>>', data.toString());
   var json = JSON.parse(data.toString());

   switch (json.cmd) {
   case 'search':
      var res = { results: {}, success: true };
      for (var i=0; i<json.words.length; i++) {
         var word = json.words[i];
         var tmp = struct[word];
         res.results[word] = tmp;
      }
      sock.send(JSON.stringify(res));
      break;
   }
});

//------------------------------------------------------------------------------
