# PTOD File - PDF to Word Converter (Vercel Version)

A modern, dark-themed web application that converts PDF files to Word (DOCX) format with a clean and intuitive user interface, optimized for deployment on Vercel.

## Features

- **Modern Dark Theme UI**: Sleek design with responsive layout
- **Drag & Drop Interface**: Easy file uploading with drag-and-drop support
- **Real-time Feedback**: Progress indicators and status messages
- **Serverless Architecture**: Optimized for Vercel deployment
- **Mobile Friendly**: Works on all devices with responsive design
- **No Registration Required**: Free to use without any sign-up

## Deployment on Vercel

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mittal122/pdftoword.git
   cd pdftoword
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel
   ```

4. **For production deployment:**
   ```bash
   vercel --prod
   ```

## Important Notes for Vercel Deployment

- The serverless function has a maximum execution time of 60 seconds
- Memory is set to 1024MB for PDF processing
- Large PDF files may exceed Vercel's limits
- The `/tmp` directory is used for temporary file storage

## Local Development

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run a local server:**
   ```bash
   python -m http.server 8000 --directory public
   ```

3. **Test the API separately** using tools like Postman or curl

## Project Structure

```
pdftoword_vercel/
├── api/
│   └── convert.py          # Serverless API function
├── public/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── script.js       # Frontend JavaScript
│   └── index.html          # Main HTML page
├── requirements.txt        # Python dependencies
└── vercel.json             # Vercel configuration
```

## Limitations

- Maximum file size: ~50MB (Vercel payload limit)
- Processing time: Limited to 60 seconds
- Complex PDFs may not convert perfectly

## License

This project is licensed under the MIT License.

---

Created by [mittal122](https://github.com/mittal122)
