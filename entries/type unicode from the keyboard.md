---
title: type unicode from the keyboard
permalink: type-unicode-from-the-keyboard
date: 2022-01-18T23:14:26-08:00
tags: mac keyboard
---

I'm often looking up Unicode code points to use in various places. There are two
ways I type them quickly from the keyboard.

The first way is a cheat. In the first tab of Keyboard preferences, ensure
"Press 🌐 to: " is set to "Show Emoji & Symbols". Now tap the `fn` key to bring
up the Symbols picker. The search does a half decent job of finding the symbol
you need. Clicking it behaves as a key press.

The second way is best if you know the _code_. From the Keyboard preferences in
the "Input Sources" tab, press the `+` button and add the "Unicode Hex Input"
keyboard. When using this keyboard, `⌥+<key>` no longer produces an alternate
symbol, but instead allows you to type in hex codes.

Now by holding ⌥ and typing `229b`, I can type: ⊛

One small caveat is that this only supports 4-digit UTF-16 codes, but it does
support surrogate pairs. This is annoying to type, but does allow entering Emoji
directly via keyboard.

For example holding ⌥ and typing `d83ddcbe`: 💾
