from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime
import os

class ReportGenerator:
    """Generate comprehensive PDF reports for predictions"""
    
    def __init__(self, report_path):
        self.report_path = report_path
        self.doc = SimpleDocTemplate(report_path, pagesize=letter)
        self.styles = getSampleStyleSheet()
        self.story = []
        
        # Custom styles
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#1a5490'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )
        
        self.heading_style = ParagraphStyle(
            'CustomHeading',
            parent=self.styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#2c5282'),
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold'
        )
        
        self.normal_style = ParagraphStyle(
            'CustomNormal',
            parent=self.styles['Normal'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=10
        )
    
    def add_title(self, title):
        """Add report title"""
        self.story.append(Paragraph(title, self.title_style))
        self.story.append(Spacer(1, 0.3 * inch))
    
    def add_heading(self, heading):
        """Add section heading"""
        self.story.append(Paragraph(heading, self.heading_style))
        self.story.append(Spacer(1, 0.1 * inch))
    
    def add_paragraph(self, text):
        """Add paragraph text"""
        self.story.append(Paragraph(text, self.normal_style))
        self.story.append(Spacer(1, 0.1 * inch))
    
    def add_image(self, image_path, width=4*inch):
        """Add image to report"""
        if os.path.exists(image_path):
            try:
                img = Image(image_path, width=width)
                img.hAlign = 'CENTER'
                self.story.append(img)
                self.story.append(Spacer(1, 0.2 * inch))
            except Exception as e:
                self.add_paragraph(f"<i>Image could not be loaded: {str(e)}</i>")
    
    def add_table(self, data, col_widths=None):
        """Add table to report"""
        table = Table(data, colWidths=col_widths)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c5282')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ]))
        self.story.append(table)
        self.story.append(Spacer(1, 0.2 * inch))
    
    def generate_prediction_report(self, prediction_data, user_info, model_performance):
        """
        Generate complete prediction report
        
        Args:
            prediction_data: Dictionary containing prediction information
            user_info: User information
            model_performance: Model performance metrics
        """
        # Title
        self.add_title("Brain Tumor MRI Analysis Report")
        
        # Report Information
        self.add_heading("Report Information")
        report_date = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        self.add_paragraph(f"<b>Report Generated:</b> {report_date}")
        self.add_paragraph(f"<b>Analysis ID:</b> {prediction_data.get('analysis_id', 'N/A')}")
        if user_info:
            self.add_paragraph(f"<b>User:</b> {user_info.get('name', 'N/A')}")
        self.story.append(Spacer(1, 0.2 * inch))
        
        # MRI Image
        self.add_heading("Uploaded MRI Image")
        if prediction_data.get('image_path'):
            self.add_image(prediction_data['image_path'], width=3.5*inch)
        
        # Analysis Results
        self.add_heading("Analysis Results")
        
        result_data = [
            ['Parameter', 'Value'],
            ['Predicted Class', prediction_data.get('predicted_class', 'N/A').upper()],
            ['Confidence Score', f"{prediction_data.get('confidence', 0) * 100:.2f}%"],
            ['Model Used', prediction_data.get('model_name', 'CNN Model')],
            ['Analysis Date', prediction_data.get('timestamp', datetime.now()).strftime("%Y-%m-%d %H:%M:%S")]
        ]
        self.add_table(result_data, col_widths=[2.5*inch, 3*inch])
        
        # Interpretation
        self.add_heading("Result Interpretation")
        predicted_class = prediction_data.get('predicted_class', '').lower()
        confidence = prediction_data.get('confidence', 0) * 100
        
        interpretation = self._get_interpretation(predicted_class, confidence)
        self.add_paragraph(interpretation)
        
        # Image Processing Steps
        self.add_heading("Image Processing Pipeline")
        preprocessing_steps = prediction_data.get('preprocessing_steps', [
            'Image validation',
            'Resize to 224x224 pixels',
            'Noise reduction using FastNlMeans',
            'Contrast enhancement using CLAHE',
            'RGB conversion',
            'Normalization to [0, 1] range',
            'Tensor conversion for CNN'
        ])
        
        for i, step in enumerate(preprocessing_steps, 1):
            self.add_paragraph(f"{i}. {step}")
        
        self.story.append(Spacer(1, 0.2 * inch))
        
        # Model Performance
        if model_performance:
            self.add_heading("Model Performance Metrics")
            
            perf_data = [
                ['Metric', 'Value'],
                ['Accuracy', f"{model_performance.get('accuracy', 0) * 100:.2f}%"],
                ['Precision', f"{model_performance.get('precision', 0) * 100:.2f}%"],
                ['Recall', f"{model_performance.get('recall', 0) * 100:.2f}%"],
                ['F1-Score', f"{model_performance.get('f1_score', 0) * 100:.2f}%"]
            ]
            self.add_table(perf_data, col_widths=[2.5*inch, 3*inch])
        
        # Tumor Type Information
        self.add_heading("Tumor Type Information")
        tumor_info = self._get_tumor_info(predicted_class)
        self.add_paragraph(tumor_info)
        
        # Medical Disclaimer
        self.story.append(PageBreak())
        self.add_heading("IMPORTANT MEDICAL DISCLAIMER")
        disclaimer = """
        <b>⚠️ CRITICAL NOTICE:</b><br/><br/>
        This report is generated by an artificial intelligence system designed for research and educational purposes only. 
        This analysis should <b>NOT</b> be used as a replacement for professional medical advice, diagnosis, or treatment.<br/><br/>
        
        <b>Key Points:</b><br/>
        • This AI-assisted analysis is provided for informational purposes only<br/>
        • The predictions are based on machine learning algorithms and may not be 100% accurate<br/>
        • This system has not been approved by any medical regulatory authority for clinical diagnostic use<br/>
        • Results should always be verified by qualified medical professionals<br/>
        • Do not make medical decisions based solely on this report<br/>
        • Always consult with a qualified radiologist or physician for proper diagnosis and treatment<br/>
        • In case of any medical concerns, please seek immediate professional medical attention<br/><br/>
        
        The developers and operators of this system assume no liability for decisions made based on this report.
        """
        self.add_paragraph(disclaimer)
        
        # Build PDF
        self.doc.build(self.story)
        return self.report_path
    
    def _get_interpretation(self, predicted_class, confidence):
        """Get interpretation based on prediction"""
        interpretations = {
            'glioma': f"""
            The analysis indicates a <b>Glioma</b> with {confidence:.2f}% confidence. 
            Gliomas are tumors that originate in the glial cells of the brain or spine. 
            They are the most common type of primary brain tumor. Early detection and proper medical consultation 
            are crucial for appropriate treatment planning.
            """,
            'meningioma': f"""
            The analysis indicates a <b>Meningioma</b> with {confidence:.2f}% confidence. 
            Meningiomas are tumors that arise from the meninges, the membranes that surround the brain and spinal cord. 
            They are typically slow-growing and often benign, but medical evaluation is essential.
            """,
            'pituitary': f"""
            The analysis indicates a <b>Pituitary Tumor</b> with {confidence:.2f}% confidence. 
            Pituitary tumors develop in the pituitary gland and can affect hormone production. 
            Most pituitary tumors are benign but may require medical intervention depending on size and hormone effects.
            """,
            'notumor': f"""
            The analysis indicates <b>No Tumor Detected</b> with {confidence:.2f}% confidence. 
            The MRI scan does not show characteristic patterns associated with common brain tumors. 
            However, this AI analysis should be confirmed by a medical professional.
            """
        }
        return interpretations.get(predicted_class, "Analysis completed. Please consult with a medical professional for interpretation.")
    
    def _get_tumor_info(self, predicted_class):
        """Get detailed information about tumor type"""
        tumor_info = {
            'glioma': """
            <b>Glioma Overview:</b><br/>
            Gliomas are brain tumors that originate in glial cells, which support and protect neurons in the brain. 
            They represent about 33% of all brain tumors. Gliomas can be classified into different grades based on 
            their aggressiveness, ranging from slow-growing low-grade gliomas to rapidly growing high-grade gliomas. 
            Treatment options may include surgery, radiation therapy, and chemotherapy, depending on the type and grade.
            """,
            'meningioma': """
            <b>Meningioma Overview:</b><br/>
            Meningiomas are the most common type of primary brain tumor, accounting for about 30% of all brain tumors. 
            They arise from the meninges, the protective layers surrounding the brain and spinal cord. Most meningiomas 
            are benign (non-cancerous) and slow-growing. Treatment depends on size, location, and symptoms, and may 
            include observation, surgery, or radiation therapy.
            """,
            'pituitary': """
            <b>Pituitary Tumor Overview:</b><br/>
            Pituitary tumors are abnormal growths in the pituitary gland, a small organ at the base of the brain that 
            controls many important hormones. Most pituitary tumors are benign adenomas. They can cause problems by 
            producing too much of certain hormones or by pressing on nearby structures. Treatment options include 
            medications, surgery, and radiation therapy.
            """,
            'notumor': """
            <b>No Tumor Detected:</b><br/>
            The MRI analysis did not identify characteristic patterns associated with gliomas, meningiomas, or 
            pituitary tumors. While this is a positive indication, it's important to note that this AI system 
            is trained on specific tumor types and may not detect all possible brain abnormalities. Regular health 
            checkups and professional medical evaluation remain important.
            """
        }
        return tumor_info.get(predicted_class, "Please consult with a healthcare professional for detailed information.")
