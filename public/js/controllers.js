/**
 * Created by zcfrank1st on 8/17/14.
 */
'use strict';
angular
    .module('myControllers', ['valuesFactory'])
    .controller('navbarCtrl', function ($scope,$window) {
        // TODO 根据权限可以替换，demo写死
        $scope.username = 'qnmedia';

        $scope.clearBucketInfo = function () {
            $window.localStorage.clear();
        };
    })
    .controller('sidebarCtrl', function ($scope, $location) {
        var currentPath = $location.path();
        if (currentPath.indexOf('/picture') >= 0) {
            $scope.isDefault = false;
            $scope.isPicture = true;
            $scope.isAudio = false;
            $scope.isSum = false;
        } else if (currentPath.indexOf('/music') >=0){
            $scope.isDefault = false;
            $scope.isPicture = false;
            $scope.isAudio = true;
            $scope.isSum = false;
        } else if (currentPath.indexOf('/all') >=0 || currentPath.indexOf('/share') >=0 || currentPath.indexOf('/upload') >=0){
            $scope.isDefault = false;
            $scope.isPicture = false;
            $scope.isAudio = false;
            $scope.isSum = true;
        } else {
            $scope.isDefault = true;
            $scope.isPicture = false;
            $scope.isAudio = false;
            $scope.isSum = false;
        }

        $scope.sum = function () {
            $scope.isDefault = false;
            $scope.isPicture = false;
            $scope.isAudio = false;
            $scope.isSum = true;
        };

        $scope.film = function () {
            $scope.isSum = false;
            $scope.isDefault = true;
            $scope.isPicture = false;
            $scope.isAudio = false;
        };

        $scope.audio = function () {
            $scope.isSum = false;
            $scope.isDefault = false;
            $scope.isPicture = false;
            $scope.isAudio = true;
        };

        $scope.picture = function () {
            $scope.isSum = false;
            $scope.isDefault = false;
            $scope.isPicture = true;
            $scope.isAudio = false;
        };
    })
    .controller('listCtrl', function ($scope, $http, $location, listService, deleteService, Utils, $timeout, $route) {
        // hardcode type
        listService.get(function (data) {
            var contents = [];
            for (var i in data.items) {
                var content = {};
                content.type = data.items[i].mimeType;
                content.date = (new Date(parseInt((data.items[i].putTime + "").substr(0, 13)))).toLocaleString();
                content.name = data.items[i].key;
                content.url = Utils.openUrl + data.items[i].key + '?download';
                if (content.name.indexOf('.mp4') >= 0) {
                    content.isMP4 = true;
                }
                contents.push(content);
            }
            $scope.contents = contents;
        });

        $scope.play = function (filename) {
            Utils.target = filename;
            $location.path('/play');
        };

        $scope.deleteVideo = function (index, filename) {
            $('#vdel' + index).notify('文件正在删除中...',
                {
                    position: 'right',
                    className: 'info'
                }
            );

            deleteService.save({filename: filename}, function () {
                $timeout(function () {
                    $route.reload();
                }, 1000);
            });
        };
    })
    .controller('playCtrl', function ($scope, Utils) {
        $scope.targetUrl = Utils.openUrl + Utils.target;
        $scope.videoName = Utils.target;

        var popcorn = Popcorn("#ourvideo");
        popcorn.autoplay(true);
    })
    .controller('musicCtrl', function ($scope, listService, Utils, $route, deleteService, $timeout) {
        $scope.getUrl = function (filename) {
            return Utils.openUrl + filename;
        };

        listService.get(function (data) {
            var contents = [];
            for (var i in data.items) {
                var content = {};
                content.type = data.items[i].mimeType;
                content.date = (new Date(parseInt((data.items[i].putTime + "").substr(0, 13)))).toLocaleString();
                content.name = data.items[i].key;
                content.url = Utils.openUrl + data.items[i].key + '?download';
                if (content.name.indexOf('.mp3') >= 0) {
                    content.isMP3 = true;
                } else if (content.name.indexOf('.ogg') >= 0) {
                    content.isOGG = true;
                }
                contents.push(content);
            }
            $scope.musicContents = contents;
        });

        $scope.selectMusicType = function (e) {
            if (e.name.indexOf('.mp3') > 0 || e.name.indexOf('.ogg') > 0) {
                return e;
            }
        };
        $scope.playMusic = function (index) {
            $('#' + 'video' + index).show();
        };
        $scope.hide = function (index) {
            $('#' + 'video' + index).hide();
        };

        $scope.deleteMusic = function (index, filename) {
            $('#mdel' + index).notify('文件正在删除中...',
                {
                    position: 'right',
                    className: 'info'
                }
            );

            deleteService.save({filename: filename}, function () {
                $timeout(function () {
                    $route.reload();
                }, 1000);
            });
        };
    })
    .controller('pictureCtrl', function ($scope, listService, Utils, $route, deleteService, $timeout) {
        listService.get(function (data) {
            var contents = [];
            for (var i in data.items) {
                var content = {};
                content.type = data.items[i].mimeType;
                content.date = (new Date(parseInt((data.items[i].putTime + "").substr(0, 13)))).toLocaleString();
                content.name = data.items[i].key;
                content.url = Utils.openUrl + data.items[i].key + '?download';
                if (content.name.indexOf('.png') >= 0) {
                    content.isPng = true;
                } else if (content.name.indexOf('.jpg') >= 0) {
                    content.isJpg = true;
                } else if (content.name.indexOf('.gif') >= 0) {
                    content.isGif = true;
                }
                contents.push(content);
            }
            $scope.PicContents = contents;
        });

        $scope.selectPictureType = function (e) {
            if (e.name.indexOf('.png') > 0 || e.name.indexOf('.gif') > 0 || e.name.indexOf('.jpg') > 0) {
                return e;
            }
        };

        $scope.getId = function (index, name) {
            $('#eye' + index).magnificPopup({
                items: {
                    src: Utils.openUrl + name
                },
                type: 'image'
            });
            return 'eye' + index;
        };

        $scope.deletePicture = function (index, filename) {
            $('#pdel' + index).notify('文件正在删除中...',
                {
                    position: 'right',
                    className: 'info'
                }
            );

            deleteService.save({filename: filename}, function () {
                $timeout(function () {
                    $route.reload();
                }, 1000);
            });
        };
    })
    .controller('allCtrl', function ($scope, $http, $location, listService, deleteService, Utils, $timeout, $route) {
        // hardcode type
        listService.get(function (data) {
            var contents = [];
            for (var i in data.items) {
                var content = {};
                content.type = data.items[i].mimeType;
                content.date = (new Date(parseInt((data.items[i].putTime + "").substr(0, 13)))).toLocaleString();
                content.name = data.items[i].key;
                content.url = Utils.openUrl + data.items[i].key  + '?download';
                contents.push(content);
            }
            $scope.contents = contents;
        });

        $scope.deleteFile = function (index, filename) {
            $('#fdel' + index).notify('文件正在删除中...',
                {
                    position: 'right',
                    className: 'info'
                }
            );

            deleteService.save({filename: filename}, function () {
                $timeout(function () {
                    $route.reload();
                }, 1000);
            });
        };
    })
    .controller('uploadCtrl', function ($scope) {

    })
    .controller('shareCtrl', function () {

    })
    .controller('modalCtrl', function ($scope, $window) {
        $scope.setOptions = function () {
            $window.localStorage['bucketname'] = $scope.bucketname;
            $window.localStorage['ak'] = $scope.ak;
            $window.localStorage['sk'] = $scope.sk;
        };
    });


