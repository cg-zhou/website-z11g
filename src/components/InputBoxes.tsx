import React, { useRef } from 'react';

interface Props {
    text: string;
    onInputChange: (text: string) => void;
}

const InputBoxes = ({ text, onInputChange }: Props) => {
    const refs = useRef<HTMLInputElement[]>([]);

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedText = event.clipboardData.getData('text').trim().toUpperCase();
        const newValues = getValues();

        for (let i = 0; i < pastedText.length && i < 6; i++) {
            newValues[i] = pastedText[i];
        }

        triggerChangeEvent(newValues);

        event.stopPropagation();
        event.preventDefault();
    }

    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const values = getValues();

        let newValue = '';
        if (event.target.value.length > 0) {
            if (values[index] == event.target.value[0]) {
                newValue = event.target.value[event.target.value.length - 1].toUpperCase();
            } else {
                newValue = event.target.value[0].toUpperCase();
            }
        }

        values[index] = newValue;

        if (newValue.length === 1 && index < 5) {
            refs.current[index + 1].focus();
        } else if (newValue.length === 0 && index > 0) {
            refs.current[index - 1].focus();
        }

        triggerChangeEvent(values);
    };

    const triggerChangeEvent = (valueArray: string[]) => {
        const newText = valueArray.join('');
        if (text != newText) {
            onInputChange(newText);
        }
    };

    const getValues = (): string[] => {
        let values = ['', '', '', '', '', ''];
        for (let i = 0; i < values.length; i++) {
            if (i < text.length) {
                values[i] = text[i];
            }
        }
        return values;
    };

    return (
        <div className='flex flex-row gap-[0.5rem]'>
            {getValues().map((value, index) => (
                <input
                    className="text-2xl w-[2rem] h-[2rem] pl-0 text-center font-bold input-box-item"
                    key={index}
                    type="text"
                    maxLength={6}
                    value={value}
                    onPaste={(event) => handlePaste(event)}
                    onChange={(event) => handleChange(index, event)}
                    ref={(element) => refs.current[index] = element!}
                />
            ))}
        </div>
    );

};

export default InputBoxes;
