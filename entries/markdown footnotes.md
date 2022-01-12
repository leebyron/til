---
title: markdown footnotes
permalink: markdown-footnotes
date: 2022-01-06T22:58:33-08:00
tags: markdown
---

Much like [markdown link references], footnotes are defined in one place and
referenced in another, but it doesn't matter where the footnote is defined,
they'll always be collected at the end of the document in the order in which
they are referenced[^a note].

Footnotes are created similar to shortcut reference links, but the identifier
starts with a `^`.

```markdown
order in which they are referenced[^a note].
```

A footnote definition is formatted exactly like link reference
definitions[^needs cr]: in a box followed by a comma.

```markdown
[^a note]: Despite footnotes appearing numbered, the identifier can be any text.
This is helpful if you may add more notes later and don't want to be bothered to
reorder them.
```

[^a note]: Despite footnotes appearing numbered, the identifier can be any text.
This is helpful if you may add more notes later and don't want to be bothered to
reorder them.

[^needs cr]: Unlike a link reference definition, a footnote definition needs an
empty line immediately after it, otherwise content from multiple lines is joined
into a single paragraph.

[markdown link references]: ../markdown-link-references
