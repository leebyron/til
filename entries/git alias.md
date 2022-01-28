---
title: git alias
permalink: git-alias
date: 2022-01-27T22:54:58-08:00
tags: git
---

If you use git frequently you ought to set up some shortcuts with git aliases.

For example, while `git show` is useful, sometimes you just want the last commit
information and not the entire contents of the commit. Consider adding
`git last`

```sh
git config --global alias.last 'log -1 HEAD'
```

Now running `git last` is equivalent to `git log -1 HEAD`! This gets included
into git help and shell completion.

Another useful alias is `git unstage` to remove a file from the staged commit,
and `git discard` to remove the changes altogether.

```sh
git config --global alias.unstage 'restore --staged'
git config --global alias.discard 'checkout HEAD --'
```

My most used alias is one which stages all changes and then prints the current
status, which I simply call `git s`. To run multiple commands, prefix with `!`
so the alias runs as a shell script.

```sh
git config --global alias.s '!git add -A; git status'
```

I use this so frequently, that I have an alias `gs` set up in my shell config:

```sh
alias gs='git s'
```

Finally, you might want more complex positional arguments. To do this, define
then invoke a shell function. I have an alias `git fixup` which has almost the
same API as `git commit` but takes an existing commit as the first argument.
That will apply the staged change to that commit and rebase all later commits
atop it. Useful when working in a stacked PR and fixing an issue in one of the
earliest commits:

```sh
git config --global alias.fixup '!f() { TARGET=$(git rev-parse "$1"); git commit --fixup=$TARGET ${@:2} && EDITOR=true git rebase -i --autostash --autosquash $TARGET^; }; f'
```
