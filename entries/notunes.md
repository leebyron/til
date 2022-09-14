---
title: noTunes
permalink: notunes
date: 2022-09-14T13:48:45-07:00
tags: mac
---

There's many things I love about Apple's software and OS, but one thing that
feels particularly... monopolistic, and also annoying, is how the Apple Music
app opens automatically whenever you connect bluetooth headphones. I literally
never want this. This is behavior that cannot be disabled, the Apple Music
cannot be uninstalled. What to do?

The [noTunes](https://github.com/tombonez/noTunes) app is an incredibly simple
(open source!) app which solves exactly this problem. More specifically it just
keeps the Apple Music app from opening at all, or lets you launch a replacement
app if you so choose.

Install it with `brew`, launch it, then add it to "Login Items" in System
Preferences to ensure it launches automatically.

```sh
brew install --cask notunes
```
