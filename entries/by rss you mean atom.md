---
title: by RSS you mean Atom
permalink: by-rss-you-mean-atom
date: 2022-01-10T21:50:17-08:00
tags: til
---

I set about adding an "RSS feed" for this til site, only to find that despite
reader apps calling themselves "RSS readers", that most "RSS" feeds out there
are not actually written in [RSS], they're mostly written in [Atom]. There are
actually a small handful of feed document formats out there, and RSS is sort
of the "Kleenex" of the feed marketplace: all feeds find themselves called
"RSS" when they may not be.

RSS was created in 1999 (the [best era of the web](https://www.youtube.com/watch?v=vG8WpLr6y_U)
if you ask me) by Netscape as a simplification of RDF. It was ...tossed over
the wall. This was right about the time of the Netscape & AOL merger, and RSS
disappeared from netscape.com. Meanwhile RSS was _very popular_ in the early
days of the internet and adopted by many media companies figuring out this
whole world wide web thing. In 2002 the version of RSS we mostly know was
created by an independent group (retitled from "Rich Site Summary" to "Really
Simple Syndication") but under dubious legal circumstances and under the shadow
of the AOL/Netflix conglomerate which technically owned the copyright.

Emerge [Atom], an open standard introduced in 2003 meant to replace RSS. It's
vendor neutral and open, solves some of RSS's quirks, extensible,
internationalized, championed by Google and other cool young tech companies,
and even blessed by the IETF as RFC4287. And it still gets called "RSS",
sigh... open source is hard sometimes.

Two decades later, please use [Atom] for your syndication feeds. It has been
hardened by two decades of use and still works great.

In fact, even this site [has one](https://leebyron.com/til/feed.xml)! Consider
subscribing with [NetNewsWire], an open source feed reader.

[rss]: https://www.rssboard.org/rss-specification
[atom]: https://datatracker.ietf.org/doc/html/rfc4287
[netnewswire]: https://netnewswire.com/
