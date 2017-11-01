# Why, hello there
We're excited you're interested in contributing to Tiny Money. This guide
contains standards we ask that you please adhere to while you work alongside us.

If you haven't already, we recommend reading [Tyler's][tyler] article,
[The Good, Better & Best of Budgeting Software][budget-article].


## Code of conduct
Our [code of conduct][code-of-conduct] is the [Contributor Covenant][contributor-covenant].
If you're unfamiliar with it, we strongly urge you to read it.

> The first rule of Tiny Money is: be kind.<br>
> The second rule of Tiny Money is: be kind.


## Style guides
In the name of **legibility across the code base,** we adhere to style guides.
Linters are your friends, and you should configure your editor to use the
provided linter configurations.


### Global
1. **All** files should end in a new line.
2. Unless otherwise stated or there's very good reason not to do so,
   <q>please, alphabetize it.</q>

   ```js
   let music = [
     // Good: Alphabetized properties.
     {
       artist: 'David Bowie',
       genre:  'Glam Rock',
       title:  'Five Years',
     },
     // Bad: Properties all willy nilly.
     {
       title:  'Everything ever to come from',
       artist: 'Everyone who makes',
       genre:  'Dubstep',
     },
   ];
   ```

   Editors tend to have a way of doing this for you:

   | Editor  | Package                                  | Shortcut      |
   |:------- |:---------------------------------------- |:------------- |
   | Atom    | [First-party package][package-sort-atom] | <kbd>F5</kbd> |
   | Sublime | Core                                     | <kbd>F5</kbd> |

### JavaScript
- [Airbnb JavaScript Style Guide][airbnb] ([ESLint configuration file][eslint-config])
- [Vue style guide][vue-style] (Unfortunately, there's no Vue linter at the time of writing.)
  - We use `.vue` files for templates and scripts, but keep our styles in `.scss`
    files because we find it more convenient.

### Sass
[Sass Lint configuration file][sass-lint-config]



[airbnb]: https://github.com/airbnb/javascript
[budget-article]: https://medium.com/@tyvdh/the-good-better-and-best-of-budgeting-software-b1f9123436eb
[code-of-conduct]: ./CODE_OF_CONDUCT.md
[contributor-covenant]: https://www.contributor-covenant.org/
[eslint-config]: ../.eslintrc.js
[package-sort-atom]: https://atom.io/packages/sort-lines
[sass-lint-config]: ../.sass-lint.yml
[tyler]: https://github.com/tyvdh
[vue]: https://vuejs.org/
[vue-style]: https://vuejs.org/v2/style-guide/
