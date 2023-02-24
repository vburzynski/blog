---
title: This RegEx Will Change How You Design With Tailwind
date: 2022-05-18T00:00:00.000-05:00
image: this-regex-will-change-how-you-design-with-tailwind.jpg
imageAlt: A woman in a bookstore
category: Development
tags:
  - TailwindCSS
  - Stylesheets
  - RegEx
summary: An exploration of how to utilize regular expressions to change the design of your website when using TailwindCSS.
---

Are you using TailwindCSS in you project?

> ... of course you are it's all the rage lately, and everyone’s using it.

Need to change all the color based utilities in your app because you need to use semantic color names to implement a new color theme, fix dark mode, or change colors for any other reason?

> ... of course you do! Changes to the user interface, theme and graphics come up all the time.

Have you now realized your styles are dispersed and scattered across all the markup within your project?

> ... of course you have, and you’ve probably also realized your components aren’t organized as well as you would like.

Well I have a simple regular expression to aid you in swapping out all your old color utilities with new color utilities:

~~~regex
(ext|decoration|bg|from|via|to|border|divide|outline|ring|ring-offset|shadow|accent|caret|fill|stroke){1}-(inherit|current|transparent|black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|blueGray|coolGray|trueGray|warmGray|lightBlue){1}(-[0-9]{2,3})?
~~~
*No warranty is provided or inferred. Use at your own peril. Void where prohibited by law. May cause nausea, confusion, or panic. If you experience any of these symptoms, please discontinue use of the regular expression.*

The regex above should match against all of the default atomic color utilties that TailwindCSS provides and can be modified to more specifically match your use case. You may want to narrow down the list of color names or utility names to catch a specific subset of utilizations. Custom color names could be added to the list. You might also expand the regex to target specific variant modifiers.

For example, the regular expression below will match instances where at least one of the listed variant modifiers is used; narrows the set of utility names, and matches against a list of custom colors:

~~~regex
\b((dark|hover|active|focus|focus-visible):)+(text|bg|placeholder|ring|border|divide){1}-(platinum|gold|silver|bronze){1}(-[0-9]{2,3})?
~~~

## List of variant modifiers provided by TailwindCSS

`first-letter` `first-line` `marker` `selection` `file` `placeholder` `backdrop` `before` `after` `first` `last` `only` `odd` `even` `first-of-type` `last-of-type` `only-of-type` `visited` `target` `open` `default` `checked` `indeterminate` `placeholder-shown` `autofill` `required` `valid` `invalid` `in-range` `out-of-range` `read-only` `empty` `focus-within` `hover` `focus` `focus-visible` `active` `enabled` `disabled` `group` `peer` `ltr` `rtl` `motion-safe` `motion-reduce` `dark` `print` `sm` `md` `lg` `xl` `2xl` `portrait` `landscape`

## List of default colors

`inherit` `current` `transparent` `black` `white` `slate` `gray` `zinc` `neutral` `stone` `red` `orange` `amber` `yellow` `lime` `green` `emerald` `teal` `cyan` `sky` `blue` `indigo` `violet` `purple` `fuchsia` `pink` `rose` `blueGray` `coolGray` `trueGray` `warmGray` `lightBlue`

## List of utility prefixes

`text` `decoration` `bg` `from` `via` `to` `border` `divide` `outline` `ring` `ring-offset` `shadow` `accent` `caret` `fill` `stroke`

Photo by <a href="https://unsplash.com/@darwiiiin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Darwin Vegher</a> on <a href="https://unsplash.com/s/photos/clutter?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

Republished from [bendyworks.com/blog](bendyworks.com/blog) with permission.
