---
title: launch control
permalink: launch-control
date: 2022-01-19T23:07:38-08:00
tags: mac
---

I need to run a command every time a particular file changed. In the past I've
used tools like [watchman] to do this, and found them heavyweight. In this
particular case, I could safely assume I was running on macOS and wanted to
avoid the dependency of installed software. _Then I learned about `launchctl`._

The man page for [launchctl] is not particularly helpful, so it required some
searching and experimenting to understand. This, along with [launchd], are a
powerful system for configuring services within the operating system. One way
launchd determines that a service should be started is by watching for changes
to a file. Perfect.

A "service" is any executable program (like a shell script or a JavaScript file)
and a configuration plist file placed in a specific location. For example, lets
set up a service that runs a website builder every time a source file is
updated.

Here, `~/Library/LaunchAgents/com.leebyron.website-agent.plist` defines the name
of my agent, the program to run, where to write standard output, and the path to
watch. Changes to that path will run my program. Note that the program is not
run inside a shell, so a node script needs to provide a full path to the node
executable, rather than a executable "hash bang".

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.leebyron.website-agent</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/leebyron/.nvm/versions/node/v17.3.0/bin/node</string>
        <string>/Users/leebyron/projects/website/generate.js</string>
    </array>
    <key>StandardOutPath</key>
    <string>/Users/leebyron/projects/website/output.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/leebyron/projects/website/output.log</string>
    <key>WatchPaths</key>
    <array>
        <string>/Users/leebyron/projects/website/src</string>
    </array>
</dict>
</plist>
```

Finally, tell launch control about this service. You'll need to know your uid
number (which you can find by running the `id` command). Replace "500" here with
whatever your uid happens to be.

```sh
launchctl bootstrap gui/500/ ~/Library/LaunchAgents/com.leebyron.website-agent.plist
```

To remove this service, replace `bootstrap` with `bootout`:

```sh
launchctl bootout gui/500/ ~/Library/LaunchAgents/com.leebyron.website-agent.plist
```

[watchman]: https://facebook.github.io/watchman/
[launchctl]: x-man-page://launchctl
[launchd]: x-man-page://launchd
