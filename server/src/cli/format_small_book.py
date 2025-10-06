#!/usr/bin/env python3
"""
Script de traitement modulaire pour la numérisation de livres scannés.
Permet de traiter les scans double-page étape par étape ou en une seule fois.
"""

import os
import argparse
import sys
from pathlib import Path
from PIL import Image, ImageEnhance
import subprocess
import cv2
import numpy as np
from typing import List, Tuple, Optional

# === CONSTANTE DE TRAITEMENT ===
CROP_DOUBLE_PAGE = (608, 0, 2288, 1380)
CROP_PAGE_GAUCHE = (10, 10, 830, 1380)
CROP_PAGE_DROITE = (850, 10, 1680, 1380)
ROTATION_DEGRES = -90
DEFAULT_PREFIX = "MonLivre"
RESOLUTION = 200

# === FONCTIONS UTILITAIRES ===
def update_dimensions_crop(resolution: int,
    crop_double_page:Tuple[int, int, int, int],
    crop_page_gauche:Tuple[int, int, int, int],
    crop_page_droite:Tuple[int, int, int, int],
    ) -> Tuple[Tuple[int, int, int, int], Tuple[int, int, int, int], Tuple[int, int, int, int]]:
    """Calcule les dimensions de crop adaptées à la résolution passée en paramètre."""
    global CROP_DOUBLE_PAGE, CROP_PAGE_GAUCHE, CROP_PAGE_DROITE, RESOLUTION
    if resolution != RESOLUTION and resolution > 0:
        ratio = float(resolution) / RESOLUTION  # 200 DPI de référence
        crop_double_page = tuple(int(x * ratio) for x in crop_double_page)
        crop_page_gauche = tuple(int(x * ratio) for x in crop_page_gauche)
        crop_page_droite = tuple(int(x * ratio) for x in crop_page_droite)
    return crop_double_page, crop_page_gauche, crop_page_droite

def supprimer_surlignage_imagemagick(image_path: Path, seuil_luminosite: int = 85) -> Path:
    """Supprime les surlignages colorés via ImageMagick en préservant le texte noir."""
    output_path = image_path.with_name(image_path.stem + "_no_highlight.png")
    
    # Stratégie: convertir en niveaux de gris en préservant la luminosité du texte
    # et en supprimant les couleurs claires (surlignage)
    cmd = [
        "convert",
        str(image_path),
        # Augmenter le contraste pour différencier texte/surlignage
        "-modulate", "100,0,100",  # Saturation à 0 (désature les couleurs)
        # Ajuster les niveaux pour que le surlignage devienne blanc
        "-level", f"{seuil_luminosite}%,100%",
        # Normaliser pour optimiser le contraste
        "-normalize",
        str(output_path)
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    return output_path

def filtre_imagemagick(image_path: Path, rayon: float = 12.0, quantite: float = 0.6, seuil: float = 0.3) -> Path:
    """Applique un filtre de renforcement de netteté via ImageMagick."""
    output_path = image_path.with_name(image_path.stem + "_filtered.png")
    
    # Commande ImageMagick pour Unsharp Mask
    # Format: -unsharp {rayon}x{sigma}+{quantite}+{seuil}
    # sigma est généralement rayon/3 pour un bon résultat
    sigma = rayon / 3.0
    
    cmd = [
        "convert",
        str(image_path),
        "-unsharp", f"{rayon}x{sigma}+{quantite}+{seuil}",
        str(output_path)
    ]
    
    subprocess.run(cmd, check=True, capture_output=True)
    return output_path

def etape_supprimer_surlignage(images_dir: Path, prefix: str, 
                              seuil_luminosite: int = 85,
                              use_imagemagick: bool = True) -> List[Path]:
    """Étape : Suppression des surlignages colorés."""
    print("=== SUPPRESSION DES SURLIGNAGES COLORÉS ===")
    
    pages = sorted(images_dir.glob(f"{prefix}_[0-9][0-9][0-9].png"))
    pages_nettoyees = []
    
    # Vérifier si ImageMagick est disponible
    imagemagick_available = True
    if use_imagemagick:
        try:
            subprocess.run(["convert", "-version"], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("ImageMagick non trouvé, utilisation du traitement Python...")
            imagemagick_available = False
    
    for page_path in pages:
        print(f"Suppression surlignage de {page_path.name}")
        
        if use_imagemagick and imagemagick_available:
            try:
                # Utiliser ImageMagick
                page_nettoyee = supprimer_surlignage_imagemagick(page_path, seuil_luminosite)
                pages_nettoyees.append(page_nettoyee)
            except Exception as e:
                print(f"Erreur ImageMagick pour {page_path.name}, utilisation Python : {e}")
                # Fallback vers Python
                img = Image.open(page_path)
                img_nettoyee = supprimer_surlignage_python(img, seuil_luminosite)
                nom_nettoye = page_path.with_name(page_path.stem + "_no_highlight.png")
                img_nettoyee.save(nom_nettoye)
                pages_nettoyees.append(nom_nettoye)
        else:
            # Utiliser Python
            img = Image.open(page_path)
            img_nettoyee = supprimer_surlignage_python(img, seuil_luminosite)
            nom_nettoye = page_path.with_name(page_path.stem + "_no_highlight.png")
            img_nettoyee.save(nom_nettoye)
            pages_nettoyees.append(nom_nettoye)
    
    print(f"✓ {len(pages_nettoyees)} pages nettoyées")
    return pages_nettoyees

def supprimer_surlignage_python(img: Image.Image, seuil_luminosite: int = 85) -> Image.Image:
    """Supprime les surlignages colorés en Python (fallback)."""
    # Convertir en tableau numpy
    img_np = np.array(img.convert("RGB"))
    
    # Convertir en HSV pour travailler sur la luminosité
    img_hsv = cv2.cvtColor(img_np, cv2.COLOR_RGB2HSV)
    
    # Extraire le canal de luminosité (V)
    luminosite = img_hsv[:, :, 2]
    
    # Créer un masque pour les zones sombres (texte)
    masque_texte = luminosite < seuil_luminosite
    
    # Créer une image en niveaux de gris
    img_gray = cv2.cvtColor(img_np, cv2.COLOR_RGB2GRAY)
    
    # Créer l'image finale: blanc partout sauf où il y a du texte
    img_finale = np.full_like(img_gray, 255, dtype=np.uint8)
    img_finale[masque_texte] = img_gray[masque_texte]
    
    return Image.fromarray(img_finale).convert("RGB")
    """Applique un filtre de renforcement de netteté via ImageMagick."""
    output_path = image_path.with_name(image_path.stem + "_filtered.png")
    
    # Commande ImageMagick pour Unsharp Mask
    # Format: -unsharp {rayon}x{sigma}+{quantite}+{seuil}
    # sigma est généralement rayon/3 pour un bon résultat
    sigma = rayon / 3.0
    
    cmd = [
        "convert",
        str(image_path),
        "-unsharp", f"{rayon}x{sigma}+{quantite}+{seuil}",
        str(output_path)
    ]
    
    subprocess.run(cmd, check=True, capture_output=True)
    return output_path

def filtre_passe_haut(img: Image.Image, stddev: float = 900.0, contraste: float = 4.5) -> Image.Image:
    """Applique un filtre passe-haut pour améliorer la netteté du texte (version de secours)."""
    # Convertir en niveaux de gris
    img_np = np.array(img.convert("L")).astype(np.float32)
    
    # Flou gaussien
    flou = cv2.GaussianBlur(img_np, (0, 0), stddev)
    
    # Passe haut = original - flou + offset pour éviter les valeurs négatives
    passe_haut = img_np - flou + 128
    
    # Normaliser et clipper les valeurs dans [0, 255]
    passe_haut = np.clip(passe_haut, 0, 255).astype(np.uint8)
    
    # Conversion en image PIL
    passe_haut_img = Image.fromarray(passe_haut).convert("L")
    
    # Ajustement du contraste
    enhancer = ImageEnhance.Contrast(passe_haut_img)
    final_img = enhancer.enhance(contraste)
    
    return final_img.convert("RGB")

def valider_dimensions_crop(crop_str: str) -> Tuple[int, int, int, int]:
    """Valide et convertit une chaîne de dimensions de crop."""
    try:
        dimensions = tuple(map(int, crop_str.split(',')))
        if len(dimensions) != 4:
            raise ValueError
        return dimensions
    except ValueError:
        raise argparse.ArgumentTypeError(
            "Les dimensions doivent être au format 'x1,y1,x2,y2' (4 entiers séparés par des virgules)"
        )

def creer_structure_dossiers(output_dir: Path) -> Path:
    """Crée la structure de dossiers et retourne le dossier images."""
    images_dir = output_dir / "images"
    os.makedirs(images_dir, exist_ok=True)
    return images_dir

# === ÉTAPES DE TRAITEMENT ===

def etape1_convertir_et_pivoter(input_pdf: Path, images_dir: Path, prefix: str, 
                               resolution: int, rotation: float) -> List[Path]:
    """Étape 1 : Conversion PDF en images et rotation."""
    print("=== ÉTAPE 1 : Conversion PDF et rotation ===")
    
    # Conversion PDF vers PNG
    print(f"Conversion du PDF : {input_pdf.name}")
    subprocess.run([
        "pdftoppm", "-png", str(input_pdf), 
        str(images_dir / "page"), "-r", str(resolution)
    ], check=True)
    
    # Rotation et sauvegarde des doubles pages
    images_brutes = sorted(images_dir.glob("page*.png"))
    doubles_pages = []
    
    for i, img_path in enumerate(images_brutes, 1):
        print(f"Rotation de {img_path.name}")
        img = Image.open(img_path)
        img_rotee = img.rotate(rotation, expand=True)
        
        nom_double = images_dir / f"{prefix}_{i:03d}_double.png"
        img_rotee.save(nom_double)
        doubles_pages.append(nom_double)
        
        # Suppression de l'image brute
        img_path.unlink()
    
    print(f"✓ {len(doubles_pages)} doubles pages créées")
    return doubles_pages

def etape2_decouper_doubles_pages(images_dir: Path, prefix: str, 
                                 crop_double: Tuple[int, int, int, int],
                                 crop_gauche: Tuple[int, int, int, int],
                                 crop_droite: Tuple[int, int, int, int],
                                 resolution: int = RESOLUTION) -> List[Path]:
    """Étape 2 : Découpage des doubles pages en pages simples."""
    print("=== ÉTAPE 2 : Découpage des doubles pages ===")
   
    doubles_pages = sorted(images_dir.glob(f"{prefix}_*_double.png"))
    pages_simples = []
    compteur = 1
    
    for double_path in doubles_pages:
        print(f"Découpage de {double_path.name}")
        img = Image.open(double_path)
        
        # Crop de la zone utile de la double page
        double_page = img.crop(crop_double)
        
        # Sauvegarde de la double page croppée
        nom_double_crop = images_dir / f"{prefix}_{compteur//2+1:03d}_double_crop.png"
        double_page.save(nom_double_crop)
        
        # Page gauche
        page_gauche = double_page.crop(crop_gauche)
        nom_gauche = images_dir / f"{prefix}_{compteur:03d}.png"
        page_gauche.save(nom_gauche)
        pages_simples.append(nom_gauche)
        print(f" -> Sauvé {nom_gauche.name}")
        compteur += 1
        
        # Page droite
        page_droite = double_page.crop(crop_droite)
        nom_droite = images_dir / f"{prefix}_{compteur:03d}.png"
        page_droite.save(nom_droite)
        pages_simples.append(nom_droite)
        print(f" -> Sauvé {nom_droite.name}")
        compteur += 1
    
    print(f"✓ {len(pages_simples)} pages simples créées")
    return pages_simples

def etape3_appliquer_filtre(images_dir: Path, prefix: str, 
                           rayon: float = 12.0, quantite: float = 0.6, seuil: float = 0.3,
                           use_imagemagick: bool = True) -> List[Path]:
    """Étape 3 : Application du filtre de renforcement de netteté (optionnel)."""
    print("=== ÉTAPE 3 : Application du filtre de renforcement de netteté ===")
    
    pages = sorted(images_dir.glob(f"{prefix}_[0-9][0-9][0-9].png"))
    pages_filtrees = []
    
    # Vérifier si ImageMagick est disponible
    imagemagick_available = True
    if use_imagemagick:
        try:
            subprocess.run(["convert", "-version"], capture_output=True, check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("ImageMagick non trouvé, utilisation du filtre Python...")
            imagemagick_available = False
    
    for page_path in pages:
        print(f"Filtrage de {page_path.name}")
        
        if use_imagemagick and imagemagick_available:
            try:
                # Utiliser ImageMagick
                page_filtree = filtre_imagemagick(page_path, rayon, quantite, seuil)
                pages_filtrees.append(page_filtree)
            except Exception as e:
                print(f"Erreur ImageMagick pour {page_path.name}, utilisation du filtre Python : {e}")
                # Fallback vers le filtre Python
                img = Image.open(page_path)
                img_filtree = filtre_passe_haut(img, 900.0, 4.5)
                nom_filtre = page_path.with_name(page_path.stem + "_filtered.png")
                img_filtree.save(nom_filtre)
                pages_filtrees.append(nom_filtre)
        else:
            # Utiliser le filtre Python
            img = Image.open(page_path)
            img_filtree = filtre_passe_haut(img, 900.0, 4.5)
            nom_filtre = page_path.with_name(page_path.stem + "_filtered.png")
            img_filtree.save(nom_filtre)
            pages_filtrees.append(nom_filtre)
    
    print(f"✓ {len(pages_filtrees)} pages filtrées")
    return pages_filtrees

def etape4_creer_pdf(pages: List[Path], output_pdf: Path) -> None:
    """Étape 4 : Création du PDF final."""
    print("=== ÉTAPE 4 : Création du PDF final ===")
    
    if not pages:
        print("Aucune page à inclure dans le PDF.")
        return
    
    print(f"Génération du PDF avec {len(pages)} pages")
    images = [Image.open(p).convert("RGB") for p in sorted(pages)]
    images[0].save(output_pdf, save_all=True, append_images=images[1:])
    print(f"✓ PDF final enregistré : {output_pdf}")

def etape5_supprimer_pages(pages: List[Path], pages_a_supprimer: List[int]) -> List[Path]:
    """Étape 5 : Suppression de pages spécifiques."""
    if not pages_a_supprimer:
        return pages
        
    print(f"=== ÉTAPE 5 : Suppression des pages {pages_a_supprimer} ===")
    
    # Tri des pages par nom pour avoir l'ordre correct
    pages_triees = sorted(pages)
    pages_finales = []
    
    for i, page in enumerate(pages_triees, 1):
        if i not in pages_a_supprimer:
            pages_finales.append(page)
        else:
            print(f"Page {i} supprimée du PDF final")
    
    print(f"✓ {len(pages_finales)} pages conservées sur {len(pages_triees)}")
    return pages_finales

# === ARGUMENTS ET MAIN ===

def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Traitement modulaire de scans double-page",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Étapes disponibles :
  1 = Conversion PDF et rotation des doubles pages
  2 = Découpage des doubles pages en pages simples  
  3 = Suppression des surlignages colorés (optionnel)
  4 = Application du filtre de netteté (optionnel)
  5 = Création du PDF final
  6 = Suppression de pages spécifiques

Exemples d'utilisation :
  # Traitement complet (défaut)
  %(prog)s -i livre.pdf -o sortie/
  
  # Scan 300 DPI (dimensions automatiquement adaptées)
  %(prog)s -i livre_300dpi.pdf -o sortie/ --resolution 300
  
  # Étapes individuelles
  %(prog)s -i livre.pdf -o sortie/ --step 1
  %(prog)s -i livre.pdf -o sortie/ --step 2 --step 3 --step 4
  
  # Avec options personnalisées
  %(prog)s -i livre.pdf -o sortie/ --rotation 90 --remove-pages 1,5,10
  
  # Suppression des surlignages seulement
  %(prog)s -i livre.pdf -o sortie/ --step 1 --step 2 --step 3 --step 5
  
  # Filtre de netteté personnalisé
  %(prog)s -i livre.pdf -o sortie/ --step 4 --filter-radius 15 --filter-amount 0.8
        """
    )
    
    # Arguments obligatoires
    parser.add_argument("-i", "--input", required=True, type=Path,
                       help="Fichier PDF source")
    parser.add_argument("-o", "--output", required=True, type=Path,
                       help="Dossier de destination")
    
    # Sélection des étapes
    parser.add_argument("--step", action="append", type=int, choices=[1,2,3,4,5,6],
                       help="""Étape(s) à exécuter (peut être répété) :
                       1 = Conversion PDF et rotation des doubles pages
                       2 = Découpage des doubles pages en pages simples
                       3 = Suppression des surlignages colorés (optionnel)
                       4 = Application du filtre de netteté (optionnel)
                       5 = Création du PDF final
                       6 = Suppression de pages spécifiques
                       (Si aucune étape spécifiée, toutes sont exécutées)""")
    
    # Options de base
    parser.add_argument("--prefix", default=DEFAULT_PREFIX,
                       help=f"Préfixe des fichiers (défaut: {DEFAULT_PREFIX})")
    parser.add_argument("--resolution", type=int, default=RESOLUTION,
                       help=f"Résolution DPI (défaut: {RESOLUTION})")
    
    # Options de traitement
    parser.add_argument("--rotation", type=float, default=ROTATION_DEGRES,
                       help=f"Angle de rotation en degrés (défaut: {ROTATION_DEGRES})")
    parser.add_argument("--crop-double", type=valider_dimensions_crop,
                       default=CROP_DOUBLE_PAGE,
                       help="Dimensions crop double page en coordonnées 200 DPI (x1,y1,x2,y2)")
    parser.add_argument("--crop-left", type=valider_dimensions_crop,
                       default=CROP_PAGE_GAUCHE,
                       help="Dimensions crop page gauche en coordonnées 200 DPI (x1,y1,x2,y2)")
    parser.add_argument("--crop-right", type=valider_dimensions_crop,
                       default=CROP_PAGE_DROITE,
                       help="Dimensions crop page droite en coordonnées 200 DPI (x1,y1,x2,y2)")
    
    # Options de suppression surlignage
    parser.add_argument("--highlight-threshold", type=int, default=85,
                       help="Seuil de luminosité pour supprimer les surlignages (défaut: 85)")
    
    # Options du filtre
    parser.add_argument("--filter-radius", type=float, default=12.0,
                       help="Rayon du filtre de netteté (défaut: 12.0)")
    parser.add_argument("--filter-amount", type=float, default=0.6,
                       help="Quantité du filtre de netteté (défaut: 0.6)")
    parser.add_argument("--filter-threshold", type=float, default=0.3,
                       help="Seuil du filtre de netteté (défaut: 0.3)")
    parser.add_argument("--no-imagemagick", action="store_true",
                       help="Forcer l'utilisation du filtre Python au lieu d'ImageMagick")
    
    # Suppression de pages
    parser.add_argument("--remove-pages", 
                       help="Pages à supprimer (ex: 1,3,5)")
    
    return parser.parse_args()

def main():
    args = parse_arguments()
    
    # Validation des arguments
    if not args.input.exists():
        print(f"Erreur : le fichier {args.input} n'existe pas.")
        sys.exit(1)
    
    # Configuration des étapes
    if args.step:
        etapes = sorted(set(args.step))
    else:
        # Si aucune étape spécifiée, exécuter toutes les étapes
        etapes = [1, 2, 3, 4, 5, 6]
    
    # Traitement des pages à supprimer
    pages_a_supprimer = []
    if args.remove_pages:
        try:
            pages_a_supprimer = [int(x.strip()) for x in args.remove_pages.split(',')]
        except ValueError:
            print("Erreur : format invalide pour --remove-pages")
            sys.exit(1)
    
    # Modification des dimensions de crop en fonction de la résolution
    resolution = args.resolution
    crop_double = args.crop_double
    crop_left = args.crop_left
    crop_right = args.crop_right
    if resolution != RESOLUTION:
        crop_double, crop_left, crop_right = update_dimensions_crop(args.resolution, crop_double, crop_left, crop_right)


    # Création des dossiers
    images_dir = creer_structure_dossiers(args.output)
    output_pdf = args.output / f"{args.prefix}.pdf"
    
    print(f"Traitement de : {args.input}")
    print(f"Sortie vers : {args.output}")
    print(f"Étapes à exécuter : {etapes}")
    
    # Variables pour passer les données entre étapes
    doubles_pages = []
    pages_simples = []
    pages_nettoyees = []
    pages_filtrees = []
    pages_finales = []
    
    # Exécution des étapes
    for etape in etapes:
        if etape == 1:
            doubles_pages = etape1_convertir_et_pivoter(
                args.input, images_dir, args.prefix, 
                args.resolution, args.rotation
            )
        
        elif etape == 2:
            if not doubles_pages:
                doubles_pages = sorted(images_dir.glob(f"{args.prefix}_*_double.png"))
            pages_simples = etape2_decouper_doubles_pages(
                images_dir, args.prefix, 
                crop_double, crop_left, crop_right,
                resolution
            )
        
        elif etape == 3:
            if not pages_simples:
                pages_simples = sorted(images_dir.glob(f"{args.prefix}_[0-9][0-9][0-9].png"))
            pages_nettoyees = etape_supprimer_surlignage(
                images_dir, args.prefix, 
                args.highlight_threshold,
                use_imagemagick=not args.no_imagemagick
            )
        
        elif etape == 4:
            # Utiliser les pages nettoyées si disponibles, sinon les pages simples
            if not pages_nettoyees and not pages_simples:
                # Chercher les pages nettoyées d'abord
                pages_nettoyees = sorted(images_dir.glob(f"{args.prefix}_[0-9][0-9][0-9]_no_highlight.png"))
                if not pages_nettoyees:
                    pages_simples = sorted(images_dir.glob(f"{args.prefix}_[0-9][0-9][0-9].png"))
            
            pages_a_filtrer = pages_nettoyees if pages_nettoyees else pages_simples
            pages_filtrees = etape3_appliquer_filtre(
                images_dir, args.prefix, 
                args.filter_radius, args.filter_amount, args.filter_threshold,
                use_imagemagick=not args.no_imagemagick
            )
            pages_finales = pages_filtrees
        
        elif etape == 5:
            if not pages_finales:
                # Chercher dans l'ordre: filtrées, nettoyées, simples
                pages_filtrees = sorted(images_dir.glob(f"{args.prefix}_[0-9][0-9][0-9]_filtered.png"))
                if pages_filtrees:
                    pages_finales = pages_filtrees
                else:
                    pages_nettoyees = sorted(images_dir.glob(f"{args.prefix}_[0-9][0-9][0-9]_no_highlight.png"))
                    if pages_nettoyees:
                        pages_finales = pages_nettoyees
                    else:
                        pages_finales = sorted(images_dir.glob(f"{args.prefix}_[0-9][0-9][0-9].png"))
            
            # Application de la suppression de pages avant création PDF
            if pages_a_supprimer:
                pages_finales = etape5_supprimer_pages(pages_finales, pages_a_supprimer)
            
            etape4_creer_pdf(pages_finales, output_pdf)
        
        elif etape == 6:
            # Cette étape est gérée dans l'étape 5 si nécessaire
            if 5 not in etapes and pages_a_supprimer:
                print("Attention : l'étape 6 (suppression) nécessite l'étape 5 (création PDF)")
    
    print("\n=== TRAITEMENT TERMINÉ ===")
    if output_pdf.exists():
        print(f"PDF final : {output_pdf}")
    print(f"Images intermédiaires : {images_dir}")

if __name__ == "__main__":
    main()