import { BaseIterator, Maybe } from "./index.js"
import { IteroIterable } from "./types.js"

export default class IteroIterableIterator<T> extends BaseIterator<T> {
    constructor(iterable: IteroIterable<T>) {
        super()

        this.next = iterable.next.bind(iterable)
        this.nth = iterable.nth.bind(iterable)
        this.asyncNext = iterable.asyncNext.bind(iterable)
        this.asyncNth = iterable.asyncNth.bind(iterable)
        this.clone = iterable.clone.bind(iterable) as () => BaseIterator<T>
    }

    // Creation of these methods to avoid error TS18052
    // but javascript will always use the methods defined in the constructor
    next(): Maybe<T> {
        throw new Error("Method not implemented.")
    }

    asyncNext(): Promise<Maybe<T>> {
        throw new Error("Method not implemented.")
    }

    clone(): BaseIterator<T> {
        throw new Error("Method not implemented.")
    }
}
