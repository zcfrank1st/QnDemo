/**
 * Created by zcfrank1st on 8/17/14.
 */
'use strict';
angular.module('myapp', ['myControllers', 'myRoutes']).config(function($sceDelegateProvider, $sceProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://qnmedia.qiniudn.com/**'
    ]);
});