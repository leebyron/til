---
title: multi-purpose modifier keys
permalink: multi-purpose-modifier-keys
date: 2022-01-22T22:19:43-08:00
tags: keyboards
---

I spent a very long time not thinking too hard about customizing my keyboard
beyond [remapping caps lock][remap caps lock]. That is not until recently when I
started playing around with the custom keyboard firmware [QMK] and macOS
keyboard customization software [Karabiner]. The most immediately useful thing I
discovered was leveraging modifier keys to have multiple purposes.

Modifier keys are held down so that other key presses result in a different
symbol or command. But what if they're pressed alone? Nothing happens? That's an
opportunity.

The first I tried was the "Vim key". Caps lock is remapped to the much more
useful control key when held. When pressed alone, it is escape. This key is
really easy to reach from the home row and this made getting in and out of Vim
insert mode feel much easier. However I found myself falling back to muscle
memory to reach for escape or use the equivalent and now easier to press
control+c.

Much more ergonomically offensive is backspace. I'm a terrible typist so
backspace is probably one of my most pressed keys and far enough from the home
row that my whole hand must move. So the next mapping I've tried is Caps lock as
control and backspace. This muscle memory has been hard to unwire, so I've
disabled my true backspace key.

Here's a small part of my Karabiner "complex_modifications" configuration:

```json
"manipulators": [
    {
        "type": "basic",
        "from": {
            "key_code": "caps_lock",
            "modifiers": { "optional": ["any"] } },
        "to": [ { "key_code": "left_control", "lazy": true } ],
        "to_if_alone": [ { "key_code": "delete_or_backspace" } ] },
    {
        "type": "basic",
        "from": {
            "key_code": "delete_or_backspace",
            "modifiers": { "optional": [ "all" ] } },
        "to": [ { "key_code": "vk_none" } ] },
```

Also, this works both ways! Not only can you provide a behavior for pressing
modifier keys on their own, but also consider making a typical key a modifier
when held. As an example, I map the return key to behave as "right control" when
held.

[remap caps lock]: https://leebyron.com/til/remap-caps-lock/
[qmk]: https://qmk.fm
[karabiner]: https://karabiner-elements.pqrs.org
