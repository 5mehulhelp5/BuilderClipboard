define([
	'jquery',
	'angular'
], function($, angular) {

	return {
		templateUrl: 'Cytracon_Builder/js/templates/modal/form.html',
		controller: function(
			$rootScope, 
			$scope, 
			$uibModalInstance, 
			$controller, 
			form,
			modal,
			elementManager,
			form,
			cytraconBuilderForm
		) {
			var parent = $controller('modalBaseController', {$scope: $scope, $uibModalInstance: $uibModalInstance, modal: modal, form: form});
			angular.extend(this, parent);

			var self = this;
			var builder = form.element.builder;
			var element = angular.copy(form.element);
			delete element['builder'];
			self.model = {
				shortcode: angular.toJson(element)
			};

			$scope.$emit('enableModalSpinner');
			cytraconBuilderForm.getForm('modals.shortcode', function(tabs, result) {
				self.tabs = tabs;
				builder.fields = result.fields;
				$scope.$emit('disableModalSpinner');
			});

			self.onSubmit = function() {
				try {
					var data = angular.fromJson(self.model.shortcode);
					if (data.type) {
						if (elementManager.getElement(data.type)) {
							if (data.type == form.element.type) {
								var defaultValues = angular.copy(builder.defaultValues);
								var newData       = angular.merge(defaultValues, data);
								angular.forEach(builder.fields, function(field, key) {
									if (data.hasOwnProperty(field)) {
										newData[field] = data[field];
									}
								});
								newData.elements = elementManager.prepareElements(newData.elements);
								var oldBuilderElement = elementManager.getElement(element.type);
								angular.forEach(oldBuilderElement.fields, function(field, key) {
									delete element[field];
								});
								angular.forEach(newData, function(value, key) {
									form.element[key] = value;
								});
								elementManager.prepareElement(form.element, true);
								$rootScope.$broadcast('addHistory', {
									type: 'edited',
									title: builder.name
								});
								$rootScope.$broadcast('editedElement', form.element);
							}
							$uibModalInstance.dismiss('cancel');
						} else {
							alert('Type "' + data.type + '" is not exist');
						}
					} else {
						alert('Type field is required');
					}

				} catch (e) {
					alert('Invalid JSON string');
				}
			}
		}
	}
});