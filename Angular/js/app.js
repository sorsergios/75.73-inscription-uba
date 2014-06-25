/**
 * Controller to Inscription system .
 */

var systemApp = angular.module('systemApp', ['systemFilters']);

systemApp.controller('SystemCtrl', function ($scope, $http, $q, $window) {
    
    $scope.activeModal = false;
    $scope.selectedCourse = {
            'code': null,
            'data': null,
            'next': null
    };
    $scope.mandatoryCreditsTotal = 0;
    $scope.mandatoryOrientedCreditsTotal = 34;
    $scope.electedCreditsTotal = 34;
    
    $scope.selectedOrientation = 1;
    $scope.selectedTesis = "7500";
    $scope.tesisElection = ["7500", "7599"];
    
    $http.get('data/inscriptions_1.json').success(function(data){
        if (data !== undefined) {
            $scope.inscriptions = true;
            $scope.noInscriptions = false;
            $scope.userInscriptions = data;
        } else {
            $scope.inscriptions = false;
            $scope.noInscriptions = true;
        }
    });
    
    $http.get('data/next-courses.json').success(function(data){
        $scope.nextCourses = data;
    });
    
    $scope.subjects = $http.get('data/subjects.json');
    $scope.courses = $http.get('data/courses.json');
    $scope.user = $http.get('data/user_1.json');
    
    $q.all([$scope.subjects,$scope.courses, $scope.user])
        .then(function(arrayOfResults){
        $scope.subjects = arrayOfResults[0].data;
        $scope.courses = arrayOfResults[1].data;
        $scope.user = arrayOfResults[2].data;
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
    
    $scope.checkedButton = function (courseList) {
        var select = undefined;
        angular.forEach(courseList, function(button, id) {
            if (button.checked){ 
                select = button;
            }
        });
        return select;
    };
    
    $scope.register = function () {
        if (this.userInscriptions.length > 9) {
            alert ("No puede inscribirse a más de 10 materias por cuatrimestre!");
        } else {
            var courseList = document.getElementsByName("idCourse");
            var checkedButton = $scope.checkedButton(courseList);
            if (checkedButton !== undefined) {
                var timesList = null; 
                var courseCode = $scope.selectedCourse.code;
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
                alert("Seleccione un curso a inscribirse!");
            }
            if (this.userInscriptions.length > 0) {
                $scope.inscriptions = true;
                $scope.noInscriptions = false;
            }
        }
    };
    
    $scope.removeContact = function (contactToRemove) {
        var index = this.userInscriptions.indexOf(contactToRemove);
        this.userInscriptions.splice(index, 1);
        if (this.userInscriptions.length == 0) {
            $scope.inscriptions = false;
            $scope.noInscriptions = true;
        }
    };

    $scope.mandatoryCreditsSum = function () {
        var sum = 0;
        if ($scope.subjects.obligatorias !== undefined) {
            angular.forEach($scope.subjects.obligatorias.content, function(subject, key) {
                angular.forEach(subject.assignatures, function(assignature, key2) {
                    if ($scope.user.subjects[assignature] !== undefined 
                            && $scope.user.subjects[assignature].grade >= 4) {
                        sum += $scope.user.subjects[assignature].grade;
                    }
                });
            });
        }
        return sum;
    };
    
    $scope.mandatoryOrientedCreditsSum = function () {
        var sum = 0;
        if ($scope.subjects.orientacion !== undefined) {
            angular.forEach($scope.subjects.orientacion.content, function(subject, key) {
                if (subject.id == $scope.selectedOrientation) {
                    angular.forEach(subject.assignatures, function(assignature, key2) {
                        if ($scope.user.subjects[assignature] !== undefined 
                                && $scope.user.subjects[assignature].grade >= 4) {
                            sum += $scope.user.subjects[assignature].grade;
                        }
                    });
                }
            });
        }
        return sum;
    };
    
    $scope.electedCreditsSum = function () {
        var sum = 0;
        if ($scope.subjects.orientacion !== undefined) {
            angular.forEach($scope.subjects.orientacion.content, function(subject, key) {
                if (subject.id != $scope.selectedOrientation) {
                    angular.forEach(subject.assignatures, function(assignature, key2) {
                        if ($scope.user.subjects[assignature] !== undefined 
                                && $scope.user.subjects[assignature].grade >= 4) {
                            sum += $scope.user.subjects[assignature].grade;
                        }
                    });
                }
            });
            angular.forEach($scope.subjects.electivas.content, function(subject, key) {
                angular.forEach(subject.assignatures, function(assignature, key2) {
                    if ($scope.user.subjects[assignature] !== undefined 
                            && $scope.user.subjects[assignature].grade >= 4) {
                        sum += $scope.user.subjects[assignature].grade;
                    }
                });
            });
        }
        return sum;
    };
    
    $scope.creditsObtained = function () {
        var sum = 0;
        if ($scope.user !== undefined) {
         	angular.forEach($scope.user.subjects, function(subject, key) {
       			sum += $scope.courses[key].creditos;
            });
        }
        return sum;
    };
    
    $scope.subjectsApproved = function () {
        var sum = 0;
        if ($scope.user !== undefined) {
         	angular.forEach($scope.user.subjects, function(subject, key) {
       			sum += 1;
            });
        }
        return sum;
    };

    $scope.percentage = function () {
        var percent =  ($window.Math.round((100 * $scope.creditsObtained()) * 100 / 248)) / 100;
        return percent;
    };

    $scope.average = function () {
    	var sum = 0;
		angular.forEach($scope.user.subjects, function(assignature, key) {
		    if ($scope.user.subjects[key] !== undefined 
		            && $scope.user.subjects[key].grade >= 4) {
		        sum += $scope.user.subjects[key].grade;
		    }
		});
        var avg =  ($window.Math.round(sum * 100 / $scope.subjectsApproved()))/100;
        return avg;
    };
});
