import type { IteroIterable } from "../types.js"

import Consumer from "../Consumer.js"
import Maybe from "../Maybe.js"
import {
    Awaiter,
    Chain,
    Chunk,
    ChunkExact,
    Cycle,
    Filter,
    Flatten,
    Fuse,
    Map,
    Peekable,
    Range,
    Scan,
    StepBy,
    Window,
    Zip
} from "./index.js"

export default abstract class BaseIterator<O> implements IteroIterable<O>, Iterable<O> {
    [Symbol.iterator](): Iterator<O> {
        return {
            next: () => {
                return this.next().toIterator()
            }
        }
    }

    [Symbol.asyncIterator](): AsyncIterator<O> {
        return {
            next: async () => {
                const maybe = await this.asyncNext()
                return maybe.toIterator()
            }
        }
    }

    consume(): Consumer<O> {
        return new Consumer(this)
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

    chain(iterator: IteroIterable<O>): Chain<O> {
        return new Chain(this, iterator)
    }

    await(fromSync: boolean): Awaiter<O> {
        return new Awaiter(this, fromSync)
    }

    flatten(): Flatten<O> {
        return new Flatten(this)
    }

    nth(n: number): Maybe<O> {
        for (let i = 0; i < n - 1; i++) {
            const e = this.next()
            if (e.isNone()) return Maybe.none()
        }
        return this.next()
    }

    async asyncNth(n: number): Promise<Maybe<O>> {
        const promises: Array<Promise<Maybe<O>>> = []
        for (let i = 0; i < n; i++) {
            promises.push(this.asyncNext())
        }
        const results = await Promise.all(promises)
        return results[n - 1]
    }

    abstract next(): Maybe<O>
    abstract asyncNext(): Promise<Maybe<O>>
    abstract clone(): BaseIterator<O>
}

export const NoopIterator: IteroIterable<never> = {
    nth: Maybe.none<never>,
    next: Maybe.none<never>,
    asyncNext: () => Promise.resolve(Maybe.none()),
    asyncNth: () => Promise.resolve(Maybe.none()),
    clone: () => NoopIterator,
    potentialSize: () => 0
}
