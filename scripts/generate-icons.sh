#!/usr/bin/env bash
set -euo pipefail

# generate-icons.sh
# Requirements: sips (macOS) or ImageMagick (convert). This script will
# create Android mipmap folders and iOS AppIcon.appiconset from a single
# square source image at assets/app-icon.png

SRC="assets/app-icon.png"
if [ ! -f "$SRC" ]; then
  echo "Source icon $SRC not found. Place your source PNG at $SRC and re-run."
  exit 1
fi

mkdir -p assets/icons/android
mkdir -p assets/icons/ios/AppIcon.appiconset

# Android mipmap sizes (mdpi baseline 48dp)
ANDROID_ENTRIES=(
  "mipmap-mdpi:48"
  "mipmap-hdpi:72"
  "mipmap-xhdpi:96"
  "mipmap-xxhdpi:144"
  "mipmap-xxxhdpi:192"
)

for entry in "${ANDROID_ENTRIES[@]}"; do
  dir=${entry%%:*}
  size=${entry##*:}
  outdir="android/app/src/main/res/$dir"
  mkdir -p "$outdir"
  sips -z "$size" "$size" "$SRC" --out "$outdir/ic_launcher.png" >/dev/null
  echo "Wrote $outdir/ic_launcher.png ($size x $size)"
done

# iOS AppIcon sizes
IOS_ENTRIES=(
  "20 20 2x"
  "20 20 3x"
  "29 29 2x"
  "29 29 3x"
  "40 40 2x"
  "40 40 3x"
  "60 60 2x"
  "60 60 3x"
  "76 76 2x"
  "83.5 83.5 2x"
  "1024 1024 1x"
)

images_json=""
for entry in "${IOS_ENTRIES[@]}"; do
  read -r size_label size_val scale_label <<< "$entry"
  scale=$(echo "$scale_label" | tr -d 'x')
  px=$(python3 -c "print(int(float('$size_val') * int('$scale')))")
  filename="AppIcon-${size_label}x${scale}.png"
  outpath="assets/icons/ios/AppIcon.appiconset/$filename"
  sips -z "$px" "$px" "$SRC" --out "$outpath" >/dev/null
  images_json+="    { \"idiom\": \"universal\", \"size\": \"${size_label}x${size_label}\", \"scale\": \"${scale}x\", \"filename\": \"${filename}\" },"
done

# Remove trailing comma
images_json=${images_json%,}

cat > assets/icons/ios/AppIcon.appiconset/Contents.json <<EOF
{
  "images": [
    $(echo -e "$images_json" | sed 's/},/},\n    /g')
  ],
  "info": {
    "version": 1,
    "author": "xcode"
  }
}
EOF

echo "iOS AppIcon set generated at assets/icons/ios/AppIcon.appiconset"

# Sync to project
cp assets/icons/ios/AppIcon.appiconset/* ios/OpenCalories/Images.xcassets/AppIcon.appiconset/
# Android sync (ensuring clean)
cp -R assets/icons/android/* android/app/src/main/res/ 2>/dev/null || true

echo "Icons synced to iOS and Android projects."
