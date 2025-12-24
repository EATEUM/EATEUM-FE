import api from '@/api/index'

const BASE_URL = '/fridges'

export default {
  // 냉장고 재료 목록 조회
  getFridgeItems(page = 1, size = 20) {
    return api.get(BASE_URL, {
      params: { page, size },
    })
  },

  // 단일 재료 추가
  addFridgeItem(itemId) {
    return api.post(BASE_URL, { itemId })
  },

  // 재료 삭제
  deleteFridgeItem(itemId) {
    return api.delete(`${BASE_URL}/${itemId}`)
  },

  // 이미지 인식 요청 (FormData)
  recognizeImage(formData) {
    return api.post(`${BASE_URL}/image-recognition`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // 인식된 재료들 일괄 추가
  addMultipleItems(itemIds) {
    return api.post(`${BASE_URL}/add-items`, itemIds)
  },

  // 재료 검색
  searchFridgeItems(keyword) {
    return api.get(`${BASE_URL}/search`, {
      params: { keyword: keyword },
    })
  },
}
