import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiBook, FiLink, FiSave, FiX, FiFile, FiVideo, FiImage } from 'react-icons/fi';
import axios from 'axios';

const CreateResource = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'document',
    url: '',
    category: 'other',
    fileSize: '',
    thumbnail: '',
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const types = [
    { value: 'document', label: 'Document', icon: <FiFile /> },
    { value: 'video', label: 'Video', icon: <FiVideo /> },
    { value: 'link', label: 'Link', icon: <FiLink /> },
    { value: 'image', label: 'Image', icon: <FiImage /> },
    { value: 'other', label: 'Other', icon: <FiFile /> }
  ];

  const categories = [
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'guide', label: 'Guide' },
    { value: 'presentation', label: 'Presentation' },
    { value: 'reference', label: 'Reference' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        fileSize: formData.fileSize ? parseInt(formData.fileSize) : undefined
      };

      await axios.post('/api/resources', submitData);
      toast.success('Resource created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create resource';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Resource</h1>
              <p className="text-gray-600">
                Share new learning materials with your community
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              <FiX className="mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="form-label">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter resource title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="form-label">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input form-textarea"
                    placeholder="Describe this resource..."
                    rows={4}
                  />
                </div>

                {/* Type and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="form-label">
                      Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleChange}
                      className="form-input"
                    >
                      {types.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="form-label">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="form-input"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* URL */}
                <div>
                  <label htmlFor="url" className="form-label">
                    Resource URL *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLink className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      required
                      value={formData.url}
                      onChange={handleChange}
                      className="form-input pl-10"
                      placeholder="https://example.com/resource"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Provide a direct link to the resource (Google Drive, Dropbox, website, etc.)
                  </p>
                </div>

                {/* File Size and Thumbnail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fileSize" className="form-label">
                      File Size (bytes)
                    </label>
                    <input
                      type="number"
                      id="fileSize"
                      name="fileSize"
                      min="0"
                      value={formData.fileSize}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Optional"
                    />
                    <p className="text-sm text-gray-500 mt-1">Leave empty if not applicable</p>
                  </div>

                  <div>
                    <label htmlFor="thumbnail" className="form-label">
                      Thumbnail URL
                    </label>
                    <input
                      type="url"
                      id="thumbnail"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                    <p className="text-sm text-gray-500 mt-1">Optional: Add a preview image</p>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="form-label">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInput}
                    className="form-input"
                    placeholder="Press Enter to add tags"
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">Add tags to help people find this resource</p>
                </div>

                {/* Type-specific guidance */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Resource Type Guidelines</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    {formData.type === 'document' && (
                      <p>• Upload documents to Google Drive, Dropbox, or similar services</p>
                    )}
                    {formData.type === 'video' && (
                      <p>• Use YouTube, Vimeo, or other video hosting platforms</p>
                    )}
                    {formData.type === 'link' && (
                      <p>• Provide direct links to websites, articles, or online tools</p>
                    )}
                    {formData.type === 'image' && (
                      <p>• Use image hosting services or direct image URLs</p>
                    )}
                    {formData.type === 'other' && (
                      <p>• Provide any other type of resource link</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? (
                      <>
                        <div className="spinner mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        Add Resource
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateResource; 