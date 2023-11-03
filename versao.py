import os
import json
import zipfile

zippable = [
    "manifest.json",
    "128.png",
    "hide.js",
    "settings.html",
    "settings.js",
    "timer.html",
    "timer.js",
    "page.js",
    "login.js",
    "watch.js",
    "width.css",
    "bootstrap.bundle.min.js",
    "bootstrap.min.css",
]

with zipfile.ZipFile(json.load(open("manifest.json"))["version"].replace(".", "_") + ".zip", "w", zipfile.ZIP_DEFLATED) as ziph:
    for root, dirs, files in os.walk("./"):
        for file in files:
            if file in zippable:
                ziph.write(os.path.join(root, file),
                           os.path.relpath(os.path.join(root, file)))
