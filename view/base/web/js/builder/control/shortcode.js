define([
	'jquery',
	'angular'
], function($, angular) {

	var directive = function(cytraconBuilderUrl, cytraconBuilderModal) {
		return {
			replace: true,
			templateUrl: function(elem) {
				return cytraconBuilderUrl.getTemplateUrl(elem, 'Cytracon_BuilderClipboard/js/templates/builder/control/shortcode.html')
			},
			controller: function($scope, elementManager) {
				$scope.viewShortcode = function() {
					cytraconBuilderModal.open('shortcode', {
						resolve: {
							form: {
								element: $scope.element
							}
						}
					});
				}
			}
		}
	}

	return directive;
});