---
title: markdown references
permalink: markdown-references
date: 2022-01-06T10:40:18-08:00
tags: markdown
---

Inline markdown links and images can be hard to read with long URLs. References
are a great way to keep prose readable and keep a catalog of links. There are
[quite a few variations][links] of the syntax.

Write references with a box around the reference identifier followed by a colon
and the URL, optionally include a trailing title in quotes (which may go on the
following line):

```markdown
[links]: https://spec.commonmark.org/0.30/#links
[links]: https://spec.commonmark.org/0.30/#links "Nearly a hundred tests"
```

Then within prose, refer to them with typical link syntax, but with a trailing
box instead of parentheses. If the linked text is the same as the identifier,
just use a standalone box.

```markdown
Here is a link about [markdown links][links]. What's the web without [links]?
```

Here is a link about [markdown links][links]. What's the web without [links]?

References can appear anywhere in a Markdown file. I often place them right
after the paragraph where they're used. If they're used in multiple places, I'll
group them together at the end of a section or end of the whole document.

---

References can also be used for images. The syntax for the reference is the
same, but images start with an `!`.

```markdown
![moebius]

[moebius]: https://uploads4.wikiart.org/images/m-c-escher/bond-of-union.jpg
"Bond of Union, M.C. Escher 1956"
```

![moebius]

[links]: https://spec.commonmark.org/0.30/#links "Nearly a hundred tests"
[moebius]: https://uploads4.wikiart.org/images/m-c-escher/bond-of-union.jpg
"Bond of Union, M.C. Escher 1956"
