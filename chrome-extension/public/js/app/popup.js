// var host = 'http://changeesearch.com';
var host = 'http://localhost:3000';

ngTool.service('pageInfoService', function($rootScope) {
    this.getInfo = function(callback) {
        var model = {};

        chrome.tabs.query({'active': true},
        function (tabs) {
            if (tabs.length > 0){
                model.title = tabs[0].title;
                model.url = tabs[0].url;
                chrome.tabs.sendMessage(tabs[0].id, { 'action': 'PageInfo' }, function (response) {
                    model.pageInfos = response;
                    callback(model);
                });
            }

        });
        // chrome.bookmarks.getTree(function (tree){
        //     console.log(tree);
        // })

    };
});

ngTool.controller("toolCtrl",['$http','$scope','pageInfoService', function ($http, $scope, pageInfoService) {

    console.log('hello')
    // $scope.message = "Hello from AngularJS";
    

    // pageInfoService.getInfo(function (info) {
    //     // $scope.title = info.title;
    //     $scope.url = info.url;
    //     // $scope.pageInfos = info.pageInfos;
    //     $http.get( host + '/link?url=' + info.url).success(function(data){
    //         $scope.info = data;
    //         $scope.title = data.title;
    //         // $scope.tags = data.keywords; 
    //         $scope.tags = [];
    //         angular.forEach(data.keywords, function(key) {
    //             this.push({
    //                 text: key
    //             })
    //         }, $scope.tags) 
    //         $scope.image = data.image;      
    //         $scope.info.url = data.url;
    //     })
        
    //     $scope.$apply();
    // });
    
    $scope.friends = [];
    


    // Check Facebook Token //
    console.log(localStorage.accessToken)
    if (localStorage.accessToken) {
        $scope.fbLogined = true;
        $scope.accessToken = localStorage.accessToken;

        var graphUrl = "https://graph.facebook.com/me?oauth_token=" + localStorage.accessToken + "&callback=displayUser";
        console.log(graphUrl);

        var loginData = {
            "provider" : "facebook",
            "token" : localStorage.accessToken
        };
        console.log(loginData);


        $http({
            method : 'POST',
            url : host + '/api/token',
            data : loginData
            // headers : {'token' : localStorage.accessToken}
        }).success(function(data){
            $scope.serverToken = data;
            var script = document.createElement("script");
            script.src = graphUrl;
            document.body.appendChild(script);
            function displayUser(user) {
                console.log(user);
            }

        }).error(console.log)

        $scope.getFriends = function(){
            var url = 'https://graph.facebook.com/v2.3/me/friends?oauth_token='
            $scope.friends = [];
            $http.get(url + $scope.accessToken).success(function(data){
                console.log(data);
            })

        }

        $scope.getFriends();
        
    } else {
        $scope.fbLogined = false;
    }


}]);




