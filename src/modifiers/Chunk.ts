import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Chunk<T> extends BaseIterator<T, Array<T>> {
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
        return Math.ceil(parentPotentialSize / this._size)
    }

    size() {
        return this._size
    }

    next(): Maybe<Array<T>> {
        this.slice = []
        while (this.slice.length < this._size) {
            const element = this.iterator.next()
            if (element.isNone()) break

            this.slice.push(element.value!)
        }

        if (this.slice.length === 0) return Maybe.none()
        return Maybe.some(this.slice)
    }

    async asyncNext(): Promise<Maybe<T[]>> {
        this.slice = []
        while (this.slice.length < this._size) {
            const element = await this.iterator.asyncNext()
            if (element.isNone()) break

            this.slice.push(element.value!)
        }

        if (this.slice.length === 0) return Maybe.none()
        return Maybe.some(this.slice)
    }

    clone(): Chunk<T> {
        return new Chunk(this.iterator.clone(), this._size)
    }
}
