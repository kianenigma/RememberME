auth = angular.module('authApp' , []) ;


function mainCtrl($scope , $http) {
    $scope.Ldata = {};
    $scope.Rdata = {};
    $('#error').hide(1) ;
    $('#congrats').hide(2) ;


    $scope.register = function () {
        $http.post('/api/register', $scope.Rdata)
            .success(function (data) {
                $scope.Rdata = {} ;
                if ( data.stat == false ) { $scope.errors = data.msg ; $('error').show(100) ;  }
                else { $scope.congrats = data.msg ; $('#congrats').show(100) ;  }
            })
            .error(function (err) {
                console.log(err);
            });
    } ;

    $scope.login = function () {

        $http.post('api/login', $scope.Ldata)
            .success(function (data) {
                $scope.Ldata = {} ;
                if (data.stat === true) { window.location = data.msg ;}
                else { $scope.errors = data.msg ; $('#error').show(100) ;  }
            })
            .error(function (err) {
                 console.log(err) ;
            }) ;
    } ;
}
