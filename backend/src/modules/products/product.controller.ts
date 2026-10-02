import type { Request, Response } from 'express'
import { Category } from '../categories/category.model'
import { Product } from './product.model'
import { uploadedImageUrl } from '../../middleware/image-upload.middleware'

function text(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const result = value.trim()
  return result && result.length <= maxLength ? result : undefined
}

function slugify(value: string): string {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 160)
}

function toStorefrontProduct(product: {
  id: string
  name: string
  categoryId?: { name?: string } | null
  basePriceAmount: number
  color?: string
  images?: { url: string }[]
  description: string
  tags?: string[]
}) {
  return {
    id: product.id,
    name: product.name,
    category: product.categoryId?.name ?? product.tags?.[0] ?? 'Linen',
    price: product.basePriceAmount / 100,
    color: product.color ?? 'Natural',
    image: product.images?.[0]?.url ?? '',
    description: product.description,
  }
}

export async function listProducts(_request: Request, response: Response) {
  const products = await Product.find({ status: 'active', deletedAt: null })
    .populate('categoryId', 'name')
    .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
    .limit(200)
    .lean()

  return response.status(200).json({ products: products.map((product) => toStorefrontProduct({
    ...product,
    id: String(product._id),
    categoryId: product.categoryId as { name?: string } | null,
  })) })
}

export async function createProduct(request: Request, response: Response) {
  const body = request.body as Record<string, unknown> | undefined
  const name = text(body?.name, 180)
  const description = text(body?.description, 20000)
  const categoryName = text(body?.category, 120)
  const color = text(body?.color, 80) ?? 'Natural'
  const price = typeof body?.price === 'number' ? body.price : Number(body?.price)
  const imageUrl = text(body?.imageUrl, 2048)

  if (!name || !description || !categoryName || !Number.isFinite(price) || price <= 0 || price > 100000) {
    return response.status(400).json({ error: 'Name, description, category, and a valid positive price are required.' })
  }
  if (!imageUrl?.startsWith('/uploads/products/')) {
    return response.status(400).json({ error: 'Upload a product image before creating the product.' })
  }

  const categorySlug = slugify(categoryName)
  const category = await Category.findOneAndUpdate(
    { slug: categorySlug },
    { $setOnInsert: { name: categoryName, slug: categorySlug, status: 'active' } },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  )

  const productSlug = `${slugify(name)}-${Date.now().toString(36)}`
  const product = await Product.create({
    name,
    slug: productSlug,
    description,
    shortDescription: description.slice(0, 500),
    categoryId: category._id,
    color,
    basePriceAmount: Math.round(price * 100),
    currency: 'USD',
    images: [{ url: imageUrl, altText: name, role: 'primary', position: 0 }],
    status: 'active',
    publishedAt: new Date(),
    createdBy: request.auth?.userId,
    updatedBy: request.auth?.userId,
  })

  await product.populate('categoryId', 'name')
  return response.status(201).json({ product: toStorefrontProduct({
    id: product.id,
    name: product.name,
    categoryId: product.categoryId as { name?: string } | null,
    basePriceAmount: product.basePriceAmount,
    color: product.color,
    images: product.images,
    description: product.description,
  }) })
}

export function productImageUploaded(request: Request, response: Response) {
  if (!request.file) return response.status(400).json({ error: 'Choose an image to upload.' })
  return response.status(201).json({
    imageUrl: uploadedImageUrl('products', request.file.filename),
    filename: request.file.filename,
  })
}