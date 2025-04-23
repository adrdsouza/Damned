import { Router } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import SezzleProviderService from "./services/sezzle-provider";
import webhookRoutes from "./api/routes/hooks";

export default {
  load: function(container, options) {
    // Register our payment service
    container.registerService({ 
      sezzleProvider: (container) => new SezzleProviderService({}, options)
    });

    const router = Router();
    const corsOptions = {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    };

    router.use(cors(corsOptions));
    router.use(bodyParser.json());

    webhookRoutes(router);

    return router;
  },
  service: SezzleProviderService
};