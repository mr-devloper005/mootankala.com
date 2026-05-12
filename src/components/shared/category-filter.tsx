'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const categories = [
  { id: 'all', label: 'All' },
  { id: 'reports', label: 'Reports' },
  { id: 'guides', label: 'Guides' },
  { id: 'technical', label: 'Technical' },
  { id: 'whitepapers', label: 'Whitepapers' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'research', label: 'Research' },
  { id: 'presentations', label: 'Presentations' },
  { id: 'templates', label: 'Templates' },
  { id: 'business', label: 'Business' },
  { id: 'service', label: 'Service' },
  { id: 'beauty', label: 'Beauty' },
]

export function CategoryFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentCategory = searchParams.get('category') || 'all'

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId === 'all') {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={currentCategory === category.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryChange(category.id)}
          className={
            currentCategory === category.id
              ? 'bg-[#0C2B4E] text-white hover:bg-[#1A3D64]'
              : 'border-[rgba(12,43,78,0.16)] bg-white text-[#1A3D64] hover:bg-[#ebf2fb]'
          }
        >
          {category.label}
        </Button>
      ))}
    </div>
  )
}
