---
title: enable key repeat
permalink: enable-key-repeat
date: 2022-01-16T23:09:29-08:00
tags: mac
---

In macOS, when you hold down a letter key you see a small popover with available
alternates for that letter (for example by applying accents). This behavior can
be disabled, returning to the previous behavior where holding a key repeats that
letter until you release it.

To do so for a specific app:

```sh
defaults write com.googlecode.iterm2 ApplePressAndHoldEnabled -bool false
```

Or to disable system wide:

```sh
defaults write -g ApplePressAndHoldEnabled -bool false
```

After changing this setting, you need to restart the app or sign in session.

_I learned this TIL recently from [@rsms] care of his excellent [macOS Fixes]
doc._

[@rsms]: https://twitter.com/rsms
[macos fixes]: https://gist.github.com/rsms/fb463396c95ad8d9efa338a8050a01dc
