var app = angular.module('examenApp', ['ngRoute']);
// ROOT CONTROLLER
app.controller('RootController', function ($scope) {});
// LOGIN CONTROLLER
app.controller('LoginController', function ($scope, $location, UserService) {
    $scope.enterChat = function () {
        UserService.setNickname($scope.currentUser.nickname);
        $location.path('/chat');
    };
});




// CHAT CONTROLLER
app.controller('ChatController', function ($scope, $interval, $http, UserService) {
    $scope.chatMessages = [];
    $scope.currentUser = UserService.getNickname();
    $scope.lastMessageSentAt = 0;
    $scope.newMessages = 0;
    $scope.previousAmountOfMessages = 0;
    
    $scope.getMessages = function() {
        $http.get("http://localhost:3000/api/chat").success(function (res) {
          $scope.chatMessages = res;
           
            if ($scope.previousAmountOfMessages < res.length) {
                $scope.chatMessages.forEach(function (message) {
                    if (message.posted_on > $scope.lastMessageSentAt) $scope.newMessages++;
                });
            }
             $scope.previousAmountOfMessages = res.length;
        });
        
    }
    
    $scope.getMessages();
    
    // Refresh the chat every second
    $interval( function(){ $scope.getMessages(); }, 1000);

    // Add new chat message
     $scope.addMessage = function() {
         $scope.lastMessageSentAt = new Date().getTime();
         console.log($scope.lastMessageSentAt);
          $http.post("http://localhost:3000/api/addMessage",
              { "nickname": $scope.currentUser, "message": $scope.chatMessage.message, "posted_on": $scope.lastMessageSentAt }
          ).success(function (res) {
             $scope.getMessages();
          });
         
        }
   
     // Verify the author of the message for left-right alignment
     $scope.getTheAuthor = function (nickname) {
         var isAuthor = false;
         if (nickname == $scope.currentUser) isAuthor = true;
         return isAuthor;
         
     }
});

// USER SERVICE
app.service('UserService', function () {
    var self = {};
    self.nickname = undefined;
    self.setNickname = function (nickname) {
        self.nickname = nickname;
    };
    self.getNickname = function () {
        return self.nickname;
    };
    return self;
});

// ROUTING
app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode('false');
    $locationProvider.hashPrefix = '!';
    $routeProvider.when('/', {
        templateUrl: 'views/login.html'
        , controller: 'LoginController'
    }).when('/chat', {
        templateUrl: 'views/main.html'
        , controller: 'ChatController'
    }).otherwise({
        redirectTo: '/'
    });
}]);