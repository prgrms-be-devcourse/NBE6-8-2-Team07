'use client';

import React, { useState, useEffect } from 'react';
import { customFetch } from '@/utils/customFetch';

interface Comment {
  id: number;
  fairytaleId: number;
  nickname: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface CommentsProps {
  fairytaleId: number;
}

export default function Comments({ fairytaleId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [fairytaleId]);

  // 댓글 조회
  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await customFetch(`http://localhost:8080/api/fairytales/${fairytaleId}/comments`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setComments(data.content);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('댓글을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 추가
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await customFetch(`http://localhost:8080/api/fairytales/${fairytaleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ fairytaleId, content: newComment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNewComment('');
      fetchComments(); // 댓글 추가 후 목록 새로고침
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('댓글 추가에 실패했습니다.');
    }
  };

  // 댓글 수정
  const handleEditComment = async (commentId: number) => {
    if (!editingContent.trim()) return;

    try {
      const response = await customFetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: editingContent }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setEditingCommentId(null);
      setEditingContent('');
      fetchComments(); // 댓글 수정 후 목록 새로고침
    } catch (err) {
      console.error('Error editing comment:', err);
      setError('댓글 수정에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    try {
      const response = await customFetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchComments(); // 댓글 삭제 후 목록 새로고침
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('댓글 삭제에 실패했습니다.');
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
      <h4 className="text-xl font-bold text-gray-700 mb-4">댓글</h4>

      {/* 댓글 작성 폼 */}
      <div className="mb-6 text-right">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          rows={3}
          placeholder="댓글을 작성해주세요..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button
          onClick={handleAddComment}
          className="mt-2 px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
        >
          댓글 작성
        </button>
      </div>

      {isLoading && <p className="text-center text-gray-500">댓글 불러오는 중...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 && !isLoading && !error && (
          <p className="text-center text-gray-500">아직 댓글이 없습니다. 첫 댓글을 남겨주세요!</p>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800">{comment.nickname}</span>
              <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
            </div>
            {editingCommentId === comment.id ? (
              <div>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                  rows={2}
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                ></textarea>
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditComment(comment.id)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 cursor-pointer"
                  >
                    저장
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-600 hover:text-white cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 mb-3">{comment.content}</p>
            )}
            <div className="flex justify-end space-x-2">
              {editingCommentId !== comment.id && (
                <>
                  <button
                    onClick={() => startEditing(comment)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 cursor-pointer"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="px-3 py-1 bg-gray-300 text-gray-800 text-sm rounded-md hover:bg-gray-600 hover:text-white cursor-pointer"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}