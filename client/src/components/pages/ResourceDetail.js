import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiDownload, 
  FiExternalLink, 
  FiEdit, 
  FiTrash2,
  FiFile,
  FiVideo,
  FiImage,
  FiLink,
  FiUser,
  FiCalendar,
  FiEye
} from 'react-icons/fi';
import axios from 'axios';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/resources/${id}`);
      setResource(response.data);
    } catch (error) {
      toast.error('Failed to fetch resource details');
      console.error('Error fetching resource:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await axios.delete(`/api/resources/${id}`);
        toast.success('Resource deleted successfully');
        navigate('/resources');
      } catch (error) {
        toast.error('Failed to delete resource');
      }
    }
  };

  const isCreator = () => {
    return resource?.createdBy?._id === user?.id;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'document':
        return <FiFile className="w-6 h-6" />;
      case 'video':
        return <FiVideo className="w-6 h-6" />;
      case 'image':
        return <FiImage className="w-6 h-6" />;
      case 'link':
        return <FiLink className="w-6 h-6" />;
      default:
        return <FiFile className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'tutorial':
        return 'bg-blue-100 text-blue-800';
      case 'guide':
        return 'bg-green-100 text-green-800';
      case 'presentation':
        return 'bg-purple-100 text-purple-800';
      case 'reference':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Resource Not Found</h1>
          <p className="text-gray-600 mb-6">The resource you're looking for doesn't exist or has been removed.</p>
          <Link to="/resources" className="btn btn-primary">
            <FiArrowLeft className="mr-2" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/resources"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{resource.title}</h1>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    <FiEye className="mr-1" />
                    {resource.downloadCount || 0} downloads
                  </span>
                  <span className="flex items-center">
                    <FiCalendar className="mr-1" />
                    {formatDate(resource.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            
            {(isCreator() || isAdmin()) && (
              <div className="flex items-center space-x-2">
                <Link
                  to={`/dashboard/edit-resource/${resource._id}`}
                  className="btn btn-secondary"
                >
                  <FiEdit className="mr-2" />
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              {resource.thumbnail && (
                <img
                  src={resource.thumbnail}
                  alt={resource.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(resource.category)}`}>
                    {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                  </span>
                  <div className="flex items-center text-gray-500">
                    {getTypeIcon(resource.type)}
                    <span className="ml-1 text-sm">{resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">
                  {resource.description}
                </p>

                {resource.tags && resource.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FiFile className="w-5 h-5 mr-3" />
                      <span>Type: {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="w-5 h-5 mr-3" />
                      <span>Added: {formatDate(resource.createdAt)}</span>
                    </div>
                    {resource.fileSize && (
                      <div className="flex items-center text-gray-600">
                        <FiDownload className="w-5 h-5 mr-3" />
                        <span>Size: {formatFileSize(resource.fileSize)}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <FiEye className="w-5 h-5 mr-3" />
                      <span>Downloads: {resource.downloadCount || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Type Guidelines */}
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">How to Use This Resource</h2>
              </div>
              <div className="card-body">
                <div className="prose max-w-none">
                  {resource.type === 'document' && (
                    <div>
                      <p className="text-gray-700 mb-4">
                        This is a document resource. You can download or view it using the link below.
                      </p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Click the download button to access the file</li>
                        <li>Some documents may require specific software to open</li>
                        <li>Make sure you have sufficient storage space</li>
                      </ul>
                    </div>
                  )}
                  {resource.type === 'video' && (
                    <div>
                      <p className="text-gray-700 mb-4">
                        This is a video resource. You can watch it using the link below.
                      </p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Click the link to watch the video</li>
                        <li>Videos may be hosted on platforms like YouTube or Vimeo</li>
                        <li>Ensure you have a stable internet connection</li>
                      </ul>
                    </div>
                  )}
                  {resource.type === 'link' && (
                    <div>
                      <p className="text-gray-700 mb-4">
                        This is a link resource. You can visit the website using the link below.
                      </p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Click the link to visit the website</li>
                        <li>The link will open in a new tab</li>
                        <li>Make sure to verify the content is safe</li>
                      </ul>
                    </div>
                  )}
                  {resource.type === 'image' && (
                    <div>
                      <p className="text-gray-700 mb-4">
                        This is an image resource. You can view or download it using the link below.
                      </p>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Click the link to view the image</li>
                        <li>Right-click to save the image if needed</li>
                        <li>Images may be high resolution</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Resource Actions</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn btn-primary"
                  >
                    <FiDownload className="mr-2" />
                    Access Resource
                  </a>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Resource Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{resource.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{resource.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Downloads:</span>
                        <span className="font-medium">{resource.downloadCount || 0}</span>
                      </div>
                      {resource.fileSize && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-medium">{formatFileSize(resource.fileSize)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Added:</span>
                        <span className="font-medium">{formatDate(resource.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {resource.createdBy && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Shared by</h4>
                      <div className="flex items-center space-x-3">
                        {resource.createdBy.avatar ? (
                          <img
                            src={resource.createdBy.avatar}
                            alt={resource.createdBy.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {resource.createdBy.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span className="text-sm text-gray-700">{resource.createdBy.name}</span>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <FiExternalLink className="mr-2" />
                        Open in new tab
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(resource.url);
                          toast.success('Link copied to clipboard!');
                        }}
                        className="flex items-center text-sm text-gray-600 hover:text-gray-700 transition-colors w-full text-left"
                      >
                        <FiLink className="mr-2" />
                        Copy link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail; 