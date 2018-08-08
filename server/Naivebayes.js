var bayes = require('bayes');
var classifier = bayes();

function processPositiveFile(inputFile) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', function (line) {
        //console.log(line);
        classifier.learn(line,'positive');
    });

    rl.on('close', function (line) {

        console.log('done reading positive file for naive base .');
    });
}
//processPositiveFile(path.join(__dirname + "/lib/dataForbayes/good.txt"));

function processNegativeFile(inputFile) {
    var fs = require('fs'),
        readline = require('readline'),
        instream = fs.createReadStream(inputFile),
        outstream = new (require('stream'))(),
        rl = readline.createInterface(instream, outstream);

    rl.on('line', function (line) {
        //console.log(line);
        classifier.learn(line,'negative');
    });

    rl.on('close', function (line) {

        console.log('done reading negative file for naive base .');

    });
}
//processNegativeFile(path.join(__dirname + "/lib/dataForbayes/bad.txt"));
module.exports = {
    getClassifier: classifier,
    init: function(NegativeFile, PositiveFile) {
        processNegativeFile(NegativeFile);
        processPositiveFile(PositiveFile);
    },
    calcComments: function(prodobj,callback){
        var maxScore = -1.0;//save the computed score classmem[item]
        var productToRet=null;
        //prodobj = JSON.parse(comments);

        for (var i = 0;i<prodobj.length ; i++)  // move on each car and check the score
            {//prodobj[0].comments[0].textContent
                //save the score
                var good = 0.0;
                var bad = 0.0;
                for (var j = 0, len = prodobj[i].comments.length; j < len; j++)
// move on each post and check the score
                {
                    var result = classifier.categorize(prodobj[i].comments[j].textContent);//:)
                    if (result==("positive"))
                    { //check if have any result
                        good += 1/ prodobj[i].comments.length;//if yes normelaize it and save it
                    }
                    if (result==("negative"))
                    {
                        bad += 1/ prodobj[i].comments.length;//if yes normelaize it and save it
                    }
                }
                if (good - bad > maxScore || productToRet==null)//check the current car score
                {
                    maxScore = good - bad;
                    productToRet = prodobj[i];//if is max save it
                }

            }
        callback(null,productToRet);
        }

};