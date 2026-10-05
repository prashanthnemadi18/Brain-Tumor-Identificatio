"""
Image Validator - Validates if uploaded image is a brain MRI scan
"""
import cv2
import numpy as np
from PIL import Image

class ImageValidator:
    """Validates if an image is likely a brain MRI scan"""
    
    def __init__(self):
        self.min_grayscale_percentage = 0.6  # 60% should be grayscale
        self.min_dark_percentage = 0.10      # At least 10% should be dark
        self.max_color_variance = 15         # Maximum color variance for grayscale
        
    def validate_mri_image(self, image_path):
        """
        Validate if the image is likely a brain MRI scan
        
        Args:
            image_path: Path to the image file
            
        Returns:
            tuple: (is_valid, error_message)
        """
        try:
            # Read image (OpenCV, with Pillow fallback for WebP and similar formats)
            image = self._read_image(image_path)
            if image is None:
                return False, "Unable to read image file"
            
            # Check 1: Check for obvious face detection first (priority check)
            if self._has_human_face(image):
                return False, "This appears to be a photograph of a person, not a medical scan. Please upload a brain MRI image."
            
            # Check 2: Detect text/documents (certificates, papers, screenshots)
            if self._has_text_content(image):
                return False, "This appears to be a document, certificate, or text image, not a medical scan. Please upload a brain MRI image."
            
            # Check 3: Image should be mostly grayscale (MRI scans are grayscale)
            if not self._is_mostly_grayscale(image):
                return False, "Image appears to be a color photo, not a medical scan. Please upload a brain MRI image in grayscale format."
            
            # Check 4: Check for brain-like circular structures
            if not self._has_brain_like_structure(image):
                return False, "Image doesn't contain brain-like structures typical of MRI scans. Please upload a valid brain MRI scan."
            
            # Check 5: Brightness check - MRI scans have specific intensity distribution
            if not self._has_medical_intensity_distribution(image):
                return False, "Image doesn't have typical medical scan characteristics. Please upload a valid brain MRI scan."
            
            # If passed all checks, it's valid
            return True, "Valid MRI image"
            
        except Exception as e:
            # If validation itself fails, REJECT to be safe
            print(f"Validation error: {str(e)}")
            return False, f"Image validation failed. Please ensure you're uploading a valid brain MRI scan."

    def _read_image(self, image_path):
        """Load an image with OpenCV, falling back to Pillow for WebP/JPEG variants."""
        image = cv2.imread(image_path)
        if image is not None:
            return image
        try:
            with Image.open(image_path) as pil_image:
                rgb = pil_image.convert('RGB')
                return cv2.cvtColor(np.array(rgb), cv2.COLOR_RGB2BGR)
        except Exception as e:
            print(f"Image load failed: {e}")
            return None
    
    def _is_mostly_grayscale(self, image):
        """Check if image is mostly grayscale"""
        # If already 2D (grayscale), return True
        if len(image.shape) == 2:
            return True
        
        # Calculate color difference between channels
        b, g, r = cv2.split(image)
        
        # Calculate standard deviation of differences
        rg_diff = np.abs(r.astype(float) - g.astype(float))
        rb_diff = np.abs(r.astype(float) - b.astype(float))
        gb_diff = np.abs(g.astype(float) - b.astype(float))
        
        # Calculate average difference
        avg_diff = (np.mean(rg_diff) + np.mean(rb_diff) + np.mean(gb_diff)) / 3
        
        # MRI images should have very low color difference
        return avg_diff < self.max_color_variance
    
    def _has_text_content(self, image):
        """
        Detect if image contains significant text content (documents, certificates, etc.)
        """
        # Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Apply binary threshold
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Find contours
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Count small rectangular contours (typical of text)
        text_like_contours = 0
        total_area = gray.shape[0] * gray.shape[1]
        
        for contour in contours:
            area = cv2.contourArea(contour)
            # Text characters are typically small
            if 50 < area < 5000:
                x, y, w, h = cv2.boundingRect(contour)
                aspect_ratio = w / float(h) if h > 0 else 0
                # Text-like rectangles
                if 0.1 < aspect_ratio < 10:
                    text_like_contours += 1
        
        # If many small rectangular contours, likely text/document
        if text_like_contours > 50:
            return True
        
        # Check for high edge density (documents have many edges)
        edges = cv2.Canny(gray, 50, 150)
        edge_density = np.sum(edges > 0) / total_area
        
        # Documents typically have high edge density. MRI skull/tissue
        # edges can also be dense, so keep this conservative.
        if edge_density > 0.28:
            return True
        
        return False
    
    def _has_brain_like_structure(self, image):
        """
        Check if image contains circular/oval structures typical of brain scans
        """
        # Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Apply Gaussian blur
        blurred = cv2.GaussianBlur(gray, (9, 9), 2)
        
        # Detect circles using Hough Circle Transform
        circles = cv2.HoughCircles(
            blurred,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=gray.shape[0] // 8,
            param1=50,
            param2=30,
            minRadius=gray.shape[0] // 8,
            maxRadius=gray.shape[0] // 2
        )
        
        # Brain scans typically have at least one large circular structure
        if circles is not None and len(circles[0]) > 0:
            return True
        
        # Alternative: Check for oval/elliptical shapes
        edges = cv2.Canny(gray, 50, 150)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        image_area = gray.shape[0] * gray.shape[1]
        
        for contour in contours:
            area = cv2.contourArea(contour)
            # Large contours (brain outline)
            if area > image_area * 0.1:
                # Fit ellipse and check circularity
                if len(contour) >= 5:
                    ellipse = cv2.fitEllipse(contour)
                    (center, axes, angle) = ellipse
                    major_axis = max(axes)
                    minor_axis = min(axes)
                    
                    # Brain is roughly circular (ratio close to 1)
                    if major_axis > 0 and 0.6 < (minor_axis / major_axis) < 1.4:
                        return True
        
        return False
    
    def _has_medical_intensity_distribution(self, image):
        """
        Check if image has intensity distribution typical of medical scans
        """
        # Convert to grayscale if needed
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Calculate histogram
        hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
        hist = hist.flatten()
        
        # Check if histogram has reasonable distribution
        non_zero_bins = np.sum(hist > 0)
        
        # Should use reasonable range of intensities
        if non_zero_bins < 30:
            return False
        
        # Check contrast - medical images have good contrast
        std_dev = np.std(gray)
        if std_dev < 15:
            return False
        
        # MRI scans normally have a large near-black background. That is
        # expected and must not be treated as a document. Documents have
        # both dark ink and bright paper at the same time.
        very_dark = np.sum(gray < 30)
        very_bright = np.sum(gray > 225)
        total_pixels = gray.size
        dark_ratio = very_dark / total_pixels
        bright_ratio = very_bright / total_pixels
        
        if bright_ratio > 0.35 and dark_ratio > 0.15:
            return False
        
        return True
    
    def _has_human_face(self, image):
        """Detect if image contains a human face (not a brain scan)"""
        try:
            # Load OpenCV face detector
            face_cascade = cv2.CascadeClassifier(
                cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            )
            
            # Convert to grayscale
            if len(image.shape) == 3:
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            else:
                gray = image
            
            # Detect faces
            faces = face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(50, 50),
                flags=cv2.CASCADE_SCALE_IMAGE
            )
            
            # Check if detected face is large (likely a portrait)
            if len(faces) > 0:
                for (x, y, w, h) in faces:
                    face_area = w * h
                    image_area = gray.shape[0] * gray.shape[1]
                    face_percentage = face_area / image_area
                    
                    # If face takes up significant portion (>15%), it's a portrait
                    if face_percentage > 0.15:
                        return True
            
            return False
            
        except Exception as e:
            print(f"Face detection warning: {e}")
            return False
    
    def get_image_info(self, image_path):
        """Get detailed information about the image"""
        try:
            image = self._read_image(image_path)
            if image is None:
                return None
            
            height, width = image.shape[:2]
            channels = 1 if len(image.shape) == 2 else image.shape[2]
            
            # Convert to grayscale for analysis
            if len(image.shape) == 3:
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            else:
                gray = image
            
            return {
                'width': width,
                'height': height,
                'channels': channels,
                'aspect_ratio': width / height,
                'mean_intensity': float(np.mean(gray)),
                'std_intensity': float(np.std(gray)),
                'min_intensity': int(np.min(gray)),
                'max_intensity': int(np.max(gray))
            }
            
        except Exception as e:
            return {'error': str(e)}
