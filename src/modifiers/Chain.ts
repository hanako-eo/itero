import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Chain<T> extends BaseIterator<T> {
    private fused: boolean

    constructor(
        private iterator1: IteroIterable<T>,
        private iterator2: IteroIterable<T>
    ) {
        super()

        this.fused = false
    }

    potentialSize(): number {
        const parentPotentialSize1 = this.iterator1.potentialSize?.() ?? -1
        const parentPotentialSize2 = this.iterator2.potentialSize?.() ?? -1
        if (parentPotentialSize1 === -1) return parentPotentialSize2
        if (parentPotentialSize2 === -1) return parentPotentialSize1
        return parentPotentialSize1 + parentPotentialSize2
    }

    next(): Maybe<T> {
        let element = this.fused ? this.iterator2.next() : this.iterator1.next()
        if (element.isNone() && !this.fused) {
            this.fused = true
            element = this.iterator2.next()
        }
        return element
    }

    clone(): Chain<T> {
        return new Chain(this.iterator1.clone(), this.iterator2.clone())
    }
}
