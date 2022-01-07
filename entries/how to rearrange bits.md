---
title: how to rearrange bits
permalink: how-to-rearrange-bits
date: 2022-01-04T00:58:22-08:00
tags: []
---

If you have a bit-powered display where the elements don't align to the bits in
the byte, you may want to remap bits from the source byte to the destination
byte. Manually writing a bunch of shifts is frustrating, and I found a great
tool which writes this code for you!

http://programming.sirrida.de/calcperm.php

I just used this to map sprite binary data to Unicode [braille
patterns](https://www.fileformat.info/info/unicode/block/braille_patterns/list.htm).
The 8 dots in a braille pattern can map to a byte, but perhaps not in the order
you expect.
