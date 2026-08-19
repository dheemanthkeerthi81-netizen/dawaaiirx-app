import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  FileText, 
  Calendar, 
  User, 
  Pill,
  ExternalLink
} from 'lucide-react';
import { HealthRecord } from '../../types';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  recordTitle: string;
  imageType?: string;
  record?: HealthRecord | null;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  recordTitle,
  imageType = 'Doctor Note',
  record,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `DawaaiiRx-${recordTitle.replace(/\s+/g, '_')}-document.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate max-w-md">{recordTitle}</h3>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 bg-emerald-600 text-white rounded-md">
                  {imageType.replace('_', ' ')}
                </span>
              </div>
              {record && (
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Patient: {record.memberName} ({record.memberRelation}) &bull; Date: {record.dateRecorded}
                </p>
              )}
            </div>
          </div>

          {/* Top Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded-xl p-1 text-slate-300 border border-slate-700">
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:text-white hover:bg-slate-700 rounded-lg"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-1.5 text-slate-400">{Math.round(zoom * 100)}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:text-white hover:bg-slate-700 rounded-lg"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-slate-700 mx-1" />
              <button
                onClick={handleRotate}
                className="p-1.5 hover:text-white hover:bg-slate-700 rounded-lg"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleDownload}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700"
              title="Download Photo"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 bg-black p-4 flex items-center justify-center overflow-auto min-h-[420px]">
          <img
            src={imageUrl}
            alt={recordTitle}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease',
            }}
            className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-xl"
          />
        </div>

        {/* Footer info */}
        {record && record.details && (
          <div className="p-3.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <p className="line-clamp-1 text-slate-400">
              <strong className="text-slate-200">Notes:</strong> {record.details}
            </p>
            <button
              onClick={handleReset}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold shrink-0 cursor-pointer ml-4"
            >
              Reset View
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
