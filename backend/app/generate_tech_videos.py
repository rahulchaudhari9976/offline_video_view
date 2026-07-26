import os
import subprocess
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

def get_font(size):
    try:
        return ImageFont.truetype("arial.ttf", size)
    except:
        try:
            return ImageFont.truetype("consolas.ttf", size)
        except:
            return ImageFont.load_default()

def get_code_font(size):
    try:
        return ImageFont.truetype("consola.ttf", size)
    except:
        try:
            return ImageFont.truetype("arial.ttf", size)
        except:
            return ImageFont.load_default()

def create_tech_video(filename, title, subtitle, badge_text, code_lines, bg_gradient_colors, accent_color, duration_sec=10, fps=30):
    width, height = 1280, 720
    total_frames = duration_sec * fps
    output_path = os.path.join("uploads", "videos", filename)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    
    cmd = [
        ffmpeg_exe,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{width}x{height}",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-movflags", "+faststart",
        output_path
    ]
    
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    title_font = get_font(32)
    sub_font = get_font(20)
    badge_font = get_font(14)
    code_font = get_code_font(20)
    header_font = get_code_font(18)
    
    c1, c2 = bg_gradient_colors
    
    # Pre-generate base background image
    base_bg = Image.new("RGB", (width, height))
    draw_bg = ImageDraw.Draw(base_bg)
    for y in range(height):
        r = int(c1[0] + (c2[0] - c1[0]) * (y / height))
        g = int(c1[1] + (c2[1] - c1[1]) * (y / height))
        b = int(c1[2] + (c2[2] - c1[2]) * (y / height))
        draw_bg.line([(0, y), (width, y)], fill=(r, g, b))
        
    all_text = "\n".join(code_lines)
    total_chars = len(all_text)
    
    for frame_idx in range(total_frames):
        t = frame_idx / total_frames
        img = base_bg.copy()
        draw = ImageDraw.Draw(img)
        
        # 1. Top Header Banner
        draw.rectangle([0, 0, width, 90], fill=(15, 23, 42))
        draw.line([(0, 90), (width, 90)], fill=accent_color, width=3)
        
        # Badge
        draw.rounded_rectangle([40, 25, 200, 65], radius=10, fill=(30, 41, 59), outline=accent_color, width=2)
        draw.text((120, 45), badge_text, fill=accent_color, font=badge_font, anchor="mm")
        
        # Title & Subtitle
        draw.text((220, 30), title, fill=(255, 255, 255), font=title_font)
        draw.text((220, 65), subtitle, fill=(148, 163, 184), font=sub_font)
        
        # 2. Main IDE / Code Editor Window
        win_x1, win_y1, win_x2, win_y2 = 60, 120, 1220, 640
        draw.rounded_rectangle([win_x1, win_y1, win_x2, win_y2], radius=16, fill=(15, 23, 42), outline=(51, 65, 85), width=2)
        
        # Window Header
        draw.rounded_rectangle([win_x1, win_y1, win_x2, win_y1 + 45], radius=16, fill=(30, 41, 59))
        draw.rectangle([win_x1, win_y1 + 30, win_x2, win_y1 + 45], fill=(30, 41, 59))
        
        # Traffic light buttons
        draw.ellipse([win_x1 + 20, win_y1 + 15, win_x1 + 32, win_y1 + 27], fill=(239, 68, 68))
        draw.ellipse([win_x1 + 42, win_y1 + 15, win_x1 + 54, win_y1 + 27], fill=(245, 158, 11))
        draw.ellipse([win_x1 + 64, win_y1 + 15, win_x1 + 76, win_y1 + 27], fill=(34, 197, 94))
        
        # Tab title
        draw.text((win_x1 + 100, win_y1 + 12), f"editor_preview.tsx  •  {title}", fill=(203, 213, 225), font=header_font)
        
        # 3. Animate Code Typing
        visible_chars = int(min(1.0, t * 1.3) * total_chars)
        char_count = 0
        line_y = win_y1 + 70
        cursor_pos = (win_x1 + 90, line_y)
        
        for idx, line in enumerate(code_lines):
            draw.text((win_x1 + 25, line_y), f"{idx+1:2d}", fill=(71, 85, 105), font=code_font)
            line_len = len(line)
            if char_count + line_len <= visible_chars:
                line_to_draw = line
                char_count += line_len + 1
            elif char_count < visible_chars:
                rem = visible_chars - char_count
                line_to_draw = line[:rem]
                line_w = draw.textlength(line_to_draw, font=code_font)
                cursor_pos = (win_x1 + 90 + line_w, line_y)
                char_count = visible_chars
            else:
                line_to_draw = ""
                
            color = (226, 232, 240)
            if line_to_draw.strip().startswith("//") or line_to_draw.strip().startswith("#"):
                color = (100, 116, 139)
            elif any(kw in line_to_draw for kw in ["import", "export", "function", "const", "return", "from", "def", "async", "class", "display:", "grid-template-columns:"]):
                color = accent_color
            elif any(kw in line_to_draw for kw in ["useActionState", "FastAPI", "IndexedDB", "caches", "grid"]):
                color = (253, 224, 71)
                
            draw.text((win_x1 + 90, line_y), line_to_draw, fill=color, font=code_font)
            line_y += 32
            
        if (int(t * 20) % 2) == 0:
            cx, cy = cursor_pos
            draw.rectangle([cx, cy, cx + 10, cy + 24], fill=accent_color)
            
        # 4. Bottom Video Progress & Status Bar
        draw.rectangle([0, height - 40, width, height], fill=(15, 23, 42))
        progress_w = int(width * t)
        draw.rectangle([0, height - 40, progress_w, height - 35], fill=accent_color)
        
        curr_sec = int(t * duration_sec)
        time_str = f"LIVE LESSON STREAM: 00:{curr_sec:02d} / 00:{duration_sec:02d}  •  HD 1080P"
        draw.text((30, height - 28), time_str, fill=(148, 163, 184), font=badge_font)
        
        process.stdin.write(img.tobytes())
        
    process.stdin.close()
    process.wait()
    print(f"Generated H.264 web MP4 video: {output_path} ({total_frames} frames)")

def generate_all_videos():
    print("Starting generation of 4 H.264 web-compatible technical MP4 videos...")
    
    # Video 1: React 19
    create_tech_video(
        filename="react_19_guide.mp4",
        title="React 19 & Modern Frontend Architecture",
        subtitle="Server Components • Custom Hooks • Optimistic UI",
        badge_text="REACT 19",
        code_lines=[
            "import { useActionState, useOptimistic, Suspense } from 'react';",
            "import { updateCourseProgress } from './api/courses';",
            "",
            "// React 19 Server Actions & Optimistic State Update",
            "export function VideoLessonCard({ lesson }) {",
            "  const [state, formAction, isPending] = useActionState(updateCourseProgress, null);",
            "  const [optimisticStatus, setOptimistic] = useOptimistic(lesson.completed);",
            "",
            "  return (",
            "    <form action={formAction} className='lesson-card'>",
            "      <VideoPlayer src={lesson.streamUrl} />",
            "      <button disabled={isPending}>Mark Complete ({optimisticStatus ? '✓' : 'Pending'})</button>",
            "    </form>",
            "  );",
            "}"
        ],
        bg_gradient_colors=((15, 23, 42), (30, 27, 75)),
        accent_color=(56, 189, 248), # React Cyan
        duration_sec=10
    )
    
    # Video 2: FastAPI
    create_tech_video(
        filename="fastapi_masterclass.mp4",
        title="Building High-Performance Async APIs with FastAPI",
        subtitle="Python AsyncIO • Pydantic v2 • SQLite ORM",
        badge_text="FASTAPI",
        code_lines=[
            "from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks",
            "from pydantic import BaseModel",
            "from sqlalchemy.orm import Session",
            "",
            "app = FastAPI(title='Offline Video Streaming API', version='1.0.0')",
            "",
            "@app.get('/videos/{video_id}/stream')",
            "async def stream_video_chunk(video_id: int, range_header: str = None):",
            "    # Partial Content Range Request Handler (HTTP 206)",
            "    video = await get_video_from_db(video_id)",
            "    return StreamingResponse(video.get_stream(), status_code=206)",
            "",
            "# Benchmark: Latency < 1.2ms | Throughput: 10,000 req/sec"
        ],
        bg_gradient_colors=((2, 44, 34), (15, 23, 42)),
        accent_color=(52, 211, 153), # FastAPI Emerald
        duration_sec=12
    )
    
    # Video 3: Progressive Web Apps
    create_tech_video(
        filename="pwa_indexeddb.mp4",
        title="Progressive Web Apps & Offline First Strategy",
        subtitle="Service Workers • Cache Storage API • IndexedDB",
        badge_text="PWA & INDEXEDDB",
        code_lines=[
            "// Service Worker & Cache Storage Registration",
            "self.addEventListener('fetch', (event) => {",
            "  event.respondWith(",
            "    caches.match(event.request).then((cachedResponse) => {",
            "      if (cachedResponse) return cachedResponse; // Zero Data Load",
            "      return fetch(event.request);",
            "    })",
            "  );",
            "});",
            "",
            "// IndexedDB Storage Manager",
            "const db = await openDB('VideoOfflineStore', 1);",
            "await db.put('videos', { id: 101, blob: videoBlob, title: 'Offline Lesson' });",
            "console.log('Video saved successfully for offline playback! ✓');"
        ],
        bg_gradient_colors=((46, 16, 101), (15, 23, 42)),
        accent_color=(232, 121, 249), # PWA Purple/Pink
        duration_sec=10
    )
    
    # Video 4: CSS Grid
    create_tech_video(
        filename="css_grid_mastery.mp4",
        title="Mastering CSS Grid & Responsive UI Design",
        subtitle="Grid Layouts • Flexbox • Glassmorphism UI",
        badge_text="CSS GRID",
        code_lines=[
            "/* Modern Responsive CSS Grid Card Layout */",
            ".video-grid-container {",
            "  display: grid;",
            "  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));",
            "  gap: 1.5rem;",
            "  padding: 2rem;",
            "}",
            "",
            ".video-card {",
            "  background: rgba(30, 41, 59, 0.7);",
            "  backdrop-filter: blur(12px);",
            "  border: 1px solid rgba(255, 255, 255, 0.1);",
            "  border-radius: 1rem;",
            "  transition: transform 0.3s ease, box-shadow 0.3s ease;",
            "}"
        ],
        bg_gradient_colors=((69, 26, 3), (15, 23, 42)),
        accent_color=(251, 191, 36), # CSS Amber/Gold
        duration_sec=10
    )
    
    print("All 4 H.264 web-compatible MP4 videos generated successfully!")

if __name__ == "__main__":
    generate_all_videos()
