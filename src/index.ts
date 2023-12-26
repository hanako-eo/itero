import type { IteroIterable } from "./types.js"
import { BaseIterator, NoopIterator, Range } from "./modifiers/index.js"
import Maybe from "./Maybe.js"

export default class IteroIterator<T> extends BaseIterator<T> {
    private iterator: IteroIterable<T> | Iterator<T>

    static fromIterable<T>(iter: Iterable<T> | IteroIterable<T>): IteroIterator<T> {
        return new IteroIterator(iter)
    }

    constructor(iter: Iterable<T> | IteroIterable<T>) {
        super()
        this.iterator = Symbol.iterator in iter ? iter[Symbol.iterator]() : iter
    }

    next(): Maybe<T> {
        const element = this.iterator.next()
        if (element instanceof Maybe) return element
        return Maybe.fromIterator(element)
    }
}

export type * from "./types.js"
export { BaseIterator, NoopIterator, Range, Maybe }
