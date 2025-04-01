import { NextResponse } from 'next/server'
import { uploadToIPFS, retrieveFromIPFS } from '@/lib/ipfs'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const patientId = formData.get('patientId') as string

    if (!file || !patientId) {
      return NextResponse.json(
        { error: 'File and patient ID are required' },
        { status: 400 }
      )
    }

    // Upload to IPFS
    const cid = await uploadToIPFS(file)

    // Save to database
    const { db } = await connectToDatabase()
    await db.collection('medicalRecords').insertOne({
      patientId,
      ipfsHash: cid,
      fileName: file.name,
      fileType: file.type,
      createdAt: new Date()
    })

    return NextResponse.json({ cid }, { status: 201 })
  } catch (error) {
    console.error('Error uploading medical record:', error)
    return NextResponse.json(
      { error: 'Failed to upload medical record' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const records = await db.collection('medicalRecords')
      .find({ patientId })
      .toArray()

    return NextResponse.json(records, { status: 200 })
  } catch (error) {
    console.error('Error fetching medical records:', error)
    return NextResponse.json(
      { error: 'Failed to fetch medical records' },
      { status: 500 }
    )
  }
}