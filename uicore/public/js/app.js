
var app = angular.module('dynamicui', [])
.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[').endSymbol(']}');
    console.log('dynamicui module loaded');
})
.value("modulecontext",{})
.value("loadedModules",[])	
.controller("CoreUIController", function($scope){
	
	console.log("on CoreUIController")
	
	$scope.name = "Gireesh";
	$scope.yourName ="G";
})
;




