import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Fuse<T> extends BaseIterator<T> {
    private fused = false

    constructor(private iterator: IteroIterable<T>) {
        super()
    }

    potentialSize(): number {
        return this.iterator.potentialSize?.() ?? -1
    }

    next(): Maybe<T> {
        if (this.fused) return Maybe.none()

        const element = this.iterator.next()
        if (element.isNone()) this.fused = true

        return element
    }

    async asyncNext(): Promise<Maybe<T>> {
        if (this.fused) return Maybe.none()

        const element = await this.iterator.asyncNext()
        if (element.isNone()) this.fused = true

        return element
    }

    clone(): Fuse<T> {
        return new Fuse(this.iterator.clone())
    }
}
