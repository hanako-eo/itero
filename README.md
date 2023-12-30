# itero

Itero is a library designed to make iterations easier and more efficient.

This code
```js
const a = [0, 1, 2, 3, 4]
    .map((x) => x * x)
    .filter((x) => x % 2 === 0) // [0, 4, 16]
```
is simple, but has a big problem, to get it you have to make 2 loops, whereas it's very easy to see that it can be done via a loop,
```js
const a = []
for (const x in [0, 1, 2, 3, 4]) {
    const x2 = x * x
    if (x2 % 2 === 0) a.push(x2)
}
a // [0, 4, 16]
```
but it's not always easy to see if it's possible with less loops than with.

To make loops easier and keep the methods chainages, Itero proposes to do the following:
```js
const a = [0, 1, 2, 3, 4].iter() // or new ArrayLikeIterator([0, 1, 2, 3, 4])
    .map((x) => x * x)
    .filter((x) => x % 2 === 0)
    .consume().toArray()
```

## LICENCE
[MIT](./LICENCE)
