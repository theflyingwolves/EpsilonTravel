angular.module('starter.services', [])

.factory('ReceiptService', function() {
	//mock data
	var receipts = [
	  {title: 'receipt1', imgUrl: '../img/receipts/receipt1.jpeg', description: 'taxi fee', date: 'October 13, 2014 11:13:00', price: 50, id: 'r1'},
	  {title: 'receipt2', imgUrl: '../img/receipts/receipt2.jpeg', description: 'lunch', date: 'June 4, 2014 11:13:00', price: 100, id: 'r2'},
	  {title: 'receipt3', imgUrl: '../img/receipts/receipt3.jpeg', description: 'hotel', date: 'May 23, 2014 11:13:00', price: 200, id: 'r3'},
	  {title: 'receipt4', imgUrl: '../img/receipts/receipt4.jpeg', description: 'something', date: 'March 1, 2014 11:13:00', price: 300, id: 'r4'}
	];

	return {
		all: function() {
			return receipts;
		},
		add: function(receipt, http, scope, stateParams) {
			// receipts.push(receipt);
			console.log(receipt);
			http.post('http://hack.waw.li', {
		      "database":"receipt",
		      "query": "insert",
		      "data": receipt
		    }).
		    then(function(response) {
		      scope.modal.hide();
		      scope.loadReceipts();
		      // console.log(response.data.data[0]._id)

		       scope.receiptDetails = {
			      title: '',
			      description: '',
			      date: '',
			      imgUrl: '',
			      price: '',
			      trip_id: stateParams.trip_id
			    };
		    }, function(response) {
		      // handle error
		      scope.modal.hide();
		       scope.receiptDetails = {
			      title: '',
			      description: '',
			      date: '',
			      imgUrl: '',
			      price: '',
			      trip_id: stateParams.trip_id
			    };
		    });

		}, 
		get: function(receiptId) {
			for (var i = 0; i < receipts.length; i++) {
				var r = receipts[i];
				if (r.id === receiptId) {
					return r;
				}
			}
			return null;
		},
		update: function(receipt) {
			for (var i = receipts.length - 1; i >= 0; i--) {
				var r = receipts[i];
				if (receipt.id === r.id) {
					r.title = receipt.title;
					r.imgUrl = receipt.imgUrl;
					r.description = receipt.description;
					r.date = receipt.date;
					r.price = receipt.price;
				}
			}
		}
	};
})

.factory('CameraService', function($q) {
	return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  };
});