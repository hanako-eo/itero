import Maybe from "./Maybe.js"

export declare interface IteroIterable<T> {
    /// SYNC ///
    next(): Maybe<T>
    nth(n: number): Maybe<T>
    /// ASYNC ///
    asyncNext(): Promise<Maybe<T>>
    asyncNth(n: number): Promise<Maybe<T>>

    clone(): IteroIterable<T>

    potentialSize?(): number
}

export type IteratorType<T extends Iterable<unknown>> = ReturnType<T[typeof Symbol.iterator]>
export type AsyncIteratorType<T extends AsyncIterable<unknown>> = ReturnType<T[typeof Symbol.asyncIterator]>
