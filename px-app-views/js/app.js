angular.module("main-view",['dynamicui'])
.controller("MainViewController", function($scope, modulecontext){
	$scope.buttonname = "Load Tree";
	$scope.treedata = {
	        "name": "Dynamic Polymer Tree"};
	
	console.log("MainViewController@MainViewController");
	
	$scope.loadTree = function(){
		//  call service and pull data
		// hardcoded now
		$scope.treedata = {
		        "name": "Tree B",
		        "open": true,
		        "shared": false,
		        "children": [
		          {
		            "name": "Child A",
		            "open": true,
		            "shared": false,
		            "children": [{
		              "name": "Grandchild A"
		            }]
		          },
		          {
		            "name": "Child B",
		            "shared": true,
		            "open": false,
		            "children": [{
		              "name": "Grandchild B",
		              open: false,
		              "children": [{
		                "name": "Great Grandchild B"
		              }]
		            }]
		          },
		          {
		            "name": "Child C",
		            "shared": false,
		            "open": false,
		            "children": [{
		              "name": "Grandchild C"
		            }]
		          },
		          {
		            "name": "Child D",
		            "shared": false,
		            "open": false,
		            "children": [{
		              "name": "Grandchild D"
		            }]
		          }
		        ]
		      };
	}
})
.run(function(){
	console.log("Angularjs module main view loaded");
	document.title = "iReport";
})


if(window.insRegisterModule){
	window.insRegisterModule('main-view');
}

/*
<script>
      document.querySelector("file-tree").data = {
        "name": "Tree B",
        "open": true,
        "shared": false,
        "children": [
          {
            "name": "Child A",
            "open": true,
            "shared": false,
            "children": [{
              "name": "Grandchild A"
            }]
          },
          {
            "name": "Child B",
            "shared": true,
            "open": false,
            "children": [{
              "name": "Grandchild B",
              open: false,
              "children": [{
                "name": "Great Grandchild B"
              }]
            }]
          },
          {
            "name": "Child C",
            "shared": false,
            "open": false,
            "children": [{
              "name": "Grandchild C"
            }]
          },
          {
            "name": "Child D",
            "shared": false,
            "open": false,
            "children": [{
              "name": "Grandchild D"
            }]
          }
        ]
      };
    </script>*/