'use client';

import { Upload, Grid, List, Trash2, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import ImageUpload from '@/components/forms/ImageUpload';
import toast from 'react-hot-toast';
import { apiClient } from '@/src/services/api';

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getMediaFiles();
        setMediaFiles(data.data || []);
      } catch (error: any) {
        toast.error('Failed to load media');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handleImageUpload = async (file: File, preview: string) => {
    setUploading(true);
    try {
      const result = await apiClient.uploadMedia(file);
      setMediaFiles([result, ...mediaFiles]);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    
    try {
      await apiClient.deleteMedia(id);
      setMediaFiles(mediaFiles.filter(f => f.id !== id));
      toast.success('Image deleted');
    } catch (error: any) {
      toast.error('Failed to delete image');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage your images and files</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition ${viewMode === 'grid' ? 'bg-white' : ''}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition ${viewMode === 'list' ? 'bg-white' : ''}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Upload New Images</h3>
        <ImageUpload onUpload={handleImageUpload} />
      </div>

      {/* Media Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading media...</p>
        </div>
      ) : mediaFiles.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No images uploaded yet</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles.map((file) => (
            <div key={file.id} className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden">
              <img
                src={file.url}
                alt={file.filename}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                <button
                  onClick={() => copyToClipboard(file.url)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                  title="Copy URL"
                >
                  <Copy size={18} />
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{file.filename}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Filename</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Size</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Uploaded</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mediaFiles.map((file) => (
                <tr key={file.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{file.filename}</td>
                  <td className="px-6 py-3 text-gray-600">{(file.size / 1024).toFixed(2)} KB</td>
                  <td className="px-6 py-3 text-gray-600">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(file.url)}
                        className="p-2 hover:bg-blue-100 text-blue-600 rounded transition"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
