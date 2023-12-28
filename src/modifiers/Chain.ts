import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Chain<T> extends BaseIterator<T> {
    constructor(
        private iterator1: IteroIterable<T>,
        private iterator2: IteroIterable<T>
    ) {
        super()
    }

    potentialSize(): number {
        const parentPotentialSize1 = this.iterator1.potentialSize?.() ?? -1
        const parentPotentialSize2 = this.iterator2.potentialSize?.() ?? -1
        if (parentPotentialSize1 === -1) return parentPotentialSize2
        if (parentPotentialSize2 === -1) return parentPotentialSize1
        return parentPotentialSize1 + parentPotentialSize2
    }

    next(): Maybe<T> {
        let element = this.iterator1.next()
        if (element.isNone()) element = this.iterator2.next()
        return element
    }

    async asyncNext(): Promise<Maybe<T>> {
        let element = await this.iterator1.asyncNext()
        if (element.isNone()) element = await this.iterator2.next()
        return element
    }

    clone(): Chain<T> {
        return new Chain(this.iterator1.clone(), this.iterator2.clone())
    }
}
