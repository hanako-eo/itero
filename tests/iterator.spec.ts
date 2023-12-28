import { test } from "@japa/runner"
import { ArrayLikeIterator, BaseIterator, Maybe, Range } from "../src/index.js"
import { NoopIterator } from "../src/modifiers/index.js"

test.group("IteroIterator", () => {
    test("noop", ({ expect }) => {
        const iter = NoopIterator

        expect(iter.next()).toEqual(Maybe.none())
        expect(iter.next()).toEqual(Maybe.none())
    })

    test("transform array into Iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = new ArrayLikeIterator(array)

        let i = 0
        for (const element of iter) {
            expect(element).toBe(array[i])
            i++
        }
    })

    test("map through iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = new ArrayLikeIterator(array)

        let i = 0
        for (const element of iter.map((x) => x + 1)) {
            expect(element).toBe(array[i] + 1)
            i++
        }
    })

    test("filter odd number through iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = new ArrayLikeIterator(array)

        let i = 0
        for (const element of iter.filter((x) => x % 2 === 0)) {
            expect(element).toBe(array[i])
            i += 2
        }
    })

    test("zip on two iterators", ({ expect }) => {
        const array1 = [0, 1, 2, 3]
        const array2 = ["a", "b", "c", "d"]
        const iter1 = new ArrayLikeIterator(array1)
        const iter2 = new ArrayLikeIterator(array2)

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
        const iter1 = new ArrayLikeIterator(array1)
        const iter2 = new ArrayLikeIterator(array2)

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
        const iter1 = new ArrayLikeIterator(array1)
        const iter2 = new ArrayLikeIterator(array2)

        let i = 0
        for (const element of iter1.zip(iter2)) {
            expect(element).toEqual([array1[i], array2[i]])
            i++
        }
        expect(i).toBe(4)
    })

    test("enumerate through iterator", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = new ArrayLikeIterator(array)

        let i = 0
        for (const [j, element] of iter.enumerate()) {
            expect(element).toBe(array[i])
            expect(j).toBe(i)
            i++
        }
    })

    test("chunking the iterator", ({ expect }) => {
        const str = "javascript"
        const iter = new ArrayLikeIterator(str)

        let i = 0
        for (const element of iter.chunk(3)) {
            expect(element.join("")).toEqual(str.slice(3 * i, 3 * (i + 1)))
            i++
        }
        expect(i).toBe(Math.ceil(str.length / 3)) // i.e. 4
    })

    test("chunking exactly the iterator", ({ expect }) => {
        const str = "javascript"
        const iter = new ArrayLikeIterator(str).chunkExact(3)

        let i = 0
        for (const element of iter) {
            expect(element.join("")).toEqual(str.slice(3 * i, 3 * (i + 1)))
            i++
        }
        expect(i).toBe(Math.floor(str.length / 3)) // i.e. 3
        expect(iter.rest().join("")).toEqual(str.slice(3 * i))
    })

    test("windowing the iterator", ({ expect }) => {
        const str = "javascript"
        const iter = new ArrayLikeIterator(str)

        let i = 0
        for (const element of iter.window(3)) {
            expect(element.join("")).toEqual(str.slice(i, i + 3))
            i++
        }
        expect(i).toBe(str.length - 2) // i.e. 8
    })

    test("iterate through the iterator with a step of 2", ({ expect }) => {
        const array = [0, 1, 2, 3]
        const iter = new ArrayLikeIterator(array)

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
            asyncNext(): Promise<Maybe<number>> {
                throw "no async"
            }
            clone(): Alternate {
                return new Alternate()
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

    test("chaining 2 iterators", ({ expect }) => {
        const array1 = [0, 1, 2]
        const array2 = [3, 4, 5]
        const iter2 = new ArrayLikeIterator(array2)
        const iter = new ArrayLikeIterator(array1).chain(iter2)

        // array1
        expect(iter.next()).toEqual(Maybe.some(0))
        expect(iter.next()).toEqual(Maybe.some(1))
        expect(iter.next()).toEqual(Maybe.some(2))
        // array2
        expect(iter.next()).toEqual(Maybe.some(3))
        expect(iter.next()).toEqual(Maybe.some(4))
        expect(iter.next()).toEqual(Maybe.some(5))
        expect(iter.next()).toEqual(Maybe.none())
    })

    test("make cycle through the iterator", ({ expect }) => {
        const array = [0, 1, 2]
        const iter = new ArrayLikeIterator(array).cycle()

        // cycle 0
        expect(iter.next()).toEqual(Maybe.some(0))
        expect(iter.next()).toEqual(Maybe.some(1))
        expect(iter.next()).toEqual(Maybe.some(2))
        // cycle 1
        expect(iter.next()).toEqual(Maybe.some(0))
        expect(iter.next()).toEqual(Maybe.some(1))
        expect(iter.next()).toEqual(Maybe.some(2))
    })

    test("scan the iterator", ({ expect }) => {
        const array = [1, 2, 3, 4]
        const iter = new ArrayLikeIterator(array).scan(1, (acc, x) => {
            acc *= x

            // ... and terminate if the state exceeds 6
            if (acc > 6) return [acc, Maybe.none()]

            // ... else yield the negation of the state
            return [acc, Maybe.some(-acc)]
        })

        expect(iter.next()).toEqual(Maybe.some(-1))
        expect(iter.accumulated()).toBe(1)

        expect(iter.next()).toEqual(Maybe.some(-2))
        expect(iter.accumulated()).toBe(2)

        expect(iter.next()).toEqual(Maybe.some(-6))
        expect(iter.accumulated()).toBe(6)

        expect(iter.next()).toEqual(Maybe.none())
        expect(iter.accumulated()).toBe(24)

        expect(iter.next()).toEqual(Maybe.none())
        expect(iter.accumulated()).toBe(24)
    })

    test("peekable iterator", ({ expect }) => {
        const array = [1, 2, 3, 4]
        const iter = new ArrayLikeIterator(array).peekable()

        expect(iter.peek()).toEqual(Maybe.some(1))
        expect(iter.peek()).toEqual(Maybe.some(1))
        expect(iter.next()).toEqual(Maybe.some(1))
        expect(iter.peek()).toEqual(Maybe.some(2))
        expect(iter.next()).toEqual(Maybe.some(2))
        expect(iter.next()).toEqual(Maybe.some(3))
        expect(iter.peek()).toEqual(Maybe.some(4))
        expect(iter.next()).toEqual(Maybe.some(4))
        expect(iter.peek()).toEqual(Maybe.none())
        expect(iter.next()).toEqual(Maybe.none())
    })

    test("clonable iterator", ({ expect }) => {
        const array = [1, 2, 3, 4]
        const iter = new ArrayLikeIterator(array)

        expect(iter.next()).toEqual(Maybe.some(1))
        expect(iter.next()).toEqual(Maybe.some(2))

        const clonedIter = iter.clone()
        expect(iter.next()).toEqual(Maybe.some(3))
        expect(clonedIter.next()).toEqual(Maybe.some(1))
        expect(clonedIter.next()).toEqual(Maybe.some(2))
        expect(iter.next()).toEqual(Maybe.some(4))
    })
})

test.group("Range", () => {
    test("range from 0 to 10", ({ expect }) => {
        const range = Range.exclusive(0, 10)

        for (let i = 0; i < 10; i++) {
            expect(range.next()).toEqual(Maybe.some(i))
        }
        expect(range.next()).toEqual(Maybe.none())

        expect(range.start()).toBe(0)
        expect(range.end()).toBe(10)
        expect(range.step).toBe(1)
    })

    test("range from 0 to 10 include", ({ expect }) => {
        const range = Range.inclusive(0, 10)

        for (let i = 0; i < 10; i++) {
            expect(range.next()).toEqual(Maybe.some(i))
        }
        expect(range.next()).toEqual(Maybe.some(10))
        expect(range.next()).toEqual(Maybe.none())

        expect(range.start()).toBe(0)
        expect(range.end()).toBe(10)
        expect(range.step).toBe(1)
    })
})

test("ArrayIterator", ({ expect }) => {
    const a = [1, 2, 3, 4]
    const iter = new ArrayLikeIterator(a)

    let i = 0
    for (const element of iter) {
        expect(element).toBe(a[i])
        i++
    }
})
