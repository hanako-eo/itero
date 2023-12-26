import type { IteroIterable } from "./types.js"
import { BaseIterator, Range } from "./modifiers/index.js"
import Maybe from "./Maybe.js"

export default class IteroIterator<T> extends BaseIterator<T> {
    static fromIterable<T>(iter: Iterable<T> | IteroIterable<T>): IteroIterator<T> {
        return new IteroIterator(iter)
    }

    constructor(iter: Iterable<T> | IteroIterable<T>) {
        const iterator = Symbol.iterator in iter ? iter[Symbol.iterator]() : iter
        super({
            next() {
                const element = iterator.next()
                if (element instanceof Maybe) return element
                return Maybe.fromIterator(element)
            }
        })
    }

    next(): Maybe<T> {
        return this.iterator.next()
    }
}

export type * from "./types.js"
export { BaseIterator, Range, Maybe }
