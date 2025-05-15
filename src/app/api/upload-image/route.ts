import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'
import { IncomingForm } from 'formidable'
import { readFile } from 'fs/promises'
import type { NextApiRequest } from 'next'

// Needed for file parsing
export const config = {
  api: {
    bodyParser: false,
  },
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  const form = new IncomingForm()
  const data = await new Promise<any>((resolve, reject) => {
    form.parse(req as unknown as NextApiRequest, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })

  const file = data.files.image[0]
  const buffer = await readFile(file.filepath)

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    }).end(buffer)
  })

  return NextResponse.json(result)
}
