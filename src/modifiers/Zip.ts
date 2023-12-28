import type { IteroIterable } from "../types.js"
import BaseIterator from "./BaseIterator.js"
import Maybe from "../Maybe.js"

export default class Zip<T1, T2> extends BaseIterator<T1, [T1, T2]> {
    constructor(
        private iterator1: IteroIterable<T1>,
        private iterator2: IteroIterable<T2>
    ) {
        super()
    }

    potentialSize(): number {
        const potentialSize1 = this.iterator1.potentialSize?.() ?? -1
        const potentialSize2 = this.iterator2.potentialSize?.() ?? -1
        return Math.min(potentialSize1, potentialSize2)
    }

    next(): Maybe<[T1, T2]> {
        const element1 = this.iterator1.next()
        const element2 = this.iterator2.next()

        if (element1.isNone() || element2.isNone()) return Maybe.none()

        return Maybe.some([element1.value!, element2.value!] as const)
    }

    async asyncNext(): Promise<Maybe<[T1, T2]>> {
        const elements = await Promise.all([this.iterator1.asyncNext(), this.iterator2.asyncNext()])

        if (elements[0].isNone() || elements[1].isNone()) return Maybe.none()

        return Maybe.some([elements[0].value!, elements[1].value!] as const)
    }

    clone(): Zip<T1, T2> {
        return new Zip(this.iterator1.clone(), this.iterator2.clone())
    }
}
