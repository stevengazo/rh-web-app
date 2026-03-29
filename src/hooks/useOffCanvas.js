import { useState } from 'react';

const useOffCanvas = () => {
  const [open, setOpen] = useState(false);
  const [canvasTitle, setCanvasTitle] = useState('');
  const [canvasContent, setCanvasContent] = useState(null);

  const openCanvas = (title, content) => {
    setCanvasTitle(title);
    setCanvasContent(content);
    setOpen(true);
  };

  const closeCanvas = () => {
    setOpen(false);
    setCanvasTitle('');
    setCanvasContent(null);
  };

  return {
    open,
    canvasTitle,
    canvasContent,
    openCanvas,
    closeCanvas,
    setOpen, // por si lo ocupas manual
  };
};

export default useOffCanvas;