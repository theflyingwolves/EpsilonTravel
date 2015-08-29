angular.module("easytrip", [])
.factory('Trips', function(){
	var allTrips = [
	{
		"title":"Trip 1",
		"destination": "Singapore",
		"participants": "Wang Kunzhen",
		"start" : "20150103",
		"end" : "20150108",
		"expense" : "300",
		"summary" : "nonsense",
		"receipts" : [{
			"title" : "receipt 1",
			"date" : "20150102",
			"time" : "1600",
			"amount" : "10",
			"description" : "some description"
		},
		{
			"title" : "receipt 2",
			"date" : "20150102",
			"time" : "1600",
			"amount" : "20",
			"description" : "some description"
		},
		{
			"title" : "receipt 3",
			"date" : "20150102",
			"time" : "1600",
			"amount" : "30",
			"description" : "some description"
		}]
	},
	{
		"title":"Trip 2",
		"destination": "Guangzhou",
		"participants": "Wang Kunzhen",
		"start" : "20150103",
		"end" : "20150108",
		"expense" : "300",
		"summary" : "nonsense",
		"receipts" : [{
			"title" : "receipt 1",
			"date" : "20150102",
			"time" : "1600",
			"amount" : "10",
			"description" : "some description"
		},
		{
			"title" : "receipt 2",
			"date" : "20150102",
			"time" : "1600",
			"amount" : "20",
			"description" : "some description"
		},
		{
			"title" : "receipt 3",
			"date" : "20150102",
			"time" : "1600",
			"amount" : "30",
			"description" : "some description"
		}]
	},
	{
		"title":"Trip 3",
		"destination": "Shenzhen",
		"participants": "Wang Kunzhen",
		"start" : "20150103",
		"end" : "20150108",
		"expense" : "300",
		"summary" : "nonsense",
		"receipts" : [{
			"title" : "receipt 1",
			"date" : "20150102",
			"time" : "1600",
			"amount" : "10",
			"description" : "some description"
		},
		{
			"title" : "receipt 2",
			"date" : "20150102",
			"time" : "1600",
			"amount" : "20",
			"description" : "some description"
		},
		{
			"title" : "receipt 3",
			"date" : "20150102",
			"time" : "1600",
			"amount" : "30",
			"description" : "some description"
		}]
	}
	];

	var selected = {};

	return {
		all: function(){
			return allTrips;
		},

		select: function(item) {
			console.log("Selecting "+JSON.stringify(item));
			selected = item;
		},

		selected: function() {
			console.log("Selected: "+JSON.stringify(selected));
			return selected;
		}
	};
})

.controller("ReceiptCtrl", function($scope, Trips){
	$scope.receiptList = Trips.selected().receipts;
})

.controller("MainCtrl", function($scope, Trips) {
	$scope.filter = {};

	$scope.isShown = function(trip) {
		if (($scope.filter.title == undefined || $scope.filter.title.length == 0 || trip.title.toLowerCase().indexOf($scope.filter.title.toLowerCase()) >= 0 ) &&
				($scope.filter.destination == undefined || $scope.filter.destination.length == 0 || trip.destination.toLowerCase().indexOf($scope.filter.destination.toLowerCase()) >= 0 ) &&
				($scope.filter.participants  == undefined || $scope.filter.participants.length == 0 || trip.participants.toLowerCase().indexOf($scope.filter.participants.toLowerCase()) >= 0 ) &&
				($scope.filter.start  == undefined || $scope.filter.start.length == 0 || trip.start.toLowerCase().indexOf($scope.filter.start.toLowerCase()) >= 0 ) &&
				($scope.filter.end  == undefined || $scope.filter.end.length == 0 || trip.end.toLowerCase().indexOf($scope.filter.end.toLowerCase()) >= 0 ) &&
				($scope.filter.summary  == undefined || $scope.filter.summary.length == 0 || trip.summary.toLowerCase().indexOf($scope.filter.summary.toLowerCase()) >= 0 ) && 
				($scope.filter.expense  == undefined || $scope.filter.expense.length == 0 || trip.expense.toLowerCase().indexOf($scope.filter.expense.toLowerCase()) >= 0 )) {
			return true;
		} else {
			return false;
		}
	};

	$scope.totalExpense;

	$scope.selectedTrip;

	$scope.select = function(item){
		$scope.selectedTrip = item;
		Trips.select(item);
	};

	$scope.$watch('filter',function(){
		var total = 0;

		for(var index = 0; index < $scope.tripList.length; index++) {
			var trip = $scope.tripList[index];
			if ($scope.isShown(trip)) {
				total += parseFloat(trip.expense);
			}
		}

		$scope.totalExpense = total;
	}, true);

	$scope.tripList = Trips.all();
});