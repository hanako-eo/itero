import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Scan<A, I, O = I> extends BaseIterator<I, O> {
    private accumulator: A

    constructor(
        private iterator: IteroIterable<I>,
        private initialAccumulator: A,
        private callback: (accumulator: A, value: I) => [A, Maybe<O>]
    ) {
        super()

        this.accumulator = initialAccumulator
    }

    potentialSize(): number {
        return this.iterator.potentialSize?.() ?? -1
    }

    accumulated() {
        return this.accumulator
    }

    next(): Maybe<O> {
        const element = this.iterator.next()
        if (element.isNone()) return Maybe.none()

        const [accumulator, scanned] = this.callback(this.accumulator, element.value!)
        this.accumulator = accumulator

        return scanned
    }

    clone(): Scan<A, I, O> {
        return new Scan(this.iterator.clone(), this.initialAccumulator, this.callback)
    }
}
