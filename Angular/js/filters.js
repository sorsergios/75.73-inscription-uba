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