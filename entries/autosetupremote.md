---
title: autoSetupRemote
permalink: autosetupremote
date: 2022-08-20T20:53:16-07:00
tags: git
---

Ever seen this git error message while creating and pushing a new branch before
opening a PR?

```
fatal: The current branch my-pr-change has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin my-pr-change
```

Perhaps you have a script you use which automates setting this upstream for your
new branches, but as of
[git v2.37](https://github.blog/2022-06-27-highlights-from-git-2-37/) which was
released June 2022, Git can handle this directly.

From your terminal, run:

```
git config --global push.autoSetupRemote true
```

This allows a simple `git push` to automatically create remote branches to
match.
