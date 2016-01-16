'use strict';

(function() {
  angular.module('ncsaas')
    .service('baseEventListController', [
      'baseControllerListClass', 'eventsService', 'ENTITYLISTFIELDTYPES', 'eventFormatter', 'ENV',
      baseEventListController]);

  function baseEventListController(
    baseControllerListClass, eventsService, ENTITYLISTFIELDTYPES, eventFormatter, ENV) {
    var ControllerListClass = baseControllerListClass.extend({
      init:function() {
        this.service = eventsService;
        this.searchFieldName = 'search';
        this.helpKey = ENV.dashboardHelp.eventsList.name;
        this.entityOptions = {
          entityData: {
            noDataText: 'No events yet',
            noMatchesText: 'No events found matching filter.',
            hideActionButtons: true,
            hideTableHead: true
          },
          list: [
            {
              propertyName: 'icon',
              className: 'icon',
              type: ENTITYLISTFIELDTYPES.fontIcon,
              showForMobile: true
            },
            {
              propertyName: 'html_message',
              className: 'message',
              type: ENTITYLISTFIELDTYPES.html,
              showForMobile: true
            },
            {
              propertyName: '@timestamp',
              className: 'date',
              type: ENTITYLISTFIELDTYPES.date,
              showForMobile: true
            }
          ]
        };
        this._super();
      },
      afterGetList: function() {
        angular.forEach(this.list, function(event) {
          event.html_message = eventFormatter.format(event);
          event.icon = eventFormatter.getIcon(event);
        });
      }
    });

    return ControllerListClass;
  }

  angular.module('ncsaas')
    .service('BaseAlertsListController', [
      'baseControllerListClass',
      'alertsService',
      'alertFormatter',
      'ENTITYLISTFIELDTYPES',
      'ENV',
      BaseAlertsListController]);

  function BaseAlertsListController(
    baseControllerListClass,
    alertsService,
    alertFormatter,
    ENTITYLISTFIELDTYPES,
    ENV) {
    return baseControllerListClass.extend({
      init: function() {
        this.service = alertsService;
        this.searchFieldName = 'message';
        this.helpKey = ENV.dashboardHelp.alertsList.name;
        this._super();

        this.entityOptions = {
          entityData: {
            noDataText: 'No alerts yet',
            noMatchesText: 'No alerts found matching filter.',
            hideActionButtons: true,
            hideTableHead: true
          },
          list: [
            {
              propertyName: 'icon',
              className: 'icon',
              type: ENTITYLISTFIELDTYPES.fontIcon,
              showForMobile: true
            },
            {
              name: 'Message',
              propertyName: 'html_message',
              className: 'message',
              type: ENTITYLISTFIELDTYPES.html,
              showForMobile: true
            },
            {
              name: 'Date',
              propertyName: 'created',
              className: 'date',
              type: ENTITYLISTFIELDTYPES.date,
              showForMobile: true
            }
          ]
        };
      },
      afterGetList: function() {
        angular.forEach(this.list, function(alert) {
          alert.html_message = alertFormatter.format(alert);
          alert.icon = alertFormatter.getIcon(alert);
        });
      }
    });
  }

  angular.module('ncsaas')
    .controller('DashboardIndexController', [
      '$scope',
      '$stateParams',
      'baseControllerClass',
      DashboardIndexController]);

  function DashboardIndexController($scope, $stateParams, baseControllerClass) {
    var controllerScope = this;
    var EventController = baseControllerClass.extend({
      init: function() {
        $scope.activeTab = $stateParams.tab || 'activity';
        this.checkQuotas = 'project';
      }
    });

    controllerScope.__proto__ = new EventController();
  }

  angular.module('ncsaas')
    .controller('DashboardCostController', [
      'baseControllerClass',
      'priceEstimationService',
      'blockUI',
      'ENV',
      'servicesService',
      'resourcesService',
      DashboardCostController]);

  function DashboardCostController(
    baseControllerClass,
    priceEstimationService,
    blockUI,
    ENV,
    servicesService,
    resourcesService) {
    var controllerScope = this;
    var EventController = baseControllerClass.extend({
      init: function() {
        this.controllerScope = controllerScope;

        this.activate();
        blockUI.start();

        this.checkQuotasResource = 'resource';
        this.checkQuotasProvider = 'service';

      },

      activate: function() {
        var vm = this;
        priceEstimationService.pageSize = 1000;
        priceEstimationService.getList().then(function(rows) {
          vm.processChartData(rows);
          vm.processTableData(rows);
        });
      },

      selectRow: function(row) {
        row.selected = !row.selected;
        row.activeTab = (ENV.featuresVisible || ENV.toBeFeatures.indexOf('providers') == -1)
          ? 'services'
          : 'projects';
        if (ENV.featuresVisible || ENV.toBeFeatures.indexOf('providers') == -1) {
          this.getServiceResourcesCount(row);
        }
        if (ENV.featuresVisible || ENV.toBeFeatures.indexOf('resources') == -1) {
          this.getResourceDetails(row);
        }
      },

      getResourceDetails: function(row) {
        for (var i = 0; i < row.resources.length; i++) {
          var resource = row.resources[i];
          if (!resource.resource_type || !resource.project_uuid) {
            resourcesService.$get(null, null, resource.scope).then(function(response) {
              resource.resource_uuid = response.uuid;
              resource.resource_type = response.resource_type;
              resource.project_uuid = response.project_uuid;
              resource.project_name = response.project_name;
            });
          }
        }
      },

      getServiceResourcesCount: function(row) {
        for (var i = 0; row.services.length > i; i++) {
          var service = row.services[i];
          if (!service.resources_count) {
            servicesService.$get(null, service.scope).then(function(service, response) {
              service.resources_count = response.resources_count;
            }.bind(null, service));
          }
        }
      },

      processChartData: function(rows) {
        var labels = [];
        var totals = [];
        rows.forEach(function(row) {
          if (row.scope_type == 'customer') {
            labels.unshift(moment(row.month, 'MM').format('MMMM'));
            totals.unshift(row.total);
          }
        });
        blockUI.stop();

        this.chartOptions = {
          bezierCurve: false,
          responsive: true,
          animationEasing: 'linear'
        };

        this.costData = {
          labels: labels,
          datasets: [
            {
              fillColor: 'rgba(123, 166, 196,0.5)',
              strokeColor: 'rgba(123, 166, 196,1)',
              pointColor: 'rgba(123, 166, 196,1)',
              pointStrokeColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(123, 166, 196,1)',
              data: totals
            }
          ]
        };
      },

      processTableData: function(rows) {
        var results = {},
            scopeArray;
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var date = moment(row.month, 'MM').format('MMMM') + ' ' + row.year;
          var currentDate = new Date();
          if (!results.hasOwnProperty(date)) {
            results[date] = {
              total: 0,
              isCurrent: (currentDate.getFullYear() === row.year && row.month == currentDate.getMonth() + 1),
              projects: [],
              services: [],
              resources: []
            }
          }
          if (row.scope_type === 'customer') {
            results[date].total = row.total;
          }
          if (row.scope_type === 'project') {
            scopeArray = row.scope_name.split(' | ');
            row.project_name = scopeArray[0];
            row.organization_name = scopeArray[1];
            results[date].projects.push(row);
          }
          if (row.scope_type === 'resource') {
            results[date].resources.push(row);
          }
          if (row.scope_type === 'service') {
            results[date].services.push(row);
          }
        }
        var table = [];
        for (var date in results) {
          var row = results[date];
          table.push({
            date: date,
            total: row.total,
            projects: row.projects,
            services: row.services,
            resources: row.resources,
            isCurrent: row.isCurrent
          });
        }
        if (table.length > 0) {
          this.selectRow(table[0]);
        }
        this.table = table;
      }
    });

    controllerScope.__proto__ = new EventController();
  }

  angular.module('ncsaas')
    .controller('DashboardActivityController', [
      'baseControllerClass',
      '$scope',
      '$rootScope',
      '$state',
      'projectsService',
      'alertsService',
      'eventsService',
      'eventStatisticsService',
      'resourcesCountService',
      'currentStateService',
      'priceEstimationService',
      'eventFormatter',
      'alertFormatter',
      'ENV',
      '$window',
      '$q',
      'ncUtils',
      DashboardActivityController]);

  function DashboardActivityController(
    baseControllerClass,
    $scope,
    $rootScope,
    $state,
    projectsService,
    alertsService,
    eventsService,
    eventStatisticsService,
    resourcesCountService,
    currentStateService,
    priceEstimationService,
    eventFormatter,
    alertFormatter,
    ENV,
    $window,
    $q,
    ncUtils) {
    var controllerScope = this;
    var EventController = baseControllerClass.extend({
      showGraph: true,
      currentCustomer: null,
      init:function() {
        this.controllerScope = controllerScope;
        this.cacheTime = ENV.dashboardEventsCacheTime;
        this._super();
        this.activeTab = 'activity';
        this.alertsHelpKey = ENV.dashboardHelp.alertsList.name;
        this.eventsHelpKey = ENV.dashboardHelp.eventsList.name;
        this.chartOptions = {
          responsive: true,
          scaleShowVerticalLines: false,
          scaleShowGridLines: false,
          bezierCurve: false
        };

        this.checkQuotas = 'project';

        this.activate();
        this.resizeControl();
      },
      resizeControl: function() {
        var vm = this;

        var window = angular.element($window);
        window.bind('resize', function() {
          vm.showGraph = false;
          setTimeout(function() {
            vm.showGraph = true;
            $scope.$apply();
          }, 0);
          $scope.$apply();
        });
      },
      selectProject: function(project) {
        var projectCounters, projectEvents;
        if (project) {
          project.selected =! project.selected;
          if (!project.count) {
            projectCounters = this.getProjectCounters(project);
          }
          if ((ENV.featuresVisible || ENV.toBeFeatures.indexOf('eventlog') == -1) && !project.chartData) {
            projectEvents = this.getProjectEvents(project);
          }

          ncUtils.blockElement('activity-content-' + project.uuid, $q.all([projectCounters, projectEvents]));
        }
      },
      activate: function() {
        this.customer_uuid = currentStateService.getCustomerUuid();
        this.getCustomerProjects();
        this.getCustomerAlerts();
        if (ENV.featuresVisible || ENV.toBeFeatures.indexOf('eventlog') == -1) {
          this.getCustomerEvents();
        }
      },
      setProjectPrices: function() {
        priceEstimationService.pageSize = 1000;
        return priceEstimationService.getList();
      },
      getCustomerAlerts: function() {
        var vm = this;
        var promise = currentStateService.getCustomer().then(function(customer) {
          return alertsService.getList({
            aggregate: 'customer',
            uuid: customer.uuid
          }).then(function(response) {
            vm.alerts = response.map(function(alert) {
              alert.html_message = alertFormatter.format(alert);
              alert.icon = alertFormatter.getIcon(alert);
              return alert;
            });
          });
        });
        ncUtils.blockElement('dashboard-alerts-list', promise);
      },
      getCustomerEvents: function() {
        var vm = this;
        var promise = currentStateService.getCustomer().then(function(customer) {
          vm.currentCustomer = customer;
          return eventsService.getList({scope: customer.url}).then(function(response) {
            vm.events = response.map(function(event) {
              event.html_message = eventFormatter.format(event);
              event.icon = eventFormatter.getIcon(event);
              return event;
            });
          });
        });
        ncUtils.blockElement('dashboard-events-list', promise);
      },
      getCustomerProjects: function() {
        var vm = this,
          pricesPromise = this.setProjectPrices(),
          projectsPromise = projectsService.getList();
        $q.all([pricesPromise, projectsPromise]).then(function(result) {
          var projectsPrices = result[0];
          vm.projects = result[1];
          for (var i = 0; i < vm.projects.length; i++) {
            vm.projects[i].selected = false;
            vm.projects[i].cost = 0;
            for (var j=0; j < projectsPrices.length; j++) {
              if (vm.projects[i].url == projectsPrices[j].scope) {
                vm.projects[i].cost += projectsPrices[j].total;
                break;
              }
            }
          }
          vm.selectProject(vm.projects[0]);
        });
      },
      getProjectCounters: function (project) {
        project.count = {};
        project.count.services = project.services.length;
        var users = resourcesCountService.users({'project': project.uuid}).then(function(count) {
          project.count.users = count;
        });
        var resources = resourcesCountService.resources({project_uuid: project.uuid}).then(function(count) {
          project.count.resources = count;
        });
        var query = angular.extend(alertsService.defaultFilter, {aggregate: 'project', uuid: project.uuid});
        var alerts = resourcesCountService.alerts(query).then(function(count) {
          project.count.alerts = count;
        });
        return $q.all([users, resources, alerts]);
      },
      getProjectEvents: function (project) {
        var end = moment.utc().unix();
        var count = 7;
        var start = moment.utc().subtract(count + 1, 'days').unix();

        return eventStatisticsService.getList({
          scope: project.url,
          start: start,
          end: end,
          points_count: count + 1
        }).then(function(response) {
          var labels = [];
          var total = [];
          for (var i = 0; i < response.length; i++) {
            var date = moment.unix(response[i].point);
            var day = date.format('dddd');
            var value = response[i].object.count;
            labels.push(day);
            total.push(value);
          }

          var points = [];
          for (var i = 1; i < total.length; i++) {
            points[i] = total[i] - total[i-1];
          }
          labels.shift();
          points.shift();

          project.chartData = {
            labels: labels,
            datasets: [
              {
                label: 'Events',
                fillColor: 'rgba(220,220,220,0.2)',
                strokeColor: 'rgba(220,220,220,1)',
                pointColor: 'rgba(220,220,220,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,220,220,1)',
                data: points
              }
            ]
          };
        });
      },
      addSupportContract: function(project) {
        $rootScope.$broadcast('adjustCurrentProject', project);
        $state.go('appstore.store', {category: 'support'});
      }
    });

    controllerScope.__proto__ = new EventController();
  }
})();
