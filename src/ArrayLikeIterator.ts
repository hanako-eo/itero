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

    next(): Maybe<T> {
        if (this.base.length <= this.index) return Maybe.none()
        return Maybe.some(this.base[this.index++])
    }
}
