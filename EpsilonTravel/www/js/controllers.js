angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $stateParams, $location) {

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

  $scope.trip_id = "";
  $scope.updateTripId = function () {
    console.log("trip id update");
    console.log($stateParams.trip_id);
    $scope.trip_id = $stateParams.trip_id;
  }

  $scope.join_path = function(things_to_append){
    return ("/app/"+$stateParams.user_id+"/"+$stateParams.trip_id+"/"+things_to_append);
   }

  $scope.trips_path = function(){
    return ("/app/"+$stateParams.user_id+"/trips");
   }


})

.controller('HomeCtrl', function($scope, $ionicModal, $ionicPopup,$window, $http){
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
      $scope.registerInfo = {};
    })
    .error(function(err){
      $scope.registerInfo = {};
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
      console.log(res);
      if (res.status != "success") {
        $scope.showConfirm("Log In Failed");
      } else {
        console.log("Redirecting");
        $window.location.href = ("#/app/"+res.message._id+"/trips");
      }
    })

    .error(function(err){
      $scope.credential = {};
      $scope.showConfirm(err);
    });
  };

  $scope.initAcc = function() {
  };
})

.controller('TripCtrl',function($scope, $stateParams, $ionicModal, $http){
  $scope.tripList = [];
  $scope.tripDetail = {
      title: "",
      startdate: "",
      enddate: "",
      basecity: "",
      destination: "",
      user_id: $stateParams.user_id
  }

  

  user_id = $stateParams.user_id;
  $scope.RequestTriplists = function(){

    $http.post('http://hack.waw.li', {
      "database":"trip",
      "query": "find",
      "data": {user_id:$stateParams.user_id}
    }).
    then(function(response) {
      $scope.tripList = response.data.data;
      console.log($scope.tripList);
    }, function(response) {
      // handle error
    });
  }


  // handle the add button
  $ionicModal.fromTemplateUrl('templates/tripModal.html', {
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
      "database":"trip",
      "query": "insert",
      "data": $scope.tripDetail
    }).
    then(function(response) {
      $scope.modal.hide();
      $scope.RequestTriplists();

      $scope.tripDetail = {
        title: "",
        startdate: "",
        enddate: "",
        basecity: "",
        destination: "",
        user_id: $stateParams.user_id
      }
    }, function(response) {
      // handle error
      $scope.tripDetail = {
        title: "",
        startdate: "",
        enddate: "",
        basecity: "",
        destination: "",
        user_id: $stateParams.user_id
      }

    });

      
    
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

  // handle swipe and delete
   $scope.listCanSwipe = true
   $scope.deleteItem = function(trip_idx){
      var e_id = $scope.tripList[trip_idx]._id;
      $scope.tripList.splice(trip_idx, 1);  
      
      // $http.post('http://hack.waw.li', {
      //   "database":"event",
      //   "query": "delete",
      //   "data": {_id:e_id}
      // }).
      // then(function(response) {
        
      // }, function(response) {
      //   // handle error
      // });

   }
})


.controller('tripDetailCtrl', function($scope, $http, $stateParams) {
  $scope.tripDetail = {};
  $scope.editing = false;

  $scope.edit = function () {
    $scope.editing = true;
  }

  $scope.finish = function () {
    $scope.editing = false;

    $http.post('http://hack.waw.li', {
      "database":"trip",
      "query": "delete",
      "data": {
        _id:$stateParams.trip_id
      }
    }).
    then(function(response) {
      $http.post('http://hack.waw.li', {
        "database":"trip",
        "query": "insert",
        "data": $scope.tripDetail
      }).
      then(function(response) {
        
      }, function(response) {
        // handle error
      });
    }, function(response) {
      // handle error
    });
  }

  $scope.RequestTripDetail = function(){

    $http.post('http://hack.waw.li', {
      "database":"trip",
      "query": "find",
      "data": {_id:$stateParams.trip_id}
    }).
    then(function(response) {
      $scope.tripDetail = response.data.data[0]
    }, function(response) {
      // handle error
    });
  }

})

.controller('AccountCtrl', function($scope, $ionicModal) {

})

.controller('EventsCtrl', function($scope, $http, $stateParams, $ionicModal, $location) {

  $scope.eventlists = [];
  $scope.eventDetail = {
      title: "",
      date: "",
      time: "",
      location: "",
      description: "",
      trip_id: $stateParams.trip_id
    }

  trip_id = $stateParams.trip_id;
  $scope.Requesteventlists = function(){

    $http.post('http://hack.waw.li', {
      "database":"event",
      "query": "find",
      "data": {trip_id:$stateParams.trip_id}
    }).
    then(function(response) {
      $scope.eventlists = response.data.data;
      console.log($scope.eventlists);
    }, function(response) {
      // handle error
    });
  }


  // handle the add button
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

       $scope.eventDetail = {
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        trip_id: $stateParams.trip_id
      }
    }, function(response) {
      // handle error
       $scope.eventDetail = {
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        trip_id: $stateParams.trip_id
      }
    });

     
    
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

  // handle swipe and delete
   $scope.listCanSwipe = true
   $scope.deleteItem = function(event_idx){
      var e_id = $scope.eventlists[event_idx]._id;
      $scope.eventlists.splice(event_idx, 1);  
      
      $http.post('http://hack.waw.li', {
        "database":"event",
        "query": "delete",
        "data": {_id:e_id}
      }).
      then(function(response) {
        
      }, function(response) {
        // handle error
      });

   }

   // append to create new url
   $scope.join_path = function(things_to_append){
    console.log("hello");
    console.log($location.url()+"/"+things_to_append);
    return $location.url()+"/"+things_to_append;
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

    $http.post('http://hack.waw.li', {
      "database":"event",
      "query": "delete",
      "data": {
        _id:$stateParams.event_id
      }
    }).
    then(function(response) {
      $http.post('http://hack.waw.li', {
        "database":"event",
        "query": "insert",
        "data": $scope.eventDetail
      }).
      then(function(response) {
        
      }, function(response) {
        // handle error
      });
    }, function(response) {
      // handle error
    });
  }

  $scope.RequestEventDetail = function(){

    $http.post('http://hack.waw.li', {
      "database":"event",
      "query": "find",
      "data": {_id:$stateParams.event_id}
    }).
    then(function(response) {
      $scope.eventDetail = response.data.data[0]
    }, function(response) {
      // handle error
    });



    // $scope.eventDetail = {
    //   title: "Meeting with Ms K",
    //   date: "Sep 1st",
    //   time: "9am",
    //   location: "NUS",
    //   description: "discuss some important issues"
    // }
  }

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('PlaylistsCtrl', function($scope, $stateParams) {
})

;


