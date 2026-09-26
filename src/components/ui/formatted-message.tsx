'use client';

import React from 'react';

interface FormattedMessageProps {
  content: string;
}

export function FormattedMessage({ content }: FormattedMessageProps) {
  // Normalize markdown text into clean formatted elements
  const lines = content.split('\n');

  const renderFormattedLine = (line: string, key: number) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={key} className="h-1.5" />;
    }

    // Header formats (### Header)
    if (trimmed.startsWith('### ')) {
      return (
        <h4 key={key} className="font-bold text-emerald-600 dark:text-emerald-300 text-xs mt-1.5 mb-0.5">
          {trimmed.replace(/^###\s+/, '')}
        </h4>
      );
    }
    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      return (
        <h3 key={key} className="font-bold text-foreground text-xs mt-2 mb-0.5">
          {trimmed.replace(/^#+\s+/, '')}
        </h3>
      );
    }

    // Bullet points (-, *, •)
    const isBullet = /^[•\-*]\s+/.test(trimmed);
    const textContent = isBullet ? trimmed.replace(/^[•\-*]\s+/, '') : trimmed;

    // Parse **bold** parts
    const parts = textContent.split(/(\*\*.*?\*\*)/g);
    const parsedNodes = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-semibold text-emerald-600 dark:text-emerald-300">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={key} className="flex items-start gap-1.5 pl-1 my-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
          <span className="flex-1 leading-relaxed text-foreground">{parsedNodes}</span>
        </div>
      );
    }

    return (
      <p key={key} className="leading-relaxed text-foreground">
        {parsedNodes}
      </p>
    );
  };

  return <div className="space-y-1 text-xs">{lines.map(renderFormattedLine)}</div>;
}
