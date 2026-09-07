"""Resume text extractor for .doc, .docx, .pdf files."""
import sys, os, re, json, zipfile, xml.etree.ElementTree as ET
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def extract_docx(path):
    """Extract text from .docx (ZIP containing word/document.xml)."""
    text = []
    with zipfile.ZipFile(path, 'r') as z:
        if 'word/document.xml' in z.namelist():
            with z.open('word/document.xml') as f:
                tree = ET.parse(f)
                root = tree.getroot()
                ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                for p in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                    line = []
                    for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                        if t.text:
                            line.append(t.text)
                    if line:
                        text.append(''.join(line))
    return '\n'.join(text)

def extract_doc(path):
    """Extract text from binary .doc (WPS/Word 97-2003)."""
    with open(path, 'rb') as f:
        data = f.read()
    
    result = []
    i = 0
    while i < len(data) - 1:
        b = data[i]
        if 0x20 <= b < 0x7f:
            # ASCII
            run = []
            while i < len(data) and 0x20 <= data[i] < 0x7f:
                run.append(chr(data[i]))
                i += 1
            s = ''.join(run)
            if len(s) >= 3:
                result.append(s)
            continue
        elif b >= 0x80:
            try:
                char = data[i:i+2].decode('utf-16-le')
                cp = ord(char)
                if cp > 0x2000:
                    # Chinese or punctuation
                    run = [char]
                    i += 2
                    while i < len(data) - 1:
                        if data[i] >= 0x80:
                            try:
                                c2 = data[i:i+2].decode('utf-16-le')
                                if ord(c2) > 0x2000:
                                    run.append(c2)
                                    i += 2
                                else:
                                    break
                            except:
                                break
                        elif data[i] in (0x0d, 0x0a):
                            run.append('\n')
                            i += 1
                        elif data[i] == 0x00:
                            i += 1
                        else:
                            break
                    s = ''.join(run).strip()
                    if len(s) >= 2:
                        result.append(s)
                    continue
            except:
                pass
        i += 1
    
    return '\n'.join(result)

def extract_pdf(path):
    """Extract text from PDF using basic string extraction."""
    with open(path, 'rb') as f:
        data = f.read()
    
    # Try to find text between stream/endstream
    text = []
    # Simple approach: decode the whole thing as latin-1 and look for text
    try:
        decoded = data.decode('latin-1', errors='ignore')
        # Find text between parentheses in text blocks
        for match in re.finditer(r'\(([^)]+)\)', decoded):
            t = match.group(1)
            if len(t) > 2 and not t.startswith('\\'):
                text.append(t)
    except:
        pass
    
    if not text:
        # Try UTF-16LE extraction similar to .doc
        result = []
        i = 0
        while i < len(data) - 1:
            if data[i] >= 0x80:
                try:
                    char = data[i:i+2].decode('utf-16-le')
                    if ord(char) > 0x2000:
                        result.append(char)
                except:
                    pass
            i += 1
        return ''.join(result)
    
    return '\n'.join(text)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
        sys.exit(1)
    
    path = sys.argv[1]
    if not os.path.exists(path):
        print(json.dumps({"error": f"File not found: {path}"}))
        sys.exit(1)
    
    ext = os.path.splitext(path)[1].lower()
    
    try:
        if ext == '.docx':
            text = extract_docx(path)
        elif ext == '.doc':
            text = extract_doc(path)
        elif ext == '.pdf':
            text = extract_pdf(path)
        else:
            print(json.dumps({"error": f"Unsupported format: {ext}"}))
            sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
    
    print(json.dumps({"text": text, "format": ext}, ensure_ascii=False))

if __name__ == '__main__':
    main()