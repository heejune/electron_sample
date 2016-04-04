
'use strict';

angular.module('electronApp', [])
    .controller('configCtrl', function($scope, $http) {

        $scope.target = {
            name : '/'
        };

        var ipcRenderer = require('electron').ipcRenderer;

        $scope.test = function () {
            alert('clicked!');
        }

        $scope.closeWin = function() {
            var remote = require('remote');
            var window = remote.getCurrentWindow();
            window.close();
        }

        // http://stackoverflow.com/questions/31171597/atom-electron-close-the-window-with-javascript
});
