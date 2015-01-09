import angular from 'angular';

export function route(module, src){
  var $inject = ['$q'];

  var Route = function ($q) {
    var def = $q.defer();

    System.import(src).then(loaded => { 
      module.register(loaded.loginModule)
      def.resolve();
    });

    return def.promise;
  };

  Route.$inject = $inject;

  return Route;
};

export function register(app){
  var $inject = ['$controllerProvider', '$provide', '$compileProvider', '$filterProvider'];

  var RegisterConfig = function ($controllerProvider, $provide, $compileProvider, $filterProvider) {
    var providers = {
      $controllerProvider: $controllerProvider,
      $provide: $provide,
      $compileProvider: $compileProvider,
      $filterProvider: $filterProvider
    };

    app.register = function (module) {
      module.requires.forEach(function (moduleName) {
        app.register(angular.module(moduleName));
      });

      module._invokeQueue.reverse().forEach(function (invokeArgs) {
        var provider = providers[invokeArgs[0]];
        provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
      });

      return this;
    };
  };

  RegisterConfig.$inject = $inject;

  return RegisterConfig;
};