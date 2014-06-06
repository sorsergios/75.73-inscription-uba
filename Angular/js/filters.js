filters = angular.module('systemFilters', []);

filters.filter('getAssignature', function() {
  return function(input, scope) {
    return input + ' - ' + scope.courses[input].nombre;
  };
});