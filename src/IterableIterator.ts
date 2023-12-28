import { BaseIterator, IteratorType, Maybe } from "./index.js"

export default class IterableIterator<T> extends BaseIterator<T> {
    private iterator: IteratorType<typeof this.iterable>

    constructor(private iterable: Iterable<T>) {
        super()
        this.iterator = iterable[Symbol.iterator]()
    }

    next(): Maybe<T> {
        return Maybe.fromIterator(this.iterator.next())
    }

    asyncNext(): Promise<Maybe<T>> {
        throw new TypeError(
            "You cannot iterate asynchronously on a non-asynchronous iterable. Please use AsyncIterator instead."
        )
    }

    clone(): IterableIterator<T> {
        return new IterableIterator(this.iterable)
    }
}
