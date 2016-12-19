(function() {
  angular.module('ncsaas')
    .controller('CustomerAlertsListController', [
      'BaseAlertsListController',
      'currentStateService',
      CustomerAlertsListController]);

  function CustomerAlertsListController(BaseAlertsListController, currentStateService) {
    var controllerScope = this;
    var controllerClass = BaseAlertsListController.extend({
      init: function() {
        this.controllerScope = controllerScope;
        this._super();
      },
      getList: function(filter) {
        var vm = this;
        var fn = this._super.bind(vm);
        filter = filter || {};
        return currentStateService.getCustomer().then(function(customer) {
          vm.service.defaultFilter.aggregate = 'customer';
          vm.service.defaultFilter.uuid = customer.uuid;
          return fn(filter);
        })
      }
    });

    controllerScope.__proto__ = new controllerClass();
  }
})();

(function() {
  angular.module('ncsaas')
      .controller('CustomerAgreementsTabController', [
        'baseControllerListClass',
        'agreementsService',
        'ENTITYLISTFIELDTYPES',
        CustomerAgreementsTabController
      ]);

  function CustomerAgreementsTabController(
    baseControllerListClass,
    agreementsService,
    ENTITYLISTFIELDTYPES) {
    var controllerScope = this;
    var AgreementsController = baseControllerListClass.extend({
      init: function() {
        this.service = agreementsService;
        this._super();

        this.entityOptions = {
          entityData: {
            noDataText: 'No plans yet',
            hideTableHead: false,
            rowTemplateUrl: 'views/payment/agreement.html'
          },
          list: [
            {
              type: ENTITYLISTFIELDTYPES.colorState,
              propertyName: 'state',
              className: 'visual-status',
              getClass: function(state) {
                if (state == 'active') {
                  return 'status-circle online';
                } else {
                  return 'status-circle offline';
                }
              }
            },
            {
              name: 'Plan name',
              propertyName: 'plan_name',
            },
            {
              name: 'Date',
              propertyName: 'created',
              type: ENTITYLISTFIELDTYPES.dateShort,
            },
            {
              name: 'Monthly price',
              propertyName: 'plan_price',
              type: ENTITYLISTFIELDTYPES.currency
            }
          ]
        };
      }
    });

    controllerScope.__proto__ = new AgreementsController();
  }

})();


(function() {
  angular.module('ncsaas')
      .controller('CustomerPaymentsTabController', [
        'baseControllerListClass',
        'paymentsService',
        'ENTITYLISTFIELDTYPES',
        'ENV',
        CustomerPaymentsTabController
      ]);

  function CustomerPaymentsTabController(
    baseControllerListClass,
    paymentsService,
    ENTITYLISTFIELDTYPES,
    ENV) {
    var controllerScope = this;
    var PaymentsController = baseControllerListClass.extend({
      defaultErrorMessage: ENV.defaultErrorMessage,
      init: function() {
        this.service = paymentsService;
        this._super();

        this.entityOptions = {
          entityData: {
            noDataText: 'No payments yet',
            hideTableHead: false,
            rowTemplateUrl: 'views/payment/row.html',
            expandable: true
          },
          list: [
            {
              type: ENTITYLISTFIELDTYPES.colorState,
              propertyName: 'state',
              className: 'visual-status',
              getClass: function(state) {
                var classes = {
                  Erred: 'erred',
                  Approved: 'online',
                  Created: 'processing',
                  Cancelled: 'offline'
                };
                var cls = classes[state];
                if (cls == 'processing') {
                  return 'icon fa-refresh fa-spin';
                } else {
                  return 'status-circle ' + cls;
                }
              }
            },
            {
              name: 'Type',
              propertyName: 'type'
            },
            {
              name: 'Date',
              propertyName: 'created',
              type: ENTITYLISTFIELDTYPES.dateShort,
            },
            {
              name: 'Amount',
              propertyName: 'amount',
              type: ENTITYLISTFIELDTYPES.currency
            }
          ]
        };
        this.expandableOptions = [
          {
            isList: false,
            addItemBlock: false,
            viewType: 'payment'
          }
        ];
      },
      afterGetList: function() {
        this._super();
        angular.forEach(this.list, function(payment) {
          payment.type = 'PayPal';
        });
      }
    });

    controllerScope.__proto__ = new PaymentsController();
  }

})();

(function() {
  angular.module('ncsaas')
    .controller('CustomerDeleteTabController', [
      'baseControllerClass',
      'customersService',
      'paymentDetailsService',
      'usersService',
      'currentStateService',
      '$uibModal',
      '$state',
      '$q',
      'ENV',
      'ISSUE_IDS',
      CustomerDeleteTabController
    ]);

  function CustomerDeleteTabController(
    baseControllerClass,
    customersService,
    paymentDetailsService,
    usersService,
    currentStateService,
    $uibModal,
    $state,
    $q,
    ENV,
    ISSUE_IDS
  ) {
    var controllerScope = this;
    var DeleteController = baseControllerClass.extend({
      init: function() {
        this.controllerScope = controllerScope;
        this._super();
        this.paymentDetails = null;
        this.loadInitial();
      },
      loadInitial: function() {
        var vm = this;
        vm.loading = true;
        return currentStateService.getCustomer().then(function(customer) {
          vm.customer = customer;
          vm.getPaymentDetails();
          return vm.checkCanRemoveCustomer(customer).then(function(result) {
            vm.canRemoveCustomer = result;
          });
        }).finally(function() {
          vm.loading = false;
        });
      },
      getPaymentDetails: function() {
        var vm = this;
        paymentDetailsService.getList({
          customer_uuid: vm.customer.uuid
        }).then(function(result) {
          if (result) {
            vm.paymentDetails = result[0];
          }
        });
      },
      checkCanRemoveCustomer: function(customer) {
        return usersService.getCurrentUser().then(function(user) {
          if (user.is_staff) {
            return $q.when(true);
          }
          for (var i = 0; i < customer.owners.length; i++) {
            if (user.uuid === customer.owners[i].uuid) {
              return $q.when(ENV.ownerCanManageCustomer);
            }
          }
          return $q.when(false);
        });
      },
      removeCustomer: function() {
        var vm = this;
        if (this.customer.projects.length > 0) {
          return $uibModal.open({
            component: 'issueCreateDialog',
            resolve: {
              issue: () => ({
                customer: vm.customer,
                type: ISSUE_IDS.CHANGE_REQUEST,
                summary: 'Customer removal'
              }),
              options: {
                title: 'Customer removal',
                hideTitle: true,
                descriptionLabel: 'Reason',
                descriptionPlaceholder: 'Why do you need to remove customer with existing projects?',
                submitTitle: 'Request removal'
              }
            }
          });
        }
        var confirmDelete = confirm('Confirm deletion?');
          if (confirmDelete) {
          currentStateService.setCustomer(null);
          this.customer.$delete().then(function(instance) {
            customersService.clearAllCacheForCurrentEndpoint();
            customersService.getPersonalOrFirstCustomer(instance.name).then(function(customer) {
              currentStateService.setCustomer(customer);
              $state.go('organization.details', {uuid: customer.uuid});
            });
          }, function() {
            currentStateService.setCustomer(vm.customer);
          });
        }
      }
    });

    controllerScope.__proto__ = new DeleteController();
  }

})();

(function() {
  angular.module('ncsaas')
    .controller('CustomerSizingTabController', [
      'baseControllerClass',
      CustomerSizingTabController
    ]);

  function CustomerSizingTabController(
    baseControllerClass
  ) {
    var controllerScope = this;
    var SizingController = baseControllerClass.extend({
      init: function() {
        this.controllerScope = controllerScope;
        this._super();
        this.list = [
          {
            name: 'Monator offer',
            email: 'john@monator.com',
            views: [],
            provider: {}
          },
          {
            name: 'Webapp for Monster Inc.',
            email: 'john@monator.com',
            views: [],
            provider: {}
          },
          {
            name: 'Webapp for Monster Inc.',
            email: 'john@monator.com',
            views: [],
            provider: {}
          }
        ];
      },
      calculate: function(item) {
        var price = 0;
        if (item.provider.price) {
          item.views.forEach(function(view) {
            price += view.count * item.provider.price;
          });
        }
        return price;
      }
    });

    controllerScope.__proto__ = new SizingController();
  }

})();
