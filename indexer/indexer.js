var net      = require('net')
  , fs       = require('fs')
  , zmq      = require('zmq')
  , sock     = zmq.socket('pair')
  , filename = 'Documents.txt';
sock.bindSync('tcp://127.0.0.1:3002');


var struct = {};


var buf = '';
var seek = 0;
var start = null;

fs.stat(filename, function (err, stat) {
   start = new Date().getTime();
   var size = stat.size;
   var file = fs.createReadStream(filename, { flags: 'r', encoding: 'utf8' });

   var s = 0;

   file.on('data', function (data) {
      buf += data;
      lines = buf.split('\r\n');
      if (lines.length == 1) return;

      var lio = data.substr(data.lastIndexOf('\r\n')+2);
      buf = lio;
      // Each lines
      for (var i=0; i<lines.length-1; i++) {
         var line = lines[i];
         var tmp = line.split('\t');
         var docId = tmp[0];
         var seekDoc = s;
         var seekWord = seekDoc + 15;
         var words = tmp[1].split(' ');
         for (var j=0; j<words.length; j++) {
            var word = words[j].replace(/('|"|,|\.|\(|\)|;|:|[|]|{|})/gi, '').toLowerCase();
            if (struct[word] == undefined || typeof struct[word] == 'function') {
               struct[word] = { docs: {} };
            }
            if (!struct[word]['docs'][seekDoc]) {
               struct[word]['docs'][seekDoc] = [];
            }
            struct[word]['docs'][seekDoc].push(seekWord);
            seekWord += word.length + 1;
         }

         s += line.length + 2;
      }
      console.log(s  + ' --> ' +  size + ' --> ' + Math.round(s/size*100)+'%', ((new Date().getTime()-start)/1000));
   });

   file.on('end', function (close) {
      console.log('to', JSON.stringify(struct['to']));
      console.log('TIME: '+new Date().getTime() - start);
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
