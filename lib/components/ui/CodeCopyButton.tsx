'use client';

import { Check, CopyIcon } from 'lucide-react';
import React, { FC, useState } from 'react';
import Tooltip from './Tooltip';
import Button from './Button';

export const CodeCopyButton: FC<{ textToCopy: string; className?: string }> = ({
  textToCopy,
  className,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Tooltip
      content={isCopied ? 'Copied!' : 'Copy'}
      position="left"
      className="text-xs">
      <Button
        variant='seamless'
        onClick={handleCopy}
        className={`text-xs !w-fit ${className}`}
        aria-label={isCopied ? 'Copied!' : 'Copy code'}>
        {isCopied ? <Check size={14} className="" /> : <CopyIcon size={14} />}
      </Button>
    </Tooltip>
  );
};