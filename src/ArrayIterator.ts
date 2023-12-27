import Maybe from "./Maybe.js"
import { BaseIterator } from "./modifiers/index.js"

export default class ArrayIterator<T> extends BaseIterator<T> {
    private index = 0
    constructor(private base: Array<T>) {
        super()
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
