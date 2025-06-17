from http.server import BaseHTTPRequestHandler
import json
import os
import tempfile
import base64
from pdf2docx import Converter
import uuid

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Get content length
        content_length = int(self.headers['Content-Length'])
        
        # Get boundary from content-type
        content_type = self.headers['Content-Type']
        boundary = content_type.split('=')[1]
        
        # Read the form data
        form_data = self.rfile.read(content_length)
        
        try:
            # Process the multipart form data
            pdf_data, filename = self.extract_pdf_from_multipart(form_data, boundary)
            
            if not pdf_data:
                self.send_error_response("No PDF file found in the request")
                return
            
            # Generate filenames
            pdf_path = f"/tmp/{str(uuid.uuid4())}.pdf"
            docx_path = f"/tmp/{str(uuid.uuid4())}.docx"
            
            # Save PDF data to file
            with open(pdf_path, 'wb') as f:
                f.write(pdf_data)
            
            # Convert PDF to DOCX
            cv = Converter(pdf_path)
            cv.convert(docx_path)
            cv.close()
            
            # Read the DOCX file
            with open(docx_path, 'rb') as f:
                docx_data = f.read()
            
            # Clean up temporary files
            try:
                os.remove(pdf_path)
                os.remove(docx_path)
            except:
                pass
            
            # Send the response
            self.send_response(200)
            self.send_header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            self.send_header('Content-Disposition', f'attachment; filename="{filename.replace(".pdf", ".docx")}"')
            self.send_header('Content-Length', str(len(docx_data)))
            self.end_headers()
            self.wfile.write(docx_data)
            
        except Exception as e:
            self.send_error_response(f"Error: {str(e)}")
    
    def extract_pdf_from_multipart(self, form_data, boundary):
        boundary = boundary.encode()
        parts = form_data.split(b'--' + boundary)
        
        for part in parts:
            if b'name="file"' in part and b'filename=' in part:
                # Extract filename
                filename_start = part.find(b'filename="') + len(b'filename="')
                filename_end = part.find(b'"', filename_start)
                filename = part[filename_start:filename_end].decode('utf-8')
                
                # Extract content type
                content_type_start = part.find(b'Content-Type: ') + len(b'Content-Type: ')
                content_type_end = part.find(b'\r\n', content_type_start)
                content_type = part[content_type_start:content_type_end].decode('utf-8')
                
                if 'application/pdf' not in content_type:
                    continue
                
                # Extract file data
                data_start = part.find(b'\r\n\r\n') + 4
                data_end = len(part) - 2  # Remove trailing \r\n
                file_data = part[data_start:data_end]
                
                return file_data, filename
        
        return None, None
    
    def send_error_response(self, message):
        self.send_response(400)
        self.send_header('Content-Type', 'text/plain')
        self.end_headers()
        self.wfile.write(message.encode())
