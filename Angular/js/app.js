/**
 * Controller to Inscription system .
 */

var systemApp = angular.module('systemApp', ['systemFilters']);

systemApp.controller('SystemCtrl', function ($scope, $http, $q) {
    
    $scope.activeModal = false;
    $scope.selectedCourse = {
            'code': null,
            'data': null,
            'next': null
    };
    $scope.mandatoryCreditsSum = 0;
    $scope.mandatoryCreditsTotal = 0;
    $scope.mandatoryOrientedCreditsSum = 0;
    $scope.mandatoryOrientedCreditsTotal = 34;
    $scope.electedCreditsSum = 0;
    $scope.electedCreditsTotal = 34;
    
    $scope.selectedOrientation = 1;
    $scope.selectedTesis = "7500";
    $scope.tesisElection = ["7500", "7599"];
    
    $http.get('data/user_1.json').success(function(data){
        $scope.user = data;
    });
    $http.get('data/inscriptions_1.json').success(function(data){
        $scope.userInscriptions = data;
    });
    
    $http.get('data/next-courses.json').success(function(data){
        $scope.nextCourses = data;
    });
    
    $scope.subjects = $http.get('data/subjects.json');
    $scope.courses = $http.get('data/courses.json');
    
    $q.all([$scope.subjects,$scope.courses])
        .then(function(arrayOfResults){
        $scope.subjects = arrayOfResults[0].data;
        $scope.courses = arrayOfResults[1].data;
        angular.forEach($scope.subjects.obligatorias.content, function(subject, key) {
            angular.forEach(subject.assignatures, function(assignature, key2) {
                if ($scope.tesisElection.indexOf(assignature) === -1) {
                    $scope.mandatoryCreditsTotal += $scope.courses[assignature].creditos;
                }
            });
        });
    });
    
    $scope.completed = function(assignature) {
        if ($scope.user.subjects !== undefined
            && $scope.user.subjects.hasOwnProperty(assignature) 
            && $scope.user.subjects[assignature].grade >= 4) {
            return 0;
        }
        return 2;
    };

    $scope.isSelectedTesis = function(assignature) {
        return ($scope.tesisElection.indexOf(assignature) === -1 || assignature === $scope.selectedTesis) ;
    };
    
    $scope.toggleModal = function() {
        $scope.activeModal = !$scope.activeModal;
    };
    
    $scope.openModal = function(assignature) {
        $scope.toggleModal();
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
    
    function getCheckedRadio(radio_group) {
        for (var i = 0; i < radio_group.length; i++) {
            var button = radio_group[i];
            if (button.checked) {
                return button;
            }
        }
        return undefined;
    }
    
    $scope.register = function () {
    	var cursos = document.getElementsByName("idCourse");
    	var checkedButton = getCheckedRadio(cursos);
    	if (checkedButton !== undefined) {
    		var timesList; 
    		var courseCode = $scope.selectedCourse.code;
    		var id =  checkedButton.id
    		angular.forEach($scope.courses[courseCode].cursos, function(course, id) {
    			if (course.curso == checkedButton.id ){ 
    				timesList = course.horarios;
    			}
    		});
    		
        	this.userInscriptions.push ({
    		"code": courseCode, 
    		"course": checkedButton.id, 
    		"horarios": timesList
        	});
        	$scope.toggleModal ();    		
    	} else {
    		alert("Seleccione un curso a inscribirse!")
    	}
    	
    };
    
    $scope.removeContact = function (contactToRemove) {
    	var index = this.userInscriptions.indexOf(contactToRemove);
    	this.userInscriptions.splice(index, 1);
    };
});
