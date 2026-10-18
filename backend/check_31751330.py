import urllib.request
import re

url = 'https://www.pexels.com/video/31751330/'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': 'https://www.pexels.com/'
}
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as r:
        html = r.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'https://videos\.pexels\.com/video-files/[^"\'\s<>]+\.mp4', html)
        print('Unique mp4 links for 31751330:')
        for m in sorted(set(matches)):
            print(m)
except Exception as e:
    print('Error:', e)
