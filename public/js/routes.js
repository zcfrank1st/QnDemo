/**
 * Created by zcfrank1st on 8/17/14.
 */
'use strict';
angular.module('myRoutes', ['ngRoute', 'myControllers'])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'views/list.html',
                    controller: 'listCtrl'
                })
                .when('/play', {
                    templateUrl: 'views/play.html',
                    controller: 'playCtrl'
                })
                .when('/music', {
                    templateUrl: 'views/music.html',
                    controller: 'musicCtrl'
                })
                .when('/all', {
                    templateUrl: 'views/all.html',
                    controller: 'allCtrl'
                })
                .when('/upload', {
                    templateUrl: 'views/upload.html',
                    controller: 'uploadCtrl'
                })
                .when('/share', {
                    templateUrl: 'views/share.html',
                    controller: 'shareCtrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }]);