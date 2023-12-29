import { IteroIterable } from "./types.js"

export function isIterable<T>(v: any): v is IteroIterable<T> {
    return v !== null && typeof v === "object" && "next" in v && "asyncNext" in v
}
