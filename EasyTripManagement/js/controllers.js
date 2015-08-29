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

.controller("MainCtrl", function($scope,$http,Trips) {
	$scope.filter = {};

	$scope.init = function() {
		$http.post("http://hack.waw.li",{
			"database":"trip",
			"query":"find",
			"data":{

			}
		})
		.success(function(res){
			console.log(JSON.stringify(res));
		})
		error(function(err){
			console.log(err);
		});
	};

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

	$scope.tableToExcel = (function() {
	  var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
        return function (table, name, filename) {
            if (!table.nodeType) table = document.getElementById(table)
            var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

            document.getElementById("dlink").href = uri + base64(format(template, ctx));
            document.getElementById("dlink").download = filename;
            document.getElementById("dlink").click();

   			}
	})();

	$scope.export = function(id) {
		$scope.tableToExcel(id,"Easy Trip Report","EasyTrip.xls");
	};

	$scope.exportReceipts = function(id) {
		$scope.tableToExcel(id,"Easy Trip Report","EasyTripReceipts.xls");
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