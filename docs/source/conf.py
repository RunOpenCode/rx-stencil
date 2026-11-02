import os
import sys

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from stencil_tsx_lexer import StencilTsxLexer


# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = '@runopencode/rx-stencil'
copyright = '2026, RunOpenCode'
author = 'Nikola Svitlica a.k.a TheCelavi'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinx_favicon',
    'sphinx_copybutton',
    'sphinx_inline_tabs',
    'sphinx_design',
]

templates_path = ['_templates']
exclude_patterns = []

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'furo'
html_static_path = ['_static']
html_theme_path = ['.']
html_theme_options = {
    'light_logo': 'logo/run-open-code-black.svg',
    'dark_logo': 'logo/run-open-code-white.svg',
}
html_css_files = [
    'css/layout.css',
]
html_title = 'RxJS for Stencil'
# Favicon configuration
favicons = [
    {
        'href': 'logo/run-open-code-black.svg'
    },
]

highlight_language = 'typescript'

# Enable copy buttons
copybutton_only_copy_prompt_lines = False


def setup(app):
    app.add_lexer("tsx", StencilTsxLexer)