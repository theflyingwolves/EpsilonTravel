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
    // console.log("trip id update");
    // console.log($stateParams.trip_id);
    $scope.trip_id = $stateParams.trip_id;
  }

  $scope.join_path = function(things_to_append){
    // console.log("here");
    // console.log($stateParams);
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
      // console.log(res);
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

  $scope.user_name = "trips";
  $http.post('http://hack.waw.li', {
    "database":"user",
    "query": "find",
    "data": {_id:$stateParams.user_id}
  }).
  then(function(response) {
    // console.log(response.data.data);
    $scope.user_name = response.data.data[0].username;
    $scope.user_name = $scope.user_name + "'s trip";
    
  }, function(response) {
    // handle error
  });

  $scope.get_user_name = function(){
    return $scope.user_name;  
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
      // console.log($scope.tripList);
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
    $scope.tripDetail = {
      title: "",
      startdate: "",
      enddate: "",
      basecity: "",
      destination: "",
      user_id: $stateParams.user_id
    }
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

  $scope.tripTitle = "trip";
  $scope.RequestTripDetail = function(){

    $http.post('http://hack.waw.li', {
      "database":"trip",
      "query": "find",
      "data": {_id:$stateParams.trip_id}
    }).
    then(function(response) {
      $scope.tripDetail = response.data.data[0]
      $scope.tripTitle = $scope.tripDetail.title;
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
      $scope.eventlists.sort(function(a,b){
        return a.date.localeCompare(b.date);
      });
      // console.log($scope.eventlists);
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
    $scope.eventDetail = {
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        trip_id: $stateParams.trip_id
      }
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
   $scope.listCanSwipe = true;
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

   $scope.schedule_owner = "";
   $http.post('http://hack.waw.li', {
      "database":"user",
      "query": "find",
      "data": {_id:$stateParams.user_id}
    }).
    then(function(response) {
      $scope.schedule_owner = response.data.data[0].username + "'s schedule"
    }, function(response) {
      // handle error
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

  $scope.eventTitle = "Event";
  $scope.RequestEventDetail = function(){

    $http.post('http://hack.waw.li', {
      "database":"event",
      "query": "find",
      "data": {_id:$stateParams.event_id}
    }).
    then(function(response) {
      $scope.eventDetail = response.data.data[0]
      $scope.eventTitle = $scope.eventDetail.title;
    }, function(response) {
      // handle error
    });

  }


})

.controller('LocalCtrl', function($scope, $stateParams) {

  $scope.amount_of_money = 0;
  $scope.amount_of_money_converted = 50;
  $scope.convert_currency = function(){
    return $scope.amount_of_money*4.54;
  }
  
  $scope.calcTime = function () {
    // create Date object for current location
    var offset = -8;
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() - (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));

    // return time as a string
    return nd.toLocaleString();
  }


})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('packsCtrl', function($scope, $http, $stateParams, $ionicModal, $location) {

  $scope.templatelist = [];
  $scope.templateDetail = {
      title: "",
      items: [],
      selected: [],
      user_id: $stateParams.user_id
  }
  for (var i = 50 - 1; i >= 0; i--) {
    $scope.templateDetail.items.push("");
    $scope.templateDetail.selected.push(false);
  };

  for (var i = 50 - 1; i >= 0; i--) {
    $scope.templateDetail.items.push("");
    // $scope.templateDetail.items.push("item"+i);
    $scope.templateDetail.selected.push(false);
  };

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
          items: [],
          selected: [],
          user_id: $stateParams.user_id
      }
      for (var i = 50 - 1; i >= 0; i--) {
        $scope.templateDetail.items.push("");
        // $scope.templateDetail.items.push("item"+i);
        $scope.templateDetail.selected.push(false);
      };
    }, function(response) {
      // handle error
      $scope.modal.hide();
      $scope.templateDetail = {
          title: "",
          items: [],
          selected: [],
          user_id: $stateParams.user_id
      }
      for (var i = 50 - 1; i >= 0; i--) {
        $scope.templateDetail.items.push("");
        // $scope.templateDetail.items.push("item"+i);
        $scope.templateDetail.selected.push(false);
      };
    });   
  };
  $scope.cancelAdd = function() {
    $scope.modal.hide();
    $scope.templateDetail = {
        title: "",
        items: [],
        selected: [],
        user_id: $stateParams.user_id
    }
    for (var i = 50 - 1; i >= 0; i--) {
      $scope.templateDetail.items.push("");
      // $scope.templateDetail.items.push("item"+i);
      $scope.templateDetail.selected.push(false);
    };
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
  if(typeof(Storage) !== "undefined") {
    // if (!localStorage.packtemplate) {
    //   localStorage.packtemplate = {}
    // };
  } else {
      console.log("no local Storage");
  }

  $scope.edit = function () {
    $scope.editing = true;
  }

  $scope.finish = function () {
    $scope.editing = false;
    // console.log($scope.templateDetail)

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
        // console.log("success");
      }, function(response) {
        // handle error
        console.log("error");
      });
    }, function(response) {
      // handle error
      console.log("error");
    });
  }

  $scope.RequestTemplateDetail = function(){
    console.log("request one time");

    $http.post('http://hack.waw.li', {
      "database":"packtemplate",
      "query": "find",
      "data": {_id:$stateParams.template_id}
    }).
    then(function(response) {
      // console.log(response.data.data[0])
      $scope.templateDetail = response.data.data[0]

      if(typeof(Storage) !== "undefined") {
        var template_id = ""+$scope.templateDetail._id;
        if (localStorage[template_id]) {
          console.log("has record in local ");
          var local_selected = JSON.parse(localStorage[template_id]);
          for (var i = local_selected.length - 1; i >= 0; i--) {
            $scope.templateDetail.selected[i] =  local_selected[i];
          };
        }else{
          console.log("no record in local ");
          localStorage.setItem(template_id, JSON.stringify($scope.templateDetail.selected));
        }

      } else {
          console.log("no local Storage");
      }

    }, function(response) {
      // handle error
    });
  }

  $scope.update = function(idx){


     if(typeof(Storage) !== "undefined") {
        console.log("store to local");
        console.log($scope.templateDetail);

        // localStorage[$scope.templateDetail._id][idx] = $scope.templateDetail.selected[idx];
        localStorage[$scope.templateDetail._id] = JSON.stringify($scope.templateDetail.selected);
        // console.log(localStorage[$scope.templateDetail._id])
      } else {
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
            console.log("upload to server");
          }, function(response) {
            // handle error
          });
        }, function(response) {
          // handle error
        });
      }

    // console.log($scope.templateDetail.selected);
    
  }

  $scope.has_item =  function(index){
    return ($scope.templateDetail.items[index] == "")
  }

  $scope.reset = function(){
    for (var i = $scope.templateDetail.selected.length - 1; i >= 0; i--) {
      $scope.templateDetail.selected[i] = false;
    };

    if(typeof(Storage) !== "undefined"){
      localStorage[$scope.templateDetail._id] = JSON.stringify($scope.templateDetail.selected);  
    }
    

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
        console.log("upload to server");
      }, function(response) {
        // handle error
      });
    }, function(response) {
      // handle error
    });
  }

})


.controller('ReceiptsCtrl', function($scope, $ionicModal, ReceiptService, CameraService, $location, $http, $stateParams, $ionicLoading, $timeout) {
  $scope.receipts = []
  $scope.receiptDetails = {
    title: '',
    description: '',
    date: '',
    imgUrl: '',
    price: '',
    claimed: false,
    trip_id: $stateParams.trip_id
  };

  $scope.showLoadingBar = function() {
    $ionicLoading.show({
      template: 'Claiming...'
    });
  };

  $scope.claimReceipts = function() {
    $scope.showLoadingBar();
    for (var i = $scope.receipts.length - 1; i >= 0; i--) {
      $scope.receipts[i].claimed = true;
    }
    $timeout(function() {
      $ionicLoading.hide();
    }, 1000);
  }

  $scope.loadReceipts = function() {
    // $scope.receipts = ReceiptService.all();
    $http.post('http://hack.waw.li', {
      "database":"receipt",
      "query": "find",
      "data": {trip_id:$stateParams.trip_id}
    }).
    then(function(response) {
      $scope.receipts = response.data.data;
      for (var i = $scope.receipts.length - 1; i >= 0; i--) {
        $scope.receipts[i].imgUrl = '../img/receipts/receipt1.jpeg';
      };
      $scope.receipts.sort(function(a,b){
        return a.date.localeCompare(b.date);
      });
      console.log(response.data.data)
      // console.log($scope.tripList);
    }, function(response) {
      // handle error
    });
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
    ReceiptService.add($scope.receiptDetails, $http, $scope, $stateParams);
    $scope.closeModal();
    // $scope.receiptDetails = {
    //   title: '',
    //   description: '',
    //   date: '',
    //   imgUrl: '',
    //   price: '',
    //   id: ''
    // };
  };

  $scope.cancelReceipt = function() {
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

  $scope.join_path = function(things_to_append){
    // console.log("hello");
    // console.log($location.url()+"/"+things_to_append);
    return $location.url()+"/"+things_to_append;
   }

  $scope.deleteItem = function(item_idx){
      var e_id = $scope.receipts[item_idx]._id;
      $scope.receipts.splice(item_idx, 1);  
      
      $http.post('http://hack.waw.li', {
        "database":"receipt",
        "query": "delete",
        "data": {_id:e_id}
      }).
      then(function(response) {
        
      }, function(response) {
        // handle error
      });

   }

})

.controller('ReceiptCtrl', function($scope, $stateParams, $ionicHistory, ReceiptService, $http) {
  $scope.receiptId = $stateParams.receiptId;

  $scope.receiptDetail = {};
  $scope.editing = false;

  $scope.edit = function () {
    $scope.editing = true;
  }

  $scope.finish = function () {
    $scope.editing = false;

    $http.post('http://hack.waw.li', {
      "database":"receipt",
      "query": "delete",
      "data": {
        _id:$stateParams.receiptId
      }
    }).
    then(function(response) {
      $http.post('http://hack.waw.li', {
        "database":"receipt",
        "query": "insert",
        "data": $scope.receiptDetail
      }).
      then(function(response) {

      }, function(response) {
        // handle error
      });
    }, function(response) {
      // handle error
    });
  }

  // $scope.receiptDetails = ReceiptService.get($scope.receiptId);

  // $scope.comfirmReceipt = function() {
  //   ReceiptService.update($scope.receiptDetails);
  //   $ionicHistory.goBack();
  // }

  $scope.receiptTitle = "receipt";
  $scope.RequestReceiptDetail = function(){

    $http.post('http://hack.waw.li', {
      "database":"receipt",
      "query": "find",
      "data": {_id:$stateParams.receiptId}
    }).
    then(function(response) {
      $scope.receiptDetail = response.data.data[0]
      $scope.receiptDetail.imgUrl = '../img/receipts/receipt1.jpeg';
      $scope.receiptTitle = $scope.receiptDetail.title;
      // console.log($scope.receiptDetail)
    }, function(response) {
      // handle error
    });
  }

})

.controller('PlaylistsCtrl', function($scope, $stateParams) {
})

.controller('foodsCtrl', function($scope, $http, $stateParams, $ionicModal, $location) {

  $scope.foodlists = [];

  trip_id = $stateParams.trip_id;


  $scope.Requestfoodlists = function(){

    $http.post('http://hack.waw.li', {
      "database":"trip",
      "query": "find",
      "data": {_id:$stateParams.trip_id}
      // "data": {trip_id:$stateParams.trip_id}
    }).
    then(function(response) {
      var trip = response.data.data[0];
      console.log(response)
      var cityname = trip.destination;

      $http.post('http://hack.waw.li', {
        "database":"food",
        "query": "find",
        // "data": {}
        "data": {cityname:cityname}
      }).
      then(function(response) {
        // console.log("hello");
        $scope.foodlists = response.data.data;
        console.log($scope.foodlists);
      }, function(response) {
        // handle error
      });

    }, function(response) {
      // handle error
    });
  }

  $scope.foodDetail = {
      title: "",
      location: "",
      category: "",
      price: "",
      cityname: "",
      rating:0,
      description:"",
      comments:[]
  };

  // handle the add button
  $ionicModal.fromTemplateUrl('templates/foodModal.html', {
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
      $scope.foodDetail = {
        title: "",
        location: "",
        category: "",
        price: "",
        cityname: "",
        description:"",
        rating:0,
        comments:[]
      };
  };

  $scope.item2bUpdate = {};

  $scope.like = function(id) {
    $http.post('http://hack.waw.li',{
      "database":"food",
      "query":"find",
      "data":{
        _id:id
      }
    })
    .then(function(response){
      var fooditem = response.data.data[0];
      if(fooditem.rating == undefined) {
        fooditem.rating = 0;
      }

      fooditem.rating += 1;

      $http.post('http://hack.waw.li',{
        "database":"food",
        "query":"delete",
        "data":{
          _id:id
        }
      })
      .then(function(response){
        $http.post('http://hack.waw.li',{
          "database":"food",
          "query":"insert",
          "data":fooditem
        })
        .then(function(response){
          $scope.Requestfoodlists();
        });
      });
    });
  };

  $scope.confirmAdd = function() {
    $scope.foodDetail.rating = 0;

    $http.post('http://hack.waw.li', {
      "database":"trip",
      "query": "find",
      "data": {_id:$stateParams.trip_id}
      // "data": {trip_id:$stateParams.trip_id}
    }).
    then(function(response){
      var trip = response.data.data[0];
      console.log(response)
      $scope.foodDetail.cityname = trip.destination;

      $http.post('http://hack.waw.li', {
            "database":"food",
            "query": "insert",
            "data": $scope.foodDetail
          }).
          then(function(response) {
            $scope.modal.hide();
            $scope.Requestfoodlists();

             $scope.foodDetail = {
              title: "",
              location: "",
              category: "",
              price: "",
              cityname: "",
              description:"",
              comments:[]
             };

          }, function(response) {
            // handle error
            $scope.modal.hide();
             $scope.foodDetail = {
              title: "",
              location: "",
              category: "",
              price: "",
              cityname: "",
              rating:0,
              description:"",
              comments:[]
             };

          });

    });


    
  };
  $scope.cancelAdd = function() {
    $scope.modal.hide();
    $scope.foodDetail = {
        title: "",
        location: "",
        category: "",
        price: "",
        cityname: "",
        rating:0,
        description:""
      }
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
   $scope.listCanSwipe = true;
   $scope.deleteItem = function(event_idx){
      var e_id = $scope.foodlists[event_idx]._id;
      $scope.foodlists.splice(event_idx, 1);  
      
      $http.post('http://hack.waw.li', {
        "database":"food",
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


.controller('foodCtrl', function($scope, $http, $stateParams) {
  $scope.foodDetail = {};
  $scope.editing = false;

  $scope.edit = function () {
    $scope.editing = true;
  }

  $scope.finish = function () {
    $scope.editing = false;

    $http.post('http://hack.waw.li', {
      "database":"food",
      "query": "delete",
      "data": {
        _id:$stateParams.food_id
      }
    }).
    then(function(response) {
      $http.post('http://hack.waw.li', {
        "database":"food",
        "query": "insert",
        "data": $scope.foodDetail
      }).
      then(function(response) {
        
      }, function(response) {
        // handle error
      });
    }, function(response) {
      // handle error
    });
  }

  $scope.RequestFoodDetail = function(){

    $http.post('http://hack.waw.li', {
      "database":"food",
      "query": "find",
      "data": {_id:$stateParams.food_id}
    }).
    then(function(response) {
      $scope.foodDetail = response.data.data[0]
    }, function(response) {
      // handle error
    });

  }

})


.controller('activitiesCtrl', function($scope, $http, $stateParams, $ionicModal, $location) {

  $scope.activitylists = [];

  trip_id = $stateParams.trip_id;


  $scope.RequestActivitylists = function(){

    $http.post('http://hack.waw.li', {
      "database":"trip",
      "query": "find",
      "data": {_id:$stateParams.trip_id}
      // "data": {trip_id:$stateParams.trip_id}
    }).
    then(function(response) {
      var trip = response.data.data[0];
      console.log(response)
      var cityname = trip.destination;

      $http.post('http://hack.waw.li', {
        "database":"activity",
        "query": "find",
        // "data": {}
        "data": {cityname:cityname}
      }).
      then(function(response) {
        // console.log("hello");
        $scope.activitylists = response.data.data;
        console.log($scope.activitylists);
      }, function(response) {
        // handle error
      });

    }, function(response) {
      // handle error
    });
  }

  $scope.activityDetail = {
      title: "",
      location: "",
      category: "",
      price: "",
      cityname: "",
      rating:0,
      description:"",
      comments:[]
  };

  // handle the add button
  $ionicModal.fromTemplateUrl('templates/activityModal.html', {
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
      $scope.activityDetail = {
        title: "",
        location: "",
        category: "",
        price: "",
        cityname: "",
        description:"",
        rating:0,
        comments:[]
      };
  };
  $scope.confirmAdd = function() {
    $scope.activityDetail.rating = 0;

    $http.post('http://hack.waw.li', {
      "database":"trip",
      "query": "find",
      "data": {_id:$stateParams.trip_id}
      // "data": {trip_id:$stateParams.trip_id}
    }).
    then(function(response){
      var trip = response.data.data[0];
      console.log(response)
      $scope.activityDetail.cityname = trip.destination;

      $http.post('http://hack.waw.li', {
            "database":"activity",
            "query": "insert",
            "data": $scope.activityDetail
          }).
          then(function(response) {
            $scope.modal.hide();
            $scope.RequestActivitylists();

             $scope.activityDetail = {
              title: "",
              location: "",
              category: "",
              price: "",
              cityname: "",
              description:"",
              comments:[]
             };

          }, function(response) {
            // handle error
            $scope.modal.hide();
             $scope.activityDetail = {
              title: "",
              location: "",
              category: "",
              price: "",
              cityname: "",
              rating:0,
              description:"",
              comments:[]
             };

          });

    });


    
  };
  $scope.cancelAdd = function() {
    $scope.modal.hide();
    $scope.activityDetail = {
        title: "",
        location: "",
        category: "",
        price: "",
        cityname: "",
        rating:0,
        description:""
      }
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
   $scope.listCanSwipe = true;
   $scope.deleteItem = function(event_idx){
      var e_id = $scope.activitylists[event_idx]._id;
      $scope.activitylists.splice(event_idx, 1);  
      
      $http.post('http://hack.waw.li', {
        "database":"activity",
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


.controller('activityCtrl', function($scope, $http, $stateParams) {
  $scope.foodDetail = {};
  $scope.editing = false;

  $scope.edit = function () {
    $scope.editing = true;
  }

  $scope.finish = function () {
    $scope.editing = false;

    $http.post('http://hack.waw.li', {
      "database":"food",
      "query": "delete",
      "data": {
        _id:$stateParams.food_id
      }
    }).
    then(function(response) {
      $http.post('http://hack.waw.li', {
        "database":"food",
        "query": "insert",
        "data": $scope.foodDetail
      }).
      then(function(response) {
        
      }, function(response) {
        // handle error
      });
    }, function(response) {
      // handle error
    });
  }

  $scope.RequestFoodDetail = function(){

    $http.post('http://hack.waw.li', {
      "database":"food",
      "query": "find",
      "data": {_id:$stateParams.food_id}
    }).
    then(function(response) {
      $scope.foodDetail = response.data.data[0]
    }, function(response) {
      // handle error
    });

  }

})



;
