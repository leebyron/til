---
title: community git aliases
permalink: community-git-aliases
date: 2022-01-28T22:18:48-08:00
tags: [git]
---

After writing about [git aliases](../git-alias/) I asked my Twitter followers
for their favorite custom aliases, and learned about a number of new ones!

To list them here, I'll show them in git configfile syntax. You can find yours
at either `~/.gitconfig` or `~/.config/git/config`.

```ini
[alias]
  # My MVPs (@leeb)
  s = "!git add -A; git status -s"
  sl = log --graph --simplify-by-decoration --pretty=format:'%D %C(dim)(%cr)' --all --not --tags
  last = log -1 HEAD
  addremove = add --all
  fixup = "!f() { TARGET=$(git rev-parse "$1"); git commit --fixup=$TARGET ${@:2} && EDITOR=true git rebase -i --autostash --autosquash $TARGET^; }; f"
  unstage = restore --staged
  discard = restore

  # Find the ancestor and merge bases of sets of commits (@leeb)
  oldest-ancestor = !zsh -c 'diff --old-line-format='' --new-line-format='' <(git rev-list --first-parent "${1:-master}") <(git rev-list --first-parent "${2:-HEAD}") | head -1'
  all-merge-bases = "!f() { eval $(git for-each-ref --shell --format='git merge-base master %(refname);' refs/heads) | sort | uniq; }; f"
  common-merge-base = "!f() { git rev-list --no-walk $(git all-merge-bases) | tail -n1; }; f"

  # Replace "git git" with "git" (@jkreeftmeijer)
  git = !git

  # Nice shortcuts (@mathias)
  st = status -s

  # Show the diff between the latest commit and the current state (@mathias)
  d = !"git diff-index --quiet HEAD -- || clear; git --no-pager diff --patch-with-stat"

  # Show different kinds of things (@mathias)
  tags = tag -l
  branches = branch --all
  aliases = config --get-regexp alias
  remotes = remote --verbose
  contributors = shortlog --summary --numbered --email

  # Credit an author on the latest commit: git credit "Lee Byron" lee@leebyron.com (@mathias)
  credit = "!f() { git commit --amend --author \"$1 <$2>\" -C HEAD; }; f"

  # Show the user email for the current repository. (@mathias)
  whoami = config user.email

  # Remove branches that have already been merged with main, "delete merged" (@mathias)
  dm = "!git branch --merged | grep -v '\\*' | xargs -n 1 git branch -d"

  # Find branches with commit, tags with commit, comments with code, and commits with message (@mathias)
  fb = "!f() { git branch -a --contains $1; }; f"
  ft = "!f() { git describe --always --contains $1; }; f"
  fc = "!f() { git log --pretty=format:'%C(yellow)%h  %Cblue%ad  %Creset%s%Cgreen  [%cn] %Cred%d' --decorate --date=short -S$1; }; f"
  fm = "!f() { git log --pretty=format:'%C(yellow)%h  %Cblue%ad  %Creset%s%Cgreen  [%cn] %Cred%d' --decorate --date=short --grep=$1; }; f"

  # Stage commits by chunk (@skwp)
  chunkyadd = add --patch

  # Alternative to "git stash" (@skwp)
  # via http://philjackson.github.io/2013/04/07/handy-git-tips-to-stop-you-getting-fired.html
  snapshot = !git stash save "snapshot: $(date)" && git stash apply "stash@{0}"
  snapshots = !git stash list --grep snapshot

  # Nice shortcuts (@DLX)
  cl = clone --recursive
  co = checkout --quiet
  subup = submodule update --recursive --init

  # Pretty log (@4lb0)
  l = log --graph --decorate --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
  # Undo last commit (@4lb0)
  undo = reset --soft HEAD~
  # Add and commit: git c "message" (@4lb0)
  c = "!f() { git add --all && git commit -m \"$1\"; } f"

  # Force push less likely to clobber your coworker's work (@HostileUX)
  pushf = push --force-with-lease

  # Add changed files into the existing commit (@samhogy)
  whoops = commit --amend --no-edit
  # Push a new branch to origin
  pushu = !git push -u origin $(git symbolic-ref --short HEAD)

  # Another prettier but more verbose log (@_angelmm)
  ll = log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n''          %C(white)%s%C(reset) %C(bold red)- %an%C(reset)' --all

  # Use fzf to add, restore, restore staged, fix previous commit (@mattorb)
  fza = "!git ls-files -m -o --exclude-standard | fzf --print0 -m --preview 'git diff {}' --preview-window=top:10:wrap | xargs -0 -t -o git add --all"
  fzr = "!git ls-files -m --exclude-standard | fzf --print0 -m --preview 'git diff {}' --preview-window=top:10:wrap | xargs -0 -t -o git restore"
  fzrs = "!git diff --name-only --staged | fzf --print0 -m --preview 'git diff {}' --preview-window=top:10:wrap | xargs -0 -t -o git restore --staged"
  ffix = !HASH=`git log --pretty=oneline | head -n 100 | fzf` && git fixit `echo ${HASH} | awk '{ print $1 }'`
```
