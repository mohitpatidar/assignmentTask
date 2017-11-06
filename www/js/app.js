// Ionic Starter App
ionic.Gestures.gestures.Hold.defaults.hold_threshold = 20;
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova','starter.controllers', 'starter.services','starter.directives'])

.run(function($ionicPlatform,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    /*if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("assignment.db");
    } else {
      // Ionic serve syntax
      db = window.openDatabase("assignment.db", "1.0", "Assignment App", -1);
    }*/
    // db = $cordovaSQLite.openDB("assignment.db", location: 'default');
    /*db = $cordovaSQLite.openDB({name: 'assignment.db', iosDatabaseLocation: 'Library'});
    var db = $cordovaSQLite.openDB({ name: "my.db" });*/

    db = window.openDatabase("assignment.db", "1.0", "Assignment App", -1);

     //create the tables for the app
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS buckets (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, bucketID INTEGER)");

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

   $ionicConfigProvider.tabs.position('bottom'); //other values: top

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.all', {
    url: '/all',
    views: {
      'tab-all': {
        templateUrl: 'templates/tab-all.html',
        controller: 'AllController'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/all');

});
