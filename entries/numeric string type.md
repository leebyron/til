---
title: numeric string type
permalink: numeric-string-type
date: 2022-01-26T22:23:26-08:00
tags: typescript
---

One of the most powerful recent features from TypeScript is [template types].
While they're capable of everything from string manipulation to implementing
generic parsers, sometimes it's the simplest uses that are the most useful.

A type I've come to find very helpful is "numeric string":

```typescript
type NumericString = `${number}`
```

This type is a "subtype" of string, which means it can be used anywhere a string
is expected, but not every string can be used where `NumericString` is expected.

This is particularly helpful in describing API payloads which include numeric
strings instead of numbers to represent numeric values which need to be exact or
support high precision (and avoid floating point rounding errors) such as
currencies.

[template types]:
  https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
