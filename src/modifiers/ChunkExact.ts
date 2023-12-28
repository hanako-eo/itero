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

    potentialSize(): number {
        const parentPotentialSize = this.iterator.potentialSize?.() ?? -1
        if (parentPotentialSize === -1) return -1
        return Math.floor(parentPotentialSize / this._size)
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

    async asyncNext(): Promise<Maybe<T[]>> {
        let element = await this.iterator.asyncNext()
        if (element.isNone()) return Maybe.none()
        this.slice = [element.value!]

        while (this.slice.length < this._size) {
            element = await this.iterator.asyncNext()
            if (element.isNone()) return Maybe.none()

            this.slice.push(element.value!)
        }

        return Maybe.some(this.slice)
    }

    clone(): ChunkExact<T> {
        return new ChunkExact(this.iterator.clone(), this._size)
    }
}
