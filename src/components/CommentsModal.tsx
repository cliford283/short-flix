import React, { useState } from 'react';
import { X, Heart, Send } from 'lucide-react';
import { CommentItem } from '../types';

interface CommentsModalProps {
  comments: CommentItem[];
  dramaTitle: string;
  episodeNumber: number;
  userName: string;
  onAddComment: (content: string) => void;
  onToggleLike: (commentId: string) => void;
  onClose: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  comments,
  dramaTitle,
  episodeNumber,
  userName,
  onAddComment,
  onToggleLike,
  onClose,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#14141E] border-t border-white/10 rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl safe-bottom">
        {/* Grab bar */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-2.5 mb-2" />

        {/* Header */}
        <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">
              Comments ({comments.length})
            </h3>
            <span className="text-[11px] text-slate-400">
              · {dramaTitle} Ep.{episodeNumber}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[50vh] no-scrollbar">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <img
                src={comment.avatar}
                alt={comment.author}
                className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">
                    {comment.author}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed break-words">
                  {comment.content}
                </p>
                <div className="mt-1.5 flex items-center gap-4">
                  <button
                    onClick={() => onToggleLike(comment.id)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                  >
                    <Heart
                      className={`w-3 h-3 ${
                        comment.isLiked
                          ? 'fill-[#FF4500] text-[#FF4500]'
                          : 'text-slate-400'
                      }`}
                    />
                    <span className="tabular-nums">{comment.likes}</span>
                  </button>
                  <button className="text-[11px] text-slate-400 hover:text-slate-200">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-[#0D0D14] border-t border-white/5 flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-full bg-[#FF4500]/20 text-[#FF4500] font-bold text-xs flex items-center justify-center shrink-0">
            {userName[0]?.toUpperCase() || 'U'}
          </div>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment... (spoiler-free)"
            className="flex-1 bg-[#1A1A26] border border-white/10 rounded-full px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4500]"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="p-2 rounded-full bg-[#FF4500] disabled:bg-white/10 text-white disabled:text-slate-500 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
