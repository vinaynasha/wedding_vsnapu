from PIL import Image
import sys

def remove_white_bg(src, dst, tolerance=20):
    img = Image.open(src).convert('RGBA')
    data = img.load()
    w, h = img.size

    # Flood fill from all 4 corners to mark background pixels
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

    img.save(dst)
    print(f"Saved: {dst}")

if __name__ == '__main__':
    remove_white_bg(sys.argv[1], sys.argv[2])
