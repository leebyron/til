---
title: vim time travel
permalink: vim-time-travel
date: 2022-01-26T22:35:11-08:00
tags: [vim]
---

To undo and redo in Vim, use `u` and `⌃⇧R` ("CTRL-R" in Vim lingo, note the
capital R) respectively. This works as you'd expect, but there are a few
shortcomings:

- It is very easy to undo, but dexterously challenging to redo.
- If you undo, then accidentally make an edit, you can't redo.

Fortunately Vim has a very powerful undo feature called "undo trees" which you
might understand as similar to git branching. Undoing and then starting a new
change is just a separate branch in the undo tree. There are a number of ways of
interacting with the undo tree[^undo-redo], but a comparatively simple one is
undo time travel.

[^undo-redo]:
    Another example of interacting with the undo tree is `:undolist`, which
    shows all leafs in the tree. To learn more about undo, try
    `:help undo-redo`.

To go to an earlier state, use `g-`, to go to a later state, `g+`. If you mess
up with undo and redo, you can usually just try `g-` repeatedly until you're
back where you want to be. While this is not quite as easy to remember as `u`
for undo, I find "go earlier" and "go later" as pretty great mnemonics and
really appreciate the symmetry.

These are shorthand for the `:earlier` and `:later` commands, which are quite
flexible. As an example, `:earlier 5m` will go to whatever version you were
looking at five minutes ago. Amazing.
