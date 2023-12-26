import { test } from "@japa/runner"
import IteroIterator, { BaseIterator, Maybe, Range } from "../src/index.js"
import { NoopIterator } from "../src/modifiers/index.js"

test.group("IteroIterator", () => {
    test("noop", ({ expect }) => {
        const iter = NoopIterator

        expect(iter.next()).toEqual(Maybe.none())
        expect(iter.next()).toEqual(Maybe.none())
    })
    test("transform array into Iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = IteroIterator.fromIterable(array)

        let i = 0
        for (const element of iter) {
            expect(element).toBe(array[i])
            i++
        }
    })

    test("map through iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = IteroIterator.fromIterable(array)

        let i = 0
        for (const element of iter.map((x) => x + 1)) {
            expect(element).toBe(array[i] + 1)
            i++
        }
    })

    test("filter odd number through iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = IteroIterator.fromIterable(array)

        let i = 0
        for (const element of iter.filter((x) => x % 2 === 0)) {
            expect(element).toBe(array[i])
            i += 2
        }
    })

    test("zip on two iterators", ({ expect }) => {
        const array1 = [0, 1, 2, 3]
        const array2 = ["a", "b", "c", "d"]
        const iter1 = IteroIterator.fromIterable(array1)
        const iter2 = IteroIterator.fromIterable(array2)

        let i = 0
        for (const element of iter1.zip(iter2)) {
            expect(element).toEqual([array1[i], array2[i]])
            i++
        }
        expect(i).toBe(4)
    })

    test("zip on two iterators with the first more big", ({ expect }) => {
        const array1 = [0, 1, 2, 3, 4, 5]
        const array2 = ["a", "b", "c", "d"]
        const iter1 = IteroIterator.fromIterable(array1)
        const iter2 = IteroIterator.fromIterable(array2)

        let i = 0
        for (const element of iter1.zip(iter2)) {
            expect(element).toEqual([array1[i], array2[i]])
            i++
        }
        expect(i).toBe(4)
    })

    test("zip on two iterators with the second more big", ({ expect }) => {
        const array1 = [0, 1, 2, 3]
        const array2 = ["a", "b", "c", "d", "e", "f", "g"]
        const iter1 = IteroIterator.fromIterable(array1)
        const iter2 = IteroIterator.fromIterable(array2)

        let i = 0
        for (const element of iter1.zip(iter2)) {
            expect(element).toEqual([array1[i], array2[i]])
            i++
        }
        expect(i).toBe(4)
    })

    test("enumerate through iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = IteroIterator.fromIterable(array)

        let i = 0
        for (const [j, element] of iter.enumerate()) {
            expect(element).toBe(array[i])
            expect(j).toBe(i)
            i++
        }
    })

    test("chunking the iterator", ({ expect }) => {
        const str = ["j", "a", "v", "a", "s", "c", "r", "i", "p", "t"]
        const iter = IteroIterator.fromIterable(str)

        let i = 0
        for (const element of iter.chunk(3)) {
            expect(element).toEqual(str.slice(3 * i, 3 * (i + 1)))
            i++
        }
        expect(i).toBe(Math.ceil(str.length / 3)) // i.e. 4
    })

    test("chunking exactly the iterator", ({ expect }) => {
        const str = ["j", "a", "v", "a", "s", "c", "r", "i", "p", "t"]
        const iter = IteroIterator.fromIterable(str).chunkExact(3)

        let i = 0
        for (const element of iter) {
            expect(element).toEqual(str.slice(3 * i, 3 * (i + 1)))
            i++
        }
        expect(i).toBe(Math.floor(str.length / 3)) // i.e. 3
        expect(iter.rest()).toEqual(str.slice(3 * i))
    })

    test("windowing the iterator", ({ expect }) => {
        const str = ["j", "a", "v", "a", "s", "c", "r", "i", "p", "t"]
        const iter = IteroIterator.fromIterable(str)

        let i = 0
        for (const element of iter.window(3)) {
            expect(element).toEqual(str.slice(i, i + 3))
            i++
        }
        expect(i).toBe(str.length - 2) // i.e. 8
    })

    test("iterate through the iterator with a step of 2", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = IteroIterator.fromIterable(array)

        let i = 0
        for (const element of iter.stepBy(2)) {
            expect(element).toBe(array[2 * i])
            i++
        }
        expect(i).toBe(array.length / 2)
    })

    test("fusing the iterator", ({ expect }) => {
        class Alternate extends BaseIterator<number> {
            i = 0
            constructor() {
                super()
            }
            next(): Maybe<number> {
                const value: Maybe<number> = this.i % 2 === 0 ? Maybe.some(this.i) : Maybe.none()
                this.i++
                return value
            }
        }
        const iter = new Alternate()

        expect(iter.next()).toEqual(Maybe.some(0))
        expect(iter.next()).toEqual(Maybe.none())
        expect(iter.next()).toEqual(Maybe.some(2))
        expect(iter.next()).toEqual(Maybe.none())

        const fusedIter = iter.fuse()
        expect(fusedIter.next()).toEqual(Maybe.some(4))
        expect(fusedIter.next()).toEqual(Maybe.none())
        expect(fusedIter.next()).toEqual(Maybe.none())
        expect(fusedIter.next()).toEqual(Maybe.none())
    })
})

test.group("Range", () => {
    test("range from 0 to 10", ({ expect }) => {
        const range = Range.exclusive(0, 10)

        for (let i = 0; i < 10; i++) {
            expect(range.next().value).toBe(i)
        }
        expect(range.next().isNone()).toBeTruthy()

        expect(range.start()).toBe(0)
        expect(range.end()).toBe(10)
        expect(range.step).toBe(1)
    })

    test("range from 0 to 10 include", ({ expect }) => {
        const range = Range.inclusive(0, 10)

        for (let i = 0; i < 10; i++) {
            expect(range.next().value).toBe(i)
        }
        expect(range.next().value).toBe(10)
        expect(range.next().isNone()).toBeTruthy()

        expect(range.start()).toBe(0)
        expect(range.end()).toBe(10)
        expect(range.step).toBe(1)
    })
})
