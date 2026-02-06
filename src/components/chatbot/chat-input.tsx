"use client";

import {useState} from "react";
import {Send, Paperclip, Smile} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";

interface ChatInputProps {
	onSendMessage: (message: string) => void;
	disabled?: boolean;
	placeholder?: string;
}

const ChatInput = ({
	onSendMessage,
	disabled = false,
	placeholder = "Type your message...",
}: ChatInputProps) => {
	const [message, setMessage] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		const trimmedMessage = message.trim();
		if (!trimmedMessage || disabled) return;

		onSendMessage(trimmedMessage);
		setMessage("");
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	}

	const canSend = message.trim() && !disabled;

	return (
		<div className="border-t border-border/50 bg-card/90 backdrop-blur-sm">
			<form onSubmit={handleSubmit} className="p-3 sm:p-4">
				<div
					className={cn(
						"flex items-end gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl",
						"bg-card border shadow-sm",
						isFocused
							? "border-primary ring-2 ring-primary/20"
							: "border-border"
					)}
				>
					{/* Attachment Button */}
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
						disabled={disabled}
						aria-label="Attach file"
					>
						<Paperclip className="h-3 w-3 sm:h-4 sm:w-4" />
					</Button>

					{/* Input Field */}
					<div className="flex-1">
						<Input
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={handleKeyDown}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							placeholder={placeholder}
							disabled={disabled}
							className="border-0 shadow-none bg-transparent px-0 py-1 sm:py-2 text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
							autoComplete="off"
							aria-label="Type your message to the AI assistant"
							aria-describedby="chat-input-help"
						/>
						<div id="chat-input-help" className="sr-only">
							Press Enter to send your message, or Shift+Enter for a new line
						</div>
					</div>

					{/* Emoji Button */}
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg shrink-0 text-muted-foreground hover:text-secondary hover:bg-secondary/15"
						disabled={disabled}
						aria-label="Add emoji"
					>
						<Smile className="h-3 w-3 sm:h-4 sm:w-4" />
					</Button>

					{/* Send Button */}
					<Button
						type="submit"
						size="icon"
						disabled={!canSend}
						className={cn(
							"h-8 w-8 sm:h-10 sm:w-10 rounded-lg shrink-0",
							canSend
								? "bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-sm"
								: "bg-muted text-muted-foreground"
						)}
						aria-label="Send message"
					>
						<Send className="h-3 w-3 sm:h-4 sm:w-4" />
					</Button>
				</div>
			</form>
		</div>
	);
};

export default ChatInput;
