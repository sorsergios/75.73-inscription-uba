/**
 * Controller to Inscription system .
 */

var systemApp = angular.module('systemApp', ['systemFilters']);

systemApp.controller('SystemCtrl', function ($scope, $http) {
    $http.get('data/courses.json').success(function(data) {
        $scope.courses = data;
    });
    $http.get('data/subjects.json').success(function(data) {
        $scope.subjects = data;
    });
    
});