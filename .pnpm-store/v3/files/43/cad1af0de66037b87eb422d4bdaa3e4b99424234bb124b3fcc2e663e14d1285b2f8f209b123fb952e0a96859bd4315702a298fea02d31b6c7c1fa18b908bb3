"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildImpactMetricContext = void 0;
const environment_resolver_1 = require("./environment-resolver");
const buildImpactMetricContext = (customHeaders, staticContext) => {
    const metricsContext = { ...staticContext };
    if (customHeaders) {
        const environment = (0, environment_resolver_1.extractEnvironmentFromCustomHeaders)(customHeaders);
        if (environment) {
            metricsContext.environment = environment;
        }
    }
    return metricsContext;
};
exports.buildImpactMetricContext = buildImpactMetricContext;
//# sourceMappingURL=context.js.map