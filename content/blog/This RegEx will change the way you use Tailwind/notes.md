
### TailwindCSS

> One little regex that will change how you use Tailwind… -- Derek



Using Tailwindcss in you project?
... of course you are its the all the rage lately, and everyone’s using it.



Need to change all the color based utilities in your app because you need to use semantic color names to implement a new color theme, fix dark mode, or change colors for any other reason?
... of course you do, UI and graphical changes come up all the time.



Have you now realized your styles are dispersed and scattered across all the markup within your project?
 ... of course you have, and you’ve probably also realized your components aren’t organized as well as you’d like.



Well I have a simple regular expression to aid you in swapping out all your old color utilities with new color utilities:

```
\b((dark|hover|active|focus|focus-visible):)*(text|bg|placeholder|ring|border|divide|from|to|via){1}-(transparent|black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|pink|fuchsia|rose|platinum|gold|silver|bronze|main-brand-color|regal-blue|input-focus|darkgold|input|pinned|info|danger)(-[0-9]{2,3})?
```

**note:** you may need to change the set of state prefixes, utility names and modify the color list to the one’s you’ve actually used. No warranty is provided, use at your own peril. void where prohibited by law. May cause nausea, confusion, or panic. If you experience any of these symptoms, please discontinue use of product and consult someone.