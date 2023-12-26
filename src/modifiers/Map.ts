import type { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"
import Maybe from "../Maybe.js"

export default class Map<T, U> extends BaseIterator<T, U> {
    private callback: (v: T) => U

    constructor(iterator: IteroIterable<T>, callback: (v: T) => U) {
        super(iterator)
        this.callback = callback
    }

    next(): Maybe<U> {
        return this.iterator.next().map(this.callback)
    }
}
