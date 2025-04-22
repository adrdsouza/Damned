import CodProviderService from "./services/cod-provider";

export default {
  load: function(container, options) {
    // Register our payment service
    container.registerService({ 
      codProvider: (container) => new CodProviderService({}, options)
    });
  },
  service: CodProviderService
};