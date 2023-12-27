import type { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"
import Maybe from "../Maybe.js"

export default class Map<T, U> extends BaseIterator<T, U> {
    constructor(
        private iterator: IteroIterable<T>,
        private callback: (v: T) => U
    ) {
        super()
    }

    potentialSize(): number {
        return this.iterator.potentialSize?.() ?? -1
    }

    next(): Maybe<U> {
        return this.iterator.next().map(this.callback)
    }
}
