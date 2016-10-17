var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

app.use(express.static(__dirname + '/html'));
// default options
app.use(fileUpload({
    limits: { fileSize: 15 * 1024 * 1024 },
}));

app.listen(8741);

var exec = require('child_process').exec;

app.post('/upload', function(req, res) {
    var sampleFile;

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    sampleFile = req.files.sampleFile;
    sampleFile.mv(__dirname + '/html/uploads/input.jpg', function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
          var cmd = "convert html/uploads/input.jpg -resize \\<600x600 html/uploads/input.jpg; convert html/uploads/input.jpg -resize 3072x3072\\> html/uploads/input.jpg; rm -rf /tmp/lpr/*; rm -rf html/out/*; mkdir /tmp/lpr; cp weights.txt /tmp/lpr/; cp class_names.txt /tmp/lpr/; cp input.txt /tmp/lpr/; cp html/uploads/input.jpg /tmp/lpr/; cd /tmp/lpr; sleep 0.01; " + __dirname + "/bin/lpr -q -i input.txt -o /tmp/lpr | tail -n +15; sleep 0.01; cp -rf /tmp/lpr/roi_images " + __dirname + "/html/out/; cp -rf /tmp/lpr/plate_images " + __dirname + "/html/out/; cp -rf /tmp/lpr/binary_images " + __dirname + "/html/out/";
          console.log(cmd);

          exec(cmd, function(error, stdout, stderr) {

		console.log(stdout);

            fs = require('fs')
            var results = "scroll below the images..";
            fs.readFile('/tmp/lpr/results.txt', 'utf8', function (err,data) {
              if (err) {
		res.send("FAILED: " + err + "<br><pre>" + stdout + "</pre>");
                return console.log(err);
              }
		var arr = data.split(",");
              results = arr[1] + ", State: " + arr[2];
              console.log(data);
            var txt = "<html><head><title>LPR Results</title></head><body>\
            <b>Result: " + results + "</b><br><br>\
            <img src=\"uploads/input.jpg\" height=\"50%\"/><br>\
            ROIs:<br>\
            <img src=\"out/roi_images/input.jpg\" style=\"margin:5px 5px\"/><img src=\"out/roi_images/input_0.jpg\" style=\"margin:5px 5px\"/><img src=\"out/roi_images/input_1.jpg\" style=\"margin:5px 5px\"/><br>\
            Plates:<br>\
            <img src=\"out/plate_images/input.jpg\" style=\"margin:5px 5px\"/><img src=\"out/plate_images/input_0.jpg\" style=\"margin:5px 5px\"/><img src=\"out/plate_images/input_1.jpg\" style=\"margin:5px 5px\"/><br>\
            Segmentation:<br>\
            <img src=\"out/binary_images/input.jpg\" style=\"margin:5px 5px\"/><img src=\"out/binary_images/input_0.jpg\" style=\"margin:5px 5px\"/><img src=\"out/binary_images/input_1.jpg\" style=\"margin:5px 5px\"/><br>\
            <pre>" + stdout + "</pre></body></html>";
            res.send(txt);
          }); //readFile
          }); //exec

        }
    }); // sampleFile
});

function parse() {
  var text = "Hello";
}
