---
title: meta tags and the semantic web
permalink: meta-tags-and-the-semantic-web
date: 2022-01-11T22:53:30-08:00
tags: web
---

For better or worse these days a lot of the web is consumed via an aggregator
platform. Search engines like Google, or Duck Duck Go, and social media like
Facebook, Twitter, Reddit, and Mastodon. When links are displayed on these
platforms, they use available metadata to give as rich a preview as possible.

This is the reality of the branch of the multiverse we find ourselves in tracing
back to a quote from Sir Tim Berners Lee from
[1999](https://youtu.be/vG8WpLr6y_U?):

> I have a dream for the Web [in which computers] become capable of analyzing
> all the data on the Web – the content, links, and transactions between people
> and computers. A "Semantic Web", which makes this possible, has yet to emerge,
> but when it does, the day-to-day mechanisms of trade, bureaucracy and our
> daily lives will be handled by machines talking to machines.

Some variation of this is is right...

However, for us Webmasters, it's tough to keep track of the peculiarities of how
each platform would like to consume semantic information. Having just added some
meta data to this very page, I'll drop some links and tl;dr of what I learned
along the way:

- [RDF] (Resource Description Language) and [OWL] (Web Ontology Language) were
  early standards that live on. They don't get a lot of practical use.
- [Open Graph] is a standard proposed by Facebook which addressed the mess that
  was the web at the time[^og deck]. It has a surprisingly broad schema and some
  quirks[^og non standard].
- [Facebook] (and other Meta apps, like Messenger) use Open Graph with some
  minor Facebook specific additions.
  - Use the [share debugger](https://developers.facebook.com/tools/debug/) to
    see what information was parsed and any warnings. It shows a share preview
    based on an older version of their desktop site and can't be relied on.
- [Twitter] uses Open Graph if it finds them, but adds "Card Tags". This is most
  helpful when you want something to appear slightly differently on Twitter vs
  Facebook.
  - Use their [card validator](https://cards-dev.twitter.com/validator) to see
    what a card will look like. This shows for desktop, I'm not aware of a
    mobile preview.
- [Google] will also use Open Graph if it finds it, but prefers [JSON-LD].
  JSON-LD is pretty nice to work with and there's a huge set of
  [available schema](https://schema.org/docs/schemas.html).
  - There are
    [multiple validators](https://developers.google.com/search/docs/advanced/structured-data)
    for both generic JSON-LD and Google specific results. Despite being the most
    mature of these tools, I've found it least helpful in giving error messages.
    Caveat caelator.

[^og deck]: Facebook made an interesting
[deck on the design decisions](https://www.scribd.com/doc/30715288/The-Open-Graph-Protocol-Design-Decisions)
of Open Graph that details these problems. It's an interesting read.

[^og non standard]: Open Graph uses `<meta>` tags, but annoyingly uses a
`property="og:type"` attribute which is non standard. It ideally should have
used
[`name=`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-name)
(which Twitter cards does). Someone should have caught that in code review.

[semantic web]:
  https://en.wikipedia.org/wiki/Semantic_Web
  'sometimes known as Web 3.0'
[rdf]: https://www.w3.org/RDF/
[owl]: https://en.wikipedia.org/wiki/Web_Ontology_Language
[open graph]: https://ogp.me/
[facebook]: https://developers.facebook.com/docs/sharing/webmasters/#markup
[twitter]:
  https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
[google]:
  https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data
[json-ld]: https://json-ld.org/
