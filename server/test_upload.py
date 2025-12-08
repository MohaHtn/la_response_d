#!/usr/bin/env python3
"""
Script de test pour l'endpoint /api/send-book
"""
import requests
import sys

# URL de l'API
API_URL = "http://localhost:8000/api/send-book"

# Créer un PDF de test minimal
pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000307 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n404\n%%EOF"

# Préparer les données
files = {
    'file': ('test.pdf', pdf_content, 'application/pdf')
}

data = {
    'title': 'Test PDF',
    'author': 'Test Author'
}

print("🔄 Envoi du PDF de test...")
try:
    response = requests.post(API_URL, files=files, data=data)
    
    print(f"\n📊 Status Code: {response.status_code}")
    print(f"\n📄 Response Headers:")
    for key, value in response.headers.items():
        print(f"  {key}: {value}")
    
    print(f"\n📝 Response Body:")
    try:
        print(response.json())
    except:
        print(response.text)
    
    if response.status_code == 200:
        print("\n✅ Upload réussi!")
    else:
        print(f"\n❌ Erreur: {response.status_code}")
        sys.exit(1)
        
except requests.exceptions.RequestException as e:
    print(f"\n❌ Erreur de connexion: {e}")
    sys.exit(1)

