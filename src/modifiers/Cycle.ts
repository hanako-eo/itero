import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Cycle<T> extends BaseIterator<T> {
    #cycle: Array<Maybe<T>> = []
    private i = 0

    constructor(private iterator: IteroIterable<T> | null) {
        super()
    }

    potentialSize(): number {
        return Infinity
    }

    next(): Maybe<T> {
        let element = Maybe.none<T>()

        if (this.iterator !== null) {
            element = this.iterator.next()

            if (element.isSome()) this.#cycle.push(element)
            else this.iterator = null
        }

        if (this.iterator === null && this.#cycle.length > 0) {
            element = this.#cycle[this.i]
            this.i = (this.i + 1) % this.#cycle.length
        }

        return element
    }
}
