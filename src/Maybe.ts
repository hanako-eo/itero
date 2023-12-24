export default class Maybe<T> {
    #hasValue: boolean
    value: T | undefined

    static some<T>(value: T): Maybe<T> {
        return new Maybe(value, true)
    }

    static none<T>(): Maybe<T> {
        return new Maybe(undefined as T, false)
    }

    static fromIterator<T>(iteratorResult: IteratorResult<T>): Maybe<T> {
        if (iteratorResult.done) return Maybe.none()
        return Maybe.some(iteratorResult.value)
    }

    private constructor(value: T | undefined, hasValue: boolean) {
        this.#hasValue = hasValue
        this.value = value
    }

    toIterator<T>(): IteratorResult<T> {
        if (this.#hasValue)
            return {
                done: false,
                value: this.value! as T
            }
        return {
            done: true,
            value: undefined
        }
    }

    isSome() {
        return this.#hasValue
    }

    isNone() {
        return !this.#hasValue
    }
}
