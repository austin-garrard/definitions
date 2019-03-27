# How to contribute to Queer Undefined

1. Read CODE_OF_CONDUCT.md
2. Fork the repository
3. Configure your upstream remote. This will allow you to pull changes from the main repository
  ```bash
    git remote add upstream git@github.com:saragw6/definitions.git
    git fetch upstream
  ```
  * For more details about workflow for forked repos, see [this guide](https://gist.github.com/Chaser324/ce0505fbed06b947d962).
4. Check out the staging branch. This is the main development branch.
5. Set up the project: `yarn setup`
  * Prerequisites: node, yarn, postgres
  * See readme for more detailed instructions
6. Find something to do
  * Talk to Sara or email info@queerundefined.com for guidance
  * Bug fixes are great
  * Potential enhancements/features are welcome, but not guaranteed to be merged.
7. Create a pull request. All PRs must:
  * provide a summary of the changes
  * include tests for new or changed code
  * pass the Travis build

_Thank you!_

