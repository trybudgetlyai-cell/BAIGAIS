import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface PinSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pin: string) => void;
}

const PinSecurityModal: React.FC<PinSecurityModalProps> = ({ isOpen, onClose, onSave }) => {
  const [stage, setStage] = useState<'enter' | 'confirm'>('enter');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [message, setMessage] = useState('Create a 4-digit PIN for an extra layer of security.');
  const [isShaking, setIsShaking] = useState(false);

  const resetState = () => {
    setStage('enter');
    setPin('');
    setConfirmPin('');
    setMessage('Create a 4-digit PIN for an extra layer of security.');
  };

  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      if (stage === 'enter') {
        setPin(p => p.slice(0, -1));
      } else {
        setConfirmPin(p => p.slice(0, -1));
      }
      return;
    }

    if (stage === 'enter') {
      if (pin.length < 4) {
        const newPin = pin + key;
        setPin(newPin);
        if (newPin.length === 4) {
          setTimeout(() => {
            setStage('confirm');
            setMessage('Confirm your new PIN.');
          }, 200);
        }
      }
    } else {
      if (confirmPin.length < 4) {
        const newConfirmPin = confirmPin + key;
        setConfirmPin(newConfirmPin);
        if (newConfirmPin.length === 4) {
          // Final check
          if (pin === newConfirmPin) {
            setMessage('PIN set successfully!');
            onSave(pin);
          } else {
            setMessage('PINs do not match. Please try again.');
            setIsShaking(true);
            setTimeout(() => {
              setIsShaking(false);
              setPin('');
              setConfirmPin('');
              setStage('enter');
            }, 800);
          }
        }
      }
    }
  };

  const currentPinLength = stage === 'enter' ? pin.length : confirmPin.length;

  const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <Card className="w-full max-w-sm text-center">
        <h3 className="text-lg font-bold text-text-primary mb-2">Set Security PIN</h3>
        <p className={`text-sm text-text-secondary mb-6 h-5 transition-colors ${message.includes('do not match') ? 'text-accent-secondary' : ''}`}>
          {message}
        </p>
        
        <div className={`flex justify-center gap-4 mb-8 ${isShaking ? 'animate-shake' : ''}`} style={{ animationIterationCount: 1, animationDuration: '0.5s' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full transition-all ${i < currentPinLength ? 'bg-accent-primary' : 'bg-border'}`}></div>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {keypadKeys.map((key, i) => (
            <button
              key={i}
              onClick={() => key && handleKeyPress(key)}
              disabled={!key}
              className={`h-16 rounded-full text-2xl font-sans transition-colors ${key ? 'bg-bg-primary text-text-primary hover:bg-bg-secondary' : 'bg-transparent'}`}
            >
              {key === 'backspace' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12" />
                </svg>
              ) : key}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={onClose} variant="secondary" className="w-full">Cancel</Button>
        </div>
      </Card>
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake {
          animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default PinSecurityModal;