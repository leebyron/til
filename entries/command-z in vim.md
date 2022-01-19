---
title: command-z in vim
permalink: command-z-in-vim
date: 2022-01-17T22:46:57-08:00
tags: vim
---

Vim, run from the terminal, does not make use of the Command key. So most of my
muscle memory has been lost while learning it. However I found a shortcut:
iTerm's key mapping.

In iTerm, open Preferences (or press `Command-,` and in the Keys tab add a new
Key Binding.

- Keyboard Shortcut: ⌘z
- Action: Send text with "vim" Special Chars
- Value: `\<M-u>` (The backslash is important)

Now within the terminal, hitting Command-Z (Undo) will map to Meta-U, which will
perform Undo in Vim.
