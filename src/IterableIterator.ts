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

    clone(): IterableIterator<T> {
        return new IterableIterator(this.iterable)
    }
}
