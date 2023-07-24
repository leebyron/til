---
title: ascii table
permalink: ascii-table
date: 2022-01-09T23:49:50-08:00
tags:
---

The [ASCII] 7-bit character encoding is ubiquitous[^actually-utf8] and
foundational to how computers talk to each other. It has an absolutely
fascinating history that dates surprisingly far back. The ASCII standard started
in 1963, and was iterated until 1986. ASCII was based on ITA2, a telegraph
standard from 1924, which itself derived from [Baudot code] from 1870—literally
the beginning of digital communication (the namesake for "baud" speed).

<style innerHTML=".ascii-table td:first-child { background: #00000008; }" />
<pre class="ascii-table">
|            | `0x00`          | `0x10`          | `0x20` | `0x30` | `0x40` | `0x50` | `0x60`  | `0x70`     |
| ---------- | --------------- | --------------- | ------ | ------ | ------ | ------ | ------- | ---------- |
| **`0x00`** | [`␀`] `⌃@` `\0` | [`␐`] `⌃P`      | Space  | `0`    | `@`    | `P`    | `` ` `` | `p`        |
| **`0x01`** | [`␁`] `⌃A`      | [`␑`] `⌃Q`      | `!`    | `1`    | `A`    | `Q`    | `a`     | `q`        |
| **`0x02`** | [`␂`] `⌃B`      | [`␒`] `⌃R`      | `"`    | `2`    | `B`    | `R`    | `b`     | `r`        |
| **`0x03`** | [`␃`] `⌃C`      | [`␓`] `⌃S`      | `#`    | `3`    | `C`    | `S`    | `c`     | `s`        |
| **`0x04`** | [`␄`] `⌃D`      | [`␔`] `⌃T`      | `$`    | `4`    | `D`    | `T`    | `d`     | `t`        |
| **`0x05`** | [`␅`] `⌃E`      | [`␕`] `⌃U`      | `%`    | `5`    | `E`    | `U`    | `e`     | `u`        |
| **`0x06`** | [`␆`] `⌃F`      | [`␖`] `⌃V`      | `&`    | `6`    | `F`    | `V`    | `f`     | `v`        |
| **`0x07`** | [`␇`] `⌃G` `\a` | [`␗`] `⌃W`      | `'`    | `7`    | `G`    | `W`    | `g`     | `w`        |
| **`0x08`** | [`␈`] `⌃H` `\b` | [`␘`] `⌃X`      | `(`    | `8`    | `H`    | `X`    | `h`     | `x`        |
| **`0x09`** | [`␉`] `⌃I` `\t` | [`␙`] `⌃Y`      | `)`    | `9`    | `I`    | `Y`    | `i`     | `y`        |
| **`0x0A`** | [`␊`] `⌃J` `\n` | [`␚`] `⌃Z`      | `*`    | `:`    | `J`    | `Z`    | `j`     | `z`        |
| **`0x0B`** | [`␋`] `⌃K` `\v` | [`␛`] `⌃[` `\e` | `+`    | `;`    | `K`    | `[`    | `k`     | `{`        |
| **`0x0C`** | [`␌`] `⌃L` `\f` | [`␜`] `⌃\`      | `,`    | `<`    | `L`    | `\`    | `l`     | `\|`       |
| **`0x0D`** | [`␍`] `⌃M` `\r` | [`␝`] `⌃]`      | `-`    | `=`    | `M`    | `]`    | `m`     | `}`        |
| **`0x0E`** | [`␎`] `⌃N`      | [`␞`] `⌃^`      | `.`    | `>`    | `N`    | `^`    | `n`     | `~`        |
| **`0x0F`** | [`␏`] `⌃O`      | [`␟`] `⌃_`      | `/`    | `?`    | `O`    | `_`    | `o`     | [`␡`] `⌃?` |
</pre>

## Other fun facts about ASCII:

- The first 128 Unicode values are ASCII. UTF-8, the most common modern
  encoding, uses a variable number of bytes to cover the full Unicode spectrum,
  but just happens to use exactly one byte for the first 128 and exactly matches
  ASCII. That means every ancient ASCII file is also a valid modern UTF-8 file.
  This is a _beautiful_ hack and a major reason for the success of UTF-8.
- The number digits are carefully placed so [BCD] can be converted to ASCII and
  vice-versa in one instruction: `ascii = bcd XOR 0x30`.
- Many keys you still reach via "shift" on a modern keyboard are either `0x10`
  or `0x20` above their standard key, a holdover from mechanical typewriters.
- Lowercase letters are exactly `0x20` above uppercase.
- Your "control" key has a `⌃` on it because its original purpose was to remap
  typical keys to control keys by xor'ing the highest bit `0x40` (`XOR` also
  happens to be `^` in C). Some of these vestiges of the past still work
  everywhere, and all should work in your terminal! Try `⌃H` for a home-row
  oriented backspace.

[^actually-utf8]: These days it's really UTF-8 thats ubiquitous.

[ascii]: https://en.wikipedia.org/wiki/ASCII
[baudot code]: https://en.wikipedia.org/wiki/Baudot_code
[bcd]: https://en.wikipedia.org/wiki/Binary-coded_decimal
[`␀`]: https://en.wikipedia.org/wiki/Null_character 'Null'
[`␁`]: https://en.wikipedia.org/wiki/Start_of_Heading 'Start of Heading'
[`␂`]: https://en.wikipedia.org/wiki/Start_of_Text 'Start of Text'
[`␃`]: https://en.wikipedia.org/wiki/End-of-Text_character 'End of Text'
[`␄`]:
  https://en.wikipedia.org/wiki/End-of-Transmission_character
  'End of Transmission'
[`␅`]: https://en.wikipedia.org/wiki/Enquiry_character 'Enquiry'
[`␆`]: https://en.wikipedia.org/wiki/Acknowledge_character 'Acknowledgement'
[`␇`]: https://en.wikipedia.org/wiki/Bell_character 'Bell'
[`␈`]: https://en.wikipedia.org/wiki/Backspace 'Backspace'
[`␉`]: https://en.wikipedia.org/wiki/Horizontal_Tab 'Horizontal Tab'
[`␊`]: https://en.wikipedia.org/wiki/Line_Feed 'Line Feed'
[`␋`]: https://en.wikipedia.org/wiki/Vertical_Tab 'Vertical Tab'
[`␌`]: https://en.wikipedia.org/wiki/Form_Feed 'Form Feed'
[`␍`]: https://en.wikipedia.org/wiki/Carriage_Return 'Carriage Return'
[`␎`]: https://en.wikipedia.org/wiki/Shift_Out 'Shift Out'
[`␏`]: https://en.wikipedia.org/wiki/Shift_In 'Shift In'
[`␐`]: https://en.wikipedia.org/wiki/Data_Link_Escape 'Data Link Escape'
[`␑`]:
  https://en.wikipedia.org/wiki/Device_Control_1
  'Device Control 1 / XON / Resume'
[`␒`]: https://en.wikipedia.org/wiki/Device_Control_2 'Device Control 2'
[`␓`]:
  https://en.wikipedia.org/wiki/Device_Control_3
  'Device Control 3 / XOFF / Pause'
[`␔`]: https://en.wikipedia.org/wiki/Device_Control_4 'Device Control 4'
[`␕`]:
  https://en.wikipedia.org/wiki/Negative-acknowledge_character
  'Negative Acknowledgement'
[`␖`]: https://en.wikipedia.org/wiki/Synchronous_Idle 'Synchronous Idle'
[`␗`]:
  https://en.wikipedia.org/wiki/End-of-Transmission-Block_character
  'End of Transmission Block'
[`␘`]: https://en.wikipedia.org/wiki/Cancel_character 'Cancel'
[`␙`]: https://en.wikipedia.org/wiki/End_of_Medium 'End of Medium'
[`␚`]: https://en.wikipedia.org/wiki/Substitute_character 'Substitute'
[`␛`]: https://en.wikipedia.org/wiki/Escape_character 'Escape'
[`␜`]: https://en.wikipedia.org/wiki/File_Separator 'File Separator'
[`␝`]: https://en.wikipedia.org/wiki/Group_Separator 'Group Separator'
[`␞`]: https://en.wikipedia.org/wiki/Record_Separator 'Record Separator'
[`␟`]: https://en.wikipedia.org/wiki/Unit_Separator 'Unit Separator'
[`␡`]: https://en.wikipedia.org/wiki/Delete_character 'Delete'
