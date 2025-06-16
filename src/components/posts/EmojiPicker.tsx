
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Common emojis
  const emojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", 
    "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", 
    "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", 
    "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", 
    "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", 
    "👍", "👎", "❤️", "🔥", "🎉", "👏", "🙏", "💯"
  ];

  return (
    <div 
      ref={pickerRef}
      className="absolute z-50 bg-background border rounded-md shadow-lg p-2 mt-1"
      style={{ width: "240px" }}
    >
      <div className="grid grid-cols-8 gap-1">
        {emojis.map((emoji, index) => (
          <Button
            key={index}
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
          >
            <span className="text-lg">{emoji}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
