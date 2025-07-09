import React, { useRef, useCallback, useState } from 'react';
import { useModal } from '../../context/ModalContext';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface FormatButton {
  command: string;
  icon: string;
  title: string;
  hasParam?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const { showAlert, showPrompt } = useModal();

  const formatButtons: FormatButton[] = [
    { command: 'bold', icon: '𝐁', title: 'Bold' },
    { command: 'italic', icon: '𝐼', title: 'Italic' },
    { command: 'underline', icon: '𝐔', title: 'Underline' },
    { command: 'strikeThrough', icon: '𝐒', title: 'Strikethrough' },
    { command: 'removeFormat', icon: '🚫', title: 'Remove Format' },
    { command: 'justifyLeft', icon: '◀', title: 'Align Left' },
    { command: 'justifyCenter', icon: '◆', title: 'Align Center' },
    { command: 'justifyRight', icon: '▶', title: 'Align Right' },
    { command: 'insertUnorderedList', icon: '•', title: 'Bullet List' },
    { command: 'insertOrderedList', icon: '№', title: 'Numbered List' },
    { command: 'outdent', icon: '←', title: 'Decrease Indent' },
    { command: 'indent', icon: '→', title: 'Increase Indent' },
  ];

  const headingOptions = [
    { value: 'div', label: 'Normal Text' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
    { value: 'h4', label: 'Heading 4' },
    { value: 'h5', label: 'Heading 5' },
    { value: 'h6', label: 'Heading 6' },
  ];

  const fontSizes = ['8', '10', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];
  const fontFamilies = [
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Verdana, sans-serif',
    'Impact, sans-serif',
    'Comic Sans MS, cursive'
  ];

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleFormat = useCallback((command: string) => {
    executeCommand(command);
  }, [executeCommand]);

  const handleHeadingChange = useCallback((tag: string) => {
    executeCommand('formatBlock', tag);
  }, [executeCommand]);

  const handleFontSizeChange = useCallback((size: string) => {
    executeCommand('fontSize', '7');
    // Custom font size implementation
    const selection = window.getSelection();
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = `${size}px`;
      try {
        range.surroundContents(span);
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      } catch (e) {
        console.warn('Could not apply font size to selection');
      }
    }
  }, [onChange]);

  const handleFontFamilyChange = useCallback((family: string) => {
    executeCommand('fontName', family);
  }, [executeCommand]);

  const handleColorChange = useCallback((color: string) => {
    executeCommand('foreColor', color);
  }, [executeCommand]);

  const handleBackgroundColorChange = useCallback((color: string) => {
    executeCommand('hiliteColor', color);
  }, [executeCommand]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        await showAlert(
          'File Too Large',
          'Image size should be less than 5MB. Please choose a smaller file.'
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target?.result as string;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.alt = file.name;
        
        const selection = window.getSelection();
        if (selection?.rangeCount) {
          const range = selection.getRangeAt(0);
          range.insertNode(img);
          range.collapse(false);
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset file input
    event.target.value = '';
  }, [onChange, showAlert]);

  const insertImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const insertLink = useCallback(() => {
    const selection = window.getSelection();
    if (selection?.toString()) {
      setLinkText(selection.toString());
    }
    setIsLinkDialogOpen(true);
  }, []);

  const handleInsertLink = useCallback(() => {
    if (linkUrl) {
      if (linkText) {
        const a = document.createElement('a');
        a.href = linkUrl;
        a.textContent = linkText;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        
        const selection = window.getSelection();
        if (selection?.rangeCount) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(a);
          range.collapse(false);
        }
      } else {
        executeCommand('createLink', linkUrl);
      }
      
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
    setIsLinkDialogOpen(false);
    setLinkUrl('');
    setLinkText('');
  }, [linkUrl, linkText, executeCommand, onChange]);

  const insertTable = useCallback(async () => {
    const rows = await showPrompt(
      'Number of Rows',
      'Enter the number of rows for the table:',
      '3'
    );
    
    if (!rows) return;
    
    const cols = await showPrompt(
      'Number of Columns',
      'Enter the number of columns for the table:',
      '3'
    );
    
    if (rows && cols) {
      const table = document.createElement('table');
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      table.style.border = '1px solid #ddd';
      
      for (let i = 0; i < parseInt(rows); i++) {
        const row = table.insertRow();
        for (let j = 0; j < parseInt(cols); j++) {
          const cell = row.insertCell();
          cell.style.border = '1px solid #ddd';
          cell.style.padding = '8px';
          cell.innerHTML = '&nbsp;';
        }
      }
      
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        range.insertNode(table);
        range.collapse(false);
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }
    }
  }, [onChange, showPrompt]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Update editor content when value prop changes
  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50">
        <div className="flex flex-wrap gap-1 items-center">
          {/* Heading Selector */}
          <select 
            onChange={(e) => handleHeadingChange(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {headingOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Font Family */}
          <select 
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm max-w-32"
          >
            <option value="">Font Family</option>
            {fontFamilies.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font.split(',')[0]}
              </option>
            ))}
          </select>

          {/* Font Size */}
          <select 
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="">Size</option>
            {fontSizes.map(size => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Format Buttons */}
          {formatButtons.map(button => (
            <button
              key={button.command}
              type="button"
              onClick={() => handleFormat(button.command)}
              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm font-bold"
              title={button.title}
            >
              {button.icon}
            </button>
          ))}

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Color Controls */}
          <div className="flex items-center gap-1">
            <label className="flex items-center gap-1 cursor-pointer">
              <span className="text-xs">Color:</span>
              <input
                type="color"
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                title="Text Color"
              />
            </label>
            
            <label className="flex items-center gap-1 cursor-pointer">
              <span className="text-xs">BG:</span>
              <input
                type="color"
                onChange={(e) => handleBackgroundColorChange(e.target.value)}
                className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                title="Background Color"
              />
            </label>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Insert Controls */}
          <button
            type="button"
            onClick={insertLink}
            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
            title="Insert Link"
          >
            🔗
          </button>
          
          <button
            type="button"
            onClick={insertImage}
            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
            title="Insert Image"
          >
            🖼️
          </button>
          
          <button
            type="button"
            onClick={insertTable}
            className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
            title="Insert Table"
          >
            📊
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="min-h-64 p-4 focus:outline-none"
        style={{ minHeight: '200px' }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Hidden file input for images */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Link Dialog */}
      {isLinkDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLinkDialogOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;