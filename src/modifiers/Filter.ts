import type { IteroIterable } from "../types.js"
import BaseIterator from "./BaseIterator.js"
import Maybe from "../Maybe.js"

export default class Filter<T> extends BaseIterator<T> {
    constructor(
        private iterator: IteroIterable<T>,
        private predicate: (v: T) => boolean
    ) {
        super()
    }

    potentialSize(): number {
        return this.iterator.potentialSize?.() ?? -1
    }

    next(): Maybe<T> {
        const element = this.iterator.next()
        if (element.isNone()) return Maybe.none()

        if (this.predicate(element.value!)) return element

        return this.next()
    }

    async asyncNext(): Promise<Maybe<T>> {
        const element = await this.iterator.asyncNext()
        if (element.isNone()) return Maybe.none()

        if (this.predicate(element.value!)) return element

        return this.asyncNext()
    }

    clone(): Filter<T> {
        return new Filter(this.iterator.clone(), this.predicate)
    }
}
