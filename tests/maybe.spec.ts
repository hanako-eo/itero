import { test } from "@japa/runner"
import Maybe from "../src/Maybe.js"

test.group("Maybe", () => {
    test("none === none", ({ expect }) => {
        expect(Maybe.none()).toEqual(Maybe.some(undefined))
        expect(Maybe.none()).toEqual(Maybe.none())
        expect(Maybe.none() === Maybe.some(undefined)).toBe(false)
        expect(Maybe.none() === Maybe.none()).toBe(true)
    })

    test("Maybe.getOr", ({ expect }) => {
        const a = Maybe.some(1)
        const b = Maybe.none()

        expect(a.getOr(2)).toBe(1)
        expect(b.getOr(2)).toBe(2)
    })

    test("Maybe.map", ({ expect }) => {
        const a = Maybe.some<number>(1)
        const b = Maybe.none<number>()

        expect(a.map((x) => x + 1)).toEqual(Maybe.some(2))
        expect(a).toEqual(Maybe.some(1))

        expect(b.map((x) => x + 1)).toEqual(Maybe.none())
    })

    test("Maybe.take", ({ expect }) => {
        const a = Maybe.some<number>(1)
        const b = Maybe.none<number>()

        expect(a.take()).toEqual(Maybe.some(1))
        expect(a).toEqual(Maybe.none())

        expect(b.take()).toEqual(Maybe.none())
    })

    test("Maybe.toIterator", ({ expect }) => {
        const a = Maybe.some<number>(1)
        const b = Maybe.none<number>()

        expect(a.toIterator()).toEqual({ done: false, value: 1 })
        expect(b.toIterator()).toEqual({ done: true })
    })
})
