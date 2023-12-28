import { BaseIterator, Maybe } from "./index.js"

export default class IterableIterator<T> extends BaseIterator<T> {
    private iterator: Iterator<T>

    constructor(private iterable: Iterable<T>) {
        super()
        this.iterator = iterable[Symbol.iterator]()
    }

    next(): Maybe<T> {
        return Maybe.fromIterator(this.iterator.next())
    }

    asyncNext(): Promise<Maybe<T>> {
        // TODO: AsyncIterator
        throw new TypeError(
            "You cannot iterate asynchronously on a non-asynchronous iterable. Please use AsyncIterator instead."
        )
    }

    clone(): IterableIterator<T> {
        return new IterableIterator(this.iterable)
    }
}
