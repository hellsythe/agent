"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strategy_1 = require("./strategy");
class GradualRolloutRandomStrategy extends strategy_1.Strategy {
    randomGenerator = () => Math.floor(Math.random() * 100) + 1;
    constructor(randomGenerator) {
        super('gradualRolloutRandom');
        this.randomGenerator = randomGenerator || this.randomGenerator;
    }
    isEnabled(parameters, _context) {
        const percentage = Number(parameters.percentage);
        const random = this.randomGenerator();
        return percentage >= random;
    }
}
exports.default = GradualRolloutRandomStrategy;
//# sourceMappingURL=gradual-rollout-random.js.map