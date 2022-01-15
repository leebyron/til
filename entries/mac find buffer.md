---
title: mac find buffer
permalink: mac-find-buffer
date: 2022-01-14T22:25:32-08:00
tags: mac
---

Most text based apps on the Mac have a find buffer accessed with ⌘F. A common
workflow is to select some text, copy it with ⌘C, open find with ⌘F, paste the
searched text with ⌘V, hit return to find the next instance, and hit return
multiple times until you find the instance you're looking for, then hit escape
to close the find overlay.

_There's a faster way._

After selecting text, press ⌘E to fill that text into the find buffer. It may
look like nothing happened, but now press ⌘G to find the next instance of that
text (⌘⇧G to find the previous). Continue pressing ⌘G until you find the
instance you're looking for.

This has a benefit of not changing modes; your cursor remains within the text
document rather than being caught by the find input.

This works in Safari, Chrome, TextEdit, Notes, VSCode, Terminal (but not iTerm),
and most other places you work with text in macOS.
