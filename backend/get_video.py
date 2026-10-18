import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

urls = [
    'https://www.pexels.com/video/industrial-machining-process-in-workshop-30409129/',
    'https://www.pexels.com/video/high-precision-cnc-machine-operation-31751330/',
    'https://www.pexels.com/video/30409129/download/',
    'https://www.pexels.com/video/31751330/download/'
]

for url in urls:
    try:
        print(f"Trying {url}...")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            final_url = response.geturl()
            print(f"Final URL: {final_url}")
            content_type = response.info().get_content_type()
            print(f"Content-Type: {content_type}")
            if 'video' in content_type or final_url.endswith('.mp4'):
                print("FOUND DIRECT VIDEO URL!")
                break
            body = response.read().decode('utf-8', errors='ignore')
            mp4s = re.findall(r'https://[^"\'\s<>]+?\.mp4[^"\'\s<>]*', body)
            print(f"Found {len(mp4s)} mp4 links: {mp4s[:3]}")
    except Exception as e:
        print(f"Error for {url}: {e}")
