var net = require('net')
  , fs  = require('fs');

/**
var server = net.createServer(function (socket) {
   console.log('Connect');
})

server.listen('/tmp/indexer.sock', function () {
   console.log('Start server');
});
*/

var struct = {};


var buf = '';
var seek = 0;

//var file = fs.createReadStream('Documents.txt', { flags: 'r', encoding: 'utf8', start: 0, end: 100000 });
var file = fs.createReadStream('Documents.txt', { flags: 'r', encoding: 'utf8', start: 0, end: 8500 });

file.on('data', function (data) {
   buf += data;

   var c = data.indexOf('\r\n');
   var r = /(.*)\r\n/g;
   while (line = r.exec(buf)) {
      console.log(line.input);
      var input = line[1].replace('\r\n', '');
      var s = seek + line['index'];

      var tmp      = input.split('\t')
        , id       = tmp[0]
        , doc      = tmp[1]
        , reg      = /\b(\w+)\b/gi
        , wordData = null;
        console.log(s);

      // For each words...
      while (wordData = reg.exec(doc)) {
         //console.log(word['index']);
         var idx  = wordData['index'] + 15
           , word = wordData[1];
           console.log(idx);

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
   //console.log(data.length);
});

file.on('end', function (close) {
   console.log('to', JSON.stringify(struct['to']));
   //for (var i in struct) {
   //   console.log(i, JSON.stringify(struct[i]));
   //}
});
