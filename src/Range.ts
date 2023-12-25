import BaseIterator from "./BaseIterator.js"
import Maybe from "./Maybe.js"

export default class Range extends BaseIterator<number> {
    private i: number

    static from(start: number, step = 1): Range {
        return new Range(start, Infinity, step)
    }

    static exclusive(start: number, end: number, step = 1): Range {
        return new Range(start, end, step)
    }

    static inclusive(start: number, end: number, step = 1): Range {
        return new Range(start, end + step, step)
    }

    private constructor(
        public start: number,
        public end: number,
        public step: number
    ) {
        super({
            next: () => Maybe.none<number>()
        })

        this.i = start
    }

    next(): Maybe<number> {
        if (this.i >= this.end) return Maybe.none()

        const value = this.i
        this.i += this.step

        return Maybe.some(value)
    }
}
