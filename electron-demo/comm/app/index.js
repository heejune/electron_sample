
'use strict';

var angularApp = angular.module('electronApp', []);

angularApp.controller('myCtrl', function($scope, $http) {

    var ipcRenderer = require('electron').ipcRenderer;

    $scope.openDevtools = function() {
        require('remote').getCurrentWindow().toggleDevTools();
    }

    $scope.openPreference = function(){
        ipcRenderer.send('openPreference', null);
    }

    ipcRenderer.on('setNameRequestCallback', function(event, arg){
        var shared = require('remote').getGlobal('sharedObject').targetPath;
        var param = arg;
        console.log('setNameRequestCallback: param = ' + param
                   + ', shared = ' + shared);
    });

    // close handler
    var closeElement  = document.querySelector('.close');

    closeElement.addEventListener('click', function () {
        ipcRenderer.send('close-main-window');
    });

    $scope.setTestValue = function(name) {
        require('remote').getGlobal('sharedObject').targetPath = name;
        ipcRenderer.send('setNameRequest', name);
    }

});
