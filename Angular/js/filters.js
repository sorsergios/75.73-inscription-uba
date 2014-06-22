filters = angular.module('systemFilters', []);

filters.filter('coalesce', function() {
    return function(input, defaultText) {
        return (input !== undefined && input >= 4) ? input : defaultText;
    };
});

filters.filter('electedOrientation', function() {
    return function(input, cond, defaultText) {
        return (cond) ? input : defaultText;
    };
});

filters.filter('addCredits', function() {
    return function(input, $scope) {
        var result = 0;
        if($scope.courses[$scope.selectedTesis] != undefined) {
            $plus = ($scope.selectedTesis === '7599') 
                        ? $scope.courses[$scope.selectedTesis].creditos 
                        : 0;
            result = input + $plus;
        } else {
            result =input;
        }
        return result;
    };
});