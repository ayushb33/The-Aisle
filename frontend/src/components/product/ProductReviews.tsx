import { useState } from 'react';
import { Star, MessageSquare, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { useProductReviews, useCreateReview } from '@/lib/queries';
import { useAuthStore } from '@/store/authStore';
import { FadeIn } from '@/components/animation/Transitions';

interface ProductReviewsProps {
  productId: string;
  slug: string;
}

export function ProductReviews({ productId, slug }: ProductReviewsProps) {
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useProductReviews(slug, page);
  const { isAuthenticated } = useAuthStore();

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createReview.mutateAsync({ productId, rating, title, body });
      setShowForm(false);
      setTitle('');
      setBody('');
      setRating(5);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div className="py-12 border-t border-surface-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-400" />
            Customer Reviews
          </h2>
        </div>
        {isAuthenticated && !showForm && (
          <Button onClick={() => setShowForm(true)} variant="outline">
            Write a Review
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 p-6 bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden"
            onSubmit={handleSubmit}
          >
            <h3 className="text-lg font-bold text-white mb-4">Write Your Review</h3>
            {error && <div className="text-red-400 text-sm mb-4 bg-red-400/10 p-3 rounded-lg">{error}</div>}
            
            <div className="mb-4">
              <label className="block text-sm text-surface-400 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-surface-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-surface-400 mb-2">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-xl px-4 py-2.5 text-white focus:border-brand-500 focus:outline-none"
                placeholder="Brief summary of your review"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-surface-400 mb-2">Review</label>
              <textarea
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-surface-950 border border-surface-700 rounded-xl px-4 py-3 text-white focus:border-brand-500 focus:outline-none resize-none"
                placeholder="What did you like or dislike?"
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" loading={createReview.isPending}>Submit Review</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="text-center py-10 text-surface-400">Loading reviews...</div>
      ) : data?.data.reviews.length === 0 ? (
        <div className="text-center py-12 bg-surface-900/50 rounded-2xl border border-surface-800">
          <Star className="w-12 h-12 text-surface-600 mx-auto mb-3" />
          <p className="text-surface-300 font-medium">No reviews yet</p>
          <p className="text-sm text-surface-500">Be the first to review this product.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {data?.data.reviews.map((review) => (
            <FadeIn key={review.id}>
              <div className="p-6 bg-surface-900 border border-surface-800 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-surface-700'}`} />
                      ))}
                    </div>
                    <h4 className="text-lg font-bold text-white">{review.title}</h4>
                  </div>
                  <span className="text-xs text-surface-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-surface-300 leading-relaxed mb-4">{review.body}</p>
                
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-800 text-surface-300 flex items-center justify-center font-bold text-xs">
                    {review.user.firstName.charAt(0)}{review.user.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-200">
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    {review.isVerified && (
                      <p className="text-[10px] text-brand-400 flex items-center gap-1 mt-0.5">
                        <CheckCircle className="w-3 h-3" /> Verified Purchase
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}

          {/* Pagination */}
          {data?.meta && data.meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={!data.meta.hasPrev}
                onClick={() => setPage(p => p - 1)}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <span className="text-sm text-surface-400">
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.meta.hasNext}
                onClick={() => setPage(p => p + 1)}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
