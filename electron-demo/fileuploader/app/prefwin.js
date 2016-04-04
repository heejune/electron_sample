
'use strict';

angular.module('electronApp', [])
    .controller('configCtrl', function($scope, $http) {

        $scope.target = {
            name : '/'
        };

        var ipcRenderer = require('electron').ipcRenderer;

        $scope.setDir = function(targetName) {
            console.log('setDir called: ' + targetName);
            require('remote').getGlobal('sharedObject').targetPath = targetName;
            ipcRenderer.send('listDir', targetName)
        }

        $scope.closeWin = function() {
            var remote = require('remote');
            var window = remote.getCurrentWindow();
            window.close();
        }
});
