---
title: how to remove the mac desktop
permalink: remove-mac-desktop
date: 2022-01-13T21:32:26-08:00
tags: mac
---

After nearly two decades on a Mac, I've finally come to the conclusion that the
Desktop is actively harmful. It is the junk drawer of the Mac. It distracts me,
it collects stuff, things get lost there, I'm done with it. Here's how to get
rid of it.

- Remove everything from the Desktop folder.
- Make sure nothing is being automatically saved to the desktop. The most likely
  culprit is [Screenshot.app](../mac-screenshot/).
- Disable the Desktop folder from the desktop, and restart Finder
  ```sh
  defaults write com.apple.finder CreateDesktop false
  Killall Finder
  ```
- Open Finder, right click Desktop in sidebar and "Remove from Sidebar"

You can't actually delete the Desktop folder itself, because Finder will just
recreate it upon finding it missing. You can instead render it useless by
symlinking it back to your home directory[^symlink].

[^symlink]:
    As an aside, if you want to keep your Desktop but want to put it somewhere
    else (like within Dropbox), these same symlinking steps will achieve this,
    just change the linked location.

```sh
rm -rf ~/Desktop
ln -s ~ ~/Desktop
sudo chflags -h schg ~/Desktop
```

This last step stops Finder from replacing the symlink with an empty directory.
