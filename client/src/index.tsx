import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { FlashcardApp } from './FlashcardApp';


const main: HTMLElement|null = document.getElementById('main');
if (main === null)
  throw new Error("Uh oh! HTML is missing 'main' element");

  

const root: Root = createRoot(main);
root.render(<FlashcardApp/>);
