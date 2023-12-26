import { BaseIterator } from "../index.js"
import Maybe from "../Maybe.js"

export default class Range extends BaseIterator<number> {
    private i: number

    static from(start: number, step = 1): Range {
        return new Range(start, Infinity, step, false)
    }

    static exclusive(start: number, end: number, step = 1): Range {
        return new Range(start, end, step, false)
    }

    static inclusive(start: number, end: number, step = 1): Range {
        return new Range(start, end, step, true)
    }

    private constructor(
        private start_edge: number,
        private end_edge: number,
        public step: number,
        private isInclusive: boolean
    ) {
        super({
            nth: () => Maybe.none<number>(),
            next: () => Maybe.none<number>()
        })

        this.i = start_edge
    }

    start() {
        return this.start_edge
    }

    end() {
        return this.end_edge
    }

    next(): Maybe<number> {
        const condition = this.isInclusive ? this.i > this.end_edge : this.i >= this.end_edge
        if (condition) return Maybe.none()

        const value = this.i
        this.i += this.step

        return Maybe.some(value)
    }
}
