---
title: mac xdg
permalink: mac-xdg
date: 2025-01-13T23:11:42-08:00
tags: mac
---

I like a tidy computer. I [don't have a desktop](./remove-mac-desktop/) and I
[organize my config files](https://github.com/leebyron/dotfiles) within XDG
base directories.

XDG base directories defines a [standard][xdg-base-dirs-standard] way to layout
a user directory that's portable across environments and defines a set of
environment variables that many programs will look for to determine where they
read and write files. This is particularly nice for keeping your `~` home
directory from becoming littered with various dot-file config scripts.

This is a growing standard on Linux but not the default on macOS. However it's
easy to set up!

Create (with `sudo`) the file `/etc/zshenv`[^or-alternatives] (or `~/.zshenv`
for your user only) with the following contents:

```sh
# Define XDG Base directory environment variables
export XDG_BIN_HOME="$HOME/.local/bin"
export XDG_CACHE_HOME="$HOME/Library/Caches"
export XDG_CONFIG_HOME="$HOME/.config"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_RUNTIME_DIR="/tmp/$USER"
export XDG_STATE_HOME="$HOME/.local/state"
export PATH="$XDG_BIN_HOME:$PATH"

# Define paths for common programs not using XDG
export ZDOTDIR="$XDG_CONFIG_HOME/zsh"
export GNUPGHOME="$XDG_CONFIG_HOME/gnupg"
export NPM_CONFIG_CACHE="$XDG_CACHE_HOME/npm"
export NPM_CONFIG_TMP="$XDG_RUNTIME_DIR/npm"
export NPM_CONFIG_USERCONFIG="$XDG_CONFIG_HOME/npm/config"
```

Many programs will now automatically start using these directories, and
existing config files can be moved into the `~/.cache/{program}/` folders.

If you're writing distributing your own program which defines local
configuration files, please do check if `$XDG_CONFIG_HOME` is set and if so
prefer using XDG paths for your config files.

[^or-alternatives]: Assuming you are using the default zsh as your shell. If
using a different shell then sub in the equivalent environment config file.
