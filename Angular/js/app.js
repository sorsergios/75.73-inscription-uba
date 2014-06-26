/**
 * Controller to Inscription system .
 */

var systemApp = angular.module('systemApp', ['systemFilters']);

systemApp.controller('SystemCtrl', function ($scope, $http, $q, $window) {
    
    $scope.activeModal = false;
    $scope.itineraryModal = false;
    $scope.gradeModal = false;
    $scope.selectedCourse = {
        'code': null,
        'data': null,
        'next': null,
        'course': null
    };
    $scope.mandatoryCreditsTotal = 0;
    $scope.mandatoryOrientedCreditsTotal = 34;
    $scope.electedCreditsTotal = 34;
    
    $scope.selectedOrientation = 1;
    $scope.selectedTesis = "7500";
    $scope.tesisElection = ["7500", "7599"];
    
    $http.get('data/inscriptions_1.json').success(function(data){
        $scope.userInscriptions = data;
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
        $scope.activeModal = false;
        $scope.itineraryModal = false;
        $scope.gradeModal = false;
    };

    $scope.openGradeModal = function(assignature) {
        $scope.activeModal = true;
        $scope.gradeModal = true;
        $scope.selectedAssignature = assignature;
        if ($scope.user.subjects !== undefined
                && !$scope.user.subjects.hasOwnProperty(assignature)) {
            $scope.user.subjects[assignature] = {'grade' : null};
        }
    };

    $scope.saveGrade = function() {
        $scope.activeModal = false;
        $scope.gradeModal = false;
    };
    
    $scope.openItineraryModal = function(assignature) {
        $scope.activeModal = true;
        $scope.itineraryModal = true;
        if ($scope.courses !== undefined
                && $scope.courses.hasOwnProperty(assignature)) {
            $scope.selectedCourse.code = assignature;
            $scope.selectedCourse.data = $scope.courses[assignature];
            $scope.selectedCourse.course = null;
            if ($scope.nextCourses !== undefined
                    && $scope.nextCourses.hasOwnProperty(assignature)) {
                $scope.selectedCourse.next = $scope.nextCourses[assignature];
            }
        } else {
            $scope.selectedCourse.code = 'none';
        }
    };
    
    $scope.register = function () {
        if ($scope.userInscriptions.length > 9) {
            alert ("No puede inscribirse a más de 10 materias por cuatrimestre!");
        } else {
            if ($scope.selectedCourse.course != null) {
                $scope.toggleModal ();
                var curso = $scope.selectedCourse.data.cursos[$scope.selectedCourse.course],
                    inscription = {
                        "code": $scope.selectedCourse.code, 
                        "course": curso.curso, 
                        "horarios": curso.horarios
                    };
                $scope.userInscriptions[inscription.code] = inscription;
            } else {
                alert("Seleccione un curso a inscribirse!");
            }
        }
    };
    
    $scope.removeContact = function (contactToRemove) {
        delete this.userInscriptions[contactToRemove];
    };

    $scope.mandatoryCreditsSum = function () {
        var sum = 0;
        if ($scope.subjects.obligatorias !== undefined) {
            angular.forEach($scope.subjects.obligatorias.content, function(subject, key) {
                angular.forEach(subject.assignatures, function(assignature, key2) {
                    if ($scope.user.subjects[assignature] !== undefined 
                            && $scope.user.subjects[assignature].grade >= 4) {
                        sum += $scope.courses[assignature].creditos;
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
                            sum += $scope.courses[assignature].creditos;
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
                            sum += $scope.courses[assignature].creditos;
                        }
                    });
                }
            });
            angular.forEach($scope.subjects.electivas.content, function(subject, key) {
                angular.forEach(subject.assignatures, function(assignature, key2) {
                    if ($scope.user.subjects[assignature] !== undefined 
                            && $scope.user.subjects[assignature].grade >= 4) {
                        sum += $scope.courses[assignature].creditos;
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
                if (subject !== undefined 
                        && subject.grade >= 4) {
                    sum += $scope.courses[key].creditos;
                }
            });
        }
        return sum;
    };
    
    $scope.subjectsApproved = function () {
        var sum = 0;
        if ($scope.user !== undefined) {
            angular.forEach($scope.user.subjects, function(subject, key) {
                if (subject !== undefined 
                        && subject.grade >= 4) {
                    sum++;
                }
            });
        }
        return sum;
    };

    $scope.totalGrades = function () {
        var sum = 0;
        angular.forEach($scope.user.subjects, function(assignature, key) {
            if (assignature !== undefined 
                    && assignature.grade >= 4) {
                sum += assignature.grade;
            }
        });
        return sum;
    };
    
    $scope.isEmpty = function (obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) return false;
        }
        return true;
    };
});
