import Maybe from "./Maybe.js"

export interface IteroIterable<T> {
    next(): Maybe<T>
}

export default class IteroIterator<T> implements IteroIterable<T> {
    #iterator: IteroIterable<T> | Iterator<T>

    static fromIterable<T>(iter: Iterable<T> | IteroIterable<T>): IteroIterator<T> {
        return new IteroIterator(iter)
    }

    [Symbol.iterator](): Iterator<T> {
        return {
            next: () => {
                return this.next().toIterator()
            }
        }
    }

    constructor(iter: Iterable<T> | IteroIterable<T>) {
        this.#iterator = Symbol.iterator in iter ? iter[Symbol.iterator]() : iter
    }

    next(): Maybe<T> {
        const element = this.#iterator.next()
        if (element instanceof Maybe) return element
        return Maybe.fromIterator(element)
    }
}
