---
title: opaque types
permalink: opaque-types
date: 2022-01-25T22:09:05-08:00
tags: typescript
---

One of my favorite features from Flow is [opaque types]. This allows a
separation between interface and implementation that's incredibly helpful as a
type API designer, and a rare example of a "nominal type" in an otherwise
"structural type" environment. Unfortunately, TypeScript still does not support
this functionality.

1. I use this as a much simpler version of [private fields] that doesn't require
   a whole class interface and is scoped to a whole module rather than just a
   single class (fantastically helpful for a more functional programming style).

2. This is a great way to generate "subtypes" of a primitive like a string or
   number, which is particularly useful for representing things like URLs,
   UUIDs, and other things which are string-like but not strings.

You can emulate this behavior in TypeScript by lying to the compiler. For
example, let's build a UUID type:

```typescript
export type UUID = string & { [$uuid]: true }
declare const $uuid: unique symbol

export function isUUID(value: unknown): value is UUID {
  return uuid.validate(value)
}

export function createUUID(): UUID {
  return uuid.v4() as UUID
}
```

This introduces the type `UUID` which you can use anywhere you use a string, but
you can also write functions that accept only a `UUID` and not just any string.

This works by telling TypeScript that there exists a variable called `$uuid`
that is a [unique symbol] (the result of calling `Symbol()`) and that the type
`UUID` is both a `string` and (`&`) an object with a required property of that
unique symbol. However none of this exists at runtime, there is no variable or
unique symbol, so there's no way of actually creating a `UUID` type outside of
casting, which we only do in this bit of library code.

Perhaps you don't actually want to expose that `UUID` is implemented as a
`string`, that should be opaque as well, just remove the `string &`:

```typescript
export type UUID = { [$uuid]: true }
```

This version cannot be used where a `string` is expected, even though it's still
a string value at runtime.

This works surprisingly well, but there are shortcomings:

- Errors are not always particularly helpful. Providing the wrong value where
  `UUID` is expected will expose the details of this hack.
- This pattern is a bit inscruitble, compared to Flow's slightly more clear
  explicit syntax. Don't forget to include a comment explaining what this does.
- There's still no concept of "module private" fields without going around the
  type compiler again.

More examples of where opaque types are useful:

- `URL`, `Email`, `Username`, `ID` or anything else you might want to validate
  before using and offer a guarantee that if you have a value of that type, it
  has been validated.
- HTML sanitization, to type a string which has been HTML sanitized, while
  having unsafe functions that accept only sanitized strings.
- Subtypes of number, like integers or positive values.
- Opaque types for numeric or string database IDs which may be used alongside
  other strings or numbers.
- Unique types for overlapping identifiers such as classic MySQL auto increments
  that you'd hate to mix up, like `UserID` and `MessageID`

[opaque types]: https://flow.org/en/docs/types/opaque-types/
[private fields]:
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
[unique symbol]:
  https://www.typescriptlang.org/docs/handbook/symbols.html#unique-symbol
