---
title: changing a word in vim
permalink: changing-a-word-in-vim
date: 2022-01-03T16:34:57+08:00
tags: [vim]
---

The `c` key starts a chord to change #something. This is super useful for
changing the word under the cursor. `cw` will change from the current position
until the end of the next word, and `ciw` will change the whole word under the
cursor (read: *c*hange *i*n *w*ord).

---

This, combined with other movements can lead to very quick changes. One I've
found quite useful is `ci"` which changes the contents of a quoted string, and
`ca"` (*c*hange *a*ll <i>"</i>quoted) to include the quote marks themselves. Or
when working in prose, `cis` will change the current sentence and `cip` the
current paragraph.

Sometimes a change command is hard to think about first, or the area you want to
change is subtly different from what the change command would do. Replace `c`
with `v` to get a similar visual motion (like `v3w` for 3 words), muck about,
then press `c` to change.[^unref]

| table | example |
| :---- | ------: |
| here  | there[^note]   |

this should be a [link].

```vim
:set example?
```

[^other]: Another other other thing.
[^note]: Another thing you need to know!

[link]: http://google.com

test <div><Example x={y} d="s" {...props}>wat</Example></div>



