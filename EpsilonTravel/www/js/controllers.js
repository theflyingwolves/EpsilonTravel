angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.init = function() {
    console.log("Init");
  };

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

})

.controller('HomeCtrl', function($scope, $ionicModal, $ionicPopup,$location, $http){
  $scope.credential = {};

  $scope.registerInfo = {};

  $scope.loginModal;
  $scope.registerModal;

  $scope.serverUrl = "http://hack.waw.li";

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.registerModal = modal;
  });

  $scope.showLogin = function(){
    $scope.loginModal.show();
  };

  $scope.closeLogin = function(){
    $scope.loginModal.hide();
  };

  $scope.showRegister = function(){
    $scope.registerModal.show();
  };

  $scope.closeRegister = function(){
    $scope.registerModal.hide();
  };

  $scope.register = function(){
    console.log("Registering "+$scope.registerInfo);
    $scope.registerModal.hide();
    $http.post($scope.serverUrl+"/signup",$scope.registerInfo)
    .success(function(res){
      if(res.status == "success"){
        $scope.showConfirm("Register Successful");
      } else {
        $scope.showConfirm("User Name Already Exists");
      }
    })
    .error(function(err){
      console.log(err);
    });
  };

  $scope.showConfirm = function(message) {
    var confirmPopup = $ionicPopup.confirm({
     title: message
    });
  };

  $scope.login = function() {
    $scope.loginModal.hide();

    $http.post($scope.serverUrl+"/login",$scope.credential)
    .success(function(res){
      if (res.status != "success") {
        $scope.showConfirm("Log In Failed");
      }
    })

    .error(function(err){
      $scope.showConfirm(err);
    });
  };

  $scope.initAcc = function() {
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('AccountCtrl', function($scope, $ionicModal) {

})

.controller('EventsCtrl', function($scope, $http, $stateParams) {
  $scope.eventlists = [];
  trip_id = $stateParams.trip_id;
  $scope.Requesteventlists = function(){

    // $http.get("someapi")
    //   .success(function(response) {$scope.eventlists = response.eventlists;});
    $scope.eventlists = [
      { title: 'Meeting with Ms K', id: 5 , time:"Sep 1st 9am", trip_id:trip_id},
      { title: 'Meeting with Mr M', id: 6 , time:"Sep 1st 11am", trip_id:trip_id}
    ];
  }

})

.controller('EventCtrl', function($scope, $http, $stateParams) {
  $scope.eventDetail = {};
  $scope.editing = false;

  $scope.edit = function () {
    $scope.editing = true;
  }

  $scope.finish = function () {
    $scope.editing = false;

    // need to post to server
  }

  $scope.RequestEventDetail = function(){

    // $http.get("someapi")
    //   .success(function(response) {$scope.names = response.records;});
    $scope.eventDetail = {
      title: "Meeting with Ms K",
      date: "Sep 1st",
      time: "9am",
      location: "NUS",
      description: "discuss some important issues"
    }
  }

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
