---
title: changing a word in vim
permalink: changing-a-word-in-vim
date: 2022/01/03 16:34:57 +0480
tags: [vim]
---

The `c` key starts a chord to change something. This is super useful for
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
then press `c` to change.
