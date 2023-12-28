import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Chunk<T> extends BaseIterator<T, Array<T>> {
    private slice: Array<T> = []
    private fused = false

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
        if (this.fused) return Maybe.none()

        this.slice = []
        while (this.slice.length < this._size) {
            const element = this.iterator.next()
            if (element.isNone()) break

            this.slice.push(element.value!)
        }

        if (this.slice.length === 0) {
            this.fused = true
            return Maybe.none()
        }
        return Maybe.some(this.slice)
    }

    async asyncNext(): Promise<Maybe<T[]>> {
        if (this.fused) return Maybe.none()

        const promises: Array<Promise<Maybe<T>>> = []
        while (promises.length < this._size) {
            promises.push(this.iterator.asyncNext())
        }

        // equivalent of (await Promise.all(promises)).filter((m) => m.isSome()).map((m) => m.value!)
        // but in one loop
        this.slice = []
        for (const element of await Promise.all(promises)) {
            if (element.isSome()) this.slice.push(element.value!)
        }

        if (this.slice.length === 0) {
            this.fused = true
            return Maybe.none()
        }
        return Maybe.some(this.slice)
    }

    clone(): Chunk<T> {
        return new Chunk(this.iterator.clone(), this._size)
    }
}
