# things i've learned

Brief blurbs on miscellaneous matter; everyday things I learn, things
I know but often forget, and anything else I care to write down as I 
[learn in public]. Not always definitive nor novel but hopefully helpful
or at least interesting.

[learn in public]: https://www.swyx.io/learn-in-public/

---

https://leebyron.com/til

---

This repo is automatically maintained by a `til` script, found in `/bin/til`,
symlinked into my `/.local/bin` directory. It relies on some local programs
being available, such as `vim` and `fzf`.

Setting this up for your own system in its current state might not be so
straightforward. If setting up your own til is interesting enough to you that
you would be willing to help factor out reusable parts, open an issue to
discuss.


## Setup (only works on *nix)

- Install [NodeJS](https://nodejs.org/en/download)
- Install fzf
  - Ubuntu: `sudo apt install fzf`
- Modify the [Config File](./config.mjs) with your own info
- In [GitHub pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), set it so you have the settings:
  - Source: Deploy from a branch (Classic Pages experience)
  - Branch: `gh-pages`, from the folder `/ (root)`


## License

Code found here is licensed under [MIT]. Content under [CC BY 4.0].

[MIT]: ./LICENSE
[CC BY 4.0]: https://creativecommons.org/licenses/by/4.0/
