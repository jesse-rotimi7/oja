"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, ShoppingCart, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="pointer-events-auto"
          >
            <div
              className={`rounded-xl shadow-2xl border-2 p-4 flex items-center gap-4 ${
                toast.type === "success"
                  ? "bg-white dark:bg-gray-800 border-green-500 dark:border-green-400"
                  : toast.type === "error"
                  ? "bg-white dark:bg-gray-800 border-red-500 dark:border-red-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex-shrink-0">
                {toast.type === "success" ? (
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="h-7 w-7 text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`font-bold text-sm sm:text-base ${
                    toast.type === "success"
                      ? "text-green-900 dark:text-green-100"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                    {toast.description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => dismiss(toast.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
