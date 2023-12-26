import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class ChunkExact<T> extends BaseIterator<T, Array<T>> {
    private slice: Array<T> = []

    constructor(
        private iterator: IteroIterable<T>,
        private _size: number
    ) {
        super()
    }

    size() {
        return this._size
    }

    rest(): Array<T> {
        return this.slice
    }

    next(): Maybe<Array<T>> {
        let element = this.iterator.next()
        if (element.isNone()) return Maybe.none()
        this.slice = [element.value!]

        while (this.slice.length < this._size) {
            element = this.iterator.next()
            if (element.isNone()) return Maybe.none()

            this.slice.push(element.value!)
        }

        return Maybe.some(this.slice)
    }
}
