from PIL import Image
import sys

def make_hero_version(src, dst, tolerance=20):
    """Transparent background + black pixels → white (red stays red)."""
    img = Image.open(src).convert('RGBA')
    data = img.load()
    w, h = img.size

    # Step 1: flood-fill white background → transparent (from corners)
    visited = [[False] * h for _ in range(w)]
    queue = []
    for corner in [(0, 0), (w-1, 0), (0, h-1), (w-1, h-1)]:
        x, y = corner
        r, g, b, a = data[x, y]
        if r >= 255 - tolerance and g >= 255 - tolerance and b >= 255 - tolerance:
            queue.append((x, y))
            visited[x][y] = True

    while queue:
        x, y = queue.pop()
        r, g, b, a = data[x, y]
        if r >= 255 - tolerance and g >= 255 - tolerance and b >= 255 - tolerance:
            data[x, y] = (255, 255, 255, 0)
            for nx, ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
                if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
                    visited[nx][ny] = True
                    queue.append((nx, ny))

    # Step 2: dark pixels → white (skip red-dominant pixels)
    for x in range(w):
        for y in range(h):
            r, g, b, a = data[x, y]
            if a == 0:
                continue
            # Red-dominant: keep as-is
            if r > 150 and r > g * 1.8 and r > b * 1.8:
                continue
            # Dark pixel: make white
            brightness = (r + g + b) / 3
            if brightness < 160:
                data[x, y] = (255, 255, 255, a)

    img.save(dst)
    print(f"Saved: {dst}")

if __name__ == '__main__':
    make_hero_version(sys.argv[1], sys.argv[2])
