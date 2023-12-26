import type { IteroIterable } from "../types.js"

import Maybe from "../Maybe.js"
import { Chunk, ChunkExact, Filter, Map, Range, Window, Zip } from "./index.js"

export default class BaseIterator<I, O = I> implements IteroIterable<O>, Iterable<O> {
    [Symbol.iterator](): Iterator<O> {
        return {
            next: () => {
                return this.next().toIterator()
            }
        }
    }

    constructor(protected iterator: IteroIterable<I>) {}

    chunk(size: number): Chunk<O> {
        return new Chunk(this, size)
    }

    chunkExact(size: number): ChunkExact<O> {
        return new ChunkExact(this, size)
    }

    window(size: number): Window<O> {
        return new Window(this, size)
    }

    map<U>(callback: (v: O) => U): Map<O, U> {
        return new Map(this, callback)
    }

    filter(predicate: (v: O) => boolean): Filter<O> {
        return new Filter(this, predicate)
    }

    zip<U>(iterator: IteroIterable<U>): Zip<O, U> {
        return new Zip(this, iterator)
    }

    enumerate(): Zip<number, O> {
        return Range.from(0).zip(this)
    }

    next(): Maybe<O> {
        throw new Error("unimplementade next function, please implement it")
    }
}
