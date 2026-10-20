#!/usr/bin/env python3
"""Local static server with Vercel-style extensionless HTML paths."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import os

ROOT = Path(__file__).resolve().parents[1]

class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        translated = super().translate_path(path)
        candidate = Path(translated)
        if not candidate.suffix and candidate.with_suffix('.html').is_file():
            return str(candidate.with_suffix('.html'))
        return translated

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=3000)
    args = parser.parse_args()
    os.chdir(ROOT)
    print(f'Serving static site on port {args.port}', flush=True)
    ThreadingHTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
