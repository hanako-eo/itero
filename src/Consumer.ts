import Maybe from "./Maybe.js"
import { IteroIterable } from "./types.js"

export default class Consumer<T> {
    constructor(private iterator: IteroIterable<T>) {}

    // TODO: first, last, find

    sum(): Maybe<T> {
        return this.reduce((a: any, b: any) => (a + b) as any)
    }

    product(): Maybe<T> {
        return this.reduce((a: any, b: any) => (a * b) as any)
    }

    sort(compareFn: (a: T, b: T) => number): Array<T> {
        return this.toArray().sort(compareFn)
    }

    compare(compareFn: (a: T, b: T) => boolean): Maybe<T> {
        let element = this.iterator.next()
        if (element.isNone()) return Maybe.none()

        let compared = element

        while (element.isSome()) {
            if (compareFn(compared.value!, element.value!)) compared = element
            element = this.iterator.next()
        }

        return compared
    }

    fold<A>(defaultValue: A, callback: (acc: A, value: T) => A): A {
        let element = this.iterator.next()
        let acc = defaultValue

        while (element.isSome()) {
            acc = callback(acc, element.value!)
            element = this.iterator.next()
        }

        return acc
    }

    reduce(callback: (acc: T, value: T) => T): Maybe<T> {
        const element = this.iterator.next()
        if (element.isNone()) return Maybe.none()

        return Maybe.some(this.fold(element.value!, callback))
    }

    forEach(callback: (value: T, index: number, iter: IteroIterable<T>) => void) {
        let element = this.iterator.next()
        let i = 0

        while (element.isSome()) {
            callback(element.value!, i++, this.iterator)
            element = this.iterator.next()
        }
    }

    toArray(): Array<T> {
        const array: Array<T> = []
        let element = this.iterator.next()

        while (element.isSome()) {
            array.push(element.value!)
            element = this.iterator.next()
        }

        return array
    }
}
