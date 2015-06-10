/**
	When entering data into the input field, create a 1 second delay
	kill the timer when another character is entered and restart the timer

	focus on input on form load

	highlight currently selected link for selected user and repo (bold, back color)
**/

angular.module('gitSearch', []) 
	.controller('gitSearchController', function($scope, $http, $timeout) {

		//keep a variable for storing timeoutPromise
    var timeoutPromise;

    $scope.searchForUser = function () {
        $scope.selectedUser = null;
        $scope.selectedRepo = null;
        $scope.returnedRepos = [];
        $scope.returnedCommits = [];

        if ($scope.user.length === 0) {
            $scope.returnedUsers = null;
            return;
        }

        //if already a timeout is in progress cancel it
        if (timeoutPromise) {
            $timeout.cancel(timeoutPromise);
        }

        //Make a fresh timeout
        timeoutPromise = $timeout(searchUsers, 1000)
                         .finally(function(){
                             timeoutPromise = null; //nullify it
                          });

    };

    function searchUsers() {
        $http.get("https://api.github.com/search/users?q=" + $scope.user).
        success(function (data, status) {
            if (status === 200) {
                $scope.returnedUsers = data.items;
            }
        }).
        error(function (data, status) {
            alert("something happened with quhhnnhhhh");
        });

    }

		$scope.getRepoData = function(singleUser) {
			$scope.selectedUser = singleUser;
			$http.get(singleUser.repos_url).
				success(function(data,status) {
					if(status===200) {
						$scope.returnedRepos = data;
					}
				}).
				error(function(data,status){
					alert("something happened in single user");
				});
		}

		$scope.getCommits = function(singleRepo) {
			$scope.selectedRepo = singleRepo;
			var url = "https://api.github.com/repos/" + singleRepo.full_name + "/commits";
			$http.get(url)
				.success(function(data,status) {
					if(status===200){
						$scope.returnedCommits = data;
					}
				})
				.error(function() {
					alert("something happened in single repo");
				});
		}
	});