import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Window<T> extends BaseIterator<T, Array<T>> {
    private slice: Array<T> = []

    constructor(
        iterator: IteroIterable<T>,
        private _size: number
    ) {
        super(iterator)
    }

    size() {
        return this._size
    }

    next(): Maybe<Array<T>> {
        this.slice.shift()
        while (this.slice.length < this._size) {
            const element = this.iterator.next()
            if (element.isNone()) return Maybe.none()

            this.slice.push(element.value!)
        }

        return Maybe.some(this.slice)
    }
}
