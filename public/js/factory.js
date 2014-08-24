/**
 * Created by zcfrank1st on 8/17/14.
 */
'use strict';
angular
    .module('valuesFactory', ['ngResource'])
    .factory('Utils', function () {
        return {
            target: '',
            openUrl: 'http://qnmedia.qiniudn.com/'
        }
    })
    .factory('deleteService', function ($resource) {
        return $resource('/delete', {filename: '@name'});
    })
    .factory('listService', function ($resource) {
        return $resource('/list');
    });
