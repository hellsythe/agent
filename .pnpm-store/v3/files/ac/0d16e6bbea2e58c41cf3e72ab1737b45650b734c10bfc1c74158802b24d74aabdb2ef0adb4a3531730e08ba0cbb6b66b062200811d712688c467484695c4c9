"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_os_1 = require("node:os");
const strategy_1 = require("./strategy");
class ApplicationHostnameStrategy extends strategy_1.Strategy {
    hostname;
    constructor() {
        super('applicationHostname');
        this.hostname = (process.env.HOSTNAME || (0, node_os_1.hostname)() || 'undefined').toLowerCase();
    }
    isEnabled(parameters) {
        if (!parameters.hostNames) {
            return false;
        }
        return parameters.hostNames
            .toLowerCase()
            .split(/\s*,\s*/)
            .includes(this.hostname);
    }
}
exports.default = ApplicationHostnameStrategy;
//# sourceMappingURL=application-hostname-strategy.js.map