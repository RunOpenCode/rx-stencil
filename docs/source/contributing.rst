===========================
Contributing to the project
===========================

We welcome contributions from the community! Whether you're fixing bugs, adding 
new features, or improving documentation, your help is appreciated. 

Here are some guidelines to get you started.

Code of Conduct
---------------

**Be nice and respectful to others.**

Don't get frustrated, and remember that everyone is here to help each other. If 
there is an issue, first try to resolve it and send a pull request. If you 
encounter any problems, please reach out to the maintainers and ask for help.

If you want to make contribution which could be considered as "big" change, you 
should first open an issue to discuss it with maintainers and community. We 
value your time and effort, so we want to make sure that your contribution 
aligns with the project's goals and needs.

Report issues
-------------

.. _GitHub Issues: https://github.com/RunOpenCode/rx-stencil/issues

All issues should be reported on main repository's issue tracker which can be 
found at `GitHub Issues`_. Before reporting a new issue, please search the 
existing issues to see if it has already been reported. If you find a similar 
issue, you can add additional information or a comment to help the maintainers 
understand the problem better.

Provide as much detail as possible when reporting an issue, including:

* Steps to reproduce the issue
* Expected behavior
* Actual behavior
* Environment details (e.g., node/npm version, operating system)

Pull requests and contributions
-------------------------------

In order to contribute code or documentation changes, first, you need to setup 
your development environment.

All contributions should be made via pull requests on the main repository from 
your forked repository.

Make sure that your real identity is associated with your GitHub account, as all 
contributions are recorded and displayed publicly.

In order to submit a pull request, the following guidelines should be followed:

* **License**: All contributions must be licensed under the same license as the 
  project (MIT License). By submitting a pull request, you agree to license your 
  contribution under the MIT License.
* **Coding Standards**: Follow the project's coding standards and best 
  practices. Make sure that your code is clean, well-documented, and adheres to 
  the existing style. Don't use ``else``, keep cyclomatic complexity low 
  (preferably under 5), and write meaningful commit messages.
* **Tests**: Include tests for any new features or bug fixes. Ensure that you 
  provide tests of high quality, covering edge cases and potential failures. At 
  least 80% of code coverage is required. Make sure that all existing tests pass
  before submitting your pull request.
* **Documentation**: Update the documentation to reflect any changes made. 
  Ensure that your documentation is clear, concise, and easy to understand. It 
  is expected that all public methods and classes are documented using JSDoc 
  comments in code and that any relevant documentation files are updated as 
  well.
* **Branches**: Create a new branch for each feature or bug fix. Use descriptive 
  branch names that reflect the purpose of the changes, e.g., 
  ``feature/add-new-functionality`` or ``bugfix/fix-issue-123``.
* **Static code analysis**: Make sure that your code passes static code analysis
  using installed ``ESLint`` as well as any other tool used in the project. Try
  not to suppress any warnings or errors reported by static code analysis tools.
  If you must suppress some warnings, please explain why in the pull request
  description.

Make sure that you update ``CHANGELOG`` file with a description of your changes,
following the existing format. 

Useful links
------------

* Main repository: https://github.com/RunOpenCode/rx-stencil
* Sphinx: https://www.sphinx-doc.org
