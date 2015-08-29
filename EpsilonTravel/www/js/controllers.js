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
      $scope.credential = {};
      if (res.status != "success") {
        $scope.showConfirm("Log In Failed");
      } else {
        console.log("Redirecting");
        $window.location.href = "#/trips";
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

.controller('TripCtrl',function($scope){
  $scope.tripList = {};

  $scope.initTripList = function(){
      $scope.tripList = [{
        name: "Trip 1"
      },{
        name: "Trip 2"
      }];
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

    // $http.post('http://hack.waw.li', {
    //   "database":"event",
    //   "query": "find",
    //   "data": $scope.eventDetail
    // }).
    // then(function(response) {
    //   $scope.modal.hide();
    //   $scope.Requesteventlists();
    // }, function(response) {
    //   // handle error
    // });



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
})

.controller('ReceiptsCtrl', function($scope, $ionicModal, ReceiptService, CameraService) {
  $scope.receiptDetails = {
    title: '',
    description: '',
    date: '',
    imgUrl: '',
    price: '',
    id: ''
  };

  $scope.loadReceipts = function() {
    $scope.receipts = ReceiptService.all();
  };

  $scope.addNewRecipt = function() {
    $ionicModal.fromTemplateUrl('templates/add-new-receipt.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show();
    });
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.comfirmReceipt = function() {
    ReceiptService.add($scope.receiptDetails);
    $scope.closeModal();
    $scope.receiptDetails = {
      title: '',
      description: '',
      date: '',
      imgUrl: '',
      price: '',
      id: ''
    };
  };

  $scope.takePicture = function() {
    CameraService.getPicture().then(function(imageURI) {
      $scope.receiptDetails.imgUrl = imageURI;
    }, function(err) {
      console.err(err);
    });
  }
})

.controller('ReceiptCtrl', function($scope, $stateParams, $ionicHistory, ReceiptService) {
  $scope.receiptId = $stateParams.receiptId;
  $scope.receiptDetails = ReceiptService.get($scope.receiptId);

  $scope.comfirmReceipt = function() {
    ReceiptService.update($scope.receiptDetails);
    $ionicHistory.goBack();
  }
});
