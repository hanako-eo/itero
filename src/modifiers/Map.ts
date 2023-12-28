import type { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"
import Maybe from "../Maybe.js"

export default class Map<T, U> extends BaseIterator<U> {
    constructor(
        private iterator: IteroIterable<T>,
        private callback: (v: T) => U
    ) {
        super()
    }

    potentialSize(): number {
        return this.iterator.potentialSize?.() ?? -1
    }

    next(): Maybe<U> {
        return this.iterator.next().map(this.callback)
    }

    async asyncNext(): Promise<Maybe<U>> {
        return (await this.iterator.asyncNext()).map(this.callback)
    }

    clone(): Map<T, U> {
        return new Map(this.iterator.clone(), this.callback)
    }
}
