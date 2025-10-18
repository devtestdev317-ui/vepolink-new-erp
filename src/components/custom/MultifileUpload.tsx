// src/components/MultiFileUpload.tsx
import React, { useCallback, useState } from 'react';
import './MultiFileUpload.css';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

interface MultiFileUploadProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string;
  onFilesChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedFileTypes = '*/*',
  onFilesChange,
  onUpload,
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`;
    }
    
    if (uploadFiles.length >= maxFiles) {
      return `Maximum ${maxFiles} files allowed`;
    }

    return null;
  };

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUploadFiles: UploadFile[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      
      if (!error && uploadFiles.length + newUploadFiles.length < maxFiles) {
        newUploadFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          progress: 0,
          status: 'pending',
        });
      } else if (error) {
        console.warn(error);
      }
    });

    if (newUploadFiles.length > 0) {
      const updatedFiles = [...uploadFiles, ...newUploadFiles];
      setUploadFiles(updatedFiles);
      onFilesChange?.(updatedFiles.map(uf => uf.file));
    }
  }, [uploadFiles, maxFiles, maxSize, onFilesChange]);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files);
      event.target.value = ''; // Reset input
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = uploadFiles.filter(file => file.id !== id);
    setUploadFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map(uf => uf.file));
  };

  const updateFileProgress = (id: string, progress: number, status: UploadFile['status'], error?: string) => {
    setUploadFiles(prev => prev.map(file => 
      file.id === id ? { ...file, progress, status, error } : file
    ));
  };

  const handleUpload = async () => {
    if (onUpload) {
      // Use custom upload handler
      await onUpload(uploadFiles.map(uf => uf.file));
    } else {
      // Simulate upload progress
      uploadFiles.forEach((uploadFile) => {
        if (uploadFile.status === 'pending') {
          updateFileProgress(uploadFile.id, 0, 'uploading');
          
          // Simulate upload progress
          let progress = 0;
          const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
              progress = 100;
              updateFileProgress(uploadFile.id, progress, 'completed');
              clearInterval(interval);
            } else {
              updateFileProgress(uploadFile.id, progress, 'uploading');
            }
          }, 200);
        }
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: UploadFile['status']): string => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'uploading': return '#3b82f6';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="multi-file-upload">
      {/* Drop Zone */}
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-zone-content">
          <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p>Drag and drop files here, or click to browse</p>
          <small>
            Maximum {maxFiles} files, {formatFileSize(maxSize)} per file
          </small>
          <input
            type="file"
            multiple
            accept={acceptedFileTypes}
            onChange={handleFileInput}
            className="file-input"
          />
        </div>
      </div>

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <h3>Selected Files ({uploadFiles.length}/{maxFiles})</h3>
            <button 
              onClick={handleUpload}
              className="upload-button"
              disabled={uploadFiles.every(f => f.status !== 'pending')}
            >
              Upload All
            </button>
          </div>
          
          {uploadFiles.map((uploadFile) => (
            <div key={uploadFile.id} className="file-item">
              <div className="file-info">
                <div className="file-name">{uploadFile.file.name}</div>
                <div className="file-details">
                  {formatFileSize(uploadFile.file.size)} • 
                  <span style={{ color: getStatusColor(uploadFile.status), marginLeft: '4px' }}>
                    {uploadFile.status}
                  </span>
                </div>
              </div>
              
              <div className="file-actions">
                {/* Progress Bar */}
                {uploadFile.status === 'uploading' && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadFile.progress}%` }}
                    />
                  </div>
                )}
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFile(uploadFile.id)}
                  className="remove-button"
                  disabled={uploadFile.status === 'uploading'}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;