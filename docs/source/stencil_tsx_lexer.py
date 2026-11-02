from pygments.lexers.jsx import TsxLexer
from pygments.lexer import bygroups
from pygments.token import Name, Punctuation


class StencilTsxLexer(TsxLexer):
    name = "Stencil TSX"
    aliases = ["stencil-tsx"]

    tokens = {
        "jsx": [
            (r"</?>", Punctuation),
            (
                r"(<)([\w-]+)(\.?)",
                bygroups(Punctuation, Name.Tag, Punctuation),
                "tag",
            ),
            (
                r"(</)([\w-]+)(>)",
                bygroups(Punctuation, Name.Tag, Punctuation),
            ),
            (
                r"(</)([\w-]+)",
                bygroups(Punctuation, Name.Tag),
                "fragment",
            ),
        ],
    }