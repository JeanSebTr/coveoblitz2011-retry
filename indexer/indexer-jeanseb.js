var net      = require('net')
  , fs       = require('fs')
  , zmq      = require('zmq')
  , sock     = zmq.socket('pair')
  , filename = __dirname+'/Documents.txt';
//sock.bindSync('tcp://127.0.0.1:3002');


var words = {};


var buf = '';
var sk = 0, sb = 0, sd, sl = 0;

fs.stat(filename, function (err, stat) {

   var file = fs.createReadStream(filename, { flags: 'r', encoding: 'utf8' });

   var i, j, k;
   var d = true, l = true, e = true;
   var doc, word, suf;
   file.on('data', function (data) {
      buf += data;
      sb=0;
      j = buf.length;
      while(e && j > 0)
      {
         e=false;
         if(d)// nouveau document
         {
            sk+=sb;
            buf = buf.substr(sb);
            sb = 0;
            //console.log('New document !!');
            i = buf.indexOf('\t');
            if(i<0)
               break;
            sl++;
            doc = buf.substring(sb, i);
            //console.log('Document : '+doc);
            sd = sk+sb;
            sb+=i+1;
            d=false;
         }
         //console.log('Reading the line : ...');
         for(i=sb; i<j; i++)
         {
            e = (buf[i] == '\n' || buf[i] == '\r');// end line
            if(buf[i] == ' ' || e)
            {
               word = buf.substring(sb, i);
               suf = word.substr(-3);
               if(words[suf] === undefined || typeof words[suf] == 'Function')
                  words[suf] = {};
               if(words[suf][word] === undefined || typeof words[suf][word] == 'Function')
                  words[suf][word] = { pos:[], docs:{}};
               words[suf][word].pos.push(sk+sb);
               words[suf][word].docs[doc] = sd;
               sb=i+1;
            }
            if(e)
            {
               if(buf[i+1] == '\n')
                  i++;
               d=true;
               break;
            }
         }
         sb=i;
      }
      e=true;
      buf = buf.substr(sb);
      sk+=sb;
      k = sk/stat.size*100;
      if(k > 20)
         console.log(" - Progress : "+sk+" / "+stat.size+" = "+(k) + " ("+sl+") # "+process.memoryUsage().rss);
      //sock.send(JSON.stringify({ read: seek, total: stat.size, cmd: 'progress' }));
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
