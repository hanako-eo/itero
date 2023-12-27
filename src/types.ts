import Maybe from "./Maybe.js"

export declare interface IteroIterable<T> {
    next(): Maybe<T>
    nth(n: number): Maybe<T>
    clone(): IteroIterable<T>

    potentialSize?(): number
}
