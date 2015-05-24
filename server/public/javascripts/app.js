ngTool = angular.module('ngTool', ['ezfb','hljs']);


ngTool.config(function (ezfbProvider) {
  /**
   * Basic setup
   *
   * https://github.com/pc035860/angular-easyfb#configuration
   */
  ezfbProvider.setInitParams({
    appId: '1420010128321915',
    version: 'v2.3'
  });  
});
ngTool.controller('toolCtrl', ['$scope','$http','$window','$location','ezfb'
, function ($scope, $http,$window,$location,ezfb) {


	$scope.connectFB = function(){
		var url = 'https://www.facebook.com/dialog/oauth?client_id=1420010128321915&response_type=token&scope=email,user_friends&redirect_uri=http://www.facebook.com/connect/login_success.html&scope=publish_actions&response_type=token'
		$http.get('http://crossorigin.me/' + url).success(function(data){
			console.log(data)
		})
	}

	$scope.connectFB();






	updateLoginStatus(updateApiMe);

	  $scope.login = function () {
	    /**
	     * Calling FB.login with required permissions specified
	     * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
	     */
	    ezfb.login(function (res) {
	      /**
	       * no manual $scope.$apply, I got that handled
	       */
	       console.log(res)
	      if (res.authResponse) {
	        updateLoginStatus(updateApiMe);
	      }
	    }, {scope: 'email,user_friends'});
	  };

	  $scope.logout = function () {
	    /**
	     * Calling FB.logout
	     * https://developers.facebook.com/docs/reference/javascript/FB.logout
	     */
	    ezfb.logout(function () {
	      updateLoginStatus(updateApiMe);
	    });
	  };

	  $scope.share = function () {
	    ezfb.ui(
	      {
	        method: 'feed',
	        name: 'angular-easyfb API demo',
	        picture: 'http://plnkr.co/img/plunker.png',
	        link: 'http://plnkr.co/edit/qclqht?p=preview',
	        description: 'angular-easyfb is an AngularJS module wrapping Facebook SDK.' + 
	                     ' Facebook integration in AngularJS made easy!' + 
	                     ' Please try it and feel free to give feedbacks.'
	      },
	      function (res) {
	        // res: FB.ui response
	      }
	    );
	  };

	  $scope.friendList = function(){
	  	// $http.get('https://graph.facebook.com/v2.3/me/friends?oauth_token=' + 'CAACEdEose0cBAAupEUjRiXT1fm6XkXSfzFyxC5QzZAsHJlXANUH82ncMgi0pimGNVK5DCGZCwlShhJNfyE1VqeKZCORQPsGxZBvzWeGZBwlF2gykieqoEuKcJ5ZBgFeIYcnZCwZBf6LOdm6rt71a8WcFto6ScpcJUo4wXhBdbr2GlZB9YgDdlLcvMXdC4mO76Nzfk4LqLVEiICAQbPvaPEGNkOo4BOggP0bpafyomcuEPlwZDZD')
	  	// .success(function(data){
	  	// 	console.log(data);
	  	// })
		ezfb.api('/me/friends', function(res){
			console.log(res)
		})

	  }
	  
	  /**
	   * For generating better looking JSON results
	   */
	  var autoToJSON = ['loginStatus', 'apiMe']; 
	  angular.forEach(autoToJSON, function (varName) {
	    $scope.$watch(varName, function (val) {
	      $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
	    }, true);
	  });
	  
	  /**
	   * Update loginStatus result
	   */
	  function updateLoginStatus (more) {
	    ezfb.getLoginStatus(function (res) {
	      $scope.loginStatus = res;

	      (more || angular.noop)();
	    });
	  }
//https://www.facebook.com/connect/login_success.html#access_token=CAAFZCWVf24l8BAP8aq29zPWrLtdGWg0vVS6PJHgoFDZA8xUbCY85frN9Gzt8QiyrZBUg85yM3BOgvJeuHE2dHYw65CKf32bYHijNmxlcYN0YpUkZA7tzhZC9MLMnMRNDulAyJZAyw3VLdrxtAPKZAzOXnNuBBzi87y1pEZBoEB3fzzkjXZCZCUn0xTuZAZAnzBK5Y4W86BVuaZAJxVZA7X3OhDDxT44mQjPsHll4gZD&expires_in=4968
	  /**
	   * Update api('/me') result
	   */
	  function updateApiMe () {
	  	var token = 'CAAFZCWVf24l8BAP8aq29zPWrLtdGWg0vVS6PJHgoFDZA8xUbCY85frN9Gzt8QiyrZBUg85yM3BOgvJeuHE2dHYw65CKf32bYHijNmxlcYN0YpUkZA7tzhZC9MLMnMRNDulAyJZAyw3VLdrxtAPKZAzOXnNuBBzi87y1pEZBoEB3fzzkjXZCZCUn0xTuZAZAnzBK5Y4W86BVuaZAJxVZA7X3OhDDxT44mQjPsHll4gZD'
	    ezfb.api('/me/friends', function (res) {
	      $scope.apiMe = res;
	    });
	  }
}])

function checkLoginState(){
	FB.getLoginStatus(function(res){
		console.log(res)
	})
}

