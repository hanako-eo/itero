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

    test("sum a consume from stringify range", ({ expect }) => {
        const range = Range.inclusive(1, 5).map((x) => x.toString())

        expect(range.consume().sum()).toEqual(Maybe.some("12345"))
    })

    test("sum a consume from bigint range", ({ expect }) => {
        const range = Range.exclusive(1, 5).map(BigInt)

        // I need to transform bigint in number because I have the error "undefined: undefined"
        expect(range.consume().sum().map(Number)).toEqual(Maybe.some(10))
    })

    test("consume and get the first element", ({ expect }) => {
        const range = Range.exclusive(1, 5)

        expect(range.consume().first()).toEqual(Maybe.some(1))
    })

    test("consume and get the last element", ({ expect }) => {
        const range = Range.exclusive(1, 5)

        expect(range.consume().last()).toEqual(Maybe.some(4))
    })

    test("consume and get the first and last elements", ({ expect }) => {
        const range = Range.exclusive(1, 5)

        expect(range.consume().firstAndLast()).toEqual([Maybe.some(1), Maybe.some(4)])
    })

    test("consume and get the first and last elements on a range of 1 element (incorrectly)", ({ expect }) => {
        const range = Range.inclusive(1, 1)

        expect([range.consume().first(), range.consume().last()]).toEqual([Maybe.some(1), Maybe.none()])
    })

    test("consume and get the first and last elements on a range of 1 element (correctly)", ({ expect }) => {
        const range = Range.inclusive(1, 1)

        expect(range.consume().firstAndLast()).toEqual([Maybe.some(1), Maybe.some(1)])
    })

    test("consume and get the first even number", ({ expect }) => {
        const range = Range.inclusive(1, 3)

        expect(range.consume().find((x) => x % 2 === 0)).toEqual(Maybe.some(2))
    })

    test("consume and get the first even number and fail", ({ expect }) => {
        const range = Range.inclusive(1, 1)

        expect(range.consume().find((x) => x % 2 === 0)).toEqual(Maybe.none())
    })

    test("consume and count", ({ expect }) => {
        const range = Range.inclusive(1, 5)

        expect(range.consume().count()).toBe(5)
    })
})
