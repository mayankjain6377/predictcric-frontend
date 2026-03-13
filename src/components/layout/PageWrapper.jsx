import { motion } from 'framer-motion'

function PageWrapper({ title, children }) {
  const MotionSection = motion.section

  return (
    <main className="mx-auto max-w-5xl p-4">
      <MotionSection
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 rounded-xl border bg-white p-4 shadow-sm"
        initial={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {children}
      </MotionSection>
    </main>
  )
}

export default PageWrapper