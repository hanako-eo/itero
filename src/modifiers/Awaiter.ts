import Maybe from "../Maybe.js"
import { IteroIterable } from "../types.js"
import { BaseIterator } from "./index.js"

export default class Awaiter<T> extends BaseIterator<T> {
    constructor(
        private iterator: IteroIterable<Promise<T>> | IteroIterable<T>,
        private fromSync: boolean
    ) {
        super()
    }

    next(): Maybe<T> {
        throw new TypeError(
            "The Awaiter Iterator can only be use as an AsyncIterator (in a for await loop or with asyncNext)."
        )
    }

    async asyncNext(): Promise<Maybe<T>> {
        if (this.fromSync) {
            const element = this.iterator.next()
            if (element.isNone()) return Maybe.none()

            return Maybe.some(await element.value!)
        }
        const element = await this.iterator.asyncNext()
        if (element.isNone()) return Maybe.none()

        return Maybe.some(await element.value!)
    }

    clone(): Awaiter<T> {
        return new Awaiter(this.iterator.clone(), this.fromSync)
    }
}
