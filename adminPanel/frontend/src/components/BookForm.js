import React from 'react';
import '../css/style.css';

const BookForm = ({
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  isUploading,
  uploadProgress,
  isEdit = false
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Author:</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Genre:</label>
        <select
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          required
        >
             <option value="romantic drama with sci-fi">Romantic drama with Sci-fi</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-fiction</option>
                <option value="romance">Romance</option>
                <option value="thriller">Thriller</option>
                <option value="fantasy">Fantasy</option>
                <option value="history">History</option>
                <option value="science">Science</option>
                <option value="biography">Biography</option>
                <option value="self-help">Self-help</option>
                <option value="mystery">Mystery</option>
                <option value="historical fiction">Historical Fiction</option>
                <option value="horror">Horror</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Publication Year:</label>
        <input
          type="number"
          name="publication_year"
          value={formData.publication_year}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Cover Image:</label>
        <input
          type="file"
          name="coverImage"
          accept="image/*"
          onChange={handleFileChange}
          required={!isEdit}
        />
      </div>
      
      <div className="form-group">
        <label>PDF File:</label>
        <input
          type="file"
          name="pdfFile"
          accept=".pdf"
          onChange={handleFileChange}
          required={!isEdit}
        />
      </div>
      
      {isUploading && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
        </div>
      )}
      
      <button type="submit" className="submit-btn" disabled={isUploading}>
        {isUploading ? 'Uploading...' : isEdit ? 'Update Book' : 'Add Book'}
      </button>
    </form>
  );
};

export default BookForm;