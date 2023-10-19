import os
import json
import zipfile

zippable = [
        '128.png',
        'hide.js',
        'manifest.json',
        'page.js',
        'settings.html',
        'settings.js',
        'watch.js',
        'width.css'
    ]

with zipfile.ZipFile(json.load(open('manifest.json'))['version'].replace('.', '_') + '.zip', 'w', zipfile.ZIP_DEFLATED) as ziph:
    for root, dirs, files in os.walk('./'):
        for file in files:
            if file in zippable:
                ziph.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file)))
