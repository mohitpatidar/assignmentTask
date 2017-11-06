angular.module('starter.services', [])

.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
  var self = this;
 
  // Handle query's and potential errors
  self.query = function (query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();
 
    $ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
          q.resolve(result);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error);
          q.reject(error);
        });
    });
    return q.promise;
  }
 
  // Process a result set
  self.getAll = function(result) {
    var output = null;
    var output = [];
 
    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }  

    return output;
  }
 
  // Process a single result
  self.getById = function(result) {
    var output = null;
   if(result.rows.length > 0){
       output = angular.copy(result.rows.item(0));

    //convert output into json from an object
    output = JSON.parse(JSON.stringify(output));
   }
  
    return output;
  }
 
  return self;
})
  
.factory('All', function(DBA) {
  var self = this;


  //buckets
  self.allBuckets = function() {
    return DBA.query("SELECT * FROM buckets")
      .then(function(result){
        return DBA.getAll(result);
      });
  }
 
  self.getBucketByID = function(bucketID) {
    var parameters = [bucketID];
    return DBA.query("SELECT * FROM buckets WHERE id = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }
 
  self.addBucket = function(bucket) {
    var parameters = [bucket.title];
    return DBA.query("INSERT INTO buckets (title) VALUES (?)", parameters);
  }
 

 //lists
 self.allLists = function() {
    return DBA.query("SELECT * FROM lists")
      .then(function(result){
        return DBA.getAll(result);
      });
  }
 
  self.getListItemByID = function(itemID) {
    var parameters = [itemID];
    return DBA.query("SELECT * FROM lists WHERE id = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }
 
  self.addListItem = function(list) {
    var parameters = [list.name, list.bucketID];
    return DBA.query("INSERT INTO lists(name, bucketID) VALUES (?,?)", parameters);
  }
 
  self.getTableCount= function(tblName) {
    var parameters = [];
    return DBA.query("SELECT count(*) as count FROM "+ tblName, parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }


  return self;

});