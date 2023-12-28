import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Flatten<T> extends BaseIterator<T> {
    private maybeIterator: Maybe<IteroIterable<T>> = Maybe.none()

    constructor(private nonFlattenIterator: IteroIterable<IteroIterable<T>>) {
        super()
    }

    potentialSize(): number {
        return this.nonFlattenIterator.potentialSize?.() ?? -1
    }

    next(): Maybe<T> {
        // get the next non-flatten iterator
        if (this.maybeIterator.isNone()) this.maybeIterator = this.nonFlattenIterator.next()

        let element = Maybe.none<T>()
        while (this.maybeIterator.isSome() && element.isNone()) {
            const iterator = this.maybeIterator.value!
            element = iterator.next()

            if (element.isNone()) {
                this.maybeIterator = this.nonFlattenIterator.next()
            }
        }

        return element
    }

    async asyncNext(): Promise<Maybe<T>> {
        // get the next non-flatten iterator
        if (this.maybeIterator.isNone()) this.maybeIterator = await this.nonFlattenIterator.asyncNext()

        let element = Maybe.none<T>()
        while (this.maybeIterator.isSome() && element.isNone()) {
            const iterator = this.maybeIterator.value!
            element = await iterator.asyncNext()

            if (element.isNone()) {
                this.maybeIterator = await this.nonFlattenIterator.asyncNext()
            }
        }

        return element
    }

    clone(): Flatten<T> {
        return new Flatten(this.nonFlattenIterator.clone())
    }
}
