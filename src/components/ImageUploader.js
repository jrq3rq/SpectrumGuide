import React, { useState, useEffect } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ImageUploader = ({ maxImages, onImagesChange }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images.`);
      return;
    }

    const newImages = [];
    for (const file of files) {
      if (file.type === "application/pdf") {
        try {
          const url = URL.createObjectURL(file);
          const pdf = await pdfjs.getDocument(url).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.0 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          const imageUrl = canvas.toDataURL("image/png");
          newImages.push({ file, imageUrl });
          URL.revokeObjectURL(url);
        } catch (err) {
          setError("Failed to process PDF. Please try another file.");
          return;
        }
      } else if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        newImages.push({ file, imageUrl });
      } else {
        setError("Please upload images or PDFs only.");
        return;
      }
    }

    setImages([...images, ...newImages]);
    onImagesChange([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={handleFileChange}
        disabled={images.length >= maxImages}
      />
      {error && <p className="error">{error}</p>}
      <div className="image-preview">
        {images.map((img, index) => (
          <div key={index} className="image-preview-item">
            <img src={img.imageUrl} alt={`Uploaded ${index + 1}`} />
            <button onClick={() => removeImage(index)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ImageUploader;
