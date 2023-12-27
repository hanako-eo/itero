import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class StepBy<T> extends BaseIterator<T> {
    constructor(
        private iterator: IteroIterable<T>,
        private _step: number
    ) {
        super()
    }

    potentialSize(): number {
        const parentPotentialSize = this.iterator.potentialSize?.() ?? -1
        if (parentPotentialSize === -1) return -1
        return Math.floor(parentPotentialSize / this._step)
    }

    step() {
        return this._step
    }

    next(): Maybe<T> {
        const element = this.iterator.next()
        for (let i = 0; i < this._step - 1; i++) {
            if (this.iterator.next().isNone()) break
        }
        return element
    }

    clone(): StepBy<T> {
        return new StepBy(this.iterator.clone(), this._step)
    }
}
