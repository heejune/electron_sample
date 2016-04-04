
'use strict';

var angularApp = angular.module('electronApp', []);

angularApp.controller('myCtrl', function($scope, $http) {

    var ipcRenderer = require('electron').ipcRenderer;

    $scope.openPreference = function(){
        ipcRenderer.send('openPreference', null);
    }

    var closeElement  = document.querySelector('.close');
    closeElement.addEventListener('click', function () {
        ipcRenderer.send('close-main-window');
    });

    $scope.openDevtools = function() {
        require('remote').getCurrentWindow().toggleDevTools();
    }
});
