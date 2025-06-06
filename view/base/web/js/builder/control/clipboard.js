define([
	'jquery',
	'angular'
], function($, angular) {

	var directive = function(cytraconBuilderUrl, $rootScope) {
		return {
			replace: true,
			templateUrl: function(elem) {
				return cytraconBuilderUrl.getTemplateUrl(elem, 'Cytracon_BuilderClipboard/js/templates/builder/navbar/clipboard.html')
			},
			controller: function($scope, elementManager) {

				if (!$rootScope.clipboardElements) $rootScope.clipboardElements = [];

				var element = $scope.element;

				$scope.getEl = function(elem) {
					return $('.mgz-builder .' + elem.id);
				}

				$scope.getElemIndex = function() {
					return _.findIndex($rootScope.clipboardElements, function(_elem) {
						return _elem.id == element.id;
					});
				}

				$scope.isChildren = function() {
					var index = $scope.getElemIndex();
					return (index !== -1) ? true : false;
				}

				$scope.copyElement = function(e) {
					if ($scope.isChildren($rootScope.copiedElements)) {
						if (element.builder.clipboardType == 'move') {
							element.builder.clipboardType = 'copy';
						}
					} else {
						element.builder.clipboardType = 'copy';
						$rootScope.clipboardElements.push(element);
					}
				}

				$scope.moveElement = function() {
					if ($scope.isChildren($rootScope.copiedElements)) {
						if (element.builder.clipboardType == 'copy') {
							element.builder.clipboardType = 'move';
						}
					} else {
						element.builder.clipboardType = 'move';
						$rootScope.clipboardElements.push(element);
					}		
				}

				$scope.removeElement = function(e) {
					var index = $scope.getElemIndex();
					$rootScope.clipboardElements.splice(index, 1);
					e.stopPropagation();
				}

				$scope.pasteList = function() {
					if ($scope.canPaste() && $rootScope.clipboardElements.length) {
						var _el;
						var allowedTypes = element.builder.allowed_types;
						var currentEl = $scope.getEl(element);
						var countCopied = 0, countMoved = 0;
						var _elemt;
						angular.forEach($rootScope.clipboardElements, function(elem, index) {
							_el = $scope.getEl(elem);
							if (!_el.find(currentEl).length && $.inArray(elem.type, allowedTypes)!==-1 && elem.builder.clipboardType) {
								if (elem.builder.clipboardType == 'move') {
									$rootScope.$broadcast('removeElement', elem, {history: false});
									countMoved++;
								} else {
									countCopied++;
								}
								if (elem.builder.clipboardType == 'move') {
									_elemt = elementManager.prepareElement(angular.copy(elem));
								} else {
									_elemt = elementManager.prepareElement(angular.copy(elem), true);	
								}
								element.elements.push(_elemt);
							}
						});
						$scope.emptyList();

						if (countMoved || countCopied) {
							var subTitle = '';

							if (countCopied) {
								subTitle += ' ' + countCopied + ' copied';
							}

							if (countMoved) {
								if (subTitle) subTitle += ', ';
								subTitle += countMoved + ' moved';
							}

							$rootScope.$broadcast('addHistory', {
								type: 'clipboard',
								title: 'Clipboard',
								subtitle: subTitle,
								action: ''
							});
						}
					}
				}

				$scope.emptyList = function() {
					$rootScope.clipboardElements = [];
				}

				$scope.canPaste = function() {
					if (!$rootScope.clipboardElements.length || $scope.isChildren()) {
						return false;
					}
					if (element.builder.is_collection) {
						return true;
					}
					return false;
				}

				$scope.getTotalElements = function() {
					if ($scope.isChildren()) {
						return $rootScope.clipboardElements.length;
					} else {
						var _el;
						var length = 0 ;
						var allowedTypes = element.builder.allowed_types;
						var currentEl = $scope.getEl(element);
						angular.forEach($rootScope.clipboardElements, function(elem, index) {
							_el = $scope.getEl(elem);
							if (!_el.find(currentEl).length && $.inArray(elem.type, allowedTypes)!==-1 && elem.builder.clipboardType) {
								length++;
							}
						});
						return length;
					}
				}
			}
		}
	}

	return directive;
});