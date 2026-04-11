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
import { Bot, X, Send, MessageCircle, UserCheck, Clock } from "lucide-react";
import { isAxiosError } from "axios";
import type { Message, ChatHistoryItem, ChatResponseType } from "./types";
import { chatApi, type ChatHistoryResponse } from "@/app/lib/api/chat";
import { useChatRoom } from "@/app/hooks/useChatRoom";
import { useUserNotification } from "@/app/hooks/useUserNotification";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_RED = "#dc2626";
const HEADER_GRADIENT = "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)";

const STARTERS = [
  { label: "💰 Học phí?", query: "Học phí các khóa học là bao nhiêu?" },
  { label: "📅 Lịch học?", query: "Lịch học và giờ tập như thế nào?" },
  { label: "📝 Đăng ký?", query: "Tôi muốn đăng ký tham gia, cần làm gì?" },
  { label: "📍 Địa chỉ?", query: "Địa chỉ võ đường ở đâu?" },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return `sess_${genId()}`;
  const key = "cnk_chat_session_id";
  const stored = localStorage.getItem(key);
  if (stored) return stored;
  const id = `sess_${genId()}`;
  localStorage.setItem(key, id);
  return id;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
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
    const isSystem = message.role === "system";
    const { isFirstInGroup, isLastInGroup } = message;

    if (isSystem) {
      return (
        <motion.div
          className="flex justify-center mt-4"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[12px] rounded-xl px-3 py-2 max-w-[85%] text-center leading-relaxed">
            {message.content}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className={`flex items-end gap-2 ${isUser ? "flex-row-reverse pl-10" : "pr-10"} ${
          isFirstInGroup ? "mt-4" : "mt-1"
        }`}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {!isUser && <BotAvatar visible={isLastInGroup} />}

        <div
          className={`flex flex-col gap-1 min-w-0 max-w-full ${
            isUser ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`text-[13.5px] leading-relaxed break-words [overflow-wrap:anywhere] !whitespace-pre-wrap shadow-sm ${
              isUser
                ? "rounded-[20px] rounded-br-[4px] text-white"
                : "rounded-[20px] rounded-bl-[4px] bg-white text-gray-800 border border-gray-100"
            }`}
            style={{
              padding: "10px 14px",
              backgroundColor: isUser ? BRAND_RED : undefined,
            }}
          >
            {message.content || (
              <span className="italic text-xs opacity-60">Đang khởi tạo…</span>
            )}
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
    prev.message.isLastInGroup === next.message.isLastInGroup,
);

// ─────────────────────────────────────────────────────────────────────────────
// StatusBanner
// ─────────────────────────────────────────────────────────────────────────────

const StatusBanner = memo(function StatusBanner({
  chatMode,
}: {
  chatMode: ChatResponseType | null;
}) {
  if (!chatMode || chatMode === "AI") return null;

  const isHuman = chatMode === "HumanOnline";

  return (
    <div
      className={`flex items-center gap-2 mx-4 mb-2 px-3 py-2 rounded-xl text-[12px] ${
        isHuman
          ? "bg-green-50 border border-green-200 text-green-700"
          : "bg-blue-50 border border-blue-200 text-blue-700"
      }`}
    >
      {isHuman ? (
        <UserCheck size={13} className="flex-none" />
      ) : (
        <Clock size={13} className="flex-none" />
      )}
      <span>
        {isHuman
          ? "Đã kết nối với admin — nhắn tin bên dưới"
          : "Đã ghi nhận! Admin sẽ phản hồi sớm nhất có thể."}
      </span>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// MessageList
// ─────────────────────────────────────────────────────────────────────────────

function MessageList({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const grouped = useMemo(() => groupMessages(messages), [messages]);

  // Always scroll to bottom when messages change or loading state changes.
  // Using "instant" on send (loading=true) and "smooth" on receive.
  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: isLoading ? "instant" : "smooth",
    });
  }, [messages, isLoading]);

  const scrollbarClasses =
    // Override the 12px scrollbar from globals.css with !important
    "[&::-webkit-scrollbar]:![width:4px] [&::-webkit-scrollbar-thumb]:!rounded-full [&::-webkit-scrollbar-thumb]:!bg-gray-300 [&::-webkit-scrollbar-track]:!bg-transparent";

  if (messages.length === 0 && !isLoading) {
    return (
      <div
        className={`flex-1 overflow-y-auto bg-[#F9FAFB] ${scrollbarClasses}`}
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
              Trợ lý Võ đường Côn Nhị Khúc
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

  return (
    <div
      className={`flex-1 overflow-y-auto bg-[#F9FAFB] px-4 py-4 ${scrollbarClasses}`}
      role="log"
      aria-live="polite"
      aria-label="Lịch sử trò chuyện"
    >
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

      {isLoading && (
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
    <div className="flex flex-wrap gap-2 !pt-2 !px-1 !mb-3">
      {STARTERS.map(({ label, query }) => (
        <button
          key={query}
          onClick={() => onSelect(query)}
          className="rounded-full border border-red-200 bg-white text-red-800 text-[12px] font-medium !px-1.5 !py-1 shadow-sm hover:bg-red-50 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap select-none"
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
  isLoading,
}: {
  onSend: (text: string) => void;
  isLoading: boolean;
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 78)}px`;
  }, [value]);

  useEffect(() => {
    if (!isLoading) textareaRef.current?.focus();
  }, [isLoading]);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [value, isLoading, onSend]);

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
        disabled={isLoading}
        placeholder={isLoading ? "Đang xử lý…" : "Nhập tin nhắn…"}
        aria-label="Nhập tin nhắn"
        rows={1}
        className="flex-1 !min-w-0 resize-none bg-transparent !text-[13.5px] text-gray-800 placeholder-gray-400 outline-none border-none !leading-[1.5] !min-h-[22px] !max-h-[78px] self-center disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ scrollbarWidth: "none" }}
      />

      <motion.button
        onClick={submit}
        disabled={!hasText || isLoading}
        aria-label="Gửi tin nhắn"
        className="flex-none self-center !w-8 !h-8 rounded-full flex items-center justify-center text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        style={{
          backgroundColor: hasText && !isLoading ? BRAND_RED : "#D1D5DB",
        }}
        whileTap={{ scale: 0.88 }}
        transition={{ duration: 0.12 }}
      >
        <Send size={14} strokeWidth={2.5} />
      </motion.button>
    </>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ChatHeader
// ─────────────────────────────────────────────────────────────────────────────

const ChatHeader = memo(function ChatHeader({
  isLoading,
  chatMode,
  isMobile,
  onClose,
}: {
  isLoading: boolean;
  chatMode: ChatResponseType | null;
  isMobile: boolean;
  onClose: () => void;
}) {
  let subtitle = "Thường phản hồi ngay";
  if (isLoading) subtitle = "Đang xử lý…";
  else if (chatMode === "HumanOnline") subtitle = "Đang chat với admin";
  else if (chatMode === "LeftMessage") subtitle = "Đã gửi tin nhắn";

  return (
    <div
      className={`flex-shrink-0 flex items-center gap-3 !px-4 !py-3.5 ${isMobile ? "" : "rounded-t-2xl"}`}
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
          <motion.span
            key={subtitle}
            className="block text-[11.5px] text-white/75 !mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {subtitle}
          </motion.span>
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
  isLoading,
  chatMode,
  isMobile,
  onSend,
  onClose,
}: {
  messages: Message[];
  isLoading: boolean;
  chatMode: ChatResponseType | null;
  isMobile: boolean;
  onSend: (text: string) => void;
  onClose: () => void;
}) {
  const lastMsg = messages[messages.length - 1];
  const showSuggests =
    !isLoading &&
    chatMode !== "HumanOnline" &&
    chatMode !== "LeftMessage" &&
    (messages.length === 0 ||
      lastMsg?.role === "assistant" ||
      lastMsg?.role === "system");

  // Desktop: popup từ góc dưới phải
  // Mobile: full-screen slide lên từ dưới
  const desktopClass =
    "fixed bottom-[90px] right-6 z-[9998] w-[360px] h-[560px] flex flex-col rounded-2xl overflow-clip shadow-2xl border border-gray-100 bg-white";
  const mobileClass = "fixed inset-0 z-[9998] flex flex-col bg-white";

  const desktopVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };
  const mobileVariants = {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
  };

  const variants = isMobile ? mobileVariants : desktopVariants;
  const transition = isMobile
    ? { duration: 0.3, ease: [0.32, 0.72, 0, 1] }
    : { duration: 0.22, ease: [0.16, 1, 0.3, 1] };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Cửa sổ hỗ trợ AI"
      className={`${isMobile ? mobileClass : desktopClass} [&_p]:m-0 [&_p]:text-inherit [&_a]:text-inherit [&_a]:no-underline`}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
    >
      <ChatHeader
        isLoading={isLoading}
        chatMode={chatMode}
        isMobile={isMobile}
        onClose={onClose}
      />
      <MessageList messages={messages} isLoading={isLoading} />

      {/* <StatusBanner chatMode={chatMode} /> */}

      {/* Footer */}
      <div
        className="flex-shrink-0 px-4 pt-2 pb-4 bg-white border-t border-gray-100"
        style={{
          // Tránh bàn phím ảo che input trên iOS Safari
          paddingBottom: isMobile
            ? "max(1rem, env(safe-area-inset-bottom))"
            : undefined,
        }}
      >
        <StarterQuestions onSelect={onSend} visible={showSuggests} />

        <div className="relative flex items-center gap-2.5 bg-gray-100 rounded-2xl min-h-[46px] focus-within:ring-1 focus-within:ring-red-200 transition-all duration-150 !mx-1 !px-4 !py-2.5">
          <MessageInput onSend={onSend} isLoading={isLoading} />
        </div>

        <p className="text-[10px] text-gray-400 text-center !mt-1.5 select-none leading-none">
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
              Võ đường CNK.
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
  isMobile,
  onClick,
}: {
  isOpen: boolean;
  hasUnread: boolean;
  isMobile: boolean;
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

  // Trên mobile khi chat đang mở, ẩn trigger (đã có nút X trong header)
  if (isMobile && isOpen) return null;

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
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatResponseType | null>(null);
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const [sessionId] = useState(getOrCreateSessionId);

  const isMobile = useIsMobile();
  const messagesRef = useRef<Message[]>([]);
  messagesRef.current = messages;
  // Track Firebase message keys that have already been processed (to avoid duplicates)
  const processedFirebaseKeys = useRef<Set<string>>(new Set());

  // Lock body scroll khi mobile chat mở
  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  // Firebase subscriptions
  const {
    messages: firebaseMessages,
    status: roomStatus,
    sendMessage: sendFirebaseMessage,
  } = useChatRoom(chatMode === "HumanOnline" ? chatRoomId : null);
  const { notification } = useUserNotification(
    chatMode === "LeftMessage" ? sessionId : null,
  );

  // Sync Firebase messages into local messages when in HumanOnline mode.
  // Only add admin messages — user messages are already in local state when sent.
  // Use processedFirebaseKeys to avoid duplicates across re-renders.
  useEffect(() => {
    if (chatMode !== "HumanOnline" || firebaseMessages.length === 0) return;
    const newMsgs: Message[] = [];
    for (const fm of firebaseMessages) {
      if (processedFirebaseKeys.current.has(fm.key)) continue;
      processedFirebaseKeys.current.add(fm.key);
      // Skip user's own messages — already added to local state on send
      if (fm.sender === "user") continue;
      newMsgs.push({
        id: fm.key,
        role: "assistant",
        content: fm.text,
        timestamp: new Date(fm.timestamp),
      });
    }
    if (newMsgs.length > 0) {
      setMessages((prev) => [...prev, ...newMsgs]);
    }
  }, [firebaseMessages, chatMode]);

  // Show admin reply when LeftMessage notification arrives
  useEffect(() => {
    if (!notification) return;
    const replyMsg: Message = {
      id: `notif-${notification.repliedAt}`,
      role: "assistant",
      content: notification.reply,
      timestamp: new Date(notification.repliedAt),
    };
    setMessages((prev) => {
      if (prev.some((m) => m.id === replyMsg.id)) return prev;
      return [...prev, replyMsg];
    });
    setHasUnread(true);
    setChatMode(null);
  }, [notification]);

  // Reset processed keys when entering a new chat room
  useEffect(() => {
    processedFirebaseKeys.current = new Set();
  }, [chatRoomId]);

  // Handle admin closing the chat room (HumanOnline → back to AI)
  useEffect(() => {
    if (roomStatus !== "closed" || chatMode !== "HumanOnline") return;
    setMessages((prev) => [
      ...prev,
      {
        id: genId(),
        role: "system" as const,
        content:
          "Phiên chat với admin đã kết thúc. Bạn có thể tiếp tục hỏi bot.",
        timestamp: new Date(),
      },
    ]);
    setChatMode("AI");
    setChatRoomId(null);
  }, [roomStatus, chatMode]);

  // Restore session history on mount
  useEffect(() => {
    async function restore() {
      try {
        const res = await chatApi.getHistory(sessionId);
        const hist: ChatHistoryResponse | undefined = res.data?.data;
        if (!hist || hist.status === "None" || hist.messages.length === 0)
          return;

        setMessages(
          hist.messages.map((m) => ({
            id: m.id,
            role:
              m.role === "User" ? ("user" as const) : ("assistant" as const),
            content: m.content,
            timestamp: new Date(m.createdAt),
          })),
        );

        if (hist.status === "HumanHandoff") {
          if (hist.handoffType === "Firebase" && hist.firebaseChatRoomId) {
            setChatRoomId(hist.firebaseChatRoomId);
            setChatMode("HumanOnline");
          } else if (hist.handoffType === "Pending") {
            setChatMode("LeftMessage");
          }
        } else if (hist.status === "BotHandling" || hist.status === "Closed") {
          setChatMode("AI");
        }
      } catch {
        // Silent — non-critical, user can still chat fresh
      }
    }
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    setHasUnread(false);
  }, []);

  const handleSend = useCallback(
    async (content: string) => {
      if (isLoading) return;

      // HumanOnline: send directly to Firebase, bypass the routing API
      if (chatMode === "HumanOnline") {
        const userMsg: Message = {
          id: genId(),
          role: "user",
          content,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        await sendFirebaseMessage(content);
        return;
      }

      const userMsg: Message = {
        id: genId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      const history: ChatHistoryItem[] = messagesRef.current
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const res = await chatApi.sendMessage({
          sessionId,
          message: content,
          history,
        });

        const data = res.data?.data;
        if (!data) throw new Error("Empty response");

        if (data.type === "AI") {
          const assistantMsg: Message = {
            id: genId(),
            role: "assistant",
            content: data.answer ?? "",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setChatMode("AI");
        } else if (data.type === "HumanOnline" && data.chatRoomId) {
          setChatRoomId(data.chatRoomId);
          setChatMode("HumanOnline");
        } else if (data.type === "LeftMessage") {
          setChatMode("LeftMessage");
          const sysMsg: Message = {
            id: genId(),
            role: "system",
            content:
              "Đã ghi nhận câu hỏi của bạn. Admin sẽ phản hồi sớm nhất có thể — hãy giữ tab này mở.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, sysMsg]);
        }
      } catch (err) {
        const msg = isAxiosError(err)
          ? (err.response?.data?.error ?? err.message)
          : (err as Error).message;
        console.error("[BubbleChat] Error:", msg);
        const errMsg: Message = {
          id: genId(),
          role: "assistant",
          content:
            "Xin lỗi, đã xảy ra lỗi kết nối. Vui lòng thử lại sau hoặc gọi hotline để được hỗ trợ.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId, chatMode, sendFirebaseMessage],
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
            isLoading={isLoading}
            chatMode={chatMode}
            isMobile={isMobile}
            onSend={handleSend}
            onClose={handleToggle}
          />
        )}
      </AnimatePresence>

      <TriggerButton
        isOpen={isOpen}
        hasUnread={hasUnread}
        isMobile={isMobile}
        onClick={handleToggle}
      />
    </>
  );
}
