angular.module("easytrip", [])
.factory('Trips', function(){
	var allTrips = [
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

	$scope.users = {};

	$scope.receipts = {};

	$scope.init = function() {
		console.log("init");

		$http.post("http://hack.waw.li",{
			"database":"trip",
			"query":"find",
			"data":{
			}
		})
		.success(function(res){
			$scope.tripList = res.data;

			$http.post("http://hack.waw.li",{
				"database":"user",
				"query":"find",
				"data":{
				}
			})
			.success(function(res){
				$scope.users = res.data;

				$http.post("http://hack.waw.li",{
					"database":"receipt",
					"query":"find",
					"data":{
					}
				})

				.success(function(res){
					$scope.receipts = res.data;
					$scope.match();
				})
				.error(function(err){
					console.log(err);
				});

			})
			.error(function(err){
				console.log(err);
			});
		})
		.error(function(err){
			console.log(err);
		});
	};


	$scope.match = function() {
		console.log("Users: "+$scope.users.length);
		console.log("Trips: "+$scope.tripList.length);
		console.log("Receipts: "+$scope.receipts.length);

		for (var i = $scope.tripList.length - 1; i >= 0; i--) {
			var trip = $scope.tripList[i];

			if (trip.receipts == undefined) {
				trip.receipts = [];
			}

			if (trip.totalExpense == undefined) {
				trip.totalExpense = 0;
			};

			for (var j = $scope.users.length - 1; j >= 0; j--) {
				var user = $scope.users[j];
				if (user._id == trip.user_id) {
					trip.participants = user.username;
				};
			};

			for (var k = $scope.receipts.length - 1; k >= 0; k--) {
				var receipt = $scope.receipts[k];
				if (receipt.trip_id == trip._id) {
					trip.receipts.push(receipt);
					if (receipt.price.length > 0) {
							trip.totalExpense += parseFloat(receipt.price);						
					};
				}
			};
		};

		$scope.calculateTotalCost();
	}

	$scope.isShown = function(trip) {
		if (($scope.filter.title == undefined || $scope.filter.title.length == 0 || trip.title.toLowerCase().indexOf($scope.filter.title.toLowerCase()) >= 0 ) &&
				($scope.filter.destination == undefined || $scope.filter.destination.length == 0 || trip.destination.toLowerCase().indexOf($scope.filter.destination.toLowerCase()) >= 0 ) &&
				($scope.filter.participants  == undefined || $scope.filter.participants.length == 0 || trip.participants.toLowerCase().indexOf($scope.filter.participants.toLowerCase()) >= 0 ) &&
				($scope.filter.start  == undefined || $scope.filter.start.length == 0 || trip.startdate.toLowerCase().indexOf($scope.filter.start.toLowerCase()) >= 0 ) &&
				($scope.filter.end  == undefined || $scope.filter.end.length == 0 || trip.enddate.toLowerCase().indexOf($scope.filter.end.toLowerCase()) >= 0 ) &&
				($scope.filter.summary  == undefined || $scope.filter.summary.length == 0 || trip.summary.toLowerCase().indexOf($scope.filter.summary.toLowerCase()) >= 0 ) && 
				($scope.filter.expense  == undefined || $scope.filter.expense.length == 0 || (trip.totalExpense+"").toLowerCase().indexOf($scope.filter.expense.toLowerCase()) >= 0 )) {
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
		$scope.calculateTotalCost();
	}, true);

	$scope.calculateTotalCost = function(){
				var total = 0;

		for(var index = 0; index < $scope.tripList.length; index++) {
			var trip = $scope.tripList[index];
			if ($scope.isShown(trip)) {
				total += parseFloat(trip.totalExpense);
			}
		}

		$scope.totalExpense = total;
	};

	$scope.tripList = Trips.all();
});