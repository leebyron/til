---
title: Brewfile
permalink: brewfile
date: 2022-09-13T15:47:21-07:00
tags: mac
---

I'm a huge fan of [brew](https://brew.sh/). I use it for installing a broad list
of command line tools, as well as Mac apps. Most apps you use can be installed
with `brew install --cask`. However, where I've found Brew most helpful is as a
lightweight way to set up new computers with all the apps and utilities I rely
on. To do this, I use _Brewfile_.

This is brew's equivalent of a package.json or Gemfile, it's just a list of all
software that should be installed. To get started quickly run `brew bundle` and
to learn more, see the
[Homebrew/homebrew-bundle](https://github.com/Homebrew/homebrew-bundle) repo.

However, keeping the Brewfile up to date as new things are installed does not
happen automatically. Here are a few additional things I do:

- I keep my `.Brewfile` in my homedir, and track it as part of my
  [dotfiles](https://github.com/leebyron/dotfiles).
- I use [`brew alias`](https://github.com/Homebrew/homebrew-aliases) to keep
  commonly used commands and their arguments terse. The most important being
  `brew add` which is a replacement for `brew install` which also updates the
  Brewfile, `brew remove` replacing `brew uninstall` and `brew sync` which
  installs anything new after pulling dotfiles changes from another machine. You
  can see all of
  [these scripts](https://github.com/leebyron/dotfiles/tree/main/.brew-aliases)
  which I also include in my dotfiles repo.

The final result is that setting up a new machine with a list of apps I use is
pretty easy, as is keeping that install base the same across a few computers I
use. Brew alias makes it easy to keep everything correct.
