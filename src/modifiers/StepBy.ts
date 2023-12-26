import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class StepBy<T> extends BaseIterator<T> {
    constructor(
        iterator: IteroIterable<T>,
        private _step: number
    ) {
        super(iterator)
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
}
