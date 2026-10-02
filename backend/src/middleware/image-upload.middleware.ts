import { mkdirSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import multer from 'multer'
import type { Request } from 'express'

const uploadRoot = resolve(process.env.UPLOADS_DIRECTORY?.trim() || join(process.cwd(), 'uploads'))
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
const extensionByMime = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/avif', '.avif'],
])

function imageUpload(directory: 'products' | 'users') {
  const destination = join(uploadRoot, directory)
  mkdirSync(destination, { recursive: true })

  return multer({
    storage: multer.diskStorage({
      destination,
      filename(_request, file, callback) {
        const extension = extensionByMime.get(file.mimetype) ?? extname(file.originalname).toLowerCase()
        callback(null, `${randomUUID()}${extension}`)
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter(_request: Request, file, callback) {
      if (!allowedMimeTypes.has(file.mimetype)) {
        callback(new Error('Upload a JPEG, PNG, WebP, or AVIF image.'))
        return
      }
      callback(null, true)
    },
  }).single('image')
}

export const uploadProductImage = imageUpload('products')
export const uploadUserImage = imageUpload('users')
export const uploadedImageUrl = (directory: 'products' | 'users', filename: string) => `/uploads/${directory}/${filename}`