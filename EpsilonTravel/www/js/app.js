// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.events', {
      url: '/events',
      views: {
        'menuContent': {
          templateUrl: 'templates/events.html',
          controller: 'PlaylistsCtrl'
        }
      }
  })

  .state('app.food', {
      url: '/food',
      views: {
        'menuContent': {
          templateUrl: 'templates/food.html'
        }
      }
    })
    .state('app.activities', {
      url: '/activities',
      views: {
        'menuContent': {
          templateUrl: 'templates/activities.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.receipts', {
      url: '/receipts',
      views: {
        'menuContent': {
          templateUrl: 'templates/receipts.html',
          controller: 'ReceiptCtrl'
        }
      }
    })

    .state('app.receipt', {
      url: '/receipts/:receiptId',
      views: {
        'receiptDetail': {
          templateUrl: 'templates/receipt.html',
          controller: 'ReceiptCtrl'
        }
      }
    })

    .state('app.local', {
      url: '/local',
      views: {
        'menuContent': {
          templateUrl: 'templates/local.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
