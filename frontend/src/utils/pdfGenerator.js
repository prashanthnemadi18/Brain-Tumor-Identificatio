import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePredictionReport = (prediction, user) => {
  console.log('🔄 PDF Generation Started');
  console.log('Prediction:', JSON.stringify(prediction, null, 2));
  console.log('User:', JSON.stringify(user, null, 2));
  
  try {
    // Validate required data
    if (!prediction) {
      throw new Error('Prediction data is missing');
    }
    
    if (!prediction.predicted_class) {
      throw new Error('Predicted class is missing from prediction data');
    }
    
    console.log('✅ Validation passed, creating PDF document...');
    
    // Create new PDF document
    const doc = new jsPDF();
    console.log('✅ jsPDF instance created');
    console.log('✅ autoTable available:', typeof doc.autoTable);
    
    // Set fonts and colors
    const primaryColor = [26, 84, 144]; // #1a5490
    const accentColor = [102, 126, 234]; // #667eea
    
    // Title
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    doc.text('Brain Tumor MRI Analysis Report', 105, 20, { align: 'center' });
    
    // Horizontal line
    doc.setDrawColor(...accentColor);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Report Information Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Report Information', 20, 35);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    
    const reportDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    doc.text(`Report Generated: ${reportDate}`, 20, 42);
    doc.text(`Analysis ID: ${prediction.prediction_id || prediction.id || 'N/A'}`, 20, 48);
    doc.text(`Patient/User: ${user?.name || 'N/A'}`, 20, 54);
    
    // Analysis Results Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Analysis Results', 20, 68);
    
    // Results Table
    const predictedClass = prediction.predicted_class || 'Unknown';
    const confidence = prediction.confidence || 0;
    const timestamp = prediction.timestamp || new Date().toISOString();
    
    let finalY = 73;
    
    // Use autoTable if available, otherwise fallback
    if (typeof doc.autoTable === 'function') {
      doc.autoTable({
        startY: 73,
        head: [['Parameter', 'Value']],
        body: [
          ['Predicted Class', predictedClass.toUpperCase()],
          ['Confidence Score', `${(confidence * 100).toFixed(2)}%`],
          ['Model Used', 'CNN Deep Learning Model'],
          ['Analysis Date', new Date(timestamp).toLocaleString()]
        ],
        theme: 'striped',
        headStyles: {
          fillColor: primaryColor,
          fontSize: 11,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 10
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 60 },
          1: { cellWidth: 110 }
        }
      });
      finalY = doc.lastAutoTable.finalY + 10;
    } else {
      // Fallback if autoTable is not available
      console.warn('autoTable not available, using manual layout');
      finalY = 80;
      doc.setFontSize(10);
      doc.text('Predicted Class: ' + predictedClass.toUpperCase(), 20, finalY);
      finalY += 10;
      doc.text(`Confidence Score: ${(confidence * 100).toFixed(2)}%`, 20, finalY);
      finalY += 10;
      doc.text('Model Used: CNN Deep Learning Model', 20, finalY);
      finalY += 10;
      doc.text('Analysis Date: ' + new Date(timestamp).toLocaleString(), 20, finalY);
      finalY += 15;
    }
    
    // Result Interpretation
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Result Interpretation', 20, finalY);
    
    finalY += 7;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    
    const interpretation = getInterpretation(predictedClass, confidence * 100);
    const splitInterpretation = doc.splitTextToSize(interpretation, 170);
    doc.text(splitInterpretation, 20, finalY);
    finalY += splitInterpretation.length * 5 + 5;
    
    // Class Probabilities Section
    if (prediction.class_probabilities) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('All Class Probabilities', 20, finalY);
      
      finalY += 5;
      
      const probData = Object.entries(prediction.class_probabilities).map(
        ([className, prob]) => [
          className.charAt(0).toUpperCase() + className.slice(1),
          `${(prob * 100).toFixed(2)}%`
        ]
      );
      
      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          startY: finalY,
          head: [['Class', 'Probability']],
          body: probData,
          theme: 'grid',
          headStyles: {
            fillColor: accentColor,
            fontSize: 10
          },
          styles: {
            fontSize: 9
          }
        });
        finalY = doc.lastAutoTable.finalY + 10;
      } else {
        // Fallback without autoTable
        doc.setFontSize(10);
        finalY += 10;
        probData.forEach(([className, prob]) => {
          doc.text(`${className}: ${prob}`, 20, finalY);
          finalY += 7;
        });
        finalY += 10;
      }
    }
    
    // Tumor Type Information
    if (finalY < 240) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Tumor Type Information', 20, finalY);
      
      finalY += 7;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0, 0, 0);
      
      const tumorInfo = getTumorInfo(predictedClass);
      const splitTumorInfo = doc.splitTextToSize(tumorInfo, 170);
      doc.text(splitTumorInfo, 20, finalY);
    }
    
    // New page for disclaimer
    doc.addPage();
    
    // Medical Disclaimer
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(220, 53, 69); // Red color for warning
    doc.text('IMPORTANT MEDICAL DISCLAIMER', 105, 20, { align: 'center' });
    
    doc.setDrawColor(220, 53, 69);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('⚠ CRITICAL NOTICE:', 20, 35);
    
    doc.setFont(undefined, 'normal');
    const disclaimer = `This report is generated by an artificial intelligence system designed for research and educational purposes only. This analysis should NOT be used as a replacement for professional medical advice, diagnosis, or treatment.

KEY POINTS:
• This AI-assisted analysis is provided for informational purposes only
• The predictions are based on machine learning algorithms and may not be 100% accurate
• This system has not been approved by any medical regulatory authority for clinical use
• Results should always be verified by qualified medical professionals
• Do not make medical decisions based solely on this report
• Always consult with a qualified radiologist or physician for proper diagnosis
• In case of any medical concerns, please seek immediate professional medical attention

The developers and operators of this system assume no liability for decisions made based on this report.`;
    
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 170);
    doc.text(splitDisclaimer, 20, 45);
    
    // Footer on both pages
    const addFooter = (pageNumber) => {
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Brain Tumor Detection System - Page ${pageNumber}`,
        105,
        285,
        { align: 'center' }
      );
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        105,
        290,
        { align: 'center' }
      );
    };
    
    // Add footers
    doc.setPage(1);
    addFooter(1);
    doc.setPage(2);
    addFooter(2);
    
    // Save PDF
    const filename = `brain_tumor_report_${prediction.prediction_id || prediction.id || Date.now()}.pdf`;
    console.log('✅ Saving PDF as:', filename);
    doc.save(filename);
    
    console.log('✅ PDF generated and downloaded successfully!');
    return { success: true, filename };
    
  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    return { success: false, error: error.message };
  }
};

// Helper function for interpretation
const getInterpretation = (predictedClass, confidence) => {
  const interpretations = {
    glioma: `The analysis indicates a GLIOMA with ${confidence.toFixed(2)}% confidence. Gliomas are tumors that originate in the glial cells of the brain or spine. They are the most common type of primary brain tumor. Early detection and proper medical consultation are crucial for appropriate treatment planning.`,
    
    meningioma: `The analysis indicates a MENINGIOMA with ${confidence.toFixed(2)}% confidence. Meningiomas are tumors that arise from the meninges, the membranes that surround the brain and spinal cord. They are typically slow-growing and often benign, but medical evaluation is essential.`,
    
    pituitary: `The analysis indicates a PITUITARY TUMOR with ${confidence.toFixed(2)}% confidence. Pituitary tumors develop in the pituitary gland and can affect hormone production. Most pituitary tumors are benign but may require medical intervention.`,
    
    notumor: `The analysis indicates NO TUMOR DETECTED with ${confidence.toFixed(2)}% confidence. The MRI scan does not show characteristic patterns associated with common brain tumors. However, this AI analysis should be confirmed by a medical professional.`
  };
  
  return interpretations[predictedClass?.toLowerCase()] || 'Analysis completed. Please consult with a medical professional for interpretation.';
};

// Helper function for tumor information
const getTumorInfo = (predictedClass) => {
  const tumorInfo = {
    glioma: 'Gliomas are brain tumors that originate in glial cells, which support and protect neurons. They represent about 33% of all brain tumors and can be classified into different grades based on aggressiveness.',
    
    meningioma: 'Meningiomas are the most common type of primary brain tumor, accounting for about 30% of all brain tumors. They arise from the meninges and are usually benign and slow-growing.',
    
    pituitary: 'Pituitary tumors are abnormal growths in the pituitary gland at the base of the brain. Most are benign adenomas that can affect hormone production.',
    
    notumor: 'No tumor detected means the MRI analysis did not identify characteristic patterns of gliomas, meningiomas, or pituitary tumors. Regular health checkups remain important.'
  };
  
  return tumorInfo[predictedClass?.toLowerCase()] || 'Please consult with a healthcare professional for detailed information.';
};
