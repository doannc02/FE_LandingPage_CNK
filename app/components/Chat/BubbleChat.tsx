"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, MessageCircle, Square } from "lucide-react";
import { isAxiosError } from "axios";
import type { Message, ChatRequest } from "./types";
import { chatApi } from "@/app/lib/api/chat";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — Đồng bộ màu thương hiệu CLB
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_RED = "#dc2626";
const HEADER_GRADIENT = "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)";

const STARTERS = [
  { label: "💰 Học phí?", query: "Học phí các khóa học là bao nhiêu?" },
  { label: "📅 Lịch học?", query: "Lịch học và giờ tập như thế nào?" },
  { label: "📝 Đăng ký?", query: "Tôi muốn đăng ký tham gia, cần làm gì?" },
  { label: "📍 Địa chỉ?", query: "Địa chỉ câu lạc bộ ở đâu?" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseChunk(raw: string): string {
  let result = "";
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (
      !t ||
      t.startsWith(":") ||
      t.startsWith("event:") ||
      t.startsWith("id:") ||
      t.startsWith("retry:")
    )
      continue;

    let jsonStr = t;
    if (t.startsWith("data: ")) {
      const d = t.slice(6).trim();
      if (d === "[DONE]") continue;
      jsonStr = d;
    }

    try {
      const j = JSON.parse(jsonStr);
      result +=
        j.content ??
        j.text ??
        j.delta?.content ??
        j.choices?.[0]?.delta?.content ??
        j.choices?.[0]?.text ??
        "";
    } catch {
      /* non-JSON chunk */
    }
  }
  return result;
}

interface GroupedMessage extends Message {
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

function groupMessages(messages: Message[]): GroupedMessage[] {
  return messages.map((msg, i) => ({
    ...msg,
    isFirstInGroup: i === 0 || messages[i - 1].role !== msg.role,
    isLastInGroup:
      i === messages.length - 1 || messages[i + 1].role !== msg.role,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// StreamCursor
// ─────────────────────────────────────────────────────────────────────────────

const StreamCursor = memo(function StreamCursor() {
  return (
    <motion.span
      aria-hidden
      className="inline-block w-0.5 h-3.5 bg-orange-500 ml-0.5 align-middle rounded-sm"
      animate={{ opacity: [1, 0] }}
      transition={{
        duration: 0.55,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      }}
    />
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// BotAvatar
// ─────────────────────────────────────────────────────────────────────────────

const BotAvatar = memo(function BotAvatar({
  visible = true,
}: {
  visible?: boolean;
}) {
  return (
    <div
      className="flex-none w-8 h-8 rounded-full flex items-center justify-center self-end overflow-hidden border border-white/20 shadow-sm"
      style={{
        background: visible ? HEADER_GRADIENT : "transparent",
        visibility: visible ? "visible" : "hidden",
      }}
      aria-hidden
    >
      {visible && <Bot size={16} strokeWidth={2} className="text-white" />}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// TypingIndicator
// ─────────────────────────────────────────────────────────────────────────────

const TypingIndicator = memo(function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mt-4 pr-10">
      <BotAvatar />
      <div className="bg-white rounded-[18px] rounded-bl-[5px] shadow-sm px-4 py-3 border border-gray-100">
        <span
          aria-label="Trợ lý đang soạn tin"
          className="inline-flex gap-[5px] items-center"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-gray-400 inline-block"
              animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.16,
                ease: "easeInOut",
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// MessageBubble
// ─────────────────────────────────────────────────────────────────────────────

const MessageBubble = memo(
  function MessageBubble({ message }: { message: GroupedMessage }) {
    const isUser = message.role === "user";
    const { isFirstInGroup, isLastInGroup } = message;

    return (
      <motion.div
        className={`flex items-end gap-2 ${isUser ? "flex-row-reverse pl-10" : "pr-10"} ${
          isFirstInGroup ? "mt-4" : "mt-1"
        }`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {/* Avatar bot — luôn chiếm slot để căn chỉnh đều */}
        {!isUser && <BotAvatar visible={isLastInGroup} />}

        <div
          className={`flex flex-col gap-1 min-w-0 max-w-full ${
            isUser ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`text-[13.5px] leading-relaxed break-words [overflow-wrap:anywhere] shadow-sm ${
              isUser
                ? "rounded-[20px] rounded-br-[4px] text-white"
                : "rounded-[20px] rounded-bl-[4px] bg-white text-gray-800 border border-gray-100"
            }`}
            style={{
              padding: "10px 14px", // Cách viết chuẩn cho padding (trên-dưới 10px, trái-phải 14px)
              backgroundColor: isUser ? BRAND_RED : undefined,
            }}
          >
            {message.content || (
              <span className="italic text-xs opacity-60">Đang khởi tạo…</span>
            )}
            {message.isStreaming && message.content && <StreamCursor />}
          </div>

          {isLastInGroup && (
            <span className="text-[10px] text-gray-400 select-none px-1 mt-0.5">
              {formatTime(message.timestamp)}
            </span>
          )}
        </div>
      </motion.div>
    );
  },
  (prev, next) =>
    prev.message.id === next.message.id &&
    prev.message.content === next.message.content &&
    prev.message.isStreaming === next.message.isStreaming &&
    prev.message.isLastInGroup === next.message.isLastInGroup,
);

// ─────────────────────────────────────────────────────────────────────────────
// MessageList
// ─────────────────────────────────────────────────────────────────────────────

function MessageList({
  messages,
  isStreaming,
}: {
  messages: Message[];
  isStreaming: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const grouped = useMemo(() => groupMessages(messages), [messages]);

  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 150) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  /* ── Empty state ── */
  if (messages.length === 0 && !isStreaming) {
    return (
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto bg-[#F9FAFB] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <div className="h-full flex flex-col items-center justify-center text-center px-6 py-8 space-y-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
              style={{ background: HEADER_GRADIENT }}
            >
              <Bot size={30} strokeWidth={1.75} className="text-white" />
            </div>
            <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
          </div>

          <div className="space-y-1.5">
            <p className="font-bold text-gray-800 text-sm leading-snug">
              Trợ lý CLB Côn Nhị Khúc
            </p>
            <p className="text-[12.5px] text-gray-500 leading-relaxed max-w-[210px]">
              Hỏi tôi bất cứ điều gì về lịch tập và võ đạo.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
            <span className="w-2 h-2 rounded-full bg-green-400 flex-none" />
            <span className="text-[11px] text-gray-600 font-medium">
              Thường phản hồi trong vài giây
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Message list ── */
  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto bg-[#F9FAFB] px-4 py-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent"
      role="log"
      aria-live="polite"
      aria-label="Lịch sử trò chuyện"
    >
      {/* Date divider */}
      <div className="flex items-center gap-2 py-2">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[10.5px] text-gray-400 font-medium select-none">
          Hôm nay
        </span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <AnimatePresence initial={false}>
        {grouped.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </AnimatePresence>

      {/* Typing dots — chỉ khi stream mới bắt đầu chưa có content */}
      {isStreaming && messages[messages.length - 1]?.content === "" && (
        <motion.div
          key="typing"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TypingIndicator />
        </motion.div>
      )}

      <div ref={bottomRef} className="h-2" aria-hidden />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StarterQuestions
// ─────────────────────────────────────────────────────────────────────────────

const StarterQuestions = memo(function StarterQuestions({
  onSelect,
  visible,
}: {
  onSelect: (query: string) => void;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="flex flex-wrap gap-2 !mb-3">
      {STARTERS.map(({ label, query }) => (
        <button
          key={query}
          onClick={() => onSelect(query)}
          className="rounded-full border border-red-200 bg-white text-red-800 text-[12px] font-medium !px-3 !py-1.5 shadow-sm hover:bg-red-50 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap select-none"
        >
          {label}
        </button>
      ))}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// MessageInput
// ─────────────────────────────────────────────────────────────────────────────

const MessageInput = memo(function MessageInput({
  onSend,
  onStop,
  isStreaming,
}: {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  // Auto-resize (max ~3 dòng = 78px)
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 78)}px`;
  }, [value]);

  useEffect(() => {
    if (!isStreaming) textareaRef.current?.focus();
  }, [isStreaming]);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, isStreaming, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
    },
    [submit],
  );

  return (
    <>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isStreaming}
        placeholder={isStreaming ? "Đang nhận phản hồi…" : "Nhập tin nhắn…"}
        aria-label="Nhập tin nhắn"
        rows={1}
        className="flex-1 min-w-0 resize-none bg-transparent text-[13.5px] text-gray-800 placeholder-gray-400 outline-none border-none leading-[1.5] min-h-[22px] max-h-[78px] self-center disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ scrollbarWidth: "none" }}
      />

      <AnimatePresence mode="wait" initial={false}>
        {isStreaming ? (
          <motion.button
            key="stop"
            onClick={onStop}
            aria-label="Dừng phản hồi"
            className="flex-none self-center w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center hover:bg-gray-400 transition-colors cursor-pointer"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <Square size={11} strokeWidth={0} className="fill-current" />
          </motion.button>
        ) : (
          <motion.button
            key="send"
            onClick={submit}
            disabled={!hasText}
            aria-label="Gửi tin nhắn"
            className="flex-none self-center w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
            style={{ backgroundColor: hasText ? BRAND_RED : "#D1D5DB" }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.12 }}
            whileTap={{ scale: 0.88 }}
          >
            <Send size={14} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ChatHeader
// ─────────────────────────────────────────────────────────────────────────────

const ChatHeader = memo(function ChatHeader({
  isStreaming,
  onClose,
}: {
  isStreaming: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className="flex-shrink-0 flex items-center gap-3 !px-4 !py-3.5 rounded-t-2xl"
      style={{ background: HEADER_GRADIENT }}
    >
      <div className="relative flex-none">
        <div className="w-11 h-11 rounded-full bg-white/15 border-2 border-white/40 flex items-center justify-center">
          <Bot size={20} strokeWidth={2} className="text-white" />
        </div>
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
      </div>

      <div className="flex-1 min-w-0">
        <span className="block font-bold text-white text-[14.5px] leading-tight truncate">
          Trợ lý AI · CNK Hà Đông
        </span>
        <AnimatePresence mode="wait" initial={false}>
          {isStreaming ? (
            <motion.span
              key="typing"
              className="block text-[11.5px] text-white/75 mt-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              Đang soạn tin nhắn…
            </motion.span>
          ) : (
            <motion.span
              key="online"
              className="block text-[11.5px] text-white/75 mt-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              Thường phản hồi ngay
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onClose}
        aria-label="Đóng cửa sổ chat"
        className="flex-none w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-150 cursor-pointer"
      >
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ChatWindow
// ─────────────────────────────────────────────────────────────────────────────

const ChatWindow = memo(function ChatWindow({
  messages,
  isStreaming,
  onSend,
  onStop,
  onClose,
}: {
  messages: Message[];
  isStreaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Cửa sổ hỗ trợ AI"
      className="fixed bottom-[90px] right-6 z-[9998] w-[360px] h-[560px] flex flex-col rounded-2xl overflow-clip shadow-2xl border border-gray-100 bg-white [&_p]:m-0 [&_p]:text-inherit [&_a]:text-inherit [&_a]:no-underline"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <ChatHeader isStreaming={isStreaming} onClose={onClose} />
      <MessageList messages={messages} isStreaming={isStreaming} />

      {/* Footer */}
      <div className="flex-shrink-0 px-4 pt-3 pb-4 bg-white border-t border-gray-100">
        <StarterQuestions
          onSelect={onSend}
          visible={messages.length === 0 && !isStreaming}
        />

        {/* Input pill */}
        <div className="relative flex items-center gap-2.5 bg-gray-100 rounded-2xl min-h-[46px] focus-within:ring-1 focus-within:ring-red-200 transition-all duration-150 !mt-4 !mx-[10px] !p-[16px]">
          <MessageInput
            onSend={onSend}
            onStop={onStop}
            isStreaming={isStreaming}
          />
        </div>

        <p className="text-[10px] text-gray-400 text-center !mt-2.5 select-none leading-none">
          Phản hồi có thể mất vài giây để xử lý
        </p>
      </div>
    </motion.div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// GreetingTooltip
// ─────────────────────────────────────────────────────────────────────────────

const GreetingTooltip = memo(function GreetingTooltip({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-[72px] right-0 z-10 w-[240px]"
          initial={{ opacity: 0, y: 10, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.92 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative bg-white rounded-2xl rounded-br-[6px] shadow-[0_4px_24px_rgba(0,0,0,0.14)] border border-gray-100 !px-4 !py-3.5">
            <button
              onClick={onDismiss}
              aria-label="Đóng thông báo"
              className="absolute top-2.5 right-2.5 text-gray-300 hover:text-gray-500 cursor-pointer transition-colors"
            >
              <X size={13} strokeWidth={2.5} />
            </button>
            <p className="font-semibold text-[13px] text-gray-800 pr-5 leading-snug">
              Xin chào! 👋
            </p>
            <p className="text-[12px] text-gray-500 mt-1.5 leading-[1.55]">
              Tôi có thể giúp bạn tìm hiểu về khóa học, lịch tập và đăng ký tại
              CLB CNK.
            </p>
            <span
              aria-hidden
              className="absolute -bottom-[7px] right-[18px] w-3.5 h-3.5 bg-white border-r border-b border-gray-100 rotate-45"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// TriggerButton
// ─────────────────────────────────────────────────────────────────────────────

const TriggerButton = memo(function TriggerButton({
  isOpen,
  hasUnread,
  onClick,
}: {
  isOpen: boolean;
  hasUnread: boolean;
  onClick: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      return;
    }
    const show = setTimeout(() => setShowTooltip(true), 2000);
    const hide = setTimeout(() => setShowTooltip(false), 10000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [isOpen]);

  const handleClick = useCallback(() => {
    onClick();
    setShowTooltip(false);
  }, [onClick]);
  const handleDismiss = useCallback(() => setShowTooltip(false), []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <GreetingTooltip
        visible={showTooltip && !isOpen}
        onDismiss={handleDismiss}
      />

      {!isOpen && hasUnread && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ backgroundColor: BRAND_RED }}
        />
      )}

      <motion.button
        onClick={handleClick}
        aria-label={isOpen ? "Đóng hỗ trợ AI" : "Mở hỗ trợ AI"}
        aria-expanded={isOpen}
        className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer border-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400"
        style={{ background: HEADER_GRADIENT }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 480, damping: 26 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="x"
              initial={{ rotate: -80, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 80, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <X size={26} strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 80, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -80, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <MessageCircle size={26} strokeWidth={2} className="fill-white" />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.span
              aria-label="1 tin nhắn mới"
              className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 border-2 border-white text-[10px] text-white font-bold flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              1
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ROOT: BubbleChat
// ─────────────────────────────────────────────────────────────────────────────

export default function BubbleChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>([]);

  messagesRef.current = messages;

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    setHasUnread(false);
  }, []);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleSend = useCallback(
  async (content: string) => {
    if (isStreaming) return;

    const userMsg: Message = {
      id: genId(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    const assistantMsg: Message = {
      id: genId(),
      role: "assistant",
      content: "",
      isStreaming: true,
      timestamp: new Date(),
    };

    const historySnapshot = messagesRef.current.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history: historySnapshot }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Tách từng SSE event (kết thúc bằng \n\n)
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? ""; // phần chưa hoàn chỉnh giữ lại

        for (const part of parts) {
          const text = parseChunk(part);
          if (text) {
            setMessages((prev) =>
              prev.map((m, i) =>
                i === prev.length - 1
                  ? { ...m, content: m.content + text }
                  : m,
              ),
            );
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("[BubbleChat] Stream error:", err);
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? {
                ...m,
                content:
                  "Xin lỗi, đã xảy ra lỗi kết nối. Vui lòng thử lại sau hoặc gọi hotline để được hỗ trợ.",
              }
            : m,
        ),
      );
    } finally {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, isStreaming: false } : m,
        ),
      );
      setIsStreaming(false);
      abortRef.current = null;
    }
  },
  [isStreaming],
);


  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ChatWindow
            messages={messages}
            isStreaming={isStreaming}
            onSend={handleSend}
            onStop={handleStop}
            onClose={handleToggle}
          />
        )}
      </AnimatePresence>

      <TriggerButton
        isOpen={isOpen}
        hasUnread={hasUnread}
        onClick={handleToggle}
      />
    </>
  );
}
