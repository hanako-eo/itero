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

    next(): Maybe<U> {
        return this.iterator.next().map(this.callback)
    }
}
