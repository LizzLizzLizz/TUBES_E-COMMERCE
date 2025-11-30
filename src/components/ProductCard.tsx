import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  images: string
}

export default function ProductCard({ id, name, description, price, images }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg">
          <Image
            src={images || 'https://picsum.photos/seed/product/500/500'}
            alt={name}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
          <p className="mt-2 text-lg font-medium text-gray-900">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(price)}
          </p>
        </div>
      </div>
    </Link>
  )
}