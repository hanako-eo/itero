import Maybe from "./Maybe.js"
import { BaseIterator } from "./modifiers/index.js"

export default class ArrayLikeIterator<T> extends BaseIterator<T> {
    private index = 0
    constructor(private base: ArrayLike<T>) {
        super()
    }

    potentialSize(): number {
        return this.base.length
    }

    nth(n: number): Maybe<T> {
        this.index += n - 1
        return this.next()
    }

    asyncNth(n: number): Promise<Maybe<T>> {
        this.index += n - 1
        return this.asyncNext()
    }

    next(): Maybe<T> {
        if (this.base.length <= this.index) return Maybe.none()
        return Maybe.some(this.base[this.index++])
    }

    asyncNext(): Promise<Maybe<T>> {
        return Promise.resolve(this.next())
    }

    clone(): ArrayLikeIterator<T> {
        return new ArrayLikeIterator(this.base)
    }
}

////// GLOBAL METHOD //////
declare global {
    interface Array<T> {
        iter(): ArrayLikeIterator<T>
    }

    interface String {
        iter(): ArrayLikeIterator<string>
    }
}

Array.prototype.iter = function <T>(this: Array<T>) {
    return new ArrayLikeIterator(this)
}

String.prototype.iter = function () {
    return new ArrayLikeIterator(this)
}
