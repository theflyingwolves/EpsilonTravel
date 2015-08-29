angular.module("easytrip", [])

.controller("MainCtrl", function($scope) {
	$scope.tripList = [
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
});