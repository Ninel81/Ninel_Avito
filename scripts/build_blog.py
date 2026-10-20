#!/usr/bin/env python3
"""Render reviewed local articles; no API keys or runtime dependencies required."""
import json
from datetime import date
from html import escape as e
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://ninel-khramova-avito.vercel.app'
AUTHOR = 'Нинель Храмова'
POSTS = json.loads((ROOT / 'content/posts.json').read_text())


def page(title, description, path, body, schema):
    data = json.dumps(schema, ensure_ascii=False, indent=2).replace('<', '\\u003c')
    return f'''<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(description, quote=True)}"><meta name="author" content="{AUTHOR}">
<link rel="canonical" href="{BASE}{path}"><meta property="og:url" content="{BASE}{path}"><meta property="og:title" content="{e(title, quote=True)}"><meta property="og:description" content="{e(description, quote=True)}"><meta property="og:type" content="{'article' if path != '/blog/' else 'website'}"><meta property="og:locale" content="ru_RU">
<link rel="stylesheet" href="/styles.css"><script type="application/ld+json">{data}</script></head><body>
<a class="skip-link" href="#main">К содержанию</a><header class="header wrap"><a class="brand" href="/"><span class="mark">а.</span> {AUTHOR}</a><nav aria-label="Основная навигация"><a href="/blog/">Блог</a><a class="nav-cta" href="/#contact">Бесплатный разбор ↗</a></nav></header>
<main class="article wrap" id="main">{body}</main><footer class="wrap"><a href="/">{AUTHOR} · авитолог</a><div class="footer-extra"><a href="/blog/">Блог</a><a href="/#faq">Вопросы и ответы</a></div></footer></body></html>'''


items = []
for post in POSTS:
    slug = post['slug']
    if not slug or any(c not in 'abcdefghijklmnopqrstuvwxyz0123456789-' for c in slug):
        raise ValueError('Invalid slug')
    date.fromisoformat(post['date'])
    if date.fromisoformat(post['date']) > date.today():
        raise ValueError('Do not publish future-dated articles')
    path = f'/blog/{slug}'
    sections = ''.join(f'<section><h2>{e(h)}</h2><p>{e(text)}</p></section>' for h, text in post['sections'])
    links = ''.join(f'<li><a href="/blog/{p["slug"]}">{e(p["title"])}</a></li>' for p in POSTS if p != post)
    body = f'''<p class="breadcrumb"><a href="/">Главная</a> / <a href="/blog/">Блог</a> / {e(post['category'])}</p><p class="eyebrow">{e(post['category'])}</p>
<h1>{e(post['title'])}</h1><p class="article-meta">Автор: {AUTHOR} · <time datetime="{post['date']}">{post['date']}</time></p>
{sections}<aside class="article-cta"><h2>Разберём ваш профиль?</h2><p>Бесплатно оценю оформление, тексты, фото и категории. Дальнейшая работа — по согласованию.</p><a class="button" href="/#contact">Получить бесплатный разбор ↗</a></aside><h2>Читайте также</h2><ul>{links}</ul>'''
    schema = {'@context': 'https://schema.org', '@type': 'BlogPosting', '@id': BASE + path + '#article', 'headline': post['title'], 'description': post['description'], 'datePublished': post['date'], 'dateModified': post['date'], 'inLanguage': 'ru-RU', 'mainEntityOfPage': BASE + path, 'author': {'@type': 'Person', '@id': BASE + '/#ninel', 'name': AUTHOR, 'url': BASE + '/'}}
    (ROOT / f'blog/{slug}.html').write_text(page(post['title'] + ' | ' + AUTHOR, post['description'], path, body, schema))
    items.append(f'<article class="card"><p class="eyebrow">{e(post["category"])}</p><h2><a href="{path}">{e(post["title"])}</a></h2><p>{e(post["description"])}</p><a href="{path}">Читать материал →</a></article>')
body = '<p class="breadcrumb"><a href="/">Главная</a> / Блог</p><h1>Практика продвижения на Авито</h1><p>Материалы Нинель Храмовой о профиле, объявлениях и рекламном бюджете. Начните с вопроса, который важен для вашего бизнеса.</p><div class="blog-grid">' + ''.join(items) + '</div>'
schema = {'@context': 'https://schema.org', '@type': 'Blog', 'name': 'Практика продвижения на Авито', 'url': BASE + '/blog/', 'inLanguage': 'ru-RU', 'author': {'@type': 'Person', '@id': BASE + '/#ninel', 'name': AUTHOR}}
(ROOT / 'blog/index.html').write_text(page('Блог об Авито — Нинель Храмова', 'Практические инструкции: аудит профиля, объявления без обращений, рекламный бюджет и выбор авитолога.', '/blog/', body, schema))
ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
ET.register_namespace('', ns)
urls = ET.Element(f'{{{ns}}}urlset')
for path, modified in [('/', None), ('/blog/', max(p['date'] for p in POSTS)), *[(f'/blog/{p["slug"]}', p['date']) for p in POSTS]]:
    url = ET.SubElement(urls, f'{{{ns}}}url')
    ET.SubElement(url, f'{{{ns}}}loc').text = BASE + path
    if modified:
        ET.SubElement(url, f'{{{ns}}}lastmod').text = modified
ET.indent(urls)
ET.ElementTree(urls).write(ROOT / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
(ROOT / 'llms.txt').write_text('# Нинель Храмова — авитолог\n\n> Оформление, ведение и продвижение на Авито. Бесплатный разбор профиля.\n\nГорода: Чебоксары, Казань, Йошкар-Ола, Самара и близлежащие города. Стоимость дальнейшей работы согласуется отдельно. Количество заявок не гарантируется.\n\n## Основные страницы\n\n- [Главная](' + BASE + '/): услуги, автор, форматы работы и контакт Авито.\n- [FAQ](' + BASE + '/#faq): ответы об услугах, стоимости и начале работы.\n- [Блог](' + BASE + '/blog/): практические материалы.\n' + ''.join('- [' + p['title'] + '](' + BASE + '/blog/' + p['slug'] + ')\n' for p in POSTS) + '\nЭтот файл — дополнительный справочник; он не гарантирует индексацию или цитирование.\n')
print(f'Built {len(POSTS)} articles, blog index, sitemap.xml and llms.txt')
