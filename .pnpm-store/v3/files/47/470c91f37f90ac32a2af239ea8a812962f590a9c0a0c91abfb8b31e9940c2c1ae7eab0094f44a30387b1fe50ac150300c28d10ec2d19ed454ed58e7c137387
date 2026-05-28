"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultVariant = exports.PayloadType = void 0;
exports.getDefaultVariant = getDefaultVariant;
exports.selectVariantDefinition = selectVariantDefinition;
exports.selectVariant = selectVariant;
const helpers_1 = require("./helpers");
const util_1 = require("./strategy/util");
var PayloadType;
(function (PayloadType) {
    PayloadType["STRING"] = "string";
    PayloadType["JSON"] = "json";
    PayloadType["CSV"] = "csv";
    PayloadType["NUMBER"] = "number";
})(PayloadType || (exports.PayloadType = PayloadType = {}));
exports.defaultVariant = {
    name: 'disabled',
    enabled: false,
    feature_enabled: false,
};
/**
 * @deprecated Use {@link defaultVariant} const instead
 */
function getDefaultVariant() {
    return exports.defaultVariant;
}
function randomString() {
    return String(Math.round(Math.random() * 100000));
}
const stickinessSelectors = ['userId', 'sessionId', 'remoteAddress'];
function getSeed(context, stickiness = 'default') {
    if (stickiness !== 'default') {
        const value = (0, helpers_1.resolveContextValue)(context, stickiness);
        return value ? value.toString() : randomString();
    }
    let result;
    stickinessSelectors.some((key) => {
        const value = context[key];
        if (typeof value === 'string' && value !== '') {
            result = value;
            return true;
        }
        return false;
    });
    return result || randomString();
}
function overrideMatchesContext(context) {
    return (o) => o.values.some((value) => value === (0, helpers_1.resolveContextValue)(context, o.contextName));
}
function findOverride(variants, context) {
    return variants
        .filter((variant) => variant.overrides)
        .find((variant) => variant.overrides?.some(overrideMatchesContext(context)));
}
function selectVariantDefinition(groupId, stickiness, variants, context) {
    const totalWeight = variants.reduce((acc, v) => acc + v.weight, 0);
    if (totalWeight <= 0) {
        return null;
    }
    const variantOverride = findOverride(variants, context);
    if (variantOverride) {
        return variantOverride;
    }
    const target = (0, util_1.normalizedVariantValue)(getSeed(context, stickiness), groupId, totalWeight);
    let counter = 0;
    const variant = variants.find((v) => {
        if (v.weight === 0) {
            return undefined;
        }
        counter += v.weight;
        if (counter < target) {
            return undefined;
        }
        return v;
    });
    return variant || null;
}
function selectVariant(feature, context) {
    const stickiness = feature.variants?.[0]?.stickiness ?? undefined;
    return selectVariantDefinition(feature.name, stickiness, feature.variants || [], context);
}
//# sourceMappingURL=variant.js.map