export default function TypingPanel({ visibleLines, typedText, lineStartIndex, fullText }) {
  return (
    <div className="prompt two-line-display" aria-live="polite">
      {visibleLines.map((line, lineIndex) => {
        // Calculate the starting character index for this line in the full text
        let lineStartCharIndex = lineStartIndex;
        for (let i = 0; i < lineIndex; i++) {
          lineStartCharIndex += visibleLines[i].length + 1; // +1 for space between lines
        }
        
        return (
          <div key={lineIndex} className="typing-line">
            {line.split('').map((char, charIndex) => {
              const globalCharIndex = lineStartCharIndex + charIndex;
              const isTyped = globalCharIndex < typedText.length;
              const isCurrent = globalCharIndex === typedText.length;
              const typedChar = typedText[globalCharIndex];
              const isCorrect = isTyped && typedChar === char;
              
              let className = "char";
              if (isTyped) {
                className += isCorrect ? " ok done" : " bad done";
              } else if (isCurrent) {
                className += " current";
              }
              
              return (
                <span key={`${lineIndex}-${charIndex}`} className={className}>
                  {char}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
