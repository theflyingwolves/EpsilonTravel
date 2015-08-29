angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

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

.controller('EventsCtrl', function($scope, $http, $stateParams, $ionicModal) {
  $scope.eventlists = [];
  $scope.eventDetail = {
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      trip_id: "oAIaoXvX0cT394VU"
    }

  trip_id = $stateParams.trip_id;
  $scope.Requesteventlists = function(){

    $http.post('http://hack.waw.li', {
      "database":"event",
      "query": "find",
      "data": {trip_id:"oAIaoXvX0cT394VU"}
    }).
    then(function(response) {
      console.log(response)
      $scope.eventlists = response.data.data;
    }, function(response) {
      // handle error
    });

    // $http.get("someapi")
    //   .success(function(response) {$scope.eventlists = response.eventlists;});
    // $scope.eventlists = [
    //   { title: 'Meeting with Ms K', id: 5 , time:"Sep 1st 9am", trip_id:trip_id},
    //   { title: 'Meeting with Mr M', id: 6 , time:"Sep 1st 11am", trip_id:trip_id}
    // ];
  }

  $ionicModal.fromTemplateUrl('templates/eventModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  $scope.confirmAdd = function() {
    $http.post('http://hack.waw.li', {
      "database":"event",
      "query": "insert",
      "data": $scope.eventDetail
    }).
    then(function(response) {
      $scope.modal.hide();
      $scope.Requesteventlists();
    }, function(response) {
      // handle error
    });

    $scope.eventDetail = {
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      trip_id: "oAIaoXvX0cT394VU"
    }
    
  };
  $scope.cancelAdd = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

})

.controller('EventCtrl', function($scope, $http, $stateParams) {
  $scope.eventDetail = {};
  $scope.editing = false;

  $scope.edit = function () {
    $scope.editing = true;
  }

  $scope.finish = function () {
    $scope.editing = false;

    // $http.post('/someUrl', {event_data:$scope.eventDetail}).
    // then(function(response) {
      
    // }, function(response) {
    //   // handle error
    // });
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
