import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Fuse<T> extends BaseIterator<T> {
    private fused: boolean

    constructor(private iterator: IteroIterable<T>) {
        super()
        this.fused = false
    }

    next(): Maybe<T> {
        if (this.fused) return Maybe.none()

        const element = this.iterator.next()
        if (element.isNone()) this.fused = true

        return element
    }
}
