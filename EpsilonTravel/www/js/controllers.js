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
      $scope.modal.hide();
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
      $scope.modal.hide();
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
    // console.log("hello");
    // console.log($location.url()+"/"+things_to_append);
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

.controller('LocalCtrl', function($scope, $stateParams) {

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('packsCtrl', function($scope, $http, $stateParams, $ionicModal, $location) {

  $scope.templatelist = [];
  $scope.templateDetail = {
      title: "",
      items: {},
      user_id: $stateParams.user_id
    }

  $scope.RequestTemplatelist = function(){

    $http.post('http://hack.waw.li', {
      "database":"packtemplate",
      "query": "find",
      "data": {user_id:$stateParams.user_id}
    }).
    then(function(response) {
      $scope.templatelist = response.data.data;
    }, function(response) {
      // handle error
    });
  }


  // handle the add button
  $ionicModal.fromTemplateUrl('templates/packingModal.html', {
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
      "database":"packtemplate",
      "query": "insert",
      "data": $scope.templateDetail
    }).
    then(function(response) {
      $scope.RequestTemplatelist();
      $scope.modal.hide();
      
      $scope.templateDetail = {
        title: "",
        items: {},
        user_id: $stateParams.user_id
      }
    }, function(response) {
      // handle error
      $scope.modal.hide();
      $scope.templateDetail = {
        title: "",
        items: {},
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
   $scope.deleteItem = function(template_idx){
      var e_id = $scope.templatelist[template_idx]._id;
      $scope.templatelist.splice(template_idx, 1);  
      
      $http.post('http://hack.waw.li', {
        "database":"packtemplate",
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
    // console.log("hello");
    // console.log($location.url()+"/"+things_to_append);
    return $location.url()+"/"+things_to_append;
   }

})

.controller('packlistCtrl', function($scope, $http, $stateParams) {
  $scope.templateDetail = {};
  $scope.editing = false;

  $scope.edit = function () {
    $scope.editing = true;
  }

  $scope.finish = function () {
    $scope.editing = false;

    $http.post('http://hack.waw.li', {
      "database":"packtemplate",
      "query": "delete",
      "data": {
        _id:$stateParams.template_id
      }
    }).
    then(function(response) {
      $http.post('http://hack.waw.li', {
        "database":"packtemplate",
        "query": "insert",
        "data": $scope.templateDetail
      }).
      then(function(response) {
        
      }, function(response) {
        // handle error
      });
    }, function(response) {
      // handle error
    });
  }

  $scope.RequestTemplateDetail = function(){

    // $http.post('http://hack.waw.li', {
    //   "database":"packtemplate",
    //   "query": "find",
    //   "data": {_id:$stateParams.template_id}
    // }).
    // then(function(response) {
    //   $scope.templateDetail = response.data.data[0]
    // }, function(response) {
    //   // handle error
    // });

    $scope.templateDetail = {
      title: "my_title",
      items: ["item1","item2","item3","item4","item5"],
      selected: [true, true, false, false, false],
      user_id: 1
    }

  }

  $scope.toggle = function(idx){
    if ($scope.templateDetail.selected[idx]) {
      $scope.templateDetail.selected[idx] = false
    }else{
      $scope.templateDetail.selected[idx] = true
    }

    // console.log($scope.templateDetail.selected);
    // $http.post('http://hack.waw.li', {
    //   "database":"packtemplate",
    //   "query": "delete",
    //   "data": {
    //     _id:$stateParams.template_id
    //   }
    // }).
    // then(function(response) {
    //   $http.post('http://hack.waw.li', {
    //     "database":"packtemplate",
    //     "query": "insert",
    //     "data": $scope.templateDetail
    //   }).
    //   then(function(response) {
        
    //   }, function(response) {
    //     // handle error
    //   });
    // }, function(response) {
    //   // handle error
    // });
    

  }

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
})

.controller('PlaylistsCtrl', function($scope, $stateParams) {
})

;
