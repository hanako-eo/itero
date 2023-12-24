import { test } from "@japa/runner"
import IteroIterator from "../src/index.js"

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
})
