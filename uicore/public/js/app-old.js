
angular.module('uicore', ['oc.lazyLoad','ngSanitize','ui.gridstack'])
.value("config",{});
var app = angular.module('dynamicui', ['uicore'])
.config(['$ocLazyLoadProvider','$sceDelegateProvider', function($ocLazyLoadProvider, $sceDelegateProvider) {
	
	  $ocLazyLoadProvider.config({
		  debug: true, events: true
	  });
  
	}])

.value("loadedModules",[])	

.controller('DemoCtrl', function($scope) {

            $scope.options = {
                cell_height: 180,
                vertical_margin: 10
            };

            $scope.addWidget = function() {
                var newItem =
                {
                    x:0, y:0, width:1, height:1
                };
                $scope.widgets.push(newItem);
            };

            $scope.removeWidget = function(w) {
                var index = $scope.widgets.indexOf(w);
                $scope.widgets.splice(index, 1);
                $scope.serialize();
            };

          $scope.serialize = function(){
            var res = _.map($('.grid-stack .grid-stack-item:visible'), function (el) {
                el = $(el);
                var node = el.data('_gridstack_node');
                return {
                    id: el.attr('data-custom-id'),
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height
                };
            });
            console.log(JSON.stringify(res));            
          }

            $scope.widgets = [];

        })

.controller('DynamicUIController', function($scope, $ocLazyLoad, $compile, $sce, loadedModules, config, $http) {
	
	$http.get('/components', {}).then(function(response){
		$scope.components = response.data.components;
	});
	
	$scope.loadComponent = function(comp){
		var id = comp.id;
		if(loadedModules.indexOf(id) == -1){
			console.log("Loading component :"+comp);
			config[comp.modulename] = {"root":comp.context+"/"};
			$ocLazyLoad.load(comp.context+'/app.js');
			
			$scope.$on(comp.modulename+'.loaded', function() {
				  
				  var loadedmodule = angular.module(comp.modulename);
//				  loadedmodule.onInit();
				  
				  var el = $compile( comp.template )( $scope );
				  angular.element("#canvas").append( el );
				  loadedModules.push(id);
				});
		}else{
			 var el = $compile( comp.template )( $scope );
			  angular.element("#canvas").append( el );
		}
	}
	
	$scope.$on('ocLazyLoad.moduleLoaded', function(e, module) {
		$scope.$emit(module+'.loaded');
	});
	
});