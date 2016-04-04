
'use strict';

var angularApp = angular.module('electronApp', []);

angularApp.controller('myCtrl', function($scope, $http) {

    if(typeof process !== 'object') {
        // http://dolftax.com/2016/01/renderer-main-communication-in-electron/
    }

    var os = require('os');
    var ipcRenderer = require('electron').ipcRenderer;

    //console.log(os.cpus().length);
    //console.log(os.freemem());

    $scope.hostName = "http://localhost:5000/";

    $scope.uploadImage = function(file) {
        console.log('uploadImage');
        const path = require('path');
        //var fullPath = path.resolve(path.join(require('remote').getGlobal('sharedObject').targetPath, fileName));
        var fullPath = file.fullPath;
        console.log("upload Image: " + fullPath);
        var uploadUrl = $scope.hostName + 'upload';
        const fs = require('fs');

        fs.readFile(fullPath, function(err, data) {
                //var base64data = new Buffer(data).toString('base64');
            //var base64data = new Buffer(data);
            // image/jpge or image/png
            var mimetype = "";
            var ext = file.name.split('.').pop();
            if (ext == 'jpg')
                mimetype = "image/jpeg";
            else if (ext == 'png')
                mimetype = "image/png";

            var blob = new Blob([data], {type: mimetype});
            var fd = new FormData(blob);
            fd.append('file', blob, file.name);

            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
              .success(function(){
                  console.log('upload success');
              })
              .error(function(){
                  console.log('upload error');
              });
        });

    };

    $scope.openPreference = function(){
        ipcRenderer.send('openPreference', null);
    }

    ipcRenderer.on('listDirCallback', function(event, arg){
        var files = [];
        const fs = require('fs');
        const path = require('path');

        for (var i =0;i<arg.length;i++) {
            var targetDir = require('remote').getGlobal('sharedObject').targetPath;
            const fullPath = path.resolve(path.join(targetDir, arg[i]));
            files.push({
                targetDir: targetDir,
                name: arg[i],
                fullPath: fullPath,
                isDirectory: fs.statSync(fullPath).isDirectory() === true
            });
        }

        $scope.localFiles = files;
        $scope.$apply();
    });

    var closeElement  = document.querySelector('.close');
    closeElement.addEventListener('click', function () {
        ipcRenderer.send('close-main-window');
    });

    $scope.openDevtools = function() {
        require('remote').getCurrentWindow().toggleDevTools();
    }

    // test function in case you need...
    $scope.csstest = function() {
        const remote = require('electron').remote;
        const BrowserWindow = remote.BrowserWindow;

        var win = new BrowserWindow({ width: 800, height: 600 });
        win.loadURL('file://' + __dirname + '/csstest.html');
    }

    $scope.showDir = function(file) {
        console.log('showDir called: ' + file);
        require('remote').getGlobal('sharedObject').targetPath = file.fullPath;
        ipcRenderer.send('listDir', file.fullPath)
    }
});
