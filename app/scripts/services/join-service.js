'use strict';


(function () {
  angular.module('ncsaas')
    .service('joinService', [
      '$q',
      'baseServiceClass',
      'servicesService',
      'digitalOceanService',
      joinService
    ]);

  function joinService(
    $q,
    baseServiceClass,
    servicesService,
    digitalOceanService
  ) {
    var ServiceClass = baseServiceClass.extend({
      providers: [servicesService, digitalOceanService],

      getList: function(filter) {
        var self = this;
        var promises = [];
        for (var i = 0; i < this.providers.length; i++) {
          var promise = this.providers[i].getList(filter);
          promises.push(promise);
        };
        var deferred = $q.defer();
        $q.all(promises).then(function(responses) {
          var services = self.flattenList(responses);
          for (var i = 0; i < services.length; i++) {
            self.setDescription(services[i]);
          }
          deferred.resolve(services);
        });
        return deferred.promise;
      },

      $get: function(uuid) {
        var self = this;
        var deferred = $q.defer();
        for (var i = 0; i < this.providers.length; i++) {
          this.providers[i].$get(uuid).then(function(response){
            if (response){
              self.setDescription(response);
              deferred.resolve(response);
            }
          });
        };
        return deferred.promise;
      },

      flattenList: function(items) {
        var result = [];
        for (var i = 0; i < items.length; i++) {
          for (var j = 0; j < items[i].length; j++) {
            result.push(items[i][j]);
          }
        }
        return result;
      },

      setDescription: function(service) {
        if (service.url.indexOf('digitalocean') > -1) {
          service.provider = 'DigitalOcean';
          service.icon = '/static/images/icons/icon_digitalocean_small.png';
        } else if (service.url.indexOf('cloud') > -1) {
          service.provider = 'OpenStack';
          service.icon = '/static/images/icons/icon_openstack_small.png';
        }
      }
    });
    return new ServiceClass();
  }
})();
