import Maybe from "../Maybe.js"
import { isIterable } from "../helper.js"
import { FlatIterator, IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Flatten<T> extends BaseIterator<FlatIterator<T>> {
    private maybeIterator: Maybe<IteroIterable<T>> = Maybe.none()

    constructor(private nonFlattenIterator: IteroIterable<IteroIterable<T> | T>) {
        super()
    }

    potentialSize(): number {
        return this.nonFlattenIterator.potentialSize?.() ?? -1
    }

    next(): Maybe<FlatIterator<T>> {
        // get the next non-flatten iterator or return the next item
        if (this.maybeIterator.isNone()) {
            const item = this.nonFlattenIterator.next()
            if (item.isNone()) return Maybe.none()

            if (!isIterable(item.value!)) return item as Maybe<FlatIterator<T>>
            this.maybeIterator = item as Maybe<IteroIterable<T>>
        }
        // return the item
        const iterator = this.maybeIterator.value!
        const element = iterator.next() as Maybe<FlatIterator<T>>

        if (element.isSome()) return element

        this.maybeIterator = Maybe.none()
        return this.next()
    }

    async asyncNext(): Promise<Maybe<FlatIterator<T>>> {
        // get the next non-flatten iterator or return the next item
        if (this.maybeIterator.isNone()) {
            const item = await this.nonFlattenIterator.asyncNext()
            if (item.isNone()) return Maybe.none()

            if (!isIterable(item.value!)) return item as Maybe<FlatIterator<T>>
            this.maybeIterator = item as Maybe<IteroIterable<T>>
        }
        // return the item
        const iterator = this.maybeIterator.value!
        const element = (await iterator.asyncNext()) as Maybe<FlatIterator<T>>

        if (element.isSome()) return element

        this.maybeIterator = Maybe.none()
        return this.asyncNext()
    }

    clone(): Flatten<T> {
        return new Flatten(this.nonFlattenIterator.clone())
    }
}
