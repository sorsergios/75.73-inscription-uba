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
    
    $scope.completed = function(assignature) {
        if ($scope.user.subjects !== undefined
            && $scope.user.subjects.hasOwnProperty(assignature) 
            && $scope.user.subjects[assignature].grade >= 4) {
            return 0;
        }
        return 2;
    };
});
