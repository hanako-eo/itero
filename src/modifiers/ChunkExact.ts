import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class ChunkExact<T> extends BaseIterator<Array<T>> {
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
        this.slice = []

        while (this.slice.length < this._size) {
            const element = this.iterator.next()
            if (element.isNone()) return Maybe.none()

            this.slice.push(element.value!)
        }

        return Maybe.some(this.slice)
    }

    async asyncNext(): Promise<Maybe<T[]>> {
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

        if (this.slice.length !== this._size) return Maybe.none()
        return Maybe.some(this.slice)
    }

    clone(): ChunkExact<T> {
        return new ChunkExact(this.iterator.clone(), this._size)
    }
}
