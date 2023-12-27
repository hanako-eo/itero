import { test } from "@japa/runner"
import IteroIterator, { Maybe, Range } from "../src/index.js"
import { NoopIterator } from "../src/modifiers/index.js"
import Consumer from "../src/Consumer.js"

test.group("Consumer", () => {
    test("consume Noop", ({ expect }) => {
        expect(new Consumer(NoopIterator).toArray()).toEqual([])
    })

    test("consume to array", ({ expect }) => {
        const a = [0, 1, 2, 3, 4]
        const range = Range.exclusive(0, 5)

        expect(range.consume().toArray()).toEqual(a)
    })

    test("consume for each", ({ expect }) => {
        const a = [0, 1, 2, 3, 4]
        const range = Range.exclusive(0, 5)

        range.consume().forEach((v, i) => {
            expect(v).toEqual(a[i])
        })
    })

    test("consume and find the min", ({ expect }) => {
        const range = Range.exclusive(0, 5)

        const max = range.consume().compare((a, b) => a > b)
        expect(max).toEqual(Maybe.some(0))
    })

    test("consume and find the max", ({ expect }) => {
        const range = Range.exclusive(0, 5)

        const max = range.consume().compare((a, b) => a < b)
        expect(max).toEqual(Maybe.some(4))
    })

    test("consume and sort", ({ expect }) => {
        const a_sorted = [0, 1, 2, 3, 4, 4, 6, 7]
        const a_shuffled = [...a_sorted].sort(() => Math.random() - 0.5)
        const iter = new IteroIterator(a_shuffled)

        const iter_sorted = iter.consume().sort((a, b) => a - b)
        expect(iter_sorted).toEqual(a_sorted)
    })

    test("product a consume", ({ expect }) => {
        const range = Range.exclusive(1, 5)

        expect(range.consume().product()).toEqual(Maybe.some(24))
    })

    test("sum a consume", ({ expect }) => {
        const range = Range.exclusive(1, 5)

        expect(range.consume().sum()).toEqual(Maybe.some(10))
    })

    test("sum a consume from bigint range", ({ expect }) => {
        const range = Range.exclusive(1, 5).map(BigInt)

        expect(range.consume().sum()).toEqual(Maybe.some(10n))
    })
})
