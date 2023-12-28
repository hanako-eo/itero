import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Window<T> extends BaseIterator<T, Array<T>> {
    private slice: Array<T> = []

    constructor(
        private iterator: IteroIterable<T>,
        private _size: number
    ) {
        super()
    }

    potentialSize(): number {
        return this.iterator.potentialSize?.() ?? -1
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

    async asyncNext(): Promise<Maybe<Array<T>>> {
        this.slice.shift()
        const promises: Array<Promise<Maybe<T>>> = []
        while (this.slice.length + promises.length < this._size) {
            const element = this.iterator.asyncNext()

            promises.push(element)
        }

        // equivalent of (await Promise.all(promises)).filter((m) => m.isSome()).map((m) => m.value!)
        // but in one loop
        for (const element of await Promise.all(promises)) {
            if (element.isSome()) this.slice.push(element.value!)
        }

        return Maybe.some(this.slice)
    }

    clone(): Window<T> {
        return new Window(this.iterator.clone(), this._size)
    }
}
