angular.module('formlyEnnosol', ['formly', 'NgSwitchery', 'tsSelect2', 'angular-cron-jobs'], ['formlyConfigProvider', function configFormlyEnnosol(formlyConfigProvider) {
    'use strict';

    // WRAPPERS
    formlyConfigProvider.setWrapper([{
        name: 'label',
        templateUrl: '/src/templates/label.html'
    }, {
        name: 'addons',
        templateUrl: '/src/templates/addons.html'
    }, {
        name: 'fieldset',
        templateUrl: '/src/templates/fieldset.html'
    }, {
        name: 'validation',
        templateUrl: '/src/templates/error.html'
    }]);

    // TYPES
    formlyConfigProvider.setType([{
        name: 'nested',
        wrapper: ['fieldset'],
        template: '<formly-form model="model[options.key]" fields="options.data.fields"></formly-form>'
    }, {
        name: 'checkbox',
        templateUrl: '/src/templates/checkbox.html',
        wrapper: ['validation']
    }, {
        name: 'switch',
        templateUrl: '/src/templates/switch.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'radio',
        templateUrl: '/src/templates/radio.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'radio-inline',
        templateUrl: '/src/templates/radio-inline.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'input',
        templateUrl: '/src/templates/input.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'date',
        templateUrl: '/src/templates/date.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'time',
        templateUrl: '/src/templates/time.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'daterange',
        templateUrl: '/src/templates/daterange.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'coordinate',
        templateUrl: '/src/templates/coordinate.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'static',
        templateUrl: '/src/templates/static.html',
        wrapper: ['addons', 'label']
    }, {
        name: 'textarea',
        templateUrl: '/src/templates/textarea.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'spinner',
        templateUrl: '/src/templates/spinner.html',
        wrapper: ['addons', 'label', 'validation']
    }, {
        name: 'search',
        templateUrl: '/src/templates/search.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'tags',
        templateUrl: '/src/templates/tags.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'select',
        templateUrl: '/src/templates/select.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'multiSelect',
        templateUrl: '/src/templates/multiselect.html',
        wrapper: ['label', 'validation']
    }, {
        name: 'repeatSection',
        templateUrl: '/src/templates/repeat-section.html',
        wrapper: [],
        controller: 'RepeatSectionController'
    }, {
        name: 'sortableRepeatSection',
        templateUrl: '/src/templates/sortable-repeat-section.html',
        wrapper: [],
        controller: 'RepeatSectionController'
    }, {
        name: 'cron',
        templateUrl: '/src/templates/cron.html',
        wrapper: []
    }]);
}])

.directive('nslTouchspin', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            min: '=',
            max: '=',
            step: '=',
            stepInterval: '=',
            decimals: '=',
            boostAt: '=',
            maxBoostedStep: '=',
            prefix: '=',
            postfix: '=',
            verticalButtons: '='
        },
        link: function(scope, element, attrs) {
            if (typeof scope.min === 'undefined') {
                scope.min = Number.MIN_SAFE_INTEGER || -Number.MAX_VALUE;
            }
            if (typeof scope.max === 'undefined') {
                scope.max = Number.MAX_SAFE_INTEGER || Number.MAX_VALUE;
            }
            if (typeof scope.step === 'undefined' || scope.step === 0) {
                scope.step = 1;
            }

            $(element).TouchSpin({
                min: scope.min,
                max: scope.max,
                step: scope.step,
                stepinterval: scope.stepInterval || 50,
                decimals: scope.decimals || 0,
                boostat: scope.boostAt || 5,
                maxboostedstep: scope.maxBoostedStep || 10,
                prefix: scope.prefix || '',
                postfix: scope.postfix || '',
                verticalbuttons: scope.verticalButtons || false
            });

            // Zero timeout for access the compiled template
            $timeout(function() {
                // Trigger input event for updating ng-model
                $(element)
                    .on('change', function() {
                        element.trigger('input');
                    });
            }, 0);
        }
    };
}])

.directive('nslFormlyDatepicker', ['$timeout', function($timeout) {
    return {
        restrict: 'C',
        link: function(scope, element) {
            // Zero timeout for access the compiled template
            $timeout(function() {
                // Cut off UTC info
                $(element).val($(element).val().substring(0, 10));

                // Trigger input event for updating ng-model
                $(element).datepicker()
                    .on('changeDate', function() {
                        element.trigger('input');
                    });
            }, 0);
        }
    };
}])

.directive('nslFormlyTimepicker', ['$timeout', function($timeout) {
    return {
        restrict: 'C',
        link: function(scope, element) {
            // Zero timeout for access the compiled template
            $timeout(function() {
                // Cut off UTC info
                $(element).clockpicker({
                    placement: 'bottom',
                    align: 'left',
                    autoclose: true,
                    'default': 'now'
                });

                // Trigger input event for updating ng-model
                $(element).clockpicker()
                    .on('change', function() {
                        element.find('input').trigger('input');
                    });
            }, 0);
        }
    };
}])

.directive('nslFormlyCron', function() {
    return {
        restrict: 'C',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            scope.$watch('cronOutput', function() {
               ngModel.$setViewValue(scope.cronOutput);
            });
        }
    };
})

.directive('nslSelectWatcher', ['$timeout', function ($timeout){
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            // Load saved model values to multiselect input
            $timeout(function() {
                if ($(element).attr('multiple') === 'multiple') {
                    $(element).select2().select2('val', ngModel.$modelValue);
                }
            }, 0);

            // Watch
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function(newValue) {
                // Clear select value if the model has been removed
                if (newValue === undefined) {
                    $(element).select2().select2('val', null);
                }
            });
        }
     };
}])

.controller('RepeatSectionController', ['$scope', '$timeout', function($scope, $timeout) {
    var unique = 1;

    $scope.formOptions = {formState: $scope.formState};
    $scope.addNew = addNew;
    $scope.removeItem = removeItem;
    $scope.copyFields = copyFields;

    function copyFields(fields) {
        fields = angular.copy(fields);
        addRandomIds(fields);
        return fields;
    }

    function addNew() {
        $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
        var repeatsection = $scope.model[$scope.options.key];
        var lastSection = repeatsection[repeatsection.length - 1];
        var newsection = {open: true}; // open:true for the sortable-repeat-section template
        repeatsection.push(newsection);
    }

    function removeItem(idx) {
        $scope.model[$scope.options.key].splice(idx, 1);
    }

    function addRandomIds(fields) {
        unique++;
        angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
                addRandomIds(field.fieldGroup);
                return; // fieldGroups don't need an ID
            }

            if (field.templateOptions && field.templateOptions.fields) {
                addRandomIds(field.templateOptions.fields);
            }

            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //$scope.panelHeader
    $scope.getPanelHeader = function(idx) {
        var params = [];
        angular.forEach($scope.options.templateOptions.panel.header.captionFields, function(field, index) {
            if (typeof getValueByDottedKey($scope.model[$scope.options.key][idx], field) !== 'undefined')  {
                params.push(getValueByDottedKey($scope.model[$scope.options.key][idx], field));
            }
        });

        try {
            var caption = vsprintf($scope.options.templateOptions.panel.header.captionFormat, params);
        } catch(err) {
            caption = '';
        } finally {
            return caption;
        }
    }

    function getValueByDottedKey(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }
}])

.service('formlyEnnosolCfg', ['$q', '$http', function($q, $http) {
    this.configuration = function() {
        var self = this;

        self.url = '';
        self.method = 'get';
        self.delay = 250;

        self.idField = 'id';
        self.dataAccessor = '';
        self.termParam = 'query';
        self.termAccessor = 'term';
        self.pageParam = 'page';
        self.pageAccessor = 'page';

        self.data = function(params) {
            var data = {};
            data[self.cfg.termParam] = params[self.cfg.termAccessor];
            data[self.cfg.pageParam] = params[self.cfg.pageAccessor];
            return data;
        };

        self.processResults = function(data, page) {
            // access the target array
            if (self.cfg.dataAccessor !== '') {
                var accessor = self.cfg.dataAccessor.split('--');
                do {
                    var a = accessor.splice(0, 1);
                    if (angular.isNumber(a)) {
                        a = a * 1;
                    }
                    data = data[a];
                } while (accessor.length > 0);
            }

            // make sure we have an id
            if (self.cfg.idField !== 'id') {
                data.forEach(function(elem, ndx, arr) {
                    arr[ndx].id = arr[ndx][self.cfg.idField];
                });
            }

            return {
                results: data
            };
        };

        self.templateResult = function(data) {
            return data.text;
        };

        self.templateSelection = function(data) {
            return data.text;
        };

        self.escapeMarkup = function(markup) {
            return markup;
        };

        self.getConfig = function(config) {
            if (typeof config === 'undefined') {
                config = {};
            }
            self.cfg = angular.merge({}, self, config);
            return {
                ajax: {
                    type: self.cfg.method,
                    method: self.cfg.method,
                    dataType: 'json',
                    delay: self.cfg.delay,
                    cache: true,
                    transport: self.cfg.jTransport,
                    url: self.cfg.url,
                    data: self.cfg.data,
                    params: self.cfg.data,
                    processResults: self.cfg.processResults
                },
                templateResult: self.cfg.templateResult,
                templateSelection: self.cfg.templateSelection,
                escapeMarkup: self.cfg.escapeMarkup
            };
        };
        self.getConfig({});

        self.jTransport = function(params, success, failure) {
            var $request = $.ajax(params);

            $request.then(success);
            $request.fail(failure);

            return $request;
        };

        self.aTransport = function(params, success, failure) {
            var timeout = $q.defer();

            params.method = params.type;
            params.params = params.data;

            angular.extend({
                timeout: timeout
            }, params);

            $http(params).then(function(response) {
                success(response.data);
            }, failure);

            return {
                abort: timeout.resolve
            };
        };
    };
}]);
