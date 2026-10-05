import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.image import ImageDataGenerator
ModelCheckpoint = keras.callbacks.ModelCheckpoint
EarlyStopping = keras.callbacks.EarlyStopping
ReduceLROnPlateau = keras.callbacks.ReduceLROnPlateau
import cv2
import json
from datetime import datetime

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model_architectures import CNNArchitectures

class BrainTumorModelTrainer:
    """Train CNN models for brain tumor classification"""
    
    def __init__(self, data_dir, img_size=(224, 224), batch_size=32):
        self.data_dir = data_dir
        self.img_size = img_size
        self.batch_size = batch_size
        self.classes = ['glioma', 'meningioma', 'notumor', 'pituitary']
        self.num_classes = len(self.classes)
        self.history = None
        self.model = None
        
    def load_data(self):
        """Load and preprocess training and testing data"""
        print("Loading training data...")
        train_dir = os.path.join(self.data_dir, 'Training')
        test_dir = os.path.join(self.data_dir, 'Testing')
        
        # Data augmentation for training
        train_datagen = ImageDataGenerator(
            rescale=1./255,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            horizontal_flip=True,
            zoom_range=0.2,
            shear_range=0.15,
            fill_mode='nearest',
            validation_split=0.2
        )
        
        # Only rescaling for test data
        test_datagen = ImageDataGenerator(rescale=1./255)
        
        # Training data
        self.train_generator = train_datagen.flow_from_directory(
            train_dir,
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='categorical',
            subset='training',
            shuffle=True
        )
        
        # Validation data
        self.validation_generator = train_datagen.flow_from_directory(
            train_dir,
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='categorical',
            subset='validation',
            shuffle=False
        )
        
        # Test data
        self.test_generator = test_datagen.flow_from_directory(
            test_dir,
            target_size=self.img_size,
            batch_size=self.batch_size,
            class_mode='categorical',
            shuffle=False
        )
        
        print(f"Training samples: {self.train_generator.samples}")
        print(f"Validation samples: {self.validation_generator.samples}")
        print(f"Test samples: {self.test_generator.samples}")
        print(f"Classes: {self.classes}")
        
        return self.train_generator, self.validation_generator, self.test_generator
    
    def train_model(self, model_name='custom_cnn', epochs=50):
        """Train the selected model"""
        print(f"\n{'='*50}")
        print(f"Training {model_name} model")
        print(f"{'='*50}\n")
        
        # Build model
        architectures = CNNArchitectures(
            input_shape=(self.img_size[0], self.img_size[1], 3),
            num_classes=self.num_classes
        )
        
        if model_name == 'custom_cnn':
            self.model = architectures.build_custom_cnn()
        elif model_name == 'resnet50':
            self.model = architectures.build_resnet50()
        elif model_name == 'vgg16':
            self.model = architectures.build_vgg16()
        elif model_name == 'efficientnet':
            self.model = architectures.build_efficientnet()
        else:
            raise ValueError(f"Unknown model: {model_name}")
        
        # Compile model
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.0001),
            loss='categorical_crossentropy',
            metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
        )
        
        print(self.model.summary())
        
        # Callbacks
        model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', 'models')
        os.makedirs(model_dir, exist_ok=True)
        
        checkpoint = ModelCheckpoint(
            os.path.join(model_dir, f'{model_name}_best.h5'),
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        )
        
        early_stop = EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        )
        
        reduce_lr = ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        )
        
        # Train model
        print("\nStarting training...")
        self.history = self.model.fit(
            self.train_generator,
            epochs=epochs,
            validation_data=self.validation_generator,
            callbacks=[checkpoint, early_stop, reduce_lr],
            verbose=1
        )
        
        return self.history
    
    def evaluate_model(self):
        """Evaluate model on test data"""
        print("\n" + "="*50)
        print("Evaluating model on test data")
        print("="*50 + "\n")
        
        # Get predictions
        self.test_generator.reset()
        predictions = self.model.predict(self.test_generator, verbose=1)
        predicted_classes = np.argmax(predictions, axis=1)
        true_classes = self.test_generator.classes
        
        # Calculate metrics
        accuracy = accuracy_score(true_classes, predicted_classes)
        precision = precision_score(true_classes, predicted_classes, average='weighted')
        recall = recall_score(true_classes, predicted_classes, average='weighted')
        f1 = f1_score(true_classes, predicted_classes, average='weighted')
        
        print(f"\nTest Accuracy: {accuracy*100:.2f}%")
        print(f"Test Precision: {precision*100:.2f}%")
        print(f"Test Recall: {recall*100:.2f}%")
        print(f"Test F1-Score: {f1*100:.2f}%")
        
        # Classification report
        print("\nClassification Report:")
        print(classification_report(true_classes, predicted_classes, target_names=self.classes))
        
        # Confusion matrix
        cm = confusion_matrix(true_classes, predicted_classes)
        
        # Save metrics
        metrics = {
            'accuracy': float(accuracy),
            'precision': float(precision),
            'recall': float(recall),
            'f1_score': float(f1),
            'confusion_matrix': cm.tolist(),
            'classes': self.classes,
            'timestamp': datetime.now().isoformat()
        }
        
        return metrics, cm
    
    def plot_training_history(self, save_path=None):
        """Plot training history"""
        if self.history is None:
            print("No training history available")
            return
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # Accuracy
        axes[0, 0].plot(self.history.history['accuracy'], label='Train Accuracy')
        axes[0, 0].plot(self.history.history['val_accuracy'], label='Val Accuracy')
        axes[0, 0].set_title('Model Accuracy')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Accuracy')
        axes[0, 0].legend()
        axes[0, 0].grid(True)
        
        # Loss
        axes[0, 1].plot(self.history.history['loss'], label='Train Loss')
        axes[0, 1].plot(self.history.history['val_loss'], label='Val Loss')
        axes[0, 1].set_title('Model Loss')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()
        axes[0, 1].grid(True)
        
        # Precision
        axes[1, 0].plot(self.history.history['precision'], label='Train Precision')
        axes[1, 0].plot(self.history.history['val_precision'], label='Val Precision')
        axes[1, 0].set_title('Model Precision')
        axes[1, 0].set_xlabel('Epoch')
        axes[1, 0].set_ylabel('Precision')
        axes[1, 0].legend()
        axes[1, 0].grid(True)
        
        # Recall
        axes[1, 1].plot(self.history.history['recall'], label='Train Recall')
        axes[1, 1].plot(self.history.history['val_recall'], label='Val Recall')
        axes[1, 1].set_title('Model Recall')
        axes[1, 1].set_xlabel('Epoch')
        axes[1, 1].set_ylabel('Recall')
        axes[1, 1].legend()
        axes[1, 1].grid(True)
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            print(f"Training history plot saved to {save_path}")
        
        plt.show()
    
    def plot_confusion_matrix(self, cm, save_path=None):
        """Plot confusion matrix"""
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                    xticklabels=self.classes, yticklabels=self.classes)
        plt.title('Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            print(f"Confusion matrix plot saved to {save_path}")
        
        plt.show()
    
    def save_model(self, model_path):
        """Save the trained model"""
        if self.model is None:
            print("No model to save")
            return
        
        self.model.save(model_path)
        print(f"Model saved to {model_path}")

def main():
    """Main training function"""
    # Configuration
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'archive')
    model_name = 'custom_cnn'  # Options: custom_cnn, resnet50, vgg16, efficientnet
    epochs = 50
    
    # Initialize trainer
    trainer = BrainTumorModelTrainer(data_dir=data_dir)
    
    # Load data
    trainer.load_data()
    
    # Train model
    trainer.train_model(model_name=model_name, epochs=epochs)
    
    # Evaluate model
    metrics, cm = trainer.evaluate_model()
    
    # Plot results
    results_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', 'models', 'results')
    os.makedirs(results_dir, exist_ok=True)
    
    trainer.plot_training_history(
        save_path=os.path.join(results_dir, f'{model_name}_training_history.png')
    )
    
    trainer.plot_confusion_matrix(
        cm,
        save_path=os.path.join(results_dir, f'{model_name}_confusion_matrix.png')
    )
    
    # Save final model
    model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                               'backend', 'models', 'brain_tumor_cnn_model.h5')
    trainer.save_model(model_path)
    
    # Save metrics
    metrics_path = os.path.join(results_dir, f'{model_name}_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=4)
    print(f"Metrics saved to {metrics_path}")
    
    print("\n" + "="*50)
    print("Training completed successfully!")
    print("="*50)

if __name__ == '__main__':
    main()
