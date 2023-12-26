import { test } from "@japa/runner"
import IteroIterator, { Range } from "../src/index.js"

test.group("IteroIterator", () => {
    test("transform array into Iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = IteroIterator.fromIterable(array)

        let i = 0
        for (const element of iter) {
            expect(element).toBe(array[i])
            i++
        }
    })

    test("map on the iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = IteroIterator.fromIterable(array)

        let i = 0
        for (const element of iter.map(x => x + 1)) {
            expect(element).toBe(array[i] + 1)
            i++
        }
    })

    test("filter odd number on the iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = IteroIterator.fromIterable(array)

        let i = 0
        for (const element of iter.filter(x => x % 2 === 0)) {
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

    test("enumerate on the iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = IteroIterator.fromIterable(array)

        let i = 0
        for (const [j, element] of iter.enumerate()) {
            expect(element).toBe(array[i])
            expect(j).toBe(i)
            i++
        }
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
