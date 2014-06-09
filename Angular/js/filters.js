filters = angular.module('systemFilters', []);

filters.filter('getAssignature', function() {
  return function(input, scope) {
    if ((scope.courses !== undefined) && scope.courses.hasOwnProperty(input)) {
        return input + ' - ' + scope.courses[input].nombre;
    } else {
        return input;
    }
    
  };
});