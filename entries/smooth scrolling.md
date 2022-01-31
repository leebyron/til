---
title: smooth scrolling
permalink: smooth-scrolling
date: 2022-01-30T21:27:10-08:00
tags: css
---

Browser's automatic scrolling behavior has traditionally been very jumpy, with
developers needing to write custom JavaScript code to simulate a smooth scroll.
However thanks to the [smooth scrolling] specification, browsers over the years
have adopted an API for CSS and JavaScript to natively smooth scroll.

When clicking an anchor link, the transition be can be smoothed by adding the
`scroll-behavior` rule to the root element.

```css
:root {
  scroll-behavior: smooth;
}
```

For navigating to a specific page location using [`window.scrollTo()`] or
similar methods, provide an options object instead of explicit coordinates.

```js
// Old way
window.scrollTo(0, 100)

// Smooth way
window.scrollTo({ top: 100, behavior: 'smooth' })
```

[smooth scrolling]: https://www.w3.org/TR/cssom-view-1/#smooth-scrolling
[`window.scrollto()`]:
  https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
