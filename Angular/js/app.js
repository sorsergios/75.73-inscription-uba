/**
 * Controller to Inscription system .
 */

var systemApp = angular.module('systemApp', ['systemFilters']);

systemApp.controller('SystemCtrl', function ($scope, $http) {
    
    $scope.activeModal = false;
    $scope.selectedCourse = {
            'code': null,
            'data': null,
            'next': null
    };
    $scope.mandatoryCreditsSum = 0;
    $scope.mandatoryCreditsTotal = 0;
    $scope.mandatoryOrientedCreditsSum = 0;
    $scope.mandatoryOrientedCreditsTotal = 0;
    $scope.electedCreditsSum = 0;
    $scope.electedCreditsTotal = 0;
    
    $http.get('data/user_1.json').success(function(data) {
        $scope.user = data;
    });
    $http.get('data/subjects.json').success(function(data) {
        $scope.subjects = data;
        angular.forEach(data, function(subject, key) {
            angular.forEach(subject.content, function(group, key2) {
                angular.forEach(group.assignatures, function(assignature, key3) {
                    if (subject.type === 'Obligatorias'){
                    	if (assignature === "7500") {
                    		$scope.mandatoryCreditsTotal += 24;
                    	} else if (assignature === "7140" || assignature === "7552" || assignature === "7542") {
                    		$scope.mandatoryCreditsTotal += 4;
                    	}
                    	else { 
                    		$scope.mandatoryCreditsTotal += 6;
                    	}
                    } else if (subject.type === 'Orientación'){
                   		$scope.mandatoryOrientedCreditsTotal = 34;
                    } else if (subject.type === 'Electivas'){
                    	$scope.electedCreditsTotal = 34;                	
                    }
                });
            });
        });
    });
    $http.get('data/courses.json').success(function(data) {
        $scope.courses = data;
    });
    $http.get('data/next-courses.json').success(function(data) {
        $scope.nextCourses = data;
    });
    
    $scope.completed = function(assignature) {
        if ($scope.user.subjects !== undefined
            && $scope.user.subjects.hasOwnProperty(assignature) 
            && $scope.user.subjects[assignature].grade >= 4) {
            return 0;
        }
        return 2;
    };
    
    $scope.toggleModal = function(assignature) {
        $scope.activeModal = !$scope.activeModal;
        if ($scope.courses !== undefined
                && $scope.courses.hasOwnProperty(assignature)) {
            $scope.selectedCourse.code = assignature;
            $scope.selectedCourse.data = $scope.courses[assignature];
            if ($scope.nextCourses !== undefined
                    && $scope.nextCourses.hasOwnProperty(assignature)) {
                $scope.selectedCourse.next = $scope.nextCourses[assignature];
            }
        } else {
            $scope.selectedCourse.code = 'none';
        }
    };
});
