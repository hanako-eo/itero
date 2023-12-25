import type { IteroIterable } from "./types.js"
import BaseIterator from "./BaseIterator.js"
import Maybe from "./Maybe.js"

export default class Zip<T1, T2> extends BaseIterator<T1, [T1, T2]> {
    constructor(
        iterator1: IteroIterable<T1>,
        private iterator2: IteroIterable<T2>
    ) {
        super(iterator1)
    }

    next(): Maybe<[T1, T2]> {
        const element1 = this.iterator.next()
        const element2 = this.iterator2.next()

        if (element1.isNone() || element2.isNone()) return Maybe.none()

        return Maybe.some([element1.value!, element2.value!] as const)
    }
}
