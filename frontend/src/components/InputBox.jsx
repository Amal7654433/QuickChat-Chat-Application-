import { useRef, useState, useEffect, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { userAuthStore } from "../store/userAuth";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const TYPING_DEBOUNCE_MS = 1500;

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef    = useRef(null);
  const typingTimeout   = useRef(null);
  const isTypingRef     = useRef(false);

  const { sendMessage, selectedUser } = useChatStore();

  const emitTyping = useCallback(() => {
    const socket = userAuthStore.getState().socket;
    if (!socket || !selectedUser) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", { toUserId: selectedUser._id });
    }

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      isTypingRef.current = false;
      socket.emit("stopTyping", { toUserId: selectedUser._id });
    }, TYPING_DEBOUNCE_MS);
  }, [selectedUser]);

  const stopTypingNow = useCallback(() => {
    clearTimeout(typingTimeout.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      const socket = userAuthStore.getState().socket;
      if (socket && selectedUser) socket.emit("stopTyping", { toUserId: selectedUser._id });
    }
  }, [selectedUser]);

  // Stop typing when conversation changes or unmounts
  useEffect(() => {
    return () => stopTypingNow();
  }, [stopTypingNow]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (e.target.value.trim()) emitTyping();
    else stopTypingNow();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    stopTypingNow();
    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Failed to send:", err);
    }
  };

  const canSend = text.trim() || imagePreview;

  return (
    <div
      className="glass"
      style={{
        padding: "12px 16px",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "none",
        borderLeft: "none",
        borderRight: "none",
        flexShrink: 0,
      }}
    >
      {/* Image preview */}
      {imagePreview && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "72px", height: "72px", objectFit: "cover",
                borderRadius: "12px", border: "1px solid rgba(255,255,255,0.12)",
              }}
            />
            <button
              onClick={removeImage}
              type="button"
              style={{
                position: "absolute", top: "-6px", right: "-6px",
                width: "20px", height: "20px", borderRadius: "50%",
                background: "rgba(239,68,68,0.9)", border: "1px solid rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={11} color="#fff" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Attach image */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-glass"
          style={{
            width: "40px", height: "40px", padding: 0, flexShrink: 0,
            borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
            color: imagePreview ? "#4ade80" : "var(--text-muted)",
            borderColor: imagePreview ? "rgba(74,222,128,0.3)" : undefined,
          }}
        >
          <Image size={17} />
        </button>

        <input
          type="file" accept="image/*" className="hidden"
          ref={fileInputRef} onChange={handleImageChange}
        />

        {/* Text input */}
        <input
          type="text"
          className="input-glass"
          placeholder="Type a message..."
          value={text}
          onChange={handleTextChange}
          style={{ flex: 1, fontSize: "0.875rem", height: "40px" }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSend(e); }}
        />

        {/* Send */}
        <button
          type="submit"
          disabled={!canSend}
          className="btn-glow"
          style={{
            width: "40px", height: "40px", padding: 0, flexShrink: 0,
            borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
