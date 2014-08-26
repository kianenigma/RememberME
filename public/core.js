todoApp = angular.module('RememberMe' , []) ;

function mainCtrl($scope , $http , $window) {
    $scope.formData = {} ;

    $http.get( '/api/todos').success(function (data) {
        $scope.todos = data.todos ;
    })
        .error(function (data) {
        console.log(data) ;
    }) ;

    $http.get('api/info').success(function (data) {
        $scope.info = data ;
        if (!data.user) {
            $('.alert').show(1000) ;
        }
        else { $('.jumbotron button').show(1) }
    })
        .error(function (err) {
            console.log(err) ;
    });


    $scope.makeTodo  = function () {
        console.log("running make todo func");
        $http.post('/api/todos' , $scope.formData).success(function (data) {
            $scope.formData = {} ;
            $scope.todos = data ;
        })
            .error(function (data) {
                console.log(data) ;
            }) ;
    } ;

    $scope.deleteTodo = function (idx) {
        console.log("param : " + idx ) ;
        $http.delete('/api/todos/' + idx ).success(function (data) {
            $scope.todos = data
        })
            .error(function (err) {
                console.log(err)
            }) ;
    } ;

    $scope.deleteAllTodo = function () {
        console.log("deleting all ") ;
        $http.delete('/api/todos/0').success(function (data) {
            $scope.todos = data ;
        })
            .error(function (err) {
                console.log(err) ;
            })
    } ;

    $scope.logout = function () {
        $http.get('/api/logout' , function (err, data) {
            if (err){ console.log(err) }
        });

    }
}



