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

## Install

```sh
npm install @hanako-eo/itero
```

## API

Itero provides an easy "empty" iterface to handle iteration (in a context where Itero is used) `IteroIterable` (supporting async iteration). Itero also provides the abstract class `BaseIterator` which provides a default implementation of `nth` and `asyncNth` and by the same token provides methods such as `.map`, `.filter` and others. 

`.potentialSize` is an obtional method of `IteroIterable` which gives an idea of the size of the iterator without consuming it, for objects like `ArrayLikeIterator` it is exact but with `IterableIterator` it is -1 because it is not calculable without consuming the iterator.


### Consumer (exported)
Take an IteroIterator and consume the iterator with methods like `first`, `last`, `find` and others. Here is the list of methods:

```ts
first(): Maybe<T>;
last(): Maybe<T>;
firstAndLast(): [Maybe<T>, Maybe<T>];
find(predicate: (v: T) => boolean): Maybe<T>;
count(): number;
sum(): Maybe<T>; // equivalent to reduce((a, b) => a + b)
product(): Maybe<T>; // equivalent to reduce((a, b) => a * b)
sort(compareFn: (a: T, b: T) => number): Array<T>;
compare(compareFn: (a: T, b: T) => boolean): Maybe<T>;
fold<A>(defaultValue: A, callback: (acc: A, value: T) => A): A;
reduce(callback: (acc: T, value: T) => T): Maybe<T>;
forEach(callback: (value: T, index: number, iter: IteroIterable<T>) => void): void;
toArray(): Array<T>;
```

### Map / Filter / Flatten (via .map / .filter / .flatten)

```js
const array = new ArrayLikeIterator([[0, 1], [2, 3], [4, 5, 6]])
    .flatten() // transform [[0, 1], [2, 3], [4, 5, 6]] => [0, 1, 2, 3, 4, 5, 6]
    .map((x) => x + 1) // [0, 1, 2, 3, 4, 5, 6] => [1, 2, 3, 4, 5, 6, 7]
    .filter((x) => x % 2 == 0) // [1, 2, 3, 4, 5, 6, 7] => [2, 4, 6]
    .consume()
    .toArray()

console.log(array) // [2, 4, 6]
```
work like [`.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [`.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) and [`.flatten`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) (on arrays, the method is called `.flat`) on vanilla js arrays, but the callback only takes the element.

### Chunk / ChunkExact / Window

The three functions return arrays of size `size` given as a parameter. However, the internal functioning within the `next` is not exactly the same.

`.chunk` creates an array with as many elements as possible up to the size `size`, but if we haven't reached the end (meaning we can't make an array of size `size`), then it will create with a smaller size. The chunks start at the beginning, and the subsequent chunks start after the previous one:
```js
// for a chunk of size 3
   [0,1,2,3,4,5, 6]
    | 1 | | 2 | |3|
    ----- ----- ---
// or
[0, 1, 2, 3, 4, 5, 6] => [[0, 1, 2], [3, 4, 5], [6]]
```

Similarly, `.chunkExact` works like `.chunk`, but the chunks must be exactly of size `size`.
```js
// for a chunk of size 3
   [0,1,2,3,4,5, 6]
    | 1 | | 2 | |3| <-- "ignored"
    ----- ----- ---
// or
[0, 1, 2, 3, 4, 5, 6] => [[0, 1, 2], [3, 4, 5]]
```
The ignored chunk is recoverable with the method `.rest`.

And for `.window`, it creates an array of size `size` but with an offset of 1 and not a complete chunk like `.chunk` and `.chunkExact`.

```js
// for a chunk of size 3
   [0,1,2,3,4,5,6]
    | 1 |
      | 2 |
        | 3 |
          | 4 |
            | 5 |
// or
[0, 1, 2, 3, 4, 5, 6] => [[0, 1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6]]
```

### Chain / Zip / Enumerate

`Chain` and `Zip` both take two iterators.

`.chain` loops over the first iterator, and as soon as it finishes, it moves to the second one.

`.zip` combines the two iterators; a `next` from the zip will call the `next` on both iterators and give a tuple with the two values or nothing.

`.enumerate` performs a `.zip` between a `Range` and the base iterator (it provides indexing to the elements).

### Cycle

Repeats an iterator infinitely. Instead of stopping at a `Maybe.none()`, the iterator restarts from the beginning. After iterating again, it will start over from the beginning. And again. Ad infinitum. If the original iterator is empty, the resulting iterator will also be empty.

### Awaiter (via .await)

Transforms a synchronous iterator into an asynchronous iterator (and at the same time, if `next` returns a `Promise`, then `.await` will wait for the completion of the `Promise`).

### Fuse

Generates an iterator that terminates after the first `Maybe.none`. Once an iterator returns `Maybe.none`, subsequent calls may or may not produce another `Maybe.some`. `.fuse` modifies an iterator, ensuring that after it has yielded `Maybe.none`, it always returns `Maybe.none` indefinitely."

### StepBy

Starts from the beginning and yields every element spaced by `n` elements

```js
// for n = 3
[0, 1, 2, 3, 4, 5, 6] => [0, 3, 6]
```

### Peekable

Creates an iterator that can utilize the `.peek` method to observe the next element of the iterator without consuming it.

### Scan

Works like the [scan in rust](https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.scan)

> An iterator adapter which, like fold, holds internal state, but unlike fold, produces a new iterator.
>
> `.scan` takes two arguments: an initial value which seeds the internal state, and a closure with two arguments, the first being a mutable reference to the internal state and the second an iterator element. The closure can assign to the internal state to share state between iterations.

### Range

Works like the [range in Python](https://www.w3schools.com/python/ref_func_range.asp)

Gives 3 statics methods `from`, `exclusive`, `inclusive` to create 3 types of ranges (the step is by default to 1).

`from` is like `[start; Infinity)` in maths.
`exclusive` is like `[start; end)` in maths.
`inclusive` is like `[start; end]` in maths.

## LICENCE
[MIT](./LICENCE)
