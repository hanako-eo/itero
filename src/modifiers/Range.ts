import { BaseIterator } from "./index.js"
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
        super()

        this.i = start_edge
    }

    potentialSize(): number {
        return Math.floor((this.end_edge - this.start_edge) / this.step)
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

    asyncNext(): Promise<Maybe<number>> {
        return Promise.resolve(this.next())
    }

    clone(): Range {
        return new Range(this.start_edge, this.end_edge, this.step, this.isInclusive)
    }
}
