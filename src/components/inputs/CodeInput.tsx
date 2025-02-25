import { useRef, useEffect } from 'react';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  fields: number;
}

export const CodeInput = ({ value, onChange, fields }: CodeInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, fields);
  }, [fields]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '');
    if (newValue.length <= 1) {
      const newCode = value.split('');
      newCode[index] = newValue;
      onChange(newCode.join(''));
      
      if (newValue.length === 1 && index < fields - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < fields - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, fields);
    onChange(pastedData);
    
    if (pastedData.length === fields) {
      inputRefs.current[fields - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-row gap-2">
      {Array(fields).fill(0).map((_, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-10 h-10 text-center border border-gray-300 rounded-lg text-2xl font-medium flex items-center justify-center"
          style={{
            padding: 0,
            textAlign: 'center'
          }}
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      ))}
    </div>
  );
}; 