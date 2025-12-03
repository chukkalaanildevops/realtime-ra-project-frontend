#!/usr/bin/env python3

import os
import sys
import json
from googletrans import Translator


def translate(project_path):

    print("Path", project_path)
    if os.path.exists(project_path):

        if not project_path.endswith('/'):
            project_path += '/'

        locales_path = '{0}src/locales'.format(project_path)
        locales = os.listdir(locales_path)
        locales.remove('_build')
        locales.remove('en')
        translator = Translator()

        for locale in locales:
            target_language = locale
            locale_path = os.path.join(locales_path, locale, 'messages.json')
            new_data = dict()

            with open(locale_path, 'r') as f:
                data = json.load(f)
                results = translator.translate(
                    list(set(data.keys())),
                    dest=target_language
                )

                for item in results:
                    new_data.update({item.origin: item.text})

            with open(locale_path, 'w', encoding='utf-8') as f:
                json.dump(new_data, f, ensure_ascii=False, indent=4)

    else:
        print('Project path is invalid')


if __name__ == "__main__":
    if len(sys.argv):
        path = sys.argv[1:][0]
        translate(path)
