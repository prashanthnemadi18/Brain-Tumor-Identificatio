import cv2
import numpy as np
from PIL import Image
from config.config import Config

class ImagePreprocessor:
    """Image preprocessing pipeline for MRI images"""
    
    def __init__(self, img_size=Config.IMG_SIZE):
        self.img_size = img_size
    
    def validate_image(self, image_path):
        """Validate if the file is a valid image"""
        try:
            img = Image.open(image_path)
            img.verify()
            return True
        except Exception:
            return False
    
    def load_image(self, image_path):
        """Load image from file path (Pillow fallback for WebP)."""
        img = cv2.imread(image_path)
        if img is not None:
            return img
        try:
            with Image.open(image_path) as pil_image:
                rgb = pil_image.convert('RGB')
                return cv2.cvtColor(np.array(rgb), cv2.COLOR_RGB2BGR)
        except Exception as e:
            raise ValueError(f"Unable to load image: {e}") from e
    
    def resize_image(self, image):
        """Resize image to target size"""
        return cv2.resize(image, self.img_size, interpolation=cv2.INTER_AREA)
    
    def denoise_image(self, image):
        """Apply denoising to reduce noise"""
        return cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)
    
    def enhance_contrast(self, image):
        """Enhance image contrast using CLAHE"""
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        
        enhanced = cv2.merge([l, a, b])
        return cv2.cvtColor(enhanced, cv2.COLOR_LAB2BGR)
    
    def normalize_image(self, image):
        """Normalize pixel values to [0, 1] range"""
        return image.astype('float32') / 255.0
    
    def preprocess_for_prediction(self, image_path, apply_enhancements=True):
        """
        Complete preprocessing pipeline for prediction
        
        Args:
            image_path: Path to the MRI image
            apply_enhancements: Whether to apply denoising and contrast enhancement
            
        Returns:
            Preprocessed image ready for CNN prediction
        """
        # Validate image
        if not self.validate_image(image_path):
            raise ValueError("Invalid image file")
        
        # Load image
        image = self.load_image(image_path)
        
        # Resize to target size
        image = self.resize_image(image)
        
        # Apply optional enhancements
        if apply_enhancements:
            # Denoise
            image = self.denoise_image(image)
            
            # Enhance contrast
            image = self.enhance_contrast(image)
        
        # Convert to RGB (if needed)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Normalize
        image = self.normalize_image(image)
        
        # Add batch dimension
        image = np.expand_dims(image, axis=0)
        
        return image
    
    def preprocess_for_training(self, image_path):
        """
        Preprocessing pipeline for training data
        Consistent with prediction preprocessing
        """
        return self.preprocess_for_prediction(image_path, apply_enhancements=False)
    
    def get_preprocessing_info(self):
        """Get information about preprocessing steps"""
        return {
            'steps': [
                'Image validation',
                'Image loading',
                f'Resize to {self.img_size}',
                'Noise reduction (FastNlMeans)',
                'Contrast enhancement (CLAHE)',
                'RGB conversion',
                'Normalization to [0, 1]',
                'Tensor conversion'
            ],
            'target_size': self.img_size,
            'normalization': '[0, 1] range',
            'color_space': 'RGB'
        }
