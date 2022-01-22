---
title: r.i.p. grep
permalink: ripgrep
date: 2022-01-21T22:24:50-08:00
tags: terminal
---

One of the oldest and most incredible tools in the terminal is `grep`[^grep]. It
was written overnight by the GOAT, [Ken Thompson], back in the early 1970s. It
allows you to search through a file (or stdin) for a regular expression
pattern[^regexp]. Useful then, useful now. Incredible.

However, it turns out that software written fifty years ago might start to show
signs of age. Enter [ripgrep], or `rg` in your terminal. It is faster, it is
aware of your `.gitignore` files, it prints results in color, it has a modern
RegExp engine, it supports full Unicode, it searches compressed files, it has an
easy to use and very powerful set of options, and of course it takes half as
many letters to type.

Do yourself a favor and install it:

```sh
brew install ripgrep
```

Want to learn more? Check out the [ripgrep] project page, this very
[in depth article](https://blog.burntsushi.net/ripgrep/) explaining why it's
fast and how it works, or this fantastic resource
[comparing many grep replacements](https://beyondgrep.com/feature-comparison/).

[^grep]:
    The name "grep" comes from `g/re/p` – globally run a regular expression and
    print. It was literally that exact command extracted from the `ed` text
    editor. There's a great
    [Computerphile](https://www.youtube.com/watch?v=NTfOnGZUZDk) video which
    tells this story.

[^regexp]:
    Ken Thompson didn't invent Regular Expressions, but did popularize their use
    in computers. One of many reasons he is one of the greatest of all time.

[ken thompson]: https://en.wikipedia.org/wiki/Ken_Thompson
[ripgrep]: https://github.com/BurntSushi/ripgrep
