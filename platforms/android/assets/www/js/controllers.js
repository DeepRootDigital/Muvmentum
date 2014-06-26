angular.module('starter')

.controller('AppCtrl', ['$rootScope', '$scope', '$window','$cordovaGeolocation', '$cordovaDeviceMotion', '$ionicLoading', 'travelInfo', function($rootScope, $scope, $window, $cordovaGeolocation, $cordovaDeviceMotion, $ionicLoading, travelInfo) {
	$scope.getPosition = function() {
		$cordovaGeolocation.getCurrentPosition().then(function(position) {
			$scope.position = position;
			$scope.time = $scope.position.timestamp;
		}, function(err) {});
	};

	$scope.trackPosition = function() {
		$cordovaGeolocation.watchPosition().then(function() {
		}, function(err) {
		}, function(position) {
			if ((position.timestamp - $scope.time) / 1000 > 10) {
				var d = new Date();
				if ($scope.todayDay != d.getDate()) {
					$rootScope.infoString.push({
						day: $scope.todayDay,
						month: $scope.todayMonth,
						year: $scope.todayYear,
						total: $scope.totalDistance,
						walk: $scope.walkDistance,
						bike: $scope.bikeDistance,
						drive: $scope.driveDistance
					});
					travelInfo.save($rootScope.infoString);
					$scope.todayDay = d.getDate();
					$scope.totalDistance = 0;
					$scope.walkDistance = 0;
					$scope.bikeDistance = 0;
					$scope.driveDistance = 0;
				}
				var distance = $scope.calcLongLat($scope.position.coords.latitude,$scope.position.coords.longitude,position.coords.latitude,position.coords.longitude) * 1.60934;
				$scope.totalDistance += distance;
				$scope.totalDistanceMiles = $scope.totalDistance * 0.62137;
				$scope.position = position;
				$scope.timeDiff = (position.timestamp - $scope.time) / 1000;
				$scope.speed = $scope.totalDistance * 3600 / $scope.timeDiff;
				$scope.speedMiles = ($scope.totalDistance * 0.62137) * 3600 / $scope.timeDiff;
				$scope.time = position.timestamp;
				if ($scope.speedMiles < 15) {
					$scope.walkDistance += distance;
					$scope.walkDistanceMiles = $scope.walkDistance * 0.62137;
				} else if ($scope.speedMiles >= 15 && $scope.speedMiles < 30 ) {
					$scope.bikeDistance += distance;
					$scope.bikeDistanceMiles = $scope.bikeDistance * 0.62137;
				} else {
					$scope.driveDistance += distance;
					$scope.driveDistanceMiles = $scope.driveDistance * 0.62137;
				}
			} 
		});
};

	$scope.calcLongLat = function(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
    	var R = 3959; // Radius of earth in KM
    	var phi1 = (90 - lat1) * Math.PI / 180;
    	var phi2 = (90 - lat2) * Math.PI / 180;
    	var theta1 = Math.abs(lon1) * Math.PI / 180;
    	var theta2 = Math.abs(lon2) * Math.PI / 180;
    	var c = Math.sin(phi1) * Math.sin(phi2) * Math.cos(theta1-theta2) + Math.cos(phi1) * Math.cos(phi2);
    	var d = R * Math.acos(c);
    	return d; // KM
    }

    $scope.getDate = function() {
    	var d = new Date();
    	$scope.todayDay = d.getDate();
    	$scope.todayMonth = d.getMonth() + 1;
    	$scope.todayYear = d.getFullYear();
    	var months = ["january","february","march","april","may","june","july","august","semptember","october","november","december"];
    	$scope.todayMonthName = months[$scope.todayMonth-1];
    };

    $scope.$watch(function() { return $rootScope.settings; }, function(oldone, newone){
    	$scope.settings = $rootScope.settings;
    });
    $scope.$watch(function() { return $rootScope.settings.weight; }, function(oldone, newone) {
    	$scope.slideLeft = ($rootScope.settings.weight / 660) * $window.innerWidth + 50;
    });

    $scope.infoString = [];
    $scope.getDate();
    $scope.time = 0;
    $scope.timeDiff = 0;
    $scope.totalDistance = 0;
    $scope.walkDistance = 0;
    $scope.bikeDistance = 0;
    $scope.driveDistance = 0;
    $scope.getPosition();
    $scope.trackPosition();
	//$scope.slideLeft = ($rootScope.settings.weight / 300) * $window.innerWidth;

}])

.controller('PlaylistCtrl', function($scope, $stateParams) {

})

.controller('SplashCtrl', function($scope, $stateParams, $window) {
	$scope.setting = {
		weight: 100
	}

});












