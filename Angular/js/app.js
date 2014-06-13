/**
 * Controller to Inscription system .
 */

var systemApp = angular.module('systemApp', ['systemFilters']);

systemApp.controller('SystemCtrl', function ($scope, $http) {
    $http.get('data/user_1.json').success(function(data) {
        $scope.user = data;
    });
    $http.get('data/subjects.json').success(function(data) {
        $scope.subjects = data;
    });
    $http.get('data/courses.json').success(function(data) {
        $scope.courses = data;
    });
    $http.get('data/next-courses.json').success(function(data) {
        $scope.nextCourses = data;
    });
    
    $scope.activeModal = false;
    $scope.selectedCourse = {
        'code': null,
        'data': null,
        'next': null
    };
    
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
