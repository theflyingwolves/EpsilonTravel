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
