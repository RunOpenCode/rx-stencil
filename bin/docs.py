#!/usr/bin/env python3

import os
import subprocess

import click
from rich.console import Console

console = Console()
script_directory = os.path.dirname(__file__)
working_directory = os.path.abspath(os.path.join(script_directory, '..'))
os.chdir(working_directory)


@click.command()
@click.option('--watch', '-w', is_flag=True,
              help="Rebuild documentation automatically when source code is change (set watcher).")
def docs(watch):
    """This script will generate documentation."""
    os.system('{} -M html docs/source/ build/docs --fresh-env'.format(
        'sphinx-autobuild' if watch is True else 'sphinx-build',
        working_directory
    ))


if __name__ == '__main__':
    docs()
