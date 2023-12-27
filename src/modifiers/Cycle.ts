import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Cycle<T> extends BaseIterator<T> {
    #cycle: Array<Maybe<T>> = []
    private consumed = false
    private i = 0

    constructor(private iterator: IteroIterable<T>) {
        super()
    }

    potentialSize(): number {
        return Infinity
    }

    next(): Maybe<T> {
        let element = Maybe.none<T>()

        if (!this.consumed) {
            element = this.iterator.next()

            if (element.isSome()) this.#cycle.push(element)
            else this.consumed = true
        }

        if (this.consumed && this.#cycle.length > 0) {
            element = this.#cycle[this.i]
            this.i = (this.i + 1) % this.#cycle.length
        }

        return element
    }

    clone(): Cycle<T> {
        return new Cycle(this.iterator.clone())
    }
}
