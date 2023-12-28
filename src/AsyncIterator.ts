import { AsyncIteratorType, BaseIterator, Maybe } from "./index.js"

export default class AsyncIterator<T> extends BaseIterator<T> {
    private iterator: AsyncIteratorType<typeof this.iterable>

    constructor(private iterable: AsyncIterable<T>) {
        super()
        this.iterator = iterable[Symbol.asyncIterator]()
    }

    next(): Maybe<T> {
        throw new TypeError(
            "You cannot iterate synchronously on a non-synchronous iterable. Please use IterableIterator instead."
        )
    }

    async asyncNext(): Promise<Maybe<T>> {
        return Maybe.fromIterator(await this.iterator.next())
    }

    clone(): AsyncIterator<T> {
        return new AsyncIterator(this.iterable)
    }
}
