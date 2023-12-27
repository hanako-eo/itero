import type { IteroIterable } from "../types.js"

import Maybe from "../Maybe.js"
import { Chunk, ChunkExact, Cycle, Filter, Fuse, Map, Peekable, Range, Scan, StepBy, Window, Zip } from "./index.js"

export default abstract class BaseIterator<I, O = I> implements IteroIterable<O>, Iterable<O> {
    [Symbol.iterator](): Iterator<O> {
        return {
            next: () => {
                return this.next().toIterator()
            }
        }
    }

    // give a potential size of the iterator, if the function return -1,
    // it's impossible to know the size, if it's potential it's because
    // the first `Maybe.none` can be call before or after n
    potentialSize(): number {
        return -1
    }

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

    fuse(): Fuse<O> {
        return new Fuse(this)
    }

    peekable(): Peekable<O> {
        return new Peekable(this)
    }

    cycle(): Cycle<O> {
        return new Cycle(this)
    }

    scan<A, U>(accumulator: A, callback: (accumulator: A, value: O) => [A, Maybe<U>]): Scan<A, O, U> {
        return new Scan(this, accumulator, callback)
    }

    nth(n: number): Maybe<O> {
        for (let i = 0; i < n - 1; i++) {
            const e = this.next()
            if (e.isNone()) return Maybe.none()
        }
        return this.next()
    }

    abstract next(): Maybe<O>
}

export const NoopIterator: IteroIterable<never> = {
    nth: Maybe.none<never>,
    next: Maybe.none<never>,
    potentialSize: () => 0
}
