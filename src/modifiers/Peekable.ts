import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Peekable<T> extends BaseIterator<T> {
    private peeked: Maybe<T> = Maybe.none()

    constructor(private iterator: IteroIterable<T>) {
        super()
    }

    potentialSize(): number {
        return this.iterator.potentialSize?.() ?? -1
    }

    peek(): Maybe<T> {
        if (this.peeked.isNone()) this.peeked = this.iterator.next()

        return this.peeked
    }

    next(): Maybe<T> {
        const element = this.peeked.isSome() ? this.peeked.take() : this.iterator.next()

        return element
    }
}
