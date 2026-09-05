import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

class RangeRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().send_head()
        
        range_header = self.headers.get('Range')
        if not range_header:
            return super().send_head()
            
        try:
            total = os.path.getsize(path)
            parts = range_header.strip().split('=')[1].split('-')
            start = int(parts[0]) if parts[0] else 0
            end = int(parts[1]) if len(parts) > 1 and parts[1] else total - 1
            if start >= total or end >= total or start > end:
                self.send_error(416, "Requested Range Not Satisfiable")
                return None
                
            length = end - start + 1
            self.send_response(206)
            self.send_header('Content-Type', self.guess_type(path))
            self.send_header('Content-Range', f'bytes {start}-{end}/{total}')
            self.send_header('Content-Length', str(length))
            self.send_header('Accept-Ranges', 'bytes')
            self.end_headers()
            
            f = open(path, 'rb')
            f.seek(start)
            return RangeFileWrapper(f, length)
        except Exception:
            return super().send_head()

class RangeFileWrapper:
    def __init__(self, f, length):
        self.f = f
        self.remaining = length

    def read(self, size=-1):
        if self.remaining <= 0:
            return b""
        if size < 0 or size > self.remaining:
            size = self.remaining
        data = self.f.read(size)
        self.remaining -= len(data)
        return data

    def close(self):
        self.f.close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    server = HTTPServer(('0.0.0.0', port), RangeRequestHandler)
    print(f"Serving HTTP on 0.0.0.0 port {port} (http://localhost:{port}/) with Byte Range support...")
    server.serve_forever()
