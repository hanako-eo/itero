import type { IteroIterable } from "./types.js"
import Maybe from "./Maybe.js"

export default abstract class BaseIterator<T> implements IteroIterable<T>, Iterable<T> {
    [Symbol.iterator](): Iterator<T> {
        return {
            next: () => {
                return this.next().toIterator()
            }
        }
    }

    constructor(protected iterator: IteroIterable<T>) {}

    next(): Maybe<T> {
        throw new Error("unimplementade next function, please implement it")
    }
}
