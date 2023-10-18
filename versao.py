import os
import json
import zipfile
    
def zipdir(path, ziph):
    for root, dirs, files in os.walk(path):
        for file in files:
            if file in [
                    '128.png',
                    'hide.js',
                    'manifest.json',
                    'page.js',
                    'settings.html',
                    'settings.js',
                    'watch.js',
                    'width.css'
                    ]:
                ziph.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file)))

with zipfile.ZipFile(json.load(open('manifest.json'))['version'].replace('.', '_') + '.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
    zipdir('./', zipf)
