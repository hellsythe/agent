"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseApiResponse = void 0;
const parseApiResponse = (data) => {
    if (typeof data !== 'object' || data === null) {
        throw new Error(`Invalid API response: ${JSON.stringify(data, null, 2)}`);
    }
    if ('events' in data && Array.isArray(data.events)) {
        return { ...data, type: 'delta' };
    }
    else if ('features' in data && Array.isArray(data.features)) {
        return { ...data, type: 'full' };
    }
    throw new Error(`Client features was neither a delta nor a full response: ${JSON.stringify(data, null, 2)}`);
};
exports.parseApiResponse = parseApiResponse;
//# sourceMappingURL=feature.js.map