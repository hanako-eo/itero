import type { IteroIterable } from "../types.js"

import Maybe from "../Maybe.js"
import { Chunk, ChunkExact, Filter, Map, Range, StepBy, Window, Zip } from "./index.js"

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

    stepBy(n: number): StepBy<O> {
        return new StepBy(this, n)
    }

    nth(n: number): Maybe<O> {
        for (let i = 0; i < n - 1; i++) {
            const e = this.next()
            if (e.isNone()) return Maybe.none()
        }
        return this.next()
    }

    next(): Maybe<O> {
        throw new Error("unimplementade next function, please implement it")
    }
}

export const NoopIterator: IteroIterable<never> = {
    nth: Maybe.none<never>,
    next: Maybe.none<never>
}
