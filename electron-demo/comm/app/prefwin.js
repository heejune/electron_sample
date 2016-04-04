
'use strict';

angular.module('electronApp', [])
    .controller('configCtrl', function($scope, $http) {

        $scope.target = {
            name : 'Hello Electron!'
        };

        var ipcRenderer = require('electron').ipcRenderer;

        $scope.setName = function(targetName) {
            console.log('setName called: ' + targetName);
            require('remote').getGlobal('sharedObject').targetPath = targetName;
            ipcRenderer.send('setNameRequest', targetName)
        }

        $scope.closeWin = function() {
            var remote = require('remote');
            var window = remote.getCurrentWindow();
            window.close();
        }
});
