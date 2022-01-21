---
title: bat, a cat with wings
permalink: bat-a-cat-with-wings
date: 2022-01-20T23:42:20-08:00
tags: terminal
---

On macOS there is the fantastic "Preview" utility. Select a file and hit space
bar to quickly take a look at the contents. In terminal things are a little
different. There's `tail` `cat`, and `less`. Bash denizens will be familiar with
the results.

![regular old cat](../media/37d23ef3d437ac42.png)

Good luck if you try taking a look at a massive file, a file with long lines, or
to get a quick read on some code. Maybe your habit is to open files in Vim or
another editor so you can at least move around quickly and get some basic syntax
highlighting. There's a better way...

Use [`bat`], it's just `cat` but with wings. It syntax highlights, it shows line
numbers, it intelligently pipes to `less` (if it needs to), it even integrates
with `git` to point out modified lines. It knows where its running and where its
printing and falls back to the simple thing when you just need it to `cat` a
file.

![bat! it's got wings](../media/76a2c219c5bdb4fc.png)

Learn more about `bat` at [github.com/sharkdp/bat][`bat'], and install with
[Homebrew]:

```sh
brew install bat
```

One more thing. Combine `bat` and `prettier` with [`prettybat`], or `man` with
[`batman`], a few of many bonus tools that comes with [`bat-extras`].

[`bat`]: https://github.com/sharkdp/bat
[homebrew]: https://formulae.brew.sh/formula/bat
[`prettybat`]: https://github.com/eth-p/bat-extras/blob/master/doc/prettybat.md
[`batman`]: https://github.com/eth-p/bat-extras/blob/master/doc/batman.md
[`bat-extras`]:
  https://github.com/eth-p/bat-extras/blob/master/README.md#installation
