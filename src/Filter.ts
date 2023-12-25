import type { IteroIterable } from "./types.js"
import BaseIterator from "./BaseIterator.js"
import Maybe from "./Maybe.js"

export default class Filter<T> extends BaseIterator<T> {
    private predicate: (v: T) => boolean

    constructor(iterator: IteroIterable<T>, predicate: (v: T) => boolean) {
        super(iterator)
        this.predicate = predicate
    }

    next(): Maybe<T> {
        const element = this.iterator.next()
        if (element.isNone()) return Maybe.none()

        if (this.predicate(element.value!)) return element

        return this.next()
    }
}
