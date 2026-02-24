import json
data = {
    'images': [
        {'idiom': 'universal', 'size': '20x20', 'scale': '2x', 'filename': 'AppIcon-20x2.png'},
        {'idiom': 'universal', 'size': '20x20', 'scale': '3x', 'filename': 'AppIcon-20x3.png'},
        {'idiom': 'universal', 'size': '29x29', 'scale': '2x', 'filename': 'AppIcon-29x2.png'},
        {'idiom': 'universal', 'size': '29x29', 'scale': '3x', 'filename': 'AppIcon-29x3.png'},
        {'idiom': 'universal', 'size': '40x40', 'scale': '2x', 'filename': 'AppIcon-40x2.png'},
        {'idiom': 'universal', 'size': '40x40', 'scale': '3x', 'filename': 'AppIcon-40x3.png'},
        {'idiom': 'universal', 'size': '60x60', 'scale': '2x', 'filename': 'AppIcon-60x2.png'},
        {'idiom': 'universal', 'size': '60x60', 'scale': '3x', 'filename': 'AppIcon-60x3.png'},
        {'idiom': 'universal', 'size': '76x76', 'scale': '2x', 'filename': 'AppIcon-76x2.png'},
        {'idiom': 'universal', 'size': '83.5x83.5', 'scale': '2x', 'filename': 'AppIcon-83.5x2.png'},
        {'idiom': 'universal', 'size': '1024x1024', 'scale': '1x', 'filename': 'AppIcon-1024x1.png'}
    ],
    'info': {
        'version': 1,
        'author': 'xcode'
    }
}
with open('assets/icons/ios/AppIcon.appiconset/Contents.json', 'w') as f:
    json.dump(data, f, indent=2)
