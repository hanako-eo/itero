import Maybe from "./Maybe.js"

export declare interface IteroIterable<T> {
    next(): Maybe<T>
}