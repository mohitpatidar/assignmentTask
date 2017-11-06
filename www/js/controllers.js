angular.module('starter.controllers', [])

.controller('AllController', function($scope, All, $rootScope) {
    $scope.shouldShowDelete = false;
    $scope.shouldShowReorder = false;
    $scope.listCanSwipe = false;

    $scope.mixList = [];

    //normal functions
    $scope.addNewItem = function (itemName, bucketID) {

            //by default all tasks will be added to today
            var listItem = { name: itemName, bucketID: bucketID};

            //add the task
            All.addListItem(listItem).then(function (result) {
                refreshListItems();
            });
    };

    $scope.onReorder = function($fromIndex, $toIndex){
    //implement permanent drag and drop logic here

        var toData = $scope.mixList[$toIndex];
        var fromData = $scope.mixList[$fromIndex];

        if(fromData.itemId === -1) {
            // nothing
        } else {
            if(toData.bucketsId === fromData.bucketsId) {
                $scope.mixList[$fromIndex] = toData;
                $scope.mixList[$toIndex] = fromData;
            } else {
                temp = fromData;
                temp.bucketsId = toData.bucketsId;
                temp.bucketsIdTitle = toData.bucketsIdTitle;
                // remove
                $scope.mixList[$fromIndex] = undefined;
                $scope.mixList.clean(undefined);
                // add
                $scope.mixList.splice($toIndex, 0, temp);
            }
        }
    };

    $rootScope.checkIndex = function (value) {
      console.log(value);
      console.log(JSON.stringify($scope.mixList[value].itemId));
      if($scope.mixList[value].itemId === -1) {
        return false;
      } else {
        return true;
      }
    };

    createNewBucket = function (bucket) {
        //add a bucket synchronoulsy
        All.addBucket(bucket);
    };

    refreshListItems = function () {
        All.allLists().then(function (listItems) {
            $scope.listItems = {};
            $scope.listItems = listItems;

            $scope.mixList = [];
            for (var i = 0; i < $scope.buckets.length; i++) {
                $scope.mixList.push({
                    bucketsId: $scope.buckets[i].id,
                    bucketsIdTitle: $scope.buckets[i].title,
                    itemId:-1,
                    itemName:""
                });
                for (var j = 0; j < $scope.listItems.length; j++) {
                    if($scope.listItems[j].bucketID === $scope.buckets[i].id) {
                        $scope.mixList.push({
                            bucketsId: $scope.buckets[i].id,
                            bucketsIdTitle: $scope.buckets[i].title,
                            itemId:$scope.listItems[j].id,
                            itemName:$scope.listItems[j].name
                        })
                    }
                }
            }

        });
    };

    refreshBuckets= function () {
        $scope.bucketID = {};
        $scope.bucketID = [];
        var buckets = {};
        var buckets = [];

        All.allBuckets()
        .then(function (allBuckets) {
            for (var j = 0; j < allBuckets.length; j++) {
                $scope.bucketID.push(allBuckets[j].id);
                buckets.push({id: allBuckets[j].id, title: allBuckets[j].title});
            }
        })
        .then(function () {
            //update the scope
            $scope.buckets = {};
            $scope.buckets = buckets;
        });
    };

    //pre-checks and afterwards populate the task day statuses if first time run
    All.getTableCount('buckets').then(function (result) {
        if (result.count == 0) {//populate the day / status labels in db if first time run
            var bucketLabels = ['Today', 'Tomorrow', 'Backlog', 'Completed'];
            for (var i = 0; i < bucketLabels.length; i++) {
                var bucket = { title: bucketLabels[i] };
                createNewBucket(bucket);
            }
        }
    }).then(function () {
        refreshBuckets();
        refreshListItems();
    });

    Array.prototype.clean = function(deleteValue) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == deleteValue) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    };
});
