import apiClient from './client'

export interface UploadedMedia {
  id:          string
  mediaUrl:    string
  mediaType:   'Image' | 'Video' | 'Gif'
  fileName:    string
  size:        number
  contentType: string
}

export const mediaApi = {
  uploadSingle: async (file: File): Promise<UploadedMedia> => {
    const form = new FormData()
    form.append('file', file)
    const res = await apiClient.post('/api/media/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  uploadMultiple: async (files: File[]): Promise<UploadedMedia[]> => {
    const form = new FormData()
    files.forEach(f => form.append('files', f))
    const res = await apiClient.post('/api/media/upload-multiple', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  delete: async (userId: string, fileName: string): Promise<void> => {
    await apiClient.delete(`/api/media/${userId}/${fileName}`)
  },
}
